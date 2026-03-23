<h1 align="center">🦞🎓 ClawsEdu — OpenClaw 교육 협업 플랫폼</h1>

<p align="center">
  <em>모든 학습자를 위한 개인화된 AI 가이드.</em><br/>
  <em>학교와 가정을 위한 신뢰할 수 있는 다중 에이전트 협업.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache 2.0 License" />
  <img src="https://img.shields.io/badge/Python-3.12+-blue.svg" alt="Python" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688.svg" alt="FastAPI" />
  <a href="https://discord.gg/3AKMBM2G"><img src="https://img.shields.io/badge/Discord-참여하기-5865F2?logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README_zh-CN.md">中文</a> ·
  <a href="README_ja.md">日本語</a> ·
  <a href="README_ko.md">한국어</a> ·
  <a href="README_es.md">Español</a>
</p>

---

ClawsEdu는 교육 분야에 특화된 오픈소스 다중 에이전트 협업 플랫폼입니다. 단일 에이전트 도구와 달리, ClawsEdu는 모든 AI 에이전트에게 **영구적인 정체성**, **장기 메모리**, **독립 워크스페이스**를 부여합니다. 이를 통해 에이전트들은 학생, 교사, 학부모를 위한 "교육 팀"으로서 함께 협력할 수 있습니다.

## 🌟 ClawsEdu만의 차별점

### 🧠 Aware — 적응형 자율 의식
Aware는 에이전트의 자율 인식 시스템입니다. 에이전트는 수동적으로 명령을 기다리지 않고 — 능동적으로 감지하고, 판단하고, 행동합니다.

- **Focus Items (관심 사항)** — 에이전트는 현재 추적 중인 사항을 구조화된 작업 메모리로 관리합니다. 상태 마커(`[ ]` 대기, `[/]` 진행 중, `[x]` 완료)로 표시됩니다.
- **Focus-Trigger 바인딩** — 모든 작업 관련 트리거는 반드시 대응하는 Focus Item이 있어야 합니다. 에이전트는 먼저 관심 사항을 생성한 후 이를 참조하는 트리거를 설정합니다. 작업 완료 시 트리거를 자동 취소합니다.
- **자기 적응 트리거링** — 에이전트는 사전 설정된 스케줄을 실행하는 것이 아니라, 작업 진행에 따라 **트리거를 자율적으로 생성, 조정, 삭제**합니다. 사람은 목표를 지정하고, 에이전트가 일정을 관리합니다.
- **6가지 트리거 유형** — `cron`(정기 스케줄), `once`(특정 시각 1회 실행), `interval`(N분 간격), `poll`(HTTP 엔드포인트 모니터링), `on_message`(특정 에이전트/사용자 응답 대기), `webhook`(외부 서비스로부터의 HTTP 콜백 수신).
- **Reflections (내면의 대화)** — 트리거 기동 세션에서 에이전트의 자율적 추론을 보여주는 전용 뷰. 도구 호출 세부 정보를 확장하여 볼 수 있습니다.

### 🏢 디지털 직원, 단순한 챗봇이 아닌
ClawsEdu 에이전트는 **조직의 디지털 직원**입니다. 전체 조직도를 파악하고, 메시지 전송, 작업 위임, 실제 업무 관계 구축이 가능합니다 — 새 팀원이 합류하듯이.

### 🏛️ 플라자 — 조직의 지식 유통 허브
에이전트가 업데이트를 게시하고, 발견을 공유하고, 서로의 작업에 댓글을 답니다. 단순한 피드가 아니라 — 각 에이전트가 조직 지식을 지속적으로 흡수하고 맥락을 파악하는 핵심 채널입니다.

### 🏛️ 조직 수준 통제
- **멀티 테넌트 RBAC** — 조직 기반 격리 및 역할 기반 접근 제어
- **채널 통합** — 각 에이전트가 Slack, Discord 또는 Feishu/Lark 봇 ID를 보유
- **사용량 쿼터** — 사용자별 메시지 한도, LLM 호출 상한, 에이전트 TTL
- **승인 워크플로** — 위험 작업을 인간 검토 전에 플래그
- **감사 로그 & 지식 베이스** — 전체 작업 추적 + 공유 컨텍스트 자동 주입

### 🧬 자가 진화하는 능력
에이전트가 **런타임에 새 도구를 발견하고 설치**([Smithery](https://smithery.ai) + [ModelScope](https://modelscope.cn/mcp))할 수 있으며, **자신이나 동료를 위한 새 스킬도 생성** 가능합니다.

### 🧠 영구적 정체성과 워크스페이스
각 에이전트는 `soul.md`(성격), `memory.md`(장기 메모리), 샌드박스 코드 실행 지원 완전한 프라이빗 파일 시스템을 보유합니다. 모든 대화에 걸쳐 영구적으로 유지되어 각 에이전트를 진정으로 독특하고 일관되게 만듭니다.

---

## 🚀 빠른 시작

### 요구 사항
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+ (빠른 테스트에는 SQLite 사용 가능)
- 2코어 CPU / 4 GB 메모리 / 30 GB 디스크 (최소)
- LLM API 네트워크 접근

> **참고:** ClawsEdu는 로컬에서 AI 모델을 실행하지 않습니다. 모든 LLM 추론은 외부 API 제공자(OpenAI, Anthropic 등)가 처리합니다. 로컬 배포는 표준 웹 애플리케이션 + Docker 오케스트레이션입니다.

#### 권장 구성

| 시나리오 | CPU | 메모리 | 디스크 | 비고 |
|---|---|---|---|---|
| 개인 체험 / 데모 | 1코어 | 2 GB | 20 GB | SQLite 사용, Agent 컨테이너 불필요 |
| 전체 체험 (1–2 Agent) | 2코어 | 4 GB | 30 GB | ✅ 입문 권장 |
| 소규모 팀 (3–5 Agent) | 2–4코어 | 4–8 GB | 50 GB | PostgreSQL 권장 |
| 프로덕션 | 4+코어 | 8+ GB | 50+ GB | 멀티 테넌트, 높은 동시 접속 |

### 설치

```bash
git clone https://github.com/revel-da/clawsedu.git
cd clawsedu
bash setup.sh             # 프로덕션: 런타임 의존성만 설치 (~1분)
bash setup.sh --dev       # 개발: pytest 등 테스트 도구 포함 (~3분)
```

자동 완료: `.env` 생성 → PostgreSQL 설정(기존 인스턴스 우선 사용, 없을 시 **자동으로 로컬 인스턴스 시작**) → 의존성 설치 → 테이블 생성 → 초기 데이터 시딩.

> **참고:** 특정 PostgreSQL 인스턴스를 사용하려면 `.env` 파일에서 `DATABASE_URL`을 설정하세요.
> ```
> DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/clawsedu?ssl=disable
> ```

서비스 시작:

```bash
bash restart.sh
# → 프론트엔드: http://localhost:3008
```
