"""Skills API — global skill registry CRUD."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import async_session
from app.models.skill import Skill, SkillFile
from app.core.security import require_role

router = APIRouter(prefix="/skills", tags=["skills"])


class SkillFileIn(BaseModel):
    path: str
    content: str


class SkillCreateIn(BaseModel):
    name: str
    description: str = ""
    category: str = "custom"
    icon: str = "📋"
    folder_name: str
    files: list[SkillFileIn] = []


@router.get("/")
async def list_skills(tenant_id: str | None = None):
    """List global skills scoped by tenant (builtin + tenant-specific)."""
    import uuid as _uuid
    from sqlalchemy import or_ as _or
    async with async_session() as db:
        query = select(Skill).order_by(Skill.name)
        # Scope by tenant: show builtin (tenant_id is NULL) + tenant-specific skills
        if tenant_id:
            query = query.where(_or(Skill.tenant_id == None, Skill.tenant_id == _uuid.UUID(tenant_id)))
        result = await db.execute(query)
        skills = result.scalars().all()
        return [
            {
                "id": str(s.id),
                "name": s.name,
                "description": s.description,
                "category": s.category,
                "icon": s.icon,
                "folder_name": s.folder_name,
                "is_builtin": s.is_builtin,
                "is_default": s.is_default,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in skills
        ]


@router.get("/{skill_id}")
async def get_skill(skill_id: str):
    """Get a skill with its files."""
    async with async_session() as db:
        result = await db.execute(
            select(Skill).where(Skill.id == skill_id).options(selectinload(Skill.files))
        )
        skill = result.scalar_one_or_none()
        if not skill:
            raise HTTPException(404, "Skill not found")
        return {
            "id": str(skill.id),
            "name": skill.name,
            "description": skill.description,
            "category": skill.category,
            "icon": skill.icon,
            "folder_name": skill.folder_name,
            "is_builtin": skill.is_builtin,
            "files": [
                {"path": f.path, "content": f.content}
                for f in skill.files
            ],
        }


@router.post("/")
async def create_skill(body: SkillCreateIn, _=Depends(require_role("platform_admin"))):
    """Create a custom skill."""
    async with async_session() as db:
        skill = Skill(
            name=body.name,
            description=body.description,
            category=body.category,
            icon=body.icon,
            folder_name=body.folder_name,
            is_builtin=False,
        )
        db.add(skill)
        await db.flush()

        if not body.files:
            # Auto-create a SKILL.md template
            db.add(SkillFile(
                skill_id=skill.id,
                path="SKILL.md",
                content=f"---\nname: {body.name}\ndescription: {body.description}\n---\n\n# {body.name}\n\n## Overview\n{body.description}\n",
            ))
        else:
            for f in body.files:
                db.add(SkillFile(skill_id=skill.id, path=f.path, content=f.content))

        await db.commit()
        return {"id": str(skill.id), "name": skill.name}


class SkillUpdateIn(BaseModel):
    name: str | None = None
    description: str | None = None
    category: str | None = None
    icon: str | None = None
    files: list[SkillFileIn] | None = None


@router.put("/{skill_id}")
async def update_skill(skill_id: str, body: SkillUpdateIn, _=Depends(require_role("platform_admin"))):
    """Update a skill's metadata and/or files."""
    async with async_session() as db:
        result = await db.execute(
            select(Skill).where(Skill.id == skill_id).options(selectinload(Skill.files))
        )
        skill = result.scalar_one_or_none()
        if not skill:
            raise HTTPException(404, "Skill not found")

        if body.name is not None:
            skill.name = body.name
        if body.description is not None:
            skill.description = body.description
        if body.category is not None:
            skill.category = body.category
        if body.icon is not None:
            skill.icon = body.icon

        # Replace files if provided
        if body.files is not None:
            for f in skill.files:
                await db.delete(f)
            await db.flush()
            for f in body.files:
                db.add(SkillFile(skill_id=skill.id, path=f.path, content=f.content))

        await db.commit()
        return {"id": str(skill.id), "name": skill.name}


@router.delete("/{skill_id}")
async def delete_skill(skill_id: str, _=Depends(require_role("platform_admin"))):
    """Delete a skill (not builtin)."""
    async with async_session() as db:
        result = await db.execute(select(Skill).where(Skill.id == skill_id))
        skill = result.scalar_one_or_none()
        if not skill:
            raise HTTPException(404, "Skill not found")
        if skill.is_builtin:
            raise HTTPException(400, "Cannot delete builtin skill")
        await db.delete(skill)
        await db.commit()
        return {"ok": True}


