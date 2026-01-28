import {
  ButtonSize,
  ButtonVariant,
} from '@/modules/shared/infrastructure/styles/style-variants/button';
import { Button } from '@/ui/button/button';
import { ShadcnDropdownMenuTrigger } from '@/ui/shadcn/dropdown-menu';
import { cn } from '../../../modules/shared/infrastructure/shadcn/helpers/utils';

type Props = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function DropdownMenuTrigger({
  children,
  variant,
  size,
  className,
}: Props) {
  return (
    <ShadcnDropdownMenuTrigger asChild className={cn(className)}>
      <Button variant={variant} size={size}>
        {children}
      </Button>
    </ShadcnDropdownMenuTrigger>
  );
}
