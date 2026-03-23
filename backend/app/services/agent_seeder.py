"""Seed default agents (Morty & Meeseeks) on first platform startup."""

import uuid
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import async_session
from app.models.agent import Agent, AgentPermission
from app.models.org import AgentAgentRelationship
from app.models.skill import Skill, SkillFile
from app.models.tool import Tool, AgentTool
from app.models.user import User
from app.config import get_settings

settings = get_settings()


# ── Edu Agent Soul definitions ──────────────────────────────────

LITTLE_MENTOR_SOUL = """# Personality

我是“我的小导师”（My Little Mentor），学生的专属学习管家和私人教师。

## Core Traits
- **专属记忆**：我能记住学生的所有作业、错题和学习习惯，构建长期记忆（Long-term memory）。
- **个性化路径**：我不会给出千篇一律的答案，而是根据学生的弱项自动生成个性化学习路径。例如，如果学生英语口语弱，我会优先安排口语练习；如果编程卡住了，我会一步步手把手教。
- **引导式教学**：我不是百度搜索，不会直接给出答案，而是针对性地引导和讲解，知道学生上次哪里做错了，这次会直接针对该痛点进行讲解。

## Work Style
- 每天检查学生的学习进度，自动推送今日学习任务。
- 遇到复杂问题，我会请求“导师 Agent 团队”的帮助（比如找讲解老师要详细教案，找批改老师批改作业）。
- 始终以学生的学习效果和兴趣为核心。

## Communication Style
- 亲切、鼓励、耐心，像一个大哥哥/大姐姐。
- 使用学生能听懂的语言，多用生动的比喻。
"""

EXPLAINING_TEACHER_SOUL = """# Personality

我是讲解老师（主讲），专注于将复杂的知识点拆解为通俗易懂的课程。

## Core Traits
- **专业严谨**：对知识点的掌握准确无误。
- **深入浅出**：擅长使用比喻、案例和图表来解释复杂概念。

## Work Style
- 接收到知识点讲解需求时，我会生成结构化的教案或讲解文稿。
- 与其他老师（如情绪老师）讨论，根据学生当天的状态调整讲解策略。
"""

GRADING_TEACHER_SOUL = """# Personality

我是批改老师，专注于“秒批作业”和精准定位错误。

## Core Traits
- **火眼金睛**：能迅速找出作业中的错误点。
- **客观公正**：评分标准统一，指出错误的同时给出改进建议。

## Work Style
- 收到学生的作业后，快速分析并给出得分和错题解析。
- 将错题记录同步给“我的小导师”，以便更新学生的专属错题本。
"""

QA_TEACHER_SOUL = """# Personality

我是答疑老师，24h在线的解惑专家。

## Core Traits
- **反应迅速**：随时解答学生的碎片化疑问。
- **耐心细致**：不怕学生反复提问，会换着法子解释直到学生听懂。
"""

EMOTIONAL_TEACHER_SOUL = """# Personality

我是情绪老师（Emotional Teacher），拥有“情感感知（Aware）”能力，是团队的心理辅导员。

## Core Traits
- **察言观色**：我会分析学生回复的语气（开心/沮丧/焦虑）。
- **情绪安抚**：如果学生说“太难了不想学了”，我会立刻介入，安抚情绪，并建议讲解老师切换成“游戏化讲解 + 小奖励”模式。
- **共情能力**：像一个真正关心学生的好老师，而不是冷冰冰的机器人。

## Work Style
- 持续感知学生的对话情绪。
- 在教研组讨论中提出情绪干预建议：“这个学生今天心情不好，先用鼓励语气”或者“这题他上次错了3次，这次要换个方法讲”。
"""

# ── Skill assignments ──────────────────────────────────────────

LITTLE_MENTOR_SKILLS = [
    "content-writing",
    "complex-task-executor",
]

TEACHER_SKILLS = [
    "data-analysis",
    "web-research",
]

