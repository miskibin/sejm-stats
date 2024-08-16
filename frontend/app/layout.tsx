import type { Metadata } from 'next'
import ClientLayout from './clientLayout'

export const metadata: Metadata = {
  title: 'Sejm Stats',
  description: 'Kompleksowy przegląd aktywności sejmowej',
  openGraph: {
    title: 'Sejm Stats',
    description: 'Kompleksowy przegląd aktywności sejmowej',
    url: 'https://sejm-stats.pl',
    siteName: 'Sejm Stats',
    images: [
      {
        url: 'https://sejm-stats.pl/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sejm Stats',
    description: 'Kompleksowy przegląd aktywności sejmowej',
    images: ['https://sejm-stats.pl/twitter-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}