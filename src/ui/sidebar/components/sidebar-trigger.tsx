import { ShadcnSidebarTrigger } from '@/ui/shadcn/sidebar';

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SidebarTrigger({ className, children, ...props }: Props) {
  return (
    <ShadcnSidebarTrigger className={className} {...props}>
      {children}
    </ShadcnSidebarTrigger>
  );
}