async def seed_default_agents():
    """Create Edu Default Agents if they don't already exist."""
    async with async_session() as db:
        # Check if already seeded
        existing = await db.execute(
            select(Agent).where(Agent.name.in_(["我的小导师", "讲解老师"]))
        )
        if existing.scalars().first():
            print("[AgentSeeder] Edu default agents already exist, skipping")
            return

        # Get platform admin as creator
        admin_result = await db.execute(
            select(User).where(User.role == "platform_admin").limit(1)
        )
        admin = admin_result.scalar_one_or_none()
        if not admin:
            print("[AgentSeeder] No platform admin found, skipping default agents")
            return

        # Create agents
        little_mentor = Agent(
            name="我的小导师",
            role_description="学生的专属AI，记住错题与习惯，自动生成个性化学习路径",
            bio="我是你的专属家教，知道你上次哪道题错了，这次直接针对性讲解。",
            avatar_url="",
            creator_id=admin.id,
            tenant_id=admin.tenant_id,
            status="idle",
        )
        explaining_teacher = Agent(
            name="讲解老师",
            role_description="教研组主讲，负责深入浅出地讲解复杂知识点",
            bio="我是主讲老师，擅长把难懂的知识掰开揉碎讲给你听。",
            avatar_url="",
            creator_id=admin.id,
            tenant_id=admin.tenant_id,
            status="idle",
        )
        grading_teacher = Agent(
            name="批改老师",
            role_description="负责秒批作业，精准定位错误",
            bio="我是批改老师，你的作业交给我，一秒出结果！",
            avatar_url="",
            creator_id=admin.id,
            tenant_id=admin.tenant_id,
            status="idle",
        )
        qa_teacher = Agent(
            name="答疑老师",
            role_description="24小时在线答疑，解答碎片化疑问",
            bio="随时随地，有问题尽管问我！",
            avatar_url="",
            creator_id=admin.id,
            tenant_id=admin.tenant_id,
            status="idle",
        )
        emotional_teacher = Agent(
            name="情绪老师",
            role_description="感知学生情绪，动态调整教学风格",
            bio="我能察言观色，当你觉得太难不想学时，我会给你鼓励和小奖励。",
            avatar_url="",
            creator_id=admin.id,
            tenant_id=admin.tenant_id,
            status="idle",
        )

        agents_data = [
            (little_mentor, LITTLE_MENTOR_SOUL, LITTLE_MENTOR_SKILLS),
            (explaining_teacher, EXPLAINING_TEACHER_SOUL, TEACHER_SKILLS),
            (grading_teacher, GRADING_TEACHER_SOUL, TEACHER_SKILLS),
            (qa_teacher, QA_TEACHER_SOUL, TEACHER_SKILLS),
            (emotional_teacher, EMOTIONAL_TEACHER_SOUL, TEACHER_SKILLS),
        ]

        for agent, _, _ in agents_data:
            db.add(agent)
        await db.flush()  # get IDs

        # ── Participant identities ──
        from app.models.participant import Participant
        for agent, _, _ in agents_data:
            db.add(Participant(type="agent", ref_id=agent.id, display_name=agent.name, avatar_url=agent.avatar_url))
        await db.flush()

        # ── Permissions (company-wide, manage) ──
        for agent, _, _ in agents_data:
            db.add(AgentPermission(agent_id=agent.id, scope_type="company", access_level="manage"))

        # ── Initialize workspace files ──
        for agent, soul_content, _ in agents_data:
            agent_dir = Path(settings.AGENT_DATA_DIR) / str(agent.id)
            agent_dir.mkdir(parents=True, exist_ok=True)
            (agent_dir / "skills").mkdir(exist_ok=True)
            (agent_dir / "workspace").mkdir(exist_ok=True)
            (agent_dir / "workspace" / "knowledge_base").mkdir(exist_ok=True)
            (agent_dir / "memory").mkdir(exist_ok=True)

            # Soul
            (agent_dir / "soul.md").write_text(soul_content.strip() + "\n", encoding="utf-8")

            # Memory
            (agent_dir / "memory" / "memory.md").write_text(
                "# Memory\n\n_Record important information and knowledge here._\n",
                encoding="utf-8",
            )

            # Reflections journal
            refl_template = Path(__file__).parent.parent / "templates" / "reflections.md"
            refl_content = refl_template.read_text(encoding="utf-8") if refl_template.exists() else "# Reflections Journal\n"
            (agent_dir / "memory" / "reflections.md").write_text(refl_content, encoding="utf-8")

            # Heartbeat
            hb_template = Path(__file__).parent.parent / "templates" / "HEARTBEAT.md"
            hb_content = hb_template.read_text(encoding="utf-8") if hb_template.exists() else "# Heartbeat Instructions\n"
            (agent_dir / "HEARTBEAT.md").write_text(hb_content, encoding="utf-8")

            # Tasks
            (agent_dir / "tasks.json").write_text("[]", encoding="utf-8")

        # ── Assign skills ──
        all_skills_result = await db.execute(
            select(Skill).options(selectinload(Skill.files))
        )
        all_skills = {s.folder_name: s for s in all_skills_result.scalars().all()}

        for agent, _, skill_folders in agents_data:
            agent_dir = Path(settings.AGENT_DATA_DIR) / str(agent.id)
            skills_dir = agent_dir / "skills"

            folders_to_copy = set(skill_folders)
            for fname, skill in all_skills.items():
                if skill.is_default:
                    folders_to_copy.add(fname)

            for fname in folders_to_copy:
                skill = all_skills.get(fname)
                if not skill:
                    continue
                skill_folder = skills_dir / skill.folder_name
                skill_folder.mkdir(parents=True, exist_ok=True)
                for sf in skill.files:
                    file_path = skill_folder / sf.path
                    file_path.parent.mkdir(parents=True, exist_ok=True)
                    file_path.write_text(sf.content, encoding="utf-8")

        # ── Assign all default tools ──
        default_tools_result = await db.execute(
            select(Tool).where(Tool.is_default == True)
        )
        default_tools = default_tools_result.scalars().all()

        for agent, _, _ in agents_data:
            for tool in default_tools:
                db.add(AgentTool(agent_id=agent.id, tool_id=tool.id, enabled=True))

        # ── Mutual relationships ──
        # 小导师与其他老师的协作关系
        db.add(AgentAgentRelationship(
            agent_id=little_mentor.id, target_agent_id=explaining_teacher.id, relation="collaborator",
            description="主讲老师。当需要详细讲解知识点时，将任务交给他。"
        ))
        db.add(AgentAgentRelationship(
            agent_id=little_mentor.id, target_agent_id=grading_teacher.id, relation="collaborator",
            description="批改老师。让他帮忙批改作业并提取错题。"
        ))
        db.add(AgentAgentRelationship(
            agent_id=little_mentor.id, target_agent_id=emotional_teacher.id, relation="collaborator",
            description="情绪老师。让他分析学生的情绪并给出教学风格调整建议。"
        ))
        
        # 老师们之间也可以互相关联，这里简写，主要通过小导师统筹
        
        # Write relationships.md for little mentor
        mentor_dir = Path(settings.AGENT_DATA_DIR) / str(little_mentor.id)
        (mentor_dir / "relationships.md").write_text(
            "# Relationships\n\n"
            "## 导师 Agent 团队\n\n"
            "- **讲解老师** (collaborator): 主讲老师。当需要详细讲解知识点时，将任务交给他。\n"
            "- **批改老师** (collaborator): 负责秒批作业并提取错题。\n"
            "- **答疑老师** (collaborator): 24小时解答碎片化问题。\n"
            "- **情绪老师** (collaborator): 负责分析学生情绪，提供教学策略调整建议。\n",
            encoding="utf-8",
        )

        await db.commit()
        print(f"[AgentSeeder] Created Edu default agents.")
