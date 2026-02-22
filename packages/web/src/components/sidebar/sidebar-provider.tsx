'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type SidebarContextValue = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
  toggle: () => void;
  floating: boolean;
  width: number;
  setWidth: (width: number) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [width, setWidth] = useState(240);

  const toggle = useCallback(() => {
    setHidden((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        hidden,
        setHidden,
        toggle,
        floating: false,
        width,
        setWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
