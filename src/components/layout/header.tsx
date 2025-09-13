'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';

export function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'Analyst Dashboard';
    if (pathname === '/simulator') return 'Intuitive Simulator';
    if (pathname === '/help') return 'Contact Information';
    return 'Dashboard';
  };

  return (
    <header className="p-4 lg:p-8 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden animate-scale-in transition-all duration-200 hover:scale-110" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground animate-slide-in-right" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>{getPageTitle()}</h1>
          <p className="text-sm text-muted-foreground mt-1 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            Aegis AI - Comprehensive AI Fraud Detection System
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="animate-slide-in-right" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <Button variant="ghost" size="icon" asChild className="hover:scale-110 hover:bg-primary/10 hover:text-primary transition-all duration-200">
            <a href="mailto:abhay.manikanti@gmail.com">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="animate-slide-in-right" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
          <Link href="/help" className="flex items-center gap-2 cursor-pointer group hover:scale-105 transition-all duration-200">
            <div>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors duration-200">Developer - Abhay Manikanti</p>
              <p className="text-xs text-muted-foreground">abhay.manikanti@gmail.com</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
