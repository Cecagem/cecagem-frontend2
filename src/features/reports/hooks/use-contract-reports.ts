import { useState, useCallback } from "react";
import { getContractReport } from "../services/report-contract.service";
import type {
  ContractReportResponse,
  ContractReportFilters,
  ContractReportError,
} from "../types/report-contract.types";

interface UseContractReportsState {
  data: ContractReportResponse | null;
  loading: boolean;
  error: ContractReportError | null;
}

interface UseContractReportsReturn extends UseContractReportsState {
  fetchReport: (filters: ContractReportFilters) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook personalizado para manejar los reportes de contratos
 * Maneja el estado de carga, datos y errores para el reporte de contratos
 */
export function useContractReports(): UseContractReportsReturn {
  const [state, setState] = useState<UseContractReportsState>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Obtiene el reporte de contratos con los filtros especificados
   */
  const fetchReport = useCallback(async (filters: ContractReportFilters) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const data = await getContractReport(filters);
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const reportError: ContractReportError = {
        message: error instanceof Error ? error.message : "Error desconocido al obtener el reporte",
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