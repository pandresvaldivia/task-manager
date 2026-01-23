import { ShadcnSidebar } from '@/ui/shadcn/sidebar';

type Props = {
  children: React.ReactNode;
};

export function SidebarContainer({ children }: Props) {
  return <ShadcnSidebar>{children}</ShadcnSidebar>;
}
