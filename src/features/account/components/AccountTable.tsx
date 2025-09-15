"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction, TransactionType, TransactionCategory, TransactionStatus } from "../types/account.types";
import { TransactionType as TType, TransactionCategory as TCategory, TransactionStatus as TStatus } from "../types/account.types";

interface AccountTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onView: (transaction: Transaction) => void;
}

const getCategoryLabel = (category: TransactionCategory): string => {
  const labels: Record<TransactionCategory, string> = {
    // Ingresos
    [TCategory.SALARY]: "Salario",
    [TCategory.FREELANCE]: "Freelance",
    [TCategory.INVESTMENT]: "Inversión",
    [TCategory.BUSINESS]: "Negocio",
    [TCategory.OTHER_INCOME]: "Otros Ingresos",
    
    // Egresos
    [TCategory.FOOD]: "Comida",
    [TCategory.TRANSPORT]: "Transporte",
    [TCategory.UTILITIES]: "Servicios",
    [TCategory.ENTERTAINMENT]: "Entretenimiento",
    [TCategory.HEALTHCARE]: "Salud",
    [TCategory.EDUCATION]: "Educación",
    [TCategory.SHOPPING]: "Compras",
    [TCategory.RENT]: "Alquiler",
    [TCategory.OTHER_EXPENSE]: "Otros Gastos",
  };
  return labels[category];
};

const getStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "Pendiente",
    [TStatus.COMPLETED]: "Completado",
    [TStatus.CANCELLED]: "Cancelado",
  };
  return labels[status];
};

const getStatusVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" => {
  const variants: Record<TransactionStatus, "default" | "secondary" | "destructive"> = {
    [TStatus.PENDING]: "secondary",
    [TStatus.COMPLETED]: "default",
    [TStatus.CANCELLED]: "destructive",
  };
  return variants[status];
};

const getTypeLabel = (type: TransactionType): string => {
  return type === TType.INCOME ? "Ingreso" : "Gasto";
};

const getTypeVariant = (type: TransactionType): "default" | "secondary" => {
  return type === TType.INCOME ? "default" : "secondary";
};

export const AccountTable = ({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: AccountTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE");
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(() => [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant={getTypeVariant(row.original.type)}>
          {getTypeLabel(row.original.type)}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row }) => getCategoryLabel(row.original.category),
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.description}>
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => (
        <span className={row.original.type === TType.INCOME ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(row.original.id)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onEdit, onDelete, onView]);

  return (
    <DataTable
      data={transactions}
      columns={columns}
      isLoading={isLoading}
      title="Transacciones"
      noDataMessage="No se encontraron transacciones"
      enablePagination={true}
      enableSorting={true}
      pageSize={10}
    />
  );
};