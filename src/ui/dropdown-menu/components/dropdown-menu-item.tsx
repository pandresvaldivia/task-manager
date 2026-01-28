import { Slot } from '@/modules/shared/infrastructure/react/helpers/slot';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
};

export function DropdownMenuItem({ children, className, asChild }: Props) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      role='menuitem'
      className={cn(
        "flex cursor-default items-center gap-3 px-1.5 py-3.5 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      {children}
    </Component>
  );
}
