import { UserRound, Icon } from '@repo/ui/icon';
import Image from 'next/image';
import { apiBaseUrl } from '../lib/auth-session';
import styles from './child-avatar.module.css';

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
    <span className={styles.avatar} data-avatar={avatar}>
      <Icon icon={UserRound} size="xl" label={`${name}'s avatar`} />
    </span>
  );
}
