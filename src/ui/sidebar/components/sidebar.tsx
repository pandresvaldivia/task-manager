import { EyeIcon } from '@/icons/solid';
import { SidebarTrigger } from './sidebar-trigger';
import { SidebarContainer } from './sidebar-container';
import { SidebarMenu } from './sidebar-menu';
import { SidebarMenuItem } from './sidebar-menu-item';
import { KanbanLogoIcon } from '@/ui/shared/components/icons/colorful/kanban-logo';
import { SidebarHideButton } from './sidebar-hide-button';

interface Props {
  items: Array<{ id: string; name: string }>;
}

export async function Sidebar({ items }: Props) {
  return (
    <div className='relative'>
      <SidebarContainer>
        <div className='p-8 mb-5'>
          <KanbanLogoIcon height='24' width='152' className='h-6 w-auto' />
        </div>
        <div className='grid grid-rows-[1fr_auto] h-full gap-8 pr-6'>
          <div>
            <p className='font-jakarta font-bold text-xs tracking-wide uppercase text-medium-grey mb-4.5 mx-8'>
              All Boards ({items.length})
            </p>
            <SidebarMenu>
              {items.map((board, index) => {
                return (
                  <SidebarMenuItem
                    key={board.id}
                    text={board.name}
                    isActive={index === 0}
                  />
                );
              })}
              <SidebarMenuItem
                text='+ Create New Board'
                className='text-purple'
              />
            </SidebarMenu>
          </div>
          <div className='pb-8'>
            <SidebarHideButton />
          </div>
        </div>
      </SidebarContainer>
      <SidebarTrigger
        className='absolute left-0 bottom-8 flex items-center rounded-r-full w-14 h-12 pl-[18px] button-primary'
        aria-label='Show Sidebar'
      >
        <EyeIcon className='size-4' />
      </SidebarTrigger>
    </div>
  );
}
