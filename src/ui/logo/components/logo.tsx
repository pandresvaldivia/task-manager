'use client';

import { isDarkTheme } from '@/modules/shared/domain/helpers/theme';
import { useIsClient } from '@/modules/shared/infrastructure/react/hooks/use-is-client';
import { KanbanLogoIcon } from '@/ui/shared/components/icons/colorful/kanban-logo';
import { KanbanLogoDarkIcon } from '@/ui/shared/components/icons/colorful/kanban-logo-dark';
import { useTheme } from 'next-themes';

export function Logo() {
  const { theme } = useTheme();
  const { isClient } = useIsClient();
  const isDark = isDarkTheme(theme);

  if (!isClient) {
    return <KanbanLogoIcon height='24' width='152' className='h-6 w-auto' />;
  }

  if (isDark) {
    return (
      <KanbanLogoDarkIcon height='24' width='152' className='h-6 w-auto' />
    );
  }

  return <KanbanLogoIcon height='24' width='152' className='h-6 w-auto' />;
}
