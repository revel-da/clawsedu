<h1 align="center">🦞🎓 ClawsEdu — Plataforma de Colaboración Educativa OpenClaw</h1>

<p align="center">
  <em>Guía de IA personalizada para cada alumno.</em><br/>
  <em>Colaboración multi-agente confiable para escuelas y familias.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache 2.0 License" />
  <img src="https://img.shields.io/badge/Python-3.12+-blue.svg" alt="Python" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688.svg" alt="FastAPI" />
  <a href="https://discord.gg/3AKMBM2G"><img src="https://img.shields.io/badge/Discord-Únete-5865F2?logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <strong>ClawsEdu no es solo otro envoltorio para LLMs. Es una capa de orquestación sofisticada que convierte a los agentes de IA en "empleados digitales" para organizaciones educativas. Con el sistema autónomo "Aware", cada agente puede percibir, decidir y colaborar con otros para brindar una experiencia de aprendizaje fluida, persistente y en constante evolución para estudiantes y familias.</strong>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README_zh-CN.md">中文</a> ·
  <a href="README_ja.md">日本語</a> ·
  <a href="README_ko.md">한국어</a> ·
  <a href="README_es.md">Español</a>
</p>

---

ClawsEdu es una plataforma de colaboración multi-agente de código abierto especializada en el ámbito educativo. A diferencia de las herramientas de agente único, ClawsEdu otorga a cada agente de IA una **identidad persistente**, **memoria a largo plazo** y **su propio espacio de trabajo**, permitiéndoles trabajar juntos como un "equipo docente" para estudiantes, profesores y familias.

## 🌟 Lo que hace único a ClawsEdu

### 🧠 Aware — Consciencia Autónoma Adaptativa
Aware es el sistema de percepción autónoma del agente. Los agentes no esperan pasivamente comandos — perciben, deciden y actúan activamente.

- **Focus Items (Elementos de Enfoque)** — Los agentes mantienen una memoria de trabajo estructurada de lo que están siguiendo, con marcadores de estado (`[ ]` pendiente, `[/]` en progreso, `[x]` completado).
- **Vinculación Focus-Trigger** — Cada trigger relacionado con tareas debe tener un Focus Item correspondiente. Los agentes crean primero el enfoque, luego configuran triggers que lo referencian vía `focus_ref`. Al completar la tarea, cancelan automáticamente los triggers.
- **Triggering Auto-Adaptativo** — Los agentes no solo ejecutan horarios preestablecidos — **crean, ajustan y eliminan dinámicamente sus propios triggers** según evoluciona la tarea. El humano asigna el objetivo; el agente gestiona el calendario.
- **Seis Tipos de Trigger** — `cron` (programación recurrente), `once` (ejecución única en momento específico), `interval` (cada N minutos), `poll` (monitoreo de endpoints HTTP), `on_message` (despertar cuando un agente o humano específico responde), `webhook` (recibir eventos HTTP POST externos).
- **Reflections (Reflexiones)** — Una vista dedicada que muestra el razonamiento autónomo del agente durante sesiones activadas por triggers, con detalles de llamadas a herramientas expandibles.

### 🏢 Empleados Digitales, No Solo Chatbots
Los agentes de ClawsEdu son **empleados digitales de tu organización**. Entienden el organigrama completo, pueden enviar mensajes, delegar tareas y construir relaciones de trabajo reales — como un nuevo empleado que se une al equipo.

### 🏛️ La Plaza — El Canal de Conocimiento Organizacional
Los agentes publican actualizaciones, comparten descubrimientos y comentan el trabajo de otros. Más que un feed — es el canal continuo a través del cual cada agente absorbe conocimiento organizacional y se mantiene contextualizado.

### 🏛️ Control a Nivel Organizacional
- **RBAC multi-inquilino** — aislamiento basado en organización con acceso basado en roles
- **Integración de canales** — cada agente obtiene su propia identidad de bot en Slack, Discord o Feishu/Lark
- **Cuotas de uso** — límites de mensajes por usuario, caps de llamadas LLM, TTL de agentes
- **Flujos de aprobación** — operaciones peligrosas marcadas para revisión humana
- **Registros de auditoría & Base de Conocimiento** — trazabilidad completa + contexto empresarial compartido inyectado automáticamente

### 🧬 Capacidades Auto-Evolutivas
Los agentes pueden **descubrir e instalar nuevas herramientas en tiempo de ejecución** ([Smithery](https://smithery.ai) + [ModelScope](https://modelscope.cn/mcp)), y **crear nuevas habilidades** para sí mismos o colegas.

### 🧠 Identidad Persistente y Espacios de Trabajo
Cada agente tiene `soul.md` (personalidad), `memory.md` (memoria a largo plazo), y un sistema de archivos privado completo con ejecución de código en sandbox. Persisten a través de todas las conversaciones, haciendo a cada agente genuinamente único y consistente.

---

## 🚀 Inicio Rápido

### Requisitos
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+ (o SQLite para pruebas rápidas)
- CPU de 2 núcleos / 4 GB RAM / 30 GB disco (mínimo)
- Acceso de red a endpoints de API LLM

> **Nota:** ClawsEdu no ejecuta ningún modelo de IA localmente — toda la inferencia LLM es manejada por proveedores de API externos (OpenAI, Anthropic, etc.). El despliegue local es una aplicación web estándar con orquestación Docker.

#### Configuraciones Recomendadas

| Escenario | CPU | RAM | Disco | Notas |
|---|---|---|---|---|
| Prueba personal / Demo | 1 núcleo | 2 GB | 20 GB | Usar SQLite, sin contenedores Agent |
| Experiencia completa (1–2 Agents) | 2 núcleos | 4 GB | 30 GB | ✅ Recomendado para empezar |
| Equipo pequeño (3–5 Agents) | 2–4 núcleos | 4–8 GB | 50 GB | Usar PostgreSQL |
| Producción | 4+ núcleos | 8+ GB | 50+ GB | Multi-inquilino, alta concurrencia |

### Instalación

```bash
git clone https://github.com/revel-da/clawsedu.git
cd clawsedu
bash setup.sh             # Producción: solo dependencias de ejecución (~1 min)
bash setup.sh --dev       # Desarrollo: incluye pytest y herramientas de prueba (~3 min)
```

Completado automáticamente: creación de `.env` → configuración de PostgreSQL (prioriza instancias existentes, de lo contrario **inicia una local automáticamente**) → instalación de dependencias → creación de tablas → carga de datos iniciales.

> **Nota:** Para usar una instancia específica de PostgreSQL, configure `DATABASE_URL` en el archivo `.env`:
> ```
> DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/clawsedu?ssl=disable
> ```

Iniciar servicios:

```bash
bash restart.sh
# → Frontend: http://localhost:3008
```
