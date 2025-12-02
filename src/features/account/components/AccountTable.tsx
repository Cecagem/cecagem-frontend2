"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { Edit, Trash, Eye, RefreshCw } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ITransaction, TransactionType, TransactionStatus, ITransactionMeta } from "../types/account.types";
import { TransactionType as TType, TransactionStatus as TStatus } from "../types/account.types";

interface AccountTableProps {
  transactions: ITransaction[];
  isLoading: boolean;
  onEdit: (transaction: ITransaction) => void;
  onDelete: (id: string) => void;
  onView: (transaction: ITransaction) => void;
  onChangeStatus: (id: string) => void;
  // Nuevas props para paginación del servidor
  paginationMeta?: ITransactionMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const getCategoryLabel = (category: string): string => {
  // Como ahora las categorías son strings, simplemente retornamos el valor
  return category;
};

const getStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "Pendiente",
    [TStatus.COMPLETED]: "Completado",
    [TStatus.CANCELED]: "Cancelado",
  };
  return labels[status];
};

const getStatusVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" => {
  const variants: Record<TransactionStatus, "default" | "secondary" | "destructive"> = {
    [TStatus.PENDING]: "secondary",
    [TStatus.COMPLETED]: "default",
    [TStatus.CANCELED]: "destructive",
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
  onChangeStatus,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
}: AccountTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  };

  const columns = useMemo<ColumnDef<ITransaction>[]>(() => [
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => formatDate(row.original.fecha),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant={getTypeVariant(row.original.tipo)}>
          {getTypeLabel(row.original.tipo)}
        </Badge>
      ),
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      cell: ({ row }) => getCategoryLabel(row.original.categoria),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.descripcion}>
          {row.original.descripcion}
        </div>
      ),
    },
    {
      accessorKey: "currency",
      header: "Moneda",
      cell: ({ row }) => row.original.currency,
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => (
        <span className={row.original.tipo === TType.INCOME ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
          {formatCurrency(parseFloat(row.original.monto), row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.estado)}>
          {getStatusLabel(row.original.estado)}
        </Badge>
      ),
    },
    {
      accessorKey: "isRecurrent",
      header: "Recurrente",
      cell: ({ row }) => (
        <Badge variant={row.original.isRecurrent ? "default" : "outline"}>
          {row.original.isRecurrent ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(row.original)}
            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
            className="h-8 px-2"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangeStatus(row.original.id)}
            className="h-8 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            title="Cambiar Estado"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original.id)}
            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Eliminar"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [onEdit, onDelete, onView, onChangeStatus]);

  return (
    <DataTable
      data={transactions}
      columns={columns}
      isLoading={isLoading}
      title="Transacciones"
      noDataMessage="No se encontraron transacciones"
      enablePagination={true}
      enableSorting={true}
      pageSize={paginationMeta?.limit || 10}
      serverPagination={true}
      paginationMeta={paginationMeta}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};