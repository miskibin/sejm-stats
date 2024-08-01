import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Głosowania - Sejm-Stats',
  description: 'Lista głosowań w Sejmie',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}