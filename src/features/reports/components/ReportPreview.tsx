import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {  
  ContractReportResponse,
  CompanyReportResponse,
  TransactionReportResponse,
  ContractStatus,
  TransactionStatus,
  TransactionType
} from "../types";
import { Building2, FileText, TrendingUp, Users, DollarSign, ArrowUpDown } from "lucide-react";

interface ReportPreviewProps {
  contractData?: ContractReportResponse | null;
  companyData?: CompanyReportResponse | null;
  transactionData?: TransactionReportResponse | null;
  reportType: 'contracts' | 'companies' | 'transactions';
  loading: boolean;
  currency: 'PEN' | 'USD';
}

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    case 'EXPIRED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTransactionStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTransactionTypeColor = (type: TransactionType) => {
  switch (type) {
    case 'INCOME':
      return 'bg-green-100 text-green-800';
    case 'EXPENSE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ReportPreview({ contractData, companyData, transactionData, reportType, loading, currency }: ReportPreviewProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Cargando reporte...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contractData && !companyData && !transactionData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Selecciona los filtros y genera un reporte para ver la vista previa
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reportType === 'contracts' && contractData) {
    return (
      <div className="space-y-6">
        {/* Resumen de Contratos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumen de Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{contractData.summary.totalContracts}</p>
                <p className="text-sm text-blue-800">Total Proyectos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    currency === 'USD' ? contractData.summary.totalPaidUSD : contractData.summary.totalPaidPEN, 
                    currency
                  )}
                </p>
                <p className="text-sm text-green-800">Pagado ({currency})</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(
                    currency === 'USD' ? contractData.summary.totalPendingUSD : contractData.summary.totalPendingPEN, 
                    currency
                  )}
                </p>
                <p className="text-sm text-yellow-800">Pendiente ({currency})</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{contractData.summary.activeContracts}</p>
                <p className="text-sm text-purple-800">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Contratos */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Universidad</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Costo Total</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Pendiente</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractData.contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.name}</TableCell>
                    <TableCell>{contract.university}</TableCell>
                    <TableCell>{contract.service.name}</TableCell>
                    <TableCell>{formatCurrency(contract.costTotal, contract.currency)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(contract.totalPaid, contract.currency)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(contract.totalPending, contract.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reportType === 'companies' && companyData) {
    return (
      <div className="space-y-6">
        {/* Resumen de Empresas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Resumen de Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{companyData.summary.totalActiveCompanies}</p>
                <p className="text-sm text-blue-800">Empresas Activas</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{companyData.summary.totalCollaborators}</p>
                <p className="text-sm text-purple-800">Colaboradores</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(companyData.summary.totalRevenuePEN, 'PEN')}
                </p>
                <p className="text-sm text-green-800">Ingresos (PEN)</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(companyData.summary.averageMonthlyPaymentPEN, 'PEN')}
                </p>
                <p className="text-sm text-yellow-800">Promedio Mensual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Empresas */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUC</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Nombre Comercial</TableHead>
                  <TableHead>Empleados</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Pendiente</TableHead>
                  <TableHead>Contacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyData.companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-mono">{company.ruc}</TableCell>
                    <TableCell className="font-medium">{company.businessName}</TableCell>
                    <TableCell>{company.tradeName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {company.totalActiveEmployees}
                      </div>
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(company.totalPaidPEN, 'PEN')}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(company.totalPendingPEN, 'PEN')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{company.contact.name}</p>
                        <p className="text-muted-foreground">{company.contact.email}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reportType === 'transactions' && transactionData) {
    return (
      <div className="space-y-6">
        {/* Resumen de Transacciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumen de Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    currency === 'USD' ? transactionData.summary.totalIncomesUSD : transactionData.summary.totalIncomesPEN, 
                    currency
                  )}
                </p>
                <p className="text-sm text-green-800">Total Ingresos ({currency})</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    currency === 'USD' ? transactionData.summary.totalExpensesUSD : transactionData.summary.totalExpensesPEN, 
                    currency
                  )}
                </p>
                <p className="text-sm text-red-800">Total Egresos ({currency})</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    currency === 'USD' ? transactionData.summary.netBalanceUSD : transactionData.summary.netBalancePEN, 
                    currency
                  )}
                </p>
                <p className="text-sm text-blue-800">Balance Neto ({currency})</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {transactionData.summary.totalIncomeTransactions + transactionData.summary.totalExpenseTransactions}
                </p>
                <p className="text-sm text-purple-800">Total Transacciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorías */}
        {(transactionData.expenseByCategory.length > 0 || transactionData.incomeByCategory.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categorías de Gastos */}
                {transactionData.expenseByCategory.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">Categorías de Egresos</h4>
                    <div className="space-y-2">
                      {transactionData.expenseByCategory.map((category, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="font-medium text-black">{category.category}</span>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              {formatCurrency(
                                currency === 'USD' ? category.totalUSD : category.totalPEN, 
                                currency
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {category.percentage.toFixed(1)}% ({category.transactionCount} transacciones)
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categorías de Ingresos */}
                {transactionData.incomeByCategory.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">Categorías de Ingresos</h4>
                    <div className="space-y-2">
                      {transactionData.incomeByCategory.map((category, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="font-medium text-black">{category.category}</span>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              {formatCurrency(
                                currency === 'USD' ? category.totalUSD : category.totalPEN, 
                                currency
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {category.percentage.toFixed(1)}% ({category.transactionCount} transacciones)
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla de Transacciones */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(transaction.tipo)}>
                        <ArrowUpDown className="h-3 w-3 mr-1" />
                        {transaction.tipo === 'INCOME' ? 'Ingreso' : 'Egreso'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.categoria}</TableCell>
                    <TableCell>{transaction.descripcion}</TableCell>
                    <TableCell className={transaction.tipo === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transaction.monto, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.fecha).toLocaleDateString('es-PE')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTransactionStatusColor(transaction.estado)}>
                        {transaction.estado === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.user ? (
                        <div className="text-sm">
                          <p className="font-medium">{transaction.user.fullName}</p>
                          <p className="text-muted-foreground">{transaction.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No asignado</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}