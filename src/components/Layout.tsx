import { type ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8 lg:px-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
