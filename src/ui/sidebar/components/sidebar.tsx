'use client';

import { EyeIcon } from '@/icons/solid';
import { SidebarTrigger } from './sidebar-trigger';
import { SidebarContainer } from './sidebar-container';
import { SidebarMenu } from './sidebar-menu';
import { SidebarMenuItem } from './sidebar-menu-item';
import { SidebarHideButton } from './sidebar-hide-button';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitch } from '@/ui/theme-switch/components/theme-switch';
import { Logo } from '@/ui/logo/components/logo';

interface Props {
  items: Array<{ id: string; name: string }>;
  className?: string;
}

export function Sidebar({ items, className }: Props) {
  const pathname = usePathname();

  return (
    <div className={cn('relative', className)}>
      <SidebarContainer>
        <div className='p-8 mb-5'>
          <Logo />
        </div>
        <div className='grid grid-rows-[1fr_auto] h-full gap-8 pr-6'>
          <div>
            <p className='font-jakarta font-bold text-xs tracking-wide uppercase text-medium-grey mb-4.5 mx-8'>
              All Boards ({items.length})
            </p>
            <SidebarMenu>
              {items.map((board) => {
                const isActive = pathname === `/board/${board.id}`;

                return (
                  <SidebarMenuItem key={board.id} isActive={isActive} asChild>
                    <Link href={`/board/${board.id}`}>{board.name}</Link>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem className='text-purple'>
                + Create New Board
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          <div className='flex flex-col gap-2 pb-8'>
            <ThemeSwitch />
            <SidebarHideButton />
          </div>
        </div>
      </SidebarContainer>
      <SidebarTrigger
        className='absolute left-0 bottom-8 flex items-center rounded-r-full w-14 h-12 pl-4.5 button-primary'
        aria-label='Show Sidebar'
      >
        <EyeIcon className='size-4' />
      </SidebarTrigger>
    </div>
  );
}
