import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lista posłów - Sejm-Stats',
  description: 'Lista wszystkich posłów',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}