import { cecagemApi } from "@/lib/api-client";
import type { IDashboardData, IDashboardFilters } from "../types/dashboard.types";

const ENDPOINTS = {
  dashboard: "/dashboard",
};

export class DashboardService {
  // Obtener datos completos del dashboard
  async getDashboardData(filters: Partial<IDashboardFilters> = {}): Promise<IDashboardData> {
    const params = new URLSearchParams();
    
    // Agregar filtros si existen
    if (filters.year) params.append("year", filters.year.toString());
    if (filters.month) params.append("month", filters.month.toString());
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.dashboard}?${queryString}` : ENDPOINTS.dashboard;
    
    const response = await cecagemApi.get<IDashboardData>(url);
    return response;
  }
}

export const dashboardService = new DashboardService();