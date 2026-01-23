import { BoardIcon } from '@/icons/outline';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';

type Props = {
  text: string;
  className?: string;
  isActive?: boolean;
};

export function SidebarMenuItem({ text, className, isActive }: Props) {
  return (
    <li>
      <button
        className={cn(
          'flex justify-start items-center gap-4 px-8 h-12 w-full transition-colors rounded-none rounded-r-full text-white heading-m',
          {
            'text-medium-grey hover:bg-light-grey': !isActive,
            'bg-purple hover:bg-purple-hover text-white': isActive,
          },
          className
        )}
      >
        <BoardIcon className='size-4' />
        {text}
      </button>
    </li>
  );
}
