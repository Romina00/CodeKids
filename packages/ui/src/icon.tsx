import type { LucideIcon, LucideProps } from 'lucide-react';

export {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  CodeXml,
  LockKeyhole,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof iconSizes;

export interface IconProps extends Omit<
  LucideProps,
  'aria-hidden' | 'aria-label' | 'size'
> {
  icon: LucideIcon;
  label?: string;
  size?: IconSize;
}

export function Icon({
  icon: Glyph,
  label,
  size = 'md',
  strokeWidth = 2,
  ...props
}: IconProps) {
  const accessibilityProps = label
    ? { 'aria-label': label, role: 'img' }
    : { 'aria-hidden': true as const };

  return (
    <Glyph
      {...props}
      {...accessibilityProps}
      size={iconSizes[size]}
      strokeWidth={strokeWidth}
    />
  );
}
