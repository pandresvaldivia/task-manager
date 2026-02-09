'use client';

import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';
import { BoardsDropdown } from '@/ui/boards-dropdown/components/boards-dropdown';
import { Button } from '@/ui/button/button';
import { Logo } from '@/ui/logo/components/logo';
import { IsotypeIcon } from '@/ui/shared/components/icons/colorful/isotype';
import { PlusIcon } from '@/ui/shared/components/icons/solid';
import { useSidebarContext } from '@/ui/sidebar/providers/sidebar-provider';
import { useState } from 'react';

type Props = {
  name: string;
  boards: Array<{ id: string; name: string }>;
};

export function Header({ name, boards }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isSidebarOpen } = useSidebarContext();

  return (
    <>
      <header className='z-20 bg-white dark:bg-dark-grey border-b border-lines-light dark:border-lines-dark'>
        <div className='flex'>
          <div
            className={cn(
              'hidden lg:grid place-items-center px-6 border-r border-lines-light dark:border-lines-dark',
              {
                'lg:hidden': isSidebarOpen,
              },
            )}
          >
            <Logo />
          </div>
          <div className='flex items-center justify-between py-5 lg:py-6 px-6 w-full'>
            <p className='hidden lg:block font-jakarta text-heading-xl font-bold text-black dark:text-white'>
              {name}
            </p>
            <div className='flex items-center gap-4 lg:hidden'>
              <IsotypeIcon />
              <BoardsDropdown
                triggerContent={name}
                className='lg:hidden'
                boards={boards}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
              />
            </div>
            <Button className='py-2.5 px-4 lg:px-6 lg:py-3.5 lg:text-base'>
              <span className='hidden lg:block'>+ Add New Task</span>
              <span className='lg:hidden'>
                <PlusIcon />
              </span>
            </Button>
          </div>
        </div>
      </header>
      {isDropdownOpen && <div className='fixed inset-0 bg-black/50 z-10' />}
    </>
  );
}
