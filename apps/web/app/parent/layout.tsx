import type { ReactNode } from 'react';
import { ParentAccess } from '../../components/parent-access';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return <ParentAccess>{children}</ParentAccess>;
}
