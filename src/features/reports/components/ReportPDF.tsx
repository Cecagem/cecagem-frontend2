import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { ContractReportResponse, CompanyReportResponse, TransactionReportResponse } from '../types';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2 solid #1e40af',
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  headerText: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  dateRange: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  summaryCard: {
    width: '23%',
    margin: '1%',
    padding: 10,
    backgroundColor: '#f8fafc',
    border: '1 solid #e2e8f0',
    borderRadius: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    padding: 2,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e40af',
    padding: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 8,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },
});

interface ReportPDFProps {
  reportType: 'contracts' | 'companies' | 'transactions';
  contractData?: ContractReportResponse | null;
  companyData?: CompanyReportResponse | null;
  transactionData?: TransactionReportResponse | null;
  dateRange: { startDate: string; endDate: string };
  currency: string;
  transactionType?: 'EXPENSE' | 'INCOME';
}

// Componente del PDF para Contratos
const ContractReportPDF = ({ contractData, dateRange, currency }: { 
  contractData: ContractReportResponse, 
  dateRange: { startDate: string; endDate: string },
  currency: string 
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          style={styles.logo}
          src="/image/logos/logocecagem.png"
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>REPORTE DE PROYECTOS</Text>
          <Text style={styles.subtitle}>Análisis detallado de proyectos y servicios</Text>
          <Text style={styles.dateRange}>
            Período: {dateRange.startDate} - {dateRange.endDate} | Moneda: {currency}
          </Text>
        </View>
      </View>

      {/* Resumen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RESUMEN EJECUTIVO</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{contractData.summary.totalContracts}</Text>
            <Text style={styles.summaryLabel}>Total Proyectos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {contractData.summary.totalValuePEN.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Valor Total</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {contractData.summary.totalPaidPEN.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Total Pagado</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {contractData.summary.totalPendingPEN.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Total Pendiente</Text>
          </View>
        </View>
      </View>

      {/* Tabla de Proyectos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETALLE DE PROYECTOS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Proyecto</Text>
            <Text style={styles.tableCellHeader}>Universidad</Text>
            <Text style={styles.tableCellHeader}>Servicio</Text>
            <Text style={styles.tableCellHeader}>Total</Text>
            <Text style={styles.tableCellHeader}>Estado</Text>
          </View>
          {contractData.contracts.slice(0, 15).map((contract, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{contract.name}</Text>
              <Text style={styles.tableCell}>{contract.university}</Text>
              <Text style={styles.tableCell}>{contract.service.name}</Text>
              <Text style={styles.tableCell}>
                {currency} {contract.costTotal.toLocaleString()}
              </Text>
              <Text style={styles.tableCell}>{contract.status}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        CECAGEM - Reporte generado el {new Date().toLocaleDateString('es-PE')} | Página 1
      </Text>
    </Page>
  </Document>
);

// Componente del PDF para Empresas
const CompanyReportPDF = ({ companyData, dateRange, currency }: { 
  companyData: CompanyReportResponse, 
  dateRange: { startDate: string; endDate: string },
  currency: string 
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          style={styles.logo}
          src="/image/logos/logocecagem.png"
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>REPORTE DE EMPRESAS</Text>
          <Text style={styles.subtitle}>Análisis de empresas y pagos</Text>
          <Text style={styles.dateRange}>
            Período: {dateRange.startDate} - {dateRange.endDate} | Moneda: {currency}
          </Text>
        </View>
      </View>

      {/* Resumen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RESUMEN EJECUTIVO</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{companyData.summary.totalActiveCompanies}</Text>
            <Text style={styles.summaryLabel}>Empresas Activas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{companyData.summary.totalCollaborators}</Text>
            <Text style={styles.summaryLabel}>Colaboradores</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {companyData.summary.totalRevenuePEN.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Ingresos Totales</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {companyData.summary.averageMonthlyPaymentPEN.toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Promedio Mensual</Text>
          </View>
        </View>
      </View>

      {/* Tabla de Empresas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETALLE DE EMPRESAS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>RUC</Text>
            <Text style={styles.tableCellHeader}>Empresa</Text>
            <Text style={styles.tableCellHeader}>Empleados</Text>
            <Text style={styles.tableCellHeader}>Pagado</Text>
            <Text style={styles.tableCellHeader}>Pendiente</Text>
          </View>
          {companyData.companies.slice(0, 15).map((company, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{company.ruc}</Text>
              <Text style={styles.tableCell}>{company.businessName}</Text>
              <Text style={styles.tableCell}>{company.totalActiveEmployees}</Text>
              <Text style={styles.tableCell}>
                {currency} {company.totalPaidPEN.toLocaleString()}
              </Text>
              <Text style={styles.tableCell}>
                {currency} {company.totalPendingPEN.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        CECAGEM - Reporte generado el {new Date().toLocaleDateString('es-PE')} | Página 1
      </Text>
    </Page>
  </Document>
);

// Componente del PDF para Transacciones
const TransactionReportPDF = ({ transactionData, dateRange, currency, transactionType }: { 
  transactionData: TransactionReportResponse, 
  dateRange: { startDate: string; endDate: string },
  currency: string,
  transactionType?: 'EXPENSE' | 'INCOME'
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          style={styles.logo}
          src="/image/logos/logocecagem.png"
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>REPORTE DE TRANSACCIONES</Text>
          <Text style={styles.subtitle}>
            Análisis de {transactionType === 'EXPENSE' ? 'gastos' : transactionType === 'INCOME' ? 'ingresos' : 'transacciones'}
          </Text>
          <Text style={styles.dateRange}>
            Período: {dateRange.startDate} - {dateRange.endDate} | Moneda: {currency}
          </Text>
        </View>
      </View>

      {/* Resumen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RESUMEN EJECUTIVO</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {transactionData.summary.totalIncomeTransactions + transactionData.summary.totalExpenseTransactions}
            </Text>
            <Text style={styles.summaryLabel}>Total Transacciones</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {(transactionType === 'INCOME' 
                ? transactionData.summary.totalIncomesPEN 
                : transactionType === 'EXPENSE' 
                ? transactionData.summary.totalExpensesPEN
                : transactionData.summary.netBalancePEN
              ).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>
              {transactionType === 'INCOME' ? 'Total Ingresos' : transactionType === 'EXPENSE' ? 'Total Gastos' : 'Balance Neto'}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {currency} {(transactionType === 'INCOME' 
                ? transactionData.summary.avgIncomePerTransactionPEN 
                : transactionData.summary.avgExpensePerTransactionPEN
              ).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Promedio por Transacción</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{transactionData.summary.completedTransactions}</Text>
            <Text style={styles.summaryLabel}>Completadas</Text>
          </View>
        </View>
      </View>

      {/* Tabla de Transacciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETALLE DE TRANSACCIONES</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Fecha</Text>
            <Text style={styles.tableCellHeader}>Descripción</Text>
            <Text style={styles.tableCellHeader}>Categoría</Text>
            <Text style={styles.tableCellHeader}>Monto</Text>
            <Text style={styles.tableCellHeader}>Tipo</Text>
          </View>
          {transactionData.transactions.slice(0, 15).map((transaction, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{transaction.fecha}</Text>
              <Text style={styles.tableCell}>{transaction.descripcion}</Text>
              <Text style={styles.tableCell}>{transaction.categoria}</Text>
              <Text style={styles.tableCell}>
                {currency} {transaction.monto.toLocaleString()}
              </Text>
              <Text style={styles.tableCell}>{transaction.tipo}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        CECAGEM - Reporte generado el {new Date().toLocaleDateString('es-PE')} | Página 1
      </Text>
    </Page>
  </Document>
);

// Función principal para generar y descargar el PDF
export const generateReportPDF = async ({
  reportType,
  contractData,
  companyData,
  transactionData,
  dateRange,
  currency,
  transactionType
}: ReportPDFProps) => {
  let fileName = '';
  let pdfDocument;

  if (reportType === 'contracts') {
    fileName = `Contratos_${dateRange.startDate}_${dateRange.endDate}.pdf`;
    if (!contractData) throw new Error('No hay datos de contratos disponibles para generar el PDF');
    pdfDocument = <ContractReportPDF contractData={contractData} dateRange={dateRange} currency={currency} />;
  } else if (reportType === 'companies') {
    fileName = `Empresas_${dateRange.startDate}_${dateRange.endDate}.pdf`;
    if (!companyData) throw new Error('No hay datos de empresas disponibles para generar el PDF');  
    pdfDocument = <CompanyReportPDF companyData={companyData} dateRange={dateRange} currency={currency} />;
  } else if (reportType === 'transactions') {
    const typeLabel = transactionType === 'EXPENSE' ? 'Gastos' : transactionType === 'INCOME' ? 'Ingresos' : 'Transacciones';
    fileName = `${typeLabel}_${dateRange.startDate}_${dateRange.endDate}.pdf`;
    if (!transactionData) throw new Error('No hay datos de transacciones disponibles para generar el PDF');
    pdfDocument = <TransactionReportPDF transactionData={transactionData} dateRange={dateRange} currency={currency} transactionType={transactionType} />;
  } else {
    throw new Error('Tipo de reporte no válido');
  }

  const blob = await pdf(pdfDocument).toBlob();
  
  // Crear enlace de descarga
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};