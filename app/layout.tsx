import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LingoFlow Pro — Executive Translation Platform',
  description:
    'Triple-engine AI translation platform supporting 110+ languages with voice input/output and professional register presets for medical, legal, and academic use.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
