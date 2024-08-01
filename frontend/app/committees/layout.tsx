import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lista komisji sejmowych - Sejm-Stats',
  description: 'Lista wszystkich komisji sejmowych',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}