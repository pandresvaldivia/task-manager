import { Slot } from '@/modules/shared/infrastructure/react/helpers/slot';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';
import {
  ButtonSize,
  ButtonVariant,
  buttonVariants,
} from '@/modules/shared/infrastructure/styles/style-variants/button';

type Props = React.ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  className,
  ...rest
}: Props) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}
