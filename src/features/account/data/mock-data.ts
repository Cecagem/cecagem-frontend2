import type { Transaction, TransactionStats, TransactionsResponse } from "../types/account.types";
import { TransactionType, TransactionCategory, TransactionStatus } from "../types/account.types";

// Datos de prueba para transacciones
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "user1",
    type: TransactionType.INCOME,
    category: TransactionCategory.SALARY,
    amount: 3500.00,
    description: "Salario mensual - Desarrollador Frontend",
    date: "2024-09-01",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-09-01T08:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.FOOD,
    amount: 85.50,
    description: "Almuerzo en restaurante con cliente",
    date: "2024-09-02",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-02T13:30:00Z",
    updatedAt: "2024-09-02T13:30:00Z",
  },
  {
    id: "3",
    userId: "user1",
    type: TransactionType.INCOME,
    category: TransactionCategory.FREELANCE,
    amount: 1200.00,
    description: "Proyecto freelance - Desarrollo de landing page",
    date: "2024-09-03",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-03T18:00:00Z",
    updatedAt: "2024-09-03T18:00:00Z",
  },
  {
    id: "4",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.TRANSPORT,
    amount: 25.00,
    description: "Taxi al aeropuerto",
    date: "2024-09-04",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-04T06:15:00Z",
    updatedAt: "2024-09-04T06:15:00Z",
  },
  {
    id: "5",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITIES,
    amount: 120.75,
    description: "Factura de electricidad",
    date: "2024-09-05",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-05T10:20:00Z",
    updatedAt: "2024-09-05T10:20:00Z",
  },
  {
    id: "6",
    userId: "user1",
    type: TransactionType.INCOME,
    category: TransactionCategory.INVESTMENT,
    amount: 450.00,
    description: "Dividendos de acciones",
    date: "2024-09-06",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-06T09:00:00Z",
    updatedAt: "2024-09-06T09:00:00Z",
  },
  {
    id: "7",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.ENTERTAINMENT,
    amount: 45.00,
    description: "Entradas al cine",
    date: "2024-09-07",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-07T20:00:00Z",
    updatedAt: "2024-09-07T20:00:00Z",
  },
  {
    id: "8",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.HEALTHCARE,
    amount: 75.00,
    description: "Consulta médica",
    date: "2024-09-08",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-08T15:30:00Z",
    updatedAt: "2024-09-08T15:30:00Z",
  },
  {
    id: "9",
    userId: "user1",
    type: TransactionType.INCOME,
    category: TransactionCategory.BUSINESS,
    amount: 800.00,
    description: "Venta de curso online",
    date: "2024-09-09",
    status: TransactionStatus.PENDING,
    createdAt: "2024-09-09T14:00:00Z",
    updatedAt: "2024-09-09T14:00:00Z",
  },
  {
    id: "10",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.SHOPPING,
    amount: 150.00,
    description: "Compras de ropa",
    date: "2024-09-10",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-10T16:45:00Z",
    updatedAt: "2024-09-10T16:45:00Z",
  },
  {
    id: "11",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.RENT,
    amount: 800.00,
    description: "Alquiler mensual del apartamento",
    date: "2024-09-11",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-11T08:00:00Z",
    updatedAt: "2024-09-11T08:00:00Z",
  },
  {
    id: "12",
    userId: "user1",
    type: TransactionType.INCOME,
    category: TransactionCategory.OTHER_INCOME,
    amount: 200.00,
    description: "Reembolso de seguro",
    date: "2024-09-12",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-12T11:30:00Z",
    updatedAt: "2024-09-12T11:30:00Z",
  },
  {
    id: "13",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.EDUCATION,
    amount: 299.00,
    description: "Curso de programación online",
    date: "2024-09-13",
    status: TransactionStatus.PENDING,
    createdAt: "2024-09-13T19:20:00Z",
    updatedAt: "2024-09-13T19:20:00Z",
  },
  {
    id: "14",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.FOOD,
    amount: 35.50,
    description: "Cena en restaurante",
    date: "2024-09-14",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-14T21:00:00Z",
    updatedAt: "2024-09-14T21:00:00Z",
  },
  {
    id: "15",
    userId: "user1",
    type: TransactionType.EXPENSE,
    category: TransactionCategory.OTHER_EXPENSE,
    amount: 50.00,
    description: "Donación benéfica",
    date: "2024-09-15",
    status: TransactionStatus.COMPLETED,
    createdAt: "2024-09-15T10:00:00Z",
    updatedAt: "2024-09-15T10:00:00Z",
  },
];

// Calcular estadísticas basadas en los datos mock
const calculateStats = (): TransactionStats => {
  const completedTransactions = mockTransactions.filter(t => t.status === TransactionStatus.COMPLETED);
  
  const totalIncome = completedTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = completedTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Calcular datos del mes actual (septiembre 2024)
  const currentMonth = "2024-09";
  const monthlyTransactions = completedTransactions.filter(t => t.date.startsWith(currentMonth));
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    transactionCount: mockTransactions.length,
  };
};

export const mockStats: TransactionStats = calculateStats();

export const mockTransactionsResponse: TransactionsResponse = {
  transactions: mockTransactions,
  pagination: {
    page: 1,
    limit: 10,
    total: mockTransactions.length,
    pages: Math.ceil(mockTransactions.length / 10),
  },
  stats: mockStats,
};

// Simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));