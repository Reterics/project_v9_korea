# Birdie Design System Documentation Site

Version: 0.1  
Status: Initial extraction from working frontend

This document defines the Design System documentation site at apps/design-system-site

The site presents the **Birdie Design System** including:
- presentation
- brand book
- visual foundations
- curated component documentation
- design patterns

Storybook remains the technical component playground.

---

# Mascot

The Birdie mascot (magpie) represents the product personality.

Rules:
- mascot is supportive but not childish
- used for friendly moments (tips, empty states, hints)
- never dominate layouts
- avoid cartoon overload

Allowed places:
- hero section
- learning hints
- empty states
- onboarding explanations

Avoid:
- repeated usage in every component
- decorative clutter
- mascot inside serious UI controls

---

# Architecture

Monorepo structure:

project_v9_korea/
apps/
- web
- design-system-site

packages/
- design-system (@birdie/ui)

The site must **consume components only from `@birdie/ui`**.

Do not duplicate UI components.

---

# Design System Structure

The documentation site should contain these sections:

Overview  
Principles  
Foundations  
Components  
Patterns  
Brand  
Storybook  
Resources

---

# Foundations

Present visual language:

- colors
- typography
- spacing
- radius
- shadows
- icons
- dark mode

Show visually, not as raw token lists.

---

# Components

Explain reusable UI components:

Primitives  
Forms  
Navigation  
Product Components

Each component page shows:

- purpose
- when to use
- curated example

Do not recreate Storybook prop tables.

Link to Storybook instead.

---

# Patterns

Show real UI compositions:

- dashboard layout
- lesson grid
- learning flow
- feedback patterns
- mobile navigation

Patterns should resemble **real product screens**.

---

# Brand

Define Birdie identity:

- logo usage
- mascot usage
- color personality
- tone and feel
- spacing philosophy

---

# Storybook

Explain Storybook purpose:

- component playground
- development testing
- full prop documentation

Provide a link.

---

# Design Direction

The site should feel like:

- a premium design system portal
- calm and modern
- mobile-first
- visually curated
- dark mode friendly

Avoid:

- prop documentation overload
- raw token dumps
- technical documentation tone

---

# Deliverable

Implement a design system portal that acts as:

- brand book
- curated component guide
- product pattern showcase

while Storybook remains the development workspace.