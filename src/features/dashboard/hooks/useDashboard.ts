import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import type { IDashboardFilters } from "../types/dashboard.types";

// Query keys para cache
export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  data: (filters: Partial<IDashboardFilters>) => 
    [...DASHBOARD_QUERY_KEYS.all, "data", filters] as const,
};

// Hook para obtener datos del dashboard
export const useDashboard = (filters: Partial<IDashboardFilters> = {}) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.data(filters),
    queryFn: () => dashboardService.getDashboardData(filters),
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};