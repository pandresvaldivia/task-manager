import { BoardIcon } from '@/icons/outline';
import {
  Slot,
  Slottable,
} from '@/modules/shared/infrastructure/react/helpers/slot';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  asChild?: boolean;
};

export function SidebarMenuItem({
  children,
  className,
  isActive,
  asChild,
}: Props) {
  const Component = asChild ? Slot : 'button';

  return (
    <li>
      <Component
        className={cn(
          'flex justify-start items-center gap-4 px-8 h-12 w-full transition-colors rounded-none rounded-r-full text-white heading-m',
          {
            'text-medium-grey hover:bg-light-grey': !isActive,
            'bg-purple hover:bg-purple-hover text-white': isActive,
          },
          className,
        )}
      >
        <BoardIcon className='size-4' />
        <Slottable>{children}</Slottable>
      </Component>
    </li>
  );
}
