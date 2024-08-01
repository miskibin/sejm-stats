import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lista precesów - Sejm-Stats',
  description: 'Lista wszystkich procesów sejmowych',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}