'use client';

import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';
import { useIsMobile } from '@/modules/shared/infrastructure/shadcn/hooks/use-mobile';
import { DropdownMenu } from '@/ui/dropdown-menu/components/dropdown-menu';
import { DropdownMenuTrigger } from '@/ui/dropdown-menu/components/dropdown-menu-trigger';
import { ChevronDownIcon } from '@/ui/shared/components/icons/solid';
import Link from 'next/link';
import { BoardsDropdownItem } from './boards-dropdown-item';
import { usePathname } from 'next/navigation';

type Props = {
  triggerContent: React.ReactNode;
  boards: Array<{ id: string; name: string }>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
};

export function BoardsDropdown({
  isOpen,
  setIsOpen,
  triggerContent,
  boards,
  className,
}: Props) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <DropdownMenu
      trigger={
        <BoardsDropdownTrigger isOpen={isOpen} content={triggerContent} />
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className={cn('pl-0', className)}
    >
      <span className='inline-block px-6 mb-5 uppercase font-bold tracking-wider text-[12px]'>
        All boards ({boards.length})
      </span>
      <div className='flex flex-col pr-2'>
        {boards.map((board) => {
          const isActive = pathname === `/board/${board.id}`;

          return (
            <BoardsDropdownItem key={board.id} isActive={isActive} asChild>
              <Link href={`/board/${board.id}`}>{board.name}</Link>
            </BoardsDropdownItem>
          );
        })}
        <BoardsDropdownItem className='text-purple'>
          + Create New Board
        </BoardsDropdownItem>
      </div>
    </DropdownMenu>
  );
}

function BoardsDropdownTrigger({
  isOpen,
  content,
}: {
  isOpen: boolean;
  content: React.ReactNode;
}) {
  return (
    <DropdownMenuTrigger
      variant='ghost'
      size='lg'
      className='gap-2 text-heading-lg font-bold p-0'
    >
      {content}{' '}
      <ChevronDownIcon
        className={cn(
          'stroke-purple transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
      />
    </DropdownMenuTrigger>
  );
}