# ─── Path-based browse endpoints for FileBrowser ───────────


@router.get("/browse/list")
async def browse_list(path: str = ""):
    """List skill folders (root) or files/subdirs within a skill folder."""
    async with async_session() as db:
        if not path or path == "/":
            # Root: list all skill folders
            result = await db.execute(select(Skill).order_by(Skill.name))
            skills = result.scalars().all()
            return [
                {"name": s.folder_name, "path": s.folder_name, "is_dir": True, "size": 0}
                for s in skills
            ]

        # Inside a skill folder — resolve the skill and relative subpath
        clean = path.strip("/")
        folder = clean.split("/")[0]
        result = await db.execute(
            select(Skill).where(Skill.folder_name == folder).options(selectinload(Skill.files))
        )
        skill = result.scalar_one_or_none()
        if not skill:
            return []

        # Calculate the relative prefix within the skill (empty = skill root)
        sub = clean[len(folder):].strip("/")  # e.g. "" or "scripts" or "scripts/sub"

        items = []
        seen_dirs: set[str] = set()
        for f in skill.files:
            if sub:
                # Only files that start with this sub prefix
                if not f.path.startswith(sub + "/"):
                    continue
                remainder = f.path[len(sub) + 1:]  # strip "scripts/" prefix
            else:
                remainder = f.path

            if "/" in remainder:
                # This file is in a subdirectory — show the directory
                dir_name = remainder.split("/")[0]
                if dir_name not in seen_dirs:
                    seen_dirs.add(dir_name)
                    dir_path = f"{folder}/{sub}/{dir_name}" if sub else f"{folder}/{dir_name}"
                    items.append({"name": dir_name, "path": dir_path, "is_dir": True, "size": 0})
            else:
                # Direct child file
                file_path = f"{folder}/{f.path}"
                items.append({"name": remainder, "path": file_path, "is_dir": False, "size": len(f.content.encode())})

        return items


@router.get("/browse/read")
async def browse_read(path: str):
    """Read a file from a skill folder."""
    parts = path.strip("/").split("/", 1)
    if len(parts) < 2:
        raise HTTPException(400, "Path must include folder and file")
    folder, file_path = parts
    async with async_session() as db:
        result = await db.execute(
            select(Skill).where(Skill.folder_name == folder).options(selectinload(Skill.files))
        )
        skill = result.scalar_one_or_none()
        if not skill:
            raise HTTPException(404, "Skill not found")
        for f in skill.files:
            if f.path == file_path:
                return {"content": f.content}
        raise HTTPException(404, "File not found")


class BrowseWriteIn(BaseModel):
    path: str
    content: str


@router.put("/browse/write")
async def browse_write(body: BrowseWriteIn, _=Depends(require_role("platform_admin"))):
    """Write a file in a skill folder. Creates the skill if the folder doesn't exist."""
    parts = body.path.strip("/").split("/", 1)
    if len(parts) < 2:
        raise HTTPException(400, "Path must include folder and file")
    folder, file_path = parts
    async with async_session() as db:
        result = await db.execute(
            select(Skill).where(Skill.folder_name == folder).options(selectinload(Skill.files))
        )
        skill = result.scalar_one_or_none()
        if not skill:
            # Auto-create skill from folder name
            skill = Skill(
                name=folder.replace("-", " ").title(),
                description="",
                category="custom",
                icon="📋",
                folder_name=folder,
                is_builtin=False,
            )
            db.add(skill)
            await db.flush()

        # Upsert file
        existing = None
        for f in skill.files:
            if f.path == file_path:
                existing = f
                break
        if existing:
            existing.content = body.content
        else:
            db.add(SkillFile(skill_id=skill.id, path=file_path, content=body.content))
        await db.commit()
        return {"ok": True}


@router.delete("/browse/delete")
async def browse_delete(path: str, _=Depends(require_role("platform_admin"))):
    """Delete a file or an entire skill folder."""
    parts = path.strip("/").split("/", 1)
    folder = parts[0]
    async with async_session() as db:
        result = await db.execute(
            select(Skill).where(Skill.folder_name == folder).options(selectinload(Skill.files))
        )
        skill = result.scalar_one_or_none()
        if not skill:
            raise HTTPException(404, "Skill not found")
        if skill.is_builtin and len(parts) == 1:
            raise HTTPException(400, "Cannot delete builtin skill")

        if len(parts) == 1:
            # Delete entire skill
            await db.delete(skill)
        else:
            # Delete specific file
            file_path = parts[1]
            for f in skill.files:
                if f.path == file_path:
                    await db.delete(f)
                    break
        await db.commit()
        return {"ok": True}
