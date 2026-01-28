import { ShadcnDropdownMenuContent } from '@/ui/shadcn/dropdown-menu';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function DropdownMenuContent({ children, className }: Props) {
  return (
    <ShadcnDropdownMenuContent className={className}>
      {children}
    </ShadcnDropdownMenuContent>
  );
}
