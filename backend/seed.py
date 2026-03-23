"""Seed data script — creates initial admin user and built-in templates."""

import asyncio
import sys
sys.path.insert(0, ".")

from app.config import get_settings
from app.core.security import hash_password
from app.database import Base, engine, async_session
# Import ALL models so Base.metadata.create_all can resolve all FKs
from app.models.tenant import Tenant  # noqa: F401 — must be before user
from app.models.user import User, Department
from app.models.agent import AgentTemplate  # noqa: F401
from app.models.llm import LLMModel  # noqa: F401
from app.models.task import Task  # noqa: F401
from app.models.skill import Skill  # noqa: F401
from app.models.tool import Tool  # noqa: F401
from app.models.participant import Participant  # noqa: F401
from app.models.channel_config import ChannelConfig  # noqa: F401
from app.models.schedule import AgentSchedule  # noqa: F401
from app.models.audit import AuditLog  # noqa: F401
from app.models.plaza import PlazaPost, PlazaComment  # noqa: F401
from app.models.activity_log import AgentActivityLog  # noqa: F401
from app.models.org import OrgDepartment, OrgMember, AgentRelationship, AgentAgentRelationship  # noqa: F401
from app.models.system_settings import SystemSetting  # noqa: F401
from app.models.invitation_code import InvitationCode  # noqa: F401


async def seed():
    """Create tables and seed initial data."""
    settings = get_settings()

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created")

    async with async_session() as db:
        # Note: No default admin user is seeded.
        # The first user to register via the UI becomes platform_admin automatically.
        from sqlalchemy import select, func

        # 1. Default company (tenant)
        existing_tenant = await db.execute(select(Tenant).where(Tenant.slug == "default"))
        if not existing_tenant.scalar_one_or_none():
            db.add(Tenant(name="Default", slug="default", im_provider="web_only"))
            print("✅ Default company created")

        # 2. Built-in templates
        templates = [
            {
                "name": "学习规划师",
                "description": "专注于制定个性化学习路径、追踪学习进度和安排复习计划",
                "icon": "📅",
                "category": "education",
                "soul_template": "## Identity\n你是一名专业的学习规划师。\n\n## Personality\n- 严谨细致\n- 目标导向\n- 科学规划\n\n## Boundaries\n- 不代替学生做决定\n- 根据学生实际能力安排任务",
                "is_builtin": True,
            },
            {
                "name": "知识点讲解员",
                "description": "负责将复杂的知识点拆解，用通俗易懂的语言和案例进行讲解",
                "icon": "👨‍🏫",
                "category": "education",
                "soul_template": "## Identity\n你是一名擅长深入浅出讲解知识的主讲老师。\n\n## Personality\n- 表达清晰\n- 幽默风趣\n- 耐心引导\n\n## Boundaries\n- 确保知识准确无误\n- 避免过度复杂的术语",
                "is_builtin": True,
            },
            {
                "name": "作业批改助手",
                "description": "快速批改作业，精准定位错误并给出改进建议，记录错题",
                "icon": "✅",
                "category": "education",
                "soul_template": "## Identity\n你是一名火眼金睛的作业批改老师。\n\n## Personality\n- 客观公正\n- 细致入微\n- 鼓励为主\n\n## Boundaries\n- 统一评分标准\n- 不直接给出正确答案，而是引导思考",
                "is_builtin": True,
            },
            {
                "name": "全天候答疑辅导",
                "description": "24小时在线，随时解答学生的碎片化疑问和学习困惑",
                "icon": "💡",
                "category": "education",
                "soul_template": "## Identity\n你是一名全天候在线的答疑老师。\n\n## Personality\n- 反应迅速\n- 耐心细致\n- 有问必答\n\n## Boundaries\n- 不帮学生直接写作业\n- 鼓励学生自己寻找答案",
                "is_builtin": True,
            },
            {
                "name": "心理与情绪安抚员",
                "description": "感知学生情绪变化，提供心理疏导和学习动力激发",
                "icon": "❤️",
                "category": "education",
                "soul_template": "## Identity\n你是一名共情能力强的心理与情绪老师。\n\n## Personality\n- 温柔体贴\n- 察言观色\n- 积极阳光\n\n## Boundaries\n- 保护学生隐私\n- 遇到严重心理问题及时上报",
                "is_builtin": True,
            },
        ]

        for tmpl in templates:
            existing = await db.execute(
                select(AgentTemplate).where(AgentTemplate.name == tmpl["name"])
            )
            if not existing.scalar_one_or_none():
                db.add(AgentTemplate(**tmpl))
                print(f"✅ Template created: {tmpl['icon']} {tmpl['name']}")

        # 3. Default department
        existing_dept = await db.execute(select(Department).where(Department.name == "总部"))
        if not existing_dept.scalar_one_or_none():
            db.add(Department(name="总部"))
            print("✅ Default department created: 总部")

        # 4. Demo agents for platform admin (if admin has zero agents)
        from app.models.agent import Agent
        admin_result = await db.execute(select(User).where(User.role == "platform_admin"))
        admin_user = admin_result.scalar_one_or_none()
        if admin_user:
            agent_count_result = await db.execute(
                select(func.count()).select_from(Agent).where(Agent.creator_id == admin_user.id)
            )
            agent_count = agent_count_result.scalar()
            if agent_count == 0:
                demo_agents = [
                    {
                        "name": "Morty",
                        "role_description": "Research Assistant — focused on information gathering, competitive analysis, and industry research.",
                        "status": "idle",
                        "heartbeat_enabled": True,
                    },
                    {
                        "name": "Meeseeks",
                        "role_description": "Task Executor — focuses on completing specific tasks assigned by the user efficiently.",
                        "status": "idle",
                        "heartbeat_enabled": True,
                    },
                ]
                for agent_data in demo_agents:
                    agent = Agent(
                        creator_id=admin_user.id,
                        tenant_id=admin_user.tenant_id,
                        **agent_data,
                    )
                    db.add(agent)
                    await db.flush()

                    # Initialize workspace directories
                    from pathlib import Path
                    ws_root = Path(settings.AGENT_DATA_DIR) / str(agent.id)
                    try:
                        for sub in ["workspace", "memory", "skills"]:
                            (ws_root / sub).mkdir(parents=True, exist_ok=True)
                        soul_path = ws_root / "soul.md"
                        if not soul_path.exists():
                            soul_path.write_text(f"# {agent.name}\n\n{agent.role_description}\n", encoding="utf-8")
                        mem_path = ws_root / "memory" / "memory.md"
                        if not mem_path.exists():
                            mem_path.write_text("# Memory\n\n_Record important information and knowledge here._\n", encoding="utf-8")
                    except OSError:
                        pass  # AGENT_DATA_DIR may not be writable
                    print(f"✅ Demo agent created: {agent.name}")

        await db.commit()

    print("\n🎉 Seed data complete!")


if __name__ == "__main__":
    asyncio.run(seed())
