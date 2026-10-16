import type { ReactNode } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';

/** Re-mounts on every navigation → drives the restrained page transition. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
