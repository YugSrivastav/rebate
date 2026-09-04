import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Rebate — The Reward Layer for AI Wait States',
  description:
    'While your AI works, Rebate works for you. Turn AI reasoning and tool wait time into economic value and relevant developer opportunities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
        <footer className="border-t border-zinc-900 bg-zinc-950/60 py-8 text-xs text-zinc-500">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-semibold text-zinc-300">REBATE</span>
              <span>•</span>
              <span>AI Wait-State Opportunity Marketplace</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-emerald-400/90 font-mono">Zero Code Reading Guarantee</span>
              <a href="/privacy" className="hover:text-zinc-300 transition">Privacy & Trust</a>
              <a href="/demo" className="hover:text-zinc-300 transition">Interactive Demo</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
