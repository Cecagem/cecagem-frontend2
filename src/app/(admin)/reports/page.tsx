"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/shared";
import { 
  ReportFiltersComponent, 
  ReportPreview, 
  generateReportPDF,
  useContractReports,
  useCompanyReports,
  useTransactionReports,
  type ReportFilters 
} from "@/features/reports";

export default function ReportsPage() {
  const [currentFilters, setCurrentFilters] = useState<ReportFilters>({
    reportType: 'contracts',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    currency: 'PEN'
  });

  const contractReports = useContractReports();
  const companyReports = useCompanyReports();
  const transactionReports = useTransactionReports();

  const handleFiltersChange = (filters: ReportFilters) => {
    setCurrentFilters(filters);
  };

  const handleGenerateReport = async () => {
    try {
      if (currentFilters.reportType === 'contracts') {
        await contractReports.fetchReport({
          startDate: currentFilters.startDate,
          endDate: currentFilters.endDate,
          currency: currentFilters.currency
        });
      } else if (currentFilters.reportType === 'companies') {
        await companyReports.fetchReport({
          startDate: currentFilters.startDate,
          endDate: currentFilters.endDate,
          currency: currentFilters.currency
        });
      } else if (currentFilters.reportType === 'transactions') {
        await transactionReports.fetchReport({
          startDate: currentFilters.startDate,
          endDate: currentFilters.endDate,
          currency: currentFilters.currency,
          transactionType: currentFilters.transactionType || 'EXPENSE'
        });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      // Si no hay datos, generar el reporte primero
      const hasData = contractReports.data || companyReports.data || transactionReports.data;
      if (!hasData) {
        await handleGenerateReport();
        return;
      }

      await generateReportPDF({
        reportType: currentFilters.reportType,
        contractData: contractReports.data,
        companyData: companyReports.data,
        transactionData: transactionReports.data,
        dateRange: {
          startDate: currentFilters.startDate,
          endDate: currentFilters.endDate
        },
        currency: currentFilters.currency,
        transactionType: currentFilters.transactionType
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  const handleClearData = () => {
    contractReports.reset();
    companyReports.reset();
    transactionReports.reset();
  };

  const isLoading = contractReports.loading || companyReports.loading || transactionReports.loading;
  const hasData = Boolean(contractReports.data || companyReports.data || transactionReports.data);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Reportes" />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
            <p className="text-muted-foreground">
              Genera y visualiza reportes detallados del sistema
            </p>
          </div>
        </div>

        {/* Filtros de Reportes */}
        <ReportFiltersComponent
          filters={currentFilters}
          onFiltersChange={handleFiltersChange}
          onGenerateReport={handleGenerateReport}
          onGeneratePDF={handleGeneratePDF}
          onClearData={handleClearData}
          hasData={hasData}
          loading={isLoading}
        />

        {/* Vista Previa del Reporte */}
        <ReportPreview
          contractData={contractReports.data}
          companyData={companyReports.data}
          transactionData={transactionReports.data}
          reportType={currentFilters.reportType}
          loading={isLoading}
          currency={currentFilters.currency}
        />
      </div>
    </div>
  );
}
