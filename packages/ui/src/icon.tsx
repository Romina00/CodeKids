import type { LucideIcon, LucideProps } from 'lucide-react';

export type { LucideIcon };

export {
  ArrowLeft,
  ArrowRight,
  Ampersand,
  Award,
  BarChart3,
  BellRing,
  BookOpen,
  Bot,
  BrainCircuit,
  Cat,
  Check,
  ChefHat,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  Clock,
  Clock3,
  CodeXml,
  CreditCard,
  DoorOpen,
  DoorClosed,
  Flame,
  Gamepad2,
  GitFork,
  KeyRound,
  LockKeyhole,
  Menu,
  Map,
  Milk,
  Pizza,
  Play,
  PlayCircle,
  Plus,
  Power,
  RotateCcw,
  Rocket,
  RectangleEllipsis,
  Settings,
  ShieldCheck,
  Soup,
  Sparkles,
  Trophy,
  Undo2,
  UserRound,
  UsersRound,
  Utensils,
  Wheat,
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
