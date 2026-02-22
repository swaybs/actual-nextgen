'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LootCoreProvider } from '@/components/loot-core/LootCoreProvider';
import { Sidebar, SidebarProvider } from '@/components/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LootCoreProvider>
        <SidebarProvider>
          <div className="flex h-full bg-page-background">
            <Sidebar />
            <main className="flex-1 overflow-auto text-page-text">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </LootCoreProvider>
    </QueryClientProvider>
  );
}
