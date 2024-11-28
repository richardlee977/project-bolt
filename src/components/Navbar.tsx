import { Menu, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const navItems = [
    { label: 'Business Tools', href: 'business/' },
    { label: 'Calculators', href: '#calculator' },
    { label: 'Guides', href: '#guides' },
    { label: 'Marketing', href: '#marketing' },
    { label: 'Content Creation', href: '#content' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <a href='../' className="flex items-center space-x-2">
            <Command className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Restaurant OS</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="text-foreground/60 hover:text-foreground"
                asChild
              >
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={item.href}>{item.label}</a>
                  </Button>
                ))}
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}