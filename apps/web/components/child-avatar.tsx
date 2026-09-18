import { Bot, Icon } from '@repo/ui/icon';
import Image from 'next/image';
import { apiBaseUrl } from '../lib/auth-session';

const colors: Record<string, string> = {
  'robot-blue': '#2563eb',
  'robot-green': '#15803d',
  'robot-orange': '#c2410c',
};

export function ChildAvatar({
  avatar,
  name,
}: {
  avatar: string | null;
  name: string;
}) {
  if (avatar?.startsWith('/upload/avatars/')) {
    return (
      <Image
        src={`${apiBaseUrl}${avatar}`}
        alt={`${name}'s avatar`}
        width={48}
        height={48}
        unoptimized
        className="rounded-full object-cover"
      />
    );
  }
  if (avatar && colors[avatar]) {
    return (
      <span
        role="img"
        aria-label={`${name}'s ${avatar.replace('-', ' ')}`}
        style={{ color: colors[avatar] }}
      >
        <Icon icon={Bot} size="xl" />
      </span>
    );
  }
  return <span aria-label={`${name}'s avatar`}>{name.charAt(0)}</span>;
}
