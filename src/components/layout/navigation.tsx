'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  FolderOpen,
  Gamepad2,
  Beaker,
  Zap,
  Home,
  Plus,
  Book
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false,
  },
  {
    name: 'Brand Books',
    href: '/brandbooks',
    icon: Book,
    current: false,
  },
  {
    name: 'Briefs',
    href: '/briefs',
    icon: Zap,
    current: false,
  },
  {
    name: 'Library',
    href: '/library',
    icon: FolderOpen,
    current: false,
  },
  {
    name: 'Patterns',
    href: '/patterns',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'Experiments',
    href: '/experiments',
    icon: Beaker,
    current: false,
    badge: '3'
  },
  {
    name: 'Playground',
    href: '/playground',
    icon: Gamepad2,
    current: false,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col bg-gray-50 border-r border-gray-200">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AdCaleidoscope</span>
          </div>
        </div>
        
        <div className="px-4 mt-6">
          <Button 
            asChild 
            className="w-full justify-start bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/briefs/new">
              <Plus className="mr-2 h-4 w-4" />
              New Brief
            </Link>
          </Button>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isDisabled = ['Dashboard', 'Experiments', 'Playground', 'Library'].includes(item.name);
            
            if (isDisabled) {
              return (
                <div
                  key={item.name}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md opacity-50 cursor-not-allowed"
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-500">{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto text-xs opacity-50"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}