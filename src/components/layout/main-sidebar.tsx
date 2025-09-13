'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  AreaChart,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export function MainSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/simulator', label: 'Simulator', icon: AreaChart },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 animate-fade-in">
          <ShieldCheck className="h-8 w-8 text-primary animate-bounce-in" />
          <h1 className="text-2xl font-bold text-foreground animate-slide-in-right" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>Aegis AI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>MENU</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={item.href}>
                <div className="animate-fade-in-up" style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'both' }}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="group transition-all duration-200 hover:bg-primary/10 hover:scale-105"
                  >
                    <Link href={item.href}>
                      <item.icon className="group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:text-primary transition-colors duration-200">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>GENERAL</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === '/help'} 
                  tooltip="Help"
                  className="group transition-all duration-200 hover:bg-primary/10 hover:scale-105"
                >
                  <Link href="/help">
                    <HelpCircle className="group-hover:scale-110 transition-transform duration-200" />
                    <span className="group-hover:text-primary transition-colors duration-200">Help</span>
                  </Link>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </>
  );
}
