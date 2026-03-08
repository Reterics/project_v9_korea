<p align="center">
  <img src="https://raw.githubusercontent.com/Reterics/project_v9_korea/main/packages/design-system/public/brand/logo-icon.svg" alt="Birdie UI" width="96" height="96" />
</p>

<h1 align="center">@reterics/birdie-ui</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@reterics/birdie-ui"><img src="https://img.shields.io/npm/v/@reterics/birdie-ui" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@reterics/birdie-ui"><img src="https://img.shields.io/npm/dm/@reterics/birdie-ui" alt="npm downloads" /></a>
  <a href="https://reterics.github.io/project_v9_korea/design_system/"><img src="https://img.shields.io/badge/Design%20System-Live-3D8F7D" alt="design system live" /></a>
  <a href="https://github.com/Reterics/project_v9_korea/actions/workflows/build.yml"><img src="https://github.com/Reterics/project_v9_korea/actions/workflows/build.yml/badge.svg" alt="build status" /></a>
  <a href="https://github.com/Reterics/project_v9_korea/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license" /></a>
</p>

TailwindCSS v4 based design system for learning and productivity products, providing reusable UI primitives, composed components, layout patterns, and theme tokens.

## Installation

```bash
npm install @reterics/birdie-ui
```

## Peer Dependencies

```bash
npm install react react-dom framer-motion lucide-react
```

## Usage

```tsx
import { Button, Card } from "@reterics/birdie-ui";
import "@reterics/birdie-ui/theme";

export function Example() {
  return (
    <Card>
      <Button variant="primary">Continue</Button>
    </Card>
  );
}
```

## Assets

```ts
import logoUrl from "@reterics/birdie-ui/assets/brand/logo-primary.svg";
```

## Repository

- Source: https://github.com/Reterics/project_v9_korea/tree/main/packages/design-system
- Issues: https://github.com/Reterics/project_v9_korea/issues
