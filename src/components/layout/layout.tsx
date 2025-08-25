'use client';

import { Navigation } from './navigation';
import { Header } from './header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64">
        <Navigation />
      </div>
      
      <div className="flex flex-col flex-1 ml-64">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}