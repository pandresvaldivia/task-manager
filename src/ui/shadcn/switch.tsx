'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/modules/shared/infrastructure/shadcn/helpers/utils';

function ShadcnSwitch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'bg-purple focus-visible:border-ring focus-visible:ring-purple-hover inline-flex shrink-0 items-center rounded-full transition-all outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 h-5 w-10 border-4 border-transparent',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform size-3.5 data-[state=checked]:translate-x-[calc(100%+0.25rem)] data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { ShadcnSwitch };
