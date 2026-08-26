import type { ReactNode } from 'react';
import { KidLayout } from './kid-layout';

export default function KidRootLayout({ children }: { children: ReactNode }) {
  return <KidLayout>{children}</KidLayout>;
}
