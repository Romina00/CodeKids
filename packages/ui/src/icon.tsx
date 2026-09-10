import type { LucideIcon, LucideProps } from 'lucide-react';

export type { LucideIcon };

export {
  ArrowLeft,
  ArrowRight,
  Ampersand,
  Award,
  BarChart3,
  BatteryCharging,
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
  CornerUpLeft,
  Clock,
  Clock3,
  Coins,
  CodeXml,
  CreditCard,
  DoorOpen,
  DoorClosed,
  Flame,
  Footprints,
  Gamepad2,
  GitFork,
  GitBranch,
  Hash,
  KeyRound,
  LockKeyhole,
  Menu,
  Map,
  Minus,
  Milk,
  Pizza,
  Play,
  PlayCircle,
  Plus,
  Octagon,
  Power,
  RotateCcw,
  Rocket,
  RectangleEllipsis,
  Settings,
  ShieldCheck,
  Soup,
  Sparkles,
  Trophy,
  ToggleLeft,
  Type,
  Undo2,
  UserRound,
  UsersRound,
  Utensils,
  Variable,
  WalletCards,
  Wheat,
  X,
  Zap,
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
