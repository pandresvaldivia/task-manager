type Props = {
  children: React.ReactNode;
};

export const SidebarMenu = ({ children }: Props) => {
  return <ul className='flex flex-col gap-0'>{children}</ul>;
};
