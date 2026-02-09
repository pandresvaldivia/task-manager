'use client';

import { ShadcnSidebarProvider } from '@/ui/shadcn/sidebar';
import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebar: () => void;
};

type SidebarProviderProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultOpen);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const value = {
    isSidebarOpen,
    closeSidebar,
    openSidebar,
    toggleSidebar,
  };

  return (
    <ShadcnSidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SidebarContext.Provider value={value}>
        {children}
      </SidebarContext.Provider>
    </ShadcnSidebarProvider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }

  return context;
}
