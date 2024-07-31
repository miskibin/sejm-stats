import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lista interpelacji - Sejm-Stats',
  description: 'Lista wszystkich interpelacji',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}