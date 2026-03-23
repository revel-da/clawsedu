# ClawsEdu UI Design Specification: "Lumina Campus"

## 1. Design Philosophy: "Fluid Intelligence"
The new UI aims to break away from the rigid "Admin Dashboard" structure (sidebar + header + content box). Instead, we adopt a **"Fluid Workspace"** metaphor where tools and content float on a dynamic, living background.

**Keywords:** Ethereal, Focus, Fluidity, Tangible Depth.

## 2. Visual Identity

### 2.1. Color Palette (The "Aurora" System)
Instead of flat hex codes, we use dynamic gradients and alpha-blended layers.

**Base Theme (Dark Mode Preferred):**
- **Background:** `Obsidian Void` (#050508) with a subtle, animated mesh gradient (Indigo/Violet/Teal) moving at 5% opacity in the background.
- **Surface:** `Frosted Glass` (rgba(20, 20, 25, 0.6) with backdrop-blur: 20px).
- **Border:** `Starlight` (Linear gradient: white 10% -> transparent -> white 5%).

**Accents:**
- **Primary:** `Electric Indigo` (#6366F1) → `Vivid Violet` (#8B5CF6) gradient.
- **Secondary:** `Fluorescent Teal` (#2DD4BF) for success/growth indicators.
- **Alert:** `Rose Gold` (#F43F5E) for errors/actions.

### 2.2. Typography
- **Headings:** **'Outfit'** (Geometric Sans). Large, tight letter-spacing (-0.03em).
  - *Usage:* Page titles are massive (3rem+), almost decorative.
- **Body:** **'Plus Jakarta Sans'** or **'Inter'**. High legibility.
- **Monospace:** **'JetBrains Mono'** for code/data.

### 2.3. Iconography
- **Style:** "Duotone Glass". Icons have a filled layer at 20% opacity and a stroke layer at 100%.
- **Shape:** Rounded terminals, soft corners.

## 3. UI Components & Graphics

### 3.1. The "Command Dock" (Navigation)
**Problem:** Traditional sidebars feel static and heavy.
**Solution:** A **Floating Dock**.
- **State:** By default, it's a slim "Pill" floating on the left or bottom (user configurable).
- **Interaction:** Hovering expands it. It behaves like the macOS Dock or Dynamic Island.
- **Visual:** Glassmorphism with a glowing border.

### 3.2. "Bento" Cards
Content is organized in a **Bento Grid** layout (variable sized rounded rectangles).
- **Corner Radius:** Aggressive `24px` (Super-rounded).
- **Depth:** Cards have no border color, but use an "Inner Glow" (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1)`) and a soft drop shadow.
- **Hover:** Cards gently lift (scale 1.01) and the border glow intensifies.

### 3.3. Buttons ("Liquid Light")
- **Primary Action:** Background is a moving gradient. Text glows.
- **Secondary:** Fully transparent background, white text, with a "shine" effect passing through on hover.
- **Shape:** Full Pill (`border-radius: 999px`).

## 4. Layout Structure

### 4.1. The "Canvas"
The page is not a white box. It is an infinite canvas.
- **Z-Index Strategy:**
  - Layer 0: Animated Mesh Gradient (The "Aurora").
  - Layer 1: Content Plane (The Bento Grid).
  - Layer 2: Glass Overlays (Modals, Panels).
  - Layer 3: Floating Dock (Navigation).

### 4.2. Motion Design
- **Page Transitions:** Elements don't just appear; they **flow** in. Staggered fade-up animations for grid items.
- **Micro-interactions:** Buttons have a "magnetic" pull (move slightly towards the cursor).

## 5. Implementation Plan (Roadmap)

### Phase 1: Foundation (CSS Variables & Assets)
- Update `index.css` with the new "Aurora" color system.
- Import fonts (Outfit, Plus Jakarta Sans).
- Create the "Mesh Gradient" background component.

### Phase 2: Shell Architecture
- **Refactor `Layout.tsx`:**
  - Remove the rigid flexbox sidebar.
  - Implement the **Floating Dock** component.
  - Fix current build errors.

### Phase 3: Dashboard Transformation
- Convert `Dashboard.tsx` to the **Bento Grid** layout.
- Create "Widget" components (Greeting Widget, Quick Action Widget, Stats Widget).

### Phase 4: Component Library
- Re-style all Buttons, Inputs, and Cards to match the "Liquid Glass" aesthetic.
- Replace all icons with the new Duotone SVG set.

## 6. Concrete Examples

### Login Page Concept
- **Split Screen:** Left side is pure art—a 3D interactive spline or mesh. Right side is a minimal glass card for the form.
- **Input Fields:** No borders. Just a subtle background change. The active line animates in from the center.

### Dashboard Concept
- **Greeting:** "Good Evening, User." (Huge font, 60px).
- **Grid:**
  - [Weather/Time Widget] [Active Agent Status]
  - [Recent Conversations List (Tall)] [Create New Agent (Big Button)]
