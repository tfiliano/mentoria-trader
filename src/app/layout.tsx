import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MENTORA AI - Mentoria de Trading Gamificada',
  description:
    'Plataforma de mentoria de trading com gamificação, desafios e acompanhamento de progresso.',
  keywords: ['trading', 'mentoria', 'gamificação', 'day trade', 'investimentos'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
