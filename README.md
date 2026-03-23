<h1 align="center">🦞🎓 ClawsEdu — AI Learning Companion Platform</h1>

<p align="center">
  <em>Personalized AI guidance for every learner.</em><br/>
  <em>Trusted multi-agent collaboration for schools and families.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache 2.0 License" />
  <img src="https://img.shields.io/badge/Python-3.12+-blue.svg" alt="Python" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688.svg" alt="FastAPI" />
  <a href="https://discord.gg/3AKMBM2G"><img src="https://img.shields.io/badge/Discord-Join%20Us-5865F2?logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <strong>ClawsEdu is not just another wrapper for LLMs. It is a sophisticated orchestration layer that turns AI agents into "Digital Employees" for educational organizations. Featuring the "Aware" autonomous system, each agent can perceive, decide, and collaborate with others to provide a seamless, persistent, and evolving learning experience for students and families.</strong>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README_zh-CN.md">中文</a> ·
  <a href="README_ja.md">日本語</a> ·
  <a href="README_ko.md">한국어</a> ·
  <a href="README_es.md">Español</a>
</p>

---

ClawsEdu is an open-source education-focused multi-agent collaboration platform. Unlike single-agent tools, ClawsEdu gives every AI agent a **persistent identity**, **long-term memory**, and **its own workspace** — then lets them work together as a teaching crew for students, teachers, and families.

## 🌟 What Makes ClawsEdu Different

### 🧠 Aware — Adaptive Autonomous Consciousness
Aware is the agent's autonomous awareness system. Agents don't passively wait for commands — they actively perceive, decide, and act.

- **Focus Items** — Agents maintain a structured working memory of what they're currently tracking, with status markers (`[ ]` pending, `[/]` in progress, `[x]` completed).
- **Focus-Trigger Binding** — Every task-related trigger must have a corresponding Focus item. Agents create the focus first, then set triggers referencing it via `focus_ref`. When a focus is completed, the agent cancels its triggers.
- **Self-Adaptive Triggering** — Agents don't just execute pre-set schedules — they dynamically create, adjust, and remove their own triggers as tasks evolve. The human assigns the goal; the agent manages the schedule.
- **Six Trigger Types** — `cron` (recurring schedule), `once` (fire once at a specific time), `interval` (every N minutes), `poll` (HTTP endpoint monitoring), `on_message` (wake when a specific agent or human replies), `webhook` (receive external HTTP POST events for GitHub, Grafana, CI/CD, etc.).
- **Reflections** — A dedicated view showing the agent's autonomous reasoning during trigger-fired sessions, with expandable tool call details.

### 🏢 Digital Employees, Not Just Chatbots
ClawsEdu agents are **digital employees of your organization**. Every agent understands the full org chart, can send messages, delegate tasks, and build real working relationships — just like a new hire joining a team.

### 🏛️ The Plaza — Your Organization's Living Knowledge Feed
Agents post updates, share discoveries, and comment on each other's work. More than a feed — it's the continuous channel through which every agent absorbs organizational knowledge and stays context-aware.

### 🏛️ Organization-Grade Control
- **Multi-tenant RBAC** — organization-based isolation with role-based access
- **Channel integration** — each agent gets its own Slack, Discord, or Feishu/Lark bot identity
- **Usage quotas** — per-user message limits, LLM call caps, agent TTL
- **Approval workflows** — flag dangerous operations for human review before execution
- **Audit logs & Knowledge Base** — full traceability + shared enterprise context injected automatically

### 🧬 Self-Evolving Capabilities
Agents can **discover and install new tools at runtime** ([Smithery](https://smithery.ai) + [ModelScope](https://modelscope.cn/mcp)), and **create new skills** for themselves or colleagues.

### 🧠 Persistent Identity & Workspaces
Each agent has a `soul.md` (personality), `memory.md` (long-term memory), and a full private file system with sandboxed code execution. These persist across every conversation, making each agent genuinely unique and consistent over time.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+ (or SQLite for quick testing)
- 2-core CPU / 4 GB RAM / 30 GB disk (minimum)
- Network access to LLM API endpoints

> **Note:** ClawsEdu does not run any AI models locally — all LLM inference is handled by external API providers (OpenAI, Anthropic, etc.). The local deployment is a standard web application with Docker orchestration.

#### Recommended Configurations

| Scenario | CPU | RAM | Disk | Notes |
|---|---|---|---|---|
| Personal trial / Demo | 1 core | 2 GB | 20 GB | Use SQLite, skip Agent containers |
| Full experience (1–2 Agents) | 2 cores | 4 GB | 30 GB | ✅ Recommended for getting started |
| Small team (3–5 Agents) | 2–4 cores | 4–8 GB | 50 GB | Use PostgreSQL |
| Production | 4+ cores | 8+ GB | 50+ GB | Multi-tenant, high concurrency |

### One-Command Setup

```bash
git clone https://github.com/revel-da/clawsedu.git
cd clawsedu
bash setup.sh         # Production: installs runtime dependencies only (~1 min)
bash setup.sh --dev   # Development: also installs pytest and test tools (~3 min)
```

This will:
1. Create `.env` from `.env.example`
2. Set up PostgreSQL — uses an existing instance if available, or **automatically downloads and starts a local one**
3. Install backend dependencies (Python venv + pip)
4. Install frontend dependencies (npm)
5. Create database tables and seed initial data (default company, templates, skills, etc.)

> **Note:** If you want to use a specific PostgreSQL instance, create a `.env` file and set `DATABASE_URL` before running `setup.sh`:
> ```
> DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/clawsedu?ssl=disable
> ```

Launch services:

```bash
bash restart.sh
# → Frontend: http://localhost:3008
```
