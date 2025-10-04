import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KRPtex — 3D WebForge',
  description: 'Interactive 3D website maker powered by R3F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}