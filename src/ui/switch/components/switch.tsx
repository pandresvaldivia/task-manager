'use client';

import { ShadcnSwitch } from '@/ui/shadcn/switch';

type Props = {
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({ isChecked, onCheckedChange }: Props) {
  return <ShadcnSwitch checked={isChecked} onCheckedChange={onCheckedChange} />;
}
