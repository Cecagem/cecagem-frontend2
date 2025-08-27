"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Por defecto, los datos se consideran frescos por 5 minutos
            staleTime: 5 * 60 * 1000,
            // Cache por 10 minutos
            gcTime: 10 * 60 * 1000,
            // Reintenta 3 veces en caso de error
            retry: 3,
            // No refrescar automáticamente en focus/reconect por defecto
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Reintenta 1 vez las mutaciones en caso de error
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
