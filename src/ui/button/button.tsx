import { VariantProps } from 'class-variance-authority';
import { Slot } from '@/modules/shared/infrastructure/react/helpers/slot';
import { buttonVariants } from '@/modules/shared/infrastructure/styles/style-variants/button';

type Props = React.ComponentProps<'button'> & {
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
  asChild?: boolean;
};

export function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  ...rest
}: Props) {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={buttonVariants({ variant, size })} {...rest} />;
}
