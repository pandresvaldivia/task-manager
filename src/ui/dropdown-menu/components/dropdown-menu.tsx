'use client';

import { DropdownMenuContent } from './dropdown-menu-content';
import { DropdownMenuContainer } from './dropdown-menu-container';

type Props = {
  trigger: React.ReactNode;
  className?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

export function DropdownMenu({
  isOpen,
  setIsOpen,
  className,
  children,
  trigger,
}: Props) {
  return (
    <>
      <DropdownMenuContainer isOpen={isOpen} setIsOpen={setIsOpen}>
        {trigger}
        <DropdownMenuContent className={className}>
          {children}
        </DropdownMenuContent>
      </DropdownMenuContainer>
    </>
  );
}
