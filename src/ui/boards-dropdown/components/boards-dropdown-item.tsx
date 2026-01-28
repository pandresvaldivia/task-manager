import { Slottable } from '@/modules/shared/infrastructure/react/helpers/slot';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';
import { DropdownMenuItem } from '@/ui/dropdown-menu/components/dropdown-menu-item';
import { BoardIcon } from '@/ui/shared/components/icons/outline';
import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  isActive?: boolean;
  asChild?: boolean;
  className?: string;
};

export function BoardsDropdownItem({
  children,
  isActive,
  asChild,
  className,
}: Props) {
  return (
    <DropdownMenuItem
      className={cn(
        'flex justify-start items-center gap-3 px-6 h-12 w-full transition-colors rounded-none rounded-r-full text-white heading-m',
        {
          'text-medium-grey hover:bg-light-grey': !isActive,
          'bg-purple hover:bg-purple-hover text-white': isActive,
        },
        className,
      )}
      asChild={asChild}
    >
      <BoardIcon height='16' width='16' className='size-4' />
      <Slottable>{children}</Slottable>
    </DropdownMenuItem>
  );
}
