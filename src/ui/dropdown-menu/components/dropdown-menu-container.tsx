import { ShadcnDropdownMenu } from '@/ui/shadcn/dropdown-menu';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
};

export function DropdownMenuContainer({ isOpen, setIsOpen, children }: Props) {
  return (
    <ShadcnDropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </ShadcnDropdownMenu>
  );
}
