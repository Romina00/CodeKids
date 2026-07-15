# Icon Standard

CodeKids uses `lucide-react` as its only interface icon library. Import a Lucide glyph and render it through `@repo/ui/icon` so size, stroke, and accessibility remain consistent.

```tsx
import { ArrowRight, Icon } from '@repo/ui/icon';

<Icon icon={ArrowRight} label="Continue" size="md" />;
```

The supported sizes are `sm` (16px), `md` (20px), `lg` (24px), and `xl` (32px). The default stroke width is 2. Decorative icons omit `label` and are hidden from assistive technology; meaningful standalone icons require a concise label.

The custom CodeKids logo SVG is a brand mark, not an interface icon, and is the only current SVG exception. The audit found no competing icon dependencies to remove. Do not add Heroicons, Font Awesome, Material Icons, `react-icons`, or another icon package.
