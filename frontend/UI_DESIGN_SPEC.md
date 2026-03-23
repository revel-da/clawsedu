# Clawith-Edu UI Overhaul Spec: "Neo-Campus" Edition
# Clawith-Edu UI 视觉重构方案：新·大学校园风

## 1. 核心设计理念 (Core Concept)
目标是将原本严肃的 B 端企业级 SaaS 风格，转变为 **"活力、专注、社群感"** 的现代化校园学习工具。
摆脱 "管理系统" 的冷漠感，建立 "学习伙伴" 的亲近感。

**关键词 (Keywords):**
- **Vibrant (活力)**: 使用高饱和度点缀色，激发创造力。
- **Focus (专注)**: 大留白、卡片式布局，减少信息噪音。
- **Community (社群)**: 强化头像、表情、互动反馈的视觉比重。
- **Soft (柔和)**: 圆角、阴影、磨砂玻璃效果 (Glassmorphism)。

---

## 2. 全新配色系统 (Color Palette)

### 主色调 (Primary) - "智慧紫 / 探索蓝"
不再使用传统的 "企业蓝" (Enterprise Blue)，改用更具科技感与神秘感的 **"Indigo / Violet"** 系，或 **"Electric Blue"**。

- **Primary**: `#6366F1` (Indigo 500) -> 用于主要按钮、激活状态、品牌标识。
- **Primary Hover**: `#4F46E5` (Indigo 600)
- **Primary Light**: `#E0E7FF` (Indigo 100) -> 用于背景高亮、弱选中态。

### 辅助色 (Secondary) - "灵感粉 / 活力橙"
用于强调、通知、特殊标签，打破单调。

- **Accent Pink**: `#EC4899` (Pink 500) -> 比如 "New" 标签、点赞心形。
- **Accent Teal**: `#14B8A6` (Teal 500) -> 用于 "成功/完成" 状态，比纯绿更时尚。

### 背景色 (Background)
- **Light Mode**:
  - **Base**: `#F8FAFC` (Slate 50) -> 极淡的灰蓝，比纯白更护眼。
  - **Card**: `#FFFFFF` (White) + **Soft Shadow** (`0 4px 6px -1px rgba(0, 0, 0, 0.1)`).
- **Dark Mode**:
  - **Base**: `#0F172A` (Slate 900) -> 深邃的蓝黑，而非纯黑。
  - **Card**: `#1E293B` (Slate 800) -> 略浅的蓝灰，区分层级。

---

## 3. 视觉形态与组件 (Shapes & Components)

### 3.1 圆角与边框 (Border Radius & Stroke)
- **Global Radius**: 从 `4px/6px` 提升至 **`12px` (Small Components)** 和 **`16px` (Cards/Modals)**。
- **Buttons**: 全圆角 (Pill Shape) 或大圆角矩形，更具亲和力。
- **Inputs**: 增加高度 (40px -> 44px)，使用大圆角，背景色更淡。

### 3.2 导航栏 (Navigation) - "悬浮岛 (Floating Dock)"
- **旧版**: 传统的左侧通栏侧边栏 (Full-height Sidebar)。
- **新版**:
  - **Desktop**: **悬浮式侧边栏**。侧边栏不再贴边，而是作为一个 "悬浮卡片" 漂浮在左侧，四周留有空隙，背景略微透明 (Backdrop Blur)。
  - **Mobile**: 底部导航栏 (Tab Bar)，类似 App 体验。

### 3.3 卡片式布局 (Card Layout)
- 所有内容块（帖子、任务、聊天框）都封装在独立的 **白色/深色卡片** 中。
- 卡片之间增加间距 (Gap: 20px)，让页面更有 "呼吸感"。

### 3.4 字体与排版 (Typography)
- **Headings**: 使用 **"Rounded Sans"** (如 `Nunito` 或 `Quicksand`) 或 **"Geometric Sans"** (如 `Outfit`)，显得更现代、年轻。
- **Body**: 保持高可读性的无衬线字体 (如 `Inter` 或 `DM Sans`)。
- **Emoji**: 在标题、按钮、空状态中大量使用 Emoji 作为视觉锚点。

---

## 4. 关键页面改造 (Key Pages Redesign)

### 4.1 登录页 (Login)
- **旧**: 左右分栏或居中表单，商务风。
- **新**: **"校园通行证" 风格**。
  - 背景使用校园插画或动态渐变 Mesh Gradient。
  - 登录框设计成一张 "学生证" 或 "门票" 的样式。

### 4.2 学习主页 (Dashboard)
- **旧**: 数据看板，各种图表。
- **新**: **"个人书桌 (Study Desk)"**。
  - 顶部： "早安，同学！今天想学点什么？" (大号问候语)。
  - 核心区： "今日课程" (Timeline)、"作业 DDL" (Countdown)、"最近笔记" (Grid)。
  - 增加 "专注模式" 开关 (Focus Mode Toggle)。

### 4.3 学习广场 (Plaza)
- **旧**: 列表式论坛。
- **新**: **"瀑布流 / 灵感墙 (Pinterest Style)"**。
  - 帖子以 "便利贴" 或 "拍立得照片" 的形式展示。
  - 评论区支持富文本和表情包。

### 4.4 聊天界面 (Chat)
- **旧**: 标准 IM 界面。
- **新**: **"气泡对话 (Bubble UI)"**。
  - 聊天气泡颜色区分更鲜明（用户：主色渐变；AI：柔和灰/白）。
  - 输入框悬浮在底部，类似 iMessage/Discord。

---

## 5. 执行计划 (Implementation Plan)

1.  **Phase 1: 基础变量重定义 (Variables)**
    - 修改 `index.css` 中的 `:root` 变量（颜色、圆角、阴影）。
    - 引入新的 Google Fonts。

2.  **Phase 2: 布局重构 (Layout)**
    - 改造 `Layout.tsx`，实现 "悬浮侧边栏"。
    - 调整全局背景色和容器间距。

3.  **Phase 3: 组件样式升级 (Components)**
    - 重写 Buttons, Inputs, Cards 的 CSS 类。
    - 添加 Glassmorphism (磨砂玻璃) 效果类。

4.  **Phase 4: 页面细节打磨 (Pages)**
    - 逐个页面应用新样式 (Login -> Dashboard -> Plaza -> Chat)。
    - 替换图标为更圆润的风格 (Lucide 库本身支持调整 stroke width，可调粗一点)。

5.  **Phase 5: 动效微交互 (Animation)**
    - 添加 Hover 时的上浮效果 (Translate Y)。
    - 页面切换的淡入淡出 (Fade In/Out)。
