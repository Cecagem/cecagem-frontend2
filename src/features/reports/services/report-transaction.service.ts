import { cecagemApi } from "@/lib/api-client";
import type {
  TransactionReportResponse,
  TransactionReportFilters,
} from "../types/report-transaction.types";

const BASE_PATH = "/transactions/reports";

/**
 * Obtiene el reporte de transacciones (ingresos y egresos) con filtros
 * @param filters - Filtros para el reporte (startDate, endDate, currency, transactionType)
 * @returns Promise con la respuesta del reporte de transacciones
 */
export async function getTransactionReport(
  filters: TransactionReportFilters
): Promise<TransactionReportResponse> {
  const { startDate, endDate, currency, transactionType } = filters;
  
  const params = new URLSearchParams({
    startDate,
    endDate,
    currency,
    transactionType,
  });

  const url = `${BASE_PATH}/transactions?${params.toString()}`;
  return cecagemApi.get<TransactionReportResponse>(url);
}

/**
 * Servicio para obtener el reporte de transacciones
 */
export class TransactionReportsService {
  static getTransactionReport = getTransactionReport;
}