import { Badge } from '@repo/ui/badge';
import {
  Award,
  BookOpen,
  CodeXml,
  Icon,
  Settings,
  Sparkles,
} from '@repo/ui/icon';
import {
  Navigation,
  NavigationItem,
  NavigationLink,
} from '@repo/ui/navigation';
import Link from 'next/link';
import { LogoMark } from '../../components/logo';
import styles from './kid-dashboard.module.css';
import { ParentModeExit } from './parent-mode-exit';
import GameGL1 from '../../components/games/gl1';

export default function KidDashboard() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link aria-label="CodeKids home" className={styles.logoLink} href="/">
          <LogoMark title="" />
          <span>CodeKids</span>
        </Link>
        <Navigation label="Kid dashboard">
          <NavigationItem>
            <NavigationLink current href="#home">
              <Icon icon={Sparkles} size="sm" /> Home
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#levels">
              <Icon icon={BookOpen} size="sm" /> Levels
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#code-lab">
              <Icon icon={CodeXml} size="sm" /> Code lab
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#rewards">
              <Icon icon={Award} size="sm" /> Rewards
            </NavigationLink>
          </NavigationItem>
        </Navigation>
        <a className={styles.profileLink} href="#profile">
          <span className={styles.avatar}>M</span>
          <span>
            <strong>Mina</strong>
            <small>Explorer</small>
          </span>
          <Icon icon={Settings} size="sm" />
        </a>
        <ParentModeExit />
      </aside>

      <main className={styles.main} id="main-content" tabIndex={-1}>
        <header className={styles.welcome} id="home">
          <Badge variant="success">Titel </Badge>
          <h1>Hi Mina, ready to build?</h1>
          <GameGL1 />
        </header>
      </main>
    </div>
  );
}
