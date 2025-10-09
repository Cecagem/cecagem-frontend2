import { useState, useCallback } from "react";
import { getCompanyReport } from "../services/report-company.service";
import type {
  CompanyReportResponse,
  CompanyReportFilters,
  CompanyReportError,
} from "../types/report-company.types";

interface UseCompanyReportsState {
  data: CompanyReportResponse | null;
  loading: boolean;
  error: CompanyReportError | null;
}

interface UseCompanyReportsReturn extends UseCompanyReportsState {
  fetchReport: (filters: CompanyReportFilters) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook personalizado para manejar los reportes de empresas
 * Maneja el estado de carga, datos y errores para el reporte de empresas y sus pagos
 */
export function useCompanyReports(): UseCompanyReportsReturn {
  const [state, setState] = useState<UseCompanyReportsState>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Obtiene el reporte de empresas con los filtros especificados
   */
  const fetchReport = useCallback(async (filters: CompanyReportFilters) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const data = await getCompanyReport(filters);
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const reportError: CompanyReportError = {
        message: error instanceof Error ? error.message : "Error desconocido al obtener el reporte de empresas",
        code: (error as { status?: number })?.status?.toString(),
      };

      setState({
        data: null,
        loading: false,
        error: reportError,
      });
    }
  }, []);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Resetea el estado completo del hook
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchReport,
    clearError,
    reset,
  };
}