'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Create a smoother animation style
    const style = document.createElement('style');
    style.id = 'theme-sweep-style';
    style.textContent = `
      .theme-sweep-transition {
        animation: themeSweep 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
      }
      
      @keyframes themeSweep {
        0% {
          clip-path: inset(0 100% 0 0);
        }
        100% {
          clip-path: inset(0 0% 0 0);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Create a full HTML structure clone
    const fullClone = document.createElement('html');
    fullClone.className = `${newTheme}`;
    fullClone.setAttribute('data-theme', newTheme);
    fullClone.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
      clip-path: inset(0 100% 0 0);
      margin: 0;
      padding: 0;
    `;
    
    // Create body clone with proper theme classes
    const bodyClone = document.createElement('body');
    bodyClone.className = `${newTheme} bg-background text-foreground`;
    bodyClone.innerHTML = document.body.innerHTML;
    
    // Apply all necessary CSS variables directly
    const themeVars = newTheme === 'dark' ? {
      '--background': '240 4% 10%',
      '--foreground': '0 0% 98%',
      '--card': '240 4% 13%',
      '--card-foreground': '0 0% 98%',
      '--primary': '158 78% 46%',
      '--muted': '240 4% 16%',
      '--muted-foreground': '240 4% 60%',
      '--border': '240 4% 16%',
      '--sidebar-background': '240 4% 10%',
      '--sidebar-foreground': '0 0% 98%',
      '--sidebar-accent': '240 4% 16%',
      '--sidebar-border': '240 4% 16%'
    } : {
      '--background': '240 10% 98%',
      '--foreground': '240 5% 30%',
      '--card': '0 0% 100%',
      '--card-foreground': '240 5% 30%',
      '--primary': '158 78% 36%',
      '--muted': '240 5% 96%',
      '--muted-foreground': '240 4% 46%',
      '--border': '240 6% 90%',
      '--sidebar-background': '0 0% 100%',
      '--sidebar-foreground': '240 5.3% 26.1%',
      '--sidebar-accent': '240 5% 94%',
      '--sidebar-border': '220 13% 91%'
    };
    
    // Apply CSS variables
    Object.entries(themeVars).forEach(([key, value]) => {
      fullClone.style.setProperty(key, value);
      bodyClone.style.setProperty(key, value);
    });
    
    fullClone.appendChild(bodyClone);
    document.body.appendChild(fullClone);
    
    // Start the smooth sweep animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fullClone.classList.add('theme-sweep-transition');
      });
    });
    
    // Change theme at optimal timing
    setTimeout(() => {
      setTheme(newTheme);
    }, 400);
    
    // Cleanup with shorter duration for smoother feel
    setTimeout(() => {
      if (fullClone.parentNode) {
        document.body.removeChild(fullClone);
      }
      const styleEl = document.getElementById('theme-sweep-style');
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
      setIsAnimating(false);
    }, 900);
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 animate-bounce-in">
        <Button
          variant="outline"
          size="icon"
          onClick={handleThemeToggle}
          disabled={isAnimating}
          className="theme-toggle-button rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:scale-110 hover:shadow-lg hover:animate-wiggle transition-all duration-300 group overflow-hidden active:scale-95"
        >
          {/* Moon icon - shows in LIGHT mode (inverted) */}
          <Moon className="h-[1.5rem] w-[1.5rem] absolute text-blue-600 dark:text-yellow-500 transition-all duration-700 ease-in-out dark:-rotate-180 dark:scale-0 dark:opacity-0 rotate-0 scale-100 opacity-100" />
          
          {/* Sun icon - shows in DARK mode (inverted) */}
          <Sun className="h-[2.5rem] w-[2.5rem] absolute text-yellow-500 dark:text-yellow-00 transition-all duration-700 ease-in-out dark:rotate-0 dark:scale-100 dark:opacity-100 rotate-180 scale-0 opacity-0" />
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </>
  );
}
