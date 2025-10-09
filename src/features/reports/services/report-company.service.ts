import { cecagemApi } from "@/lib/api-client";
import type {
  CompanyReportResponse,
  CompanyReportFilters,
} from "../types/report-company.types";

const BASE_PATH = "/companies/reports";

/**
 * Obtiene el reporte de empresas y sus pagos con filtros de fecha y moneda
 * @param filters - Filtros para el reporte (startDate, endDate, currency)
 * @returns Promise con la respuesta del reporte de empresas
 */
export async function getCompanyReport(
  filters: CompanyReportFilters
): Promise<CompanyReportResponse> {
  const { startDate, endDate, currency } = filters;
  
  const params = new URLSearchParams({
    startDate,
    endDate,
    currency,
  });

  const url = `${BASE_PATH}/companies?${params.toString()}`;
  return cecagemApi.get<CompanyReportResponse>(url);
}

/**
 * Servicio para obtener el reporte de empresas
 */
export class CompanyReportsService {
  static getCompanyReport = getCompanyReport;
}