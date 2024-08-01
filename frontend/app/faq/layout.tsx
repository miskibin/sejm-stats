import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pytania i odpowiedzi - Sejm-Stats',
  description: 'Pytania i odpowiedzi oraz informacje o projekcie Sejm-Stats.',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}