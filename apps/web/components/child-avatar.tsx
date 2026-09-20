import { UserRound, Icon } from '@repo/ui/icon';
import Image from 'next/image';
import { apiBaseUrl } from '../lib/auth-session';

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
  return (
    <span
      className="grid w-full h-full place-items-center text-[color:var(--color-on-primary)] bg-[var(--color-primary)] rounded-[inherit] [&[data-avatar='robot-green']]:bg-[var(--color-success)] [&[data-avatar='robot-orange']]:bg-[var(--color-warning)] [&[data-avatar='robot-orange']]:text-[color:var(--color-text)]"
      data-avatar={avatar}
    >
      <Icon icon={UserRound} size="xl" label={`${name}'s avatar`} />
    </span>
  );
}
