import { useState, useCallback } from "react";
import { getTransactionReport } from "../services/report-transaction.service";
import type {
  TransactionReportResponse,
  TransactionReportFilters,
  TransactionReportError,
} from "../types/report-transaction.types";

interface UseTransactionReportsState {
  data: TransactionReportResponse | null;
  loading: boolean;
  error: TransactionReportError | null;
}

interface UseTransactionReportsReturn extends UseTransactionReportsState {
  fetchReport: (filters: TransactionReportFilters) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook personalizado para manejar los reportes de transacciones
 * Maneja el estado de carga, datos y errores para el reporte de ingresos y egresos
 */
export function useTransactionReports(): UseTransactionReportsReturn {
  const [state, setState] = useState<UseTransactionReportsState>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Obtiene el reporte de transacciones con los filtros especificados
   */
  const fetchReport = useCallback(async (filters: TransactionReportFilters) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const data = await getTransactionReport(filters);
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const reportError: TransactionReportError = {
        message: error instanceof Error ? error.message : "Error desconocido al obtener el reporte de transacciones",
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