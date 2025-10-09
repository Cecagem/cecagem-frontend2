import { cecagemApi } from "@/lib/api-client";
import type {
  ContractReportResponse,
  ContractReportFilters,
} from "../types/report-contract.types";

const BASE_PATH = "/contract/reports";

/**
 * Obtiene el reporte de contratos con filtros de fecha y moneda
 * @param filters - Filtros para el reporte (startDate, endDate, currency)
 * @returns Promise con la respuesta del reporte de contratos
 */
export async function getContractReport(
  filters: ContractReportFilters
): Promise<ContractReportResponse> {
  const { startDate, endDate, currency } = filters;
  
  const params = new URLSearchParams({
    startDate,
    endDate,
    currency,
  });

  const url = `${BASE_PATH}/contracts?${params.toString()}`;
  return cecagemApi.get<ContractReportResponse>(url);
}

/**
 * Servicio para obtener el reporte de contratos
 */
export class ContractReportsService {
  static getContractReport = getContractReport;
}