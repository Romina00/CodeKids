# CodeKids Design Tokens

The web application uses a three-layer token system under `apps/web/styles/tokens`:

1. `primitives.css` contains raw palette, typography, spacing, radius, and shadow values.
2. `semantic.css` assigns those values to interface purposes and owns light/dark theme changes.
3. `components.css` maps semantic values to reusable component contracts.

Components and page styles must consume semantic or component tokens. Raw values belong only in the primitive layer unless a documented one-off value cannot reasonably be represented by the shared scale.

Token names use `--{category}-{item}-{variant-or-state}`. Component tokens use `--{component}-{property}-{state}`. New tokens should reuse an existing primitive wherever possible and include a clear purpose.
