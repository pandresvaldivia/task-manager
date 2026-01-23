import { EyeSlashIcon } from '@/icons/solid';
import { SidebarTrigger } from './sidebar-trigger';

export function SidebarHideButton() {
  return (
    <SidebarTrigger className='flex items-center gap-3.5 heading-m text-medium-grey px-8 w-full h-12 hover:bg-light-grey transition-colors rounded-r-full'>
      <EyeSlashIcon className='size-4' />
      Hide Sidebar
    </SidebarTrigger>
  );
}
