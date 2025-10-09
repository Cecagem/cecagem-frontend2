import { } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/shared/DateInput";
import { FileText, Download, RefreshCw } from "lucide-react";

export type ReportType = 'contracts' | 'companies' | 'transactions';
export type Currency = 'PEN' | 'USD';
export type TransactionType = 'EXPENSE' | 'INCOME';

export interface ReportFilters {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  currency: Currency;
  transactionType?: TransactionType;
}

interface ReportFiltersComponentProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onGenerateReport: () => void;
  onGeneratePDF: () => void;
  onClearData: () => void;
  loading: boolean;
  hasData: boolean;
}

export function ReportFiltersComponent({ 
  filters,
  onFiltersChange, 
  onGenerateReport, 
  onGeneratePDF,
  onClearData,
  loading,
  hasData
}: ReportFiltersComponentProps) {
  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    let newFilters = { ...filters, [key]: value };
    
    // Si cambia el tipo de reporte y no es transactions, remover transactionType
    if (key === 'reportType' && value !== 'transactions') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { transactionType, ...filtersWithoutTransactionType } = newFilters;
      newFilters = filtersWithoutTransactionType;
    }
    
    // Si cambia a transactions y no tiene transactionType, agregar uno por defecto
    if (key === 'reportType' && value === 'transactions' && !newFilters.transactionType) {
      newFilters.transactionType = 'EXPENSE';
    }
    
    onFiltersChange(newFilters);
  };

  const handleGenerateReport = () => {
    onGenerateReport();
  };

  const isTransactionReport = filters.reportType === 'transactions';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Configuración de Reportes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Tipo de Reporte */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de Reporte</Label>
            <Select
              value={filters.reportType}
              onValueChange={(value) => handleFilterChange('reportType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contracts">Contratos</SelectItem>
                <SelectItem value="companies">Empresas</SelectItem>
                <SelectItem value="transactions">Transacciones</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Transacción - Solo visible para transacciones */}
          {isTransactionReport && (
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Tipo de Transacción</Label>
              <Select
                value={filters.transactionType || 'EXPENSE'}
                onValueChange={(value) => handleFilterChange('transactionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Egresos</SelectItem>
                  <SelectItem value="INCOME">Ingresos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Fecha de Inicio */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Fecha de Inicio</Label>
            <DateInput
              value={filters.startDate}
              onChange={(value) => handleFilterChange('startDate', value instanceof Date ? value.toISOString().split('T')[0] : value)}
              placeholder="Fecha de inicio"
            />
          </div>

          {/* Fecha de Fin */}
          <div className="space-y-2">
            <Label htmlFor="end-date">Fecha de Fin</Label>
            <DateInput
              value={filters.endDate}
              onChange={(value) => handleFilterChange('endDate', value instanceof Date ? value.toISOString().split('T')[0] : value)}
              placeholder="Fecha de fin"
            />
          </div>

          {/* Moneda */}
          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select
              value={filters.currency}
              onValueChange={(value) => handleFilterChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEN">PEN - Soles</SelectItem>
                <SelectItem value="USD">USD - Dólares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full sm:flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{loading ? 'Generando...' : 'Generar Vista Previa'}</span>
            <span className="sm:hidden">{loading ? 'Generando...' : 'Vista Previa'}</span>
          </Button>
          <Button 
            onClick={onGeneratePDF}
            variant="outline"
            disabled={loading || !hasData}
            className="w-full sm:flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Descargar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button 
            onClick={onClearData}
            variant="secondary"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}