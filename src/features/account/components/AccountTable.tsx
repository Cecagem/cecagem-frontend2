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
import { MoreHorizontal, Edit, Trash, Eye, RefreshCw } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ITransaction, TransactionType, TransactionStatus } from "../types/account.types";
import { TransactionType as TType, TransactionStatus as TStatus } from "../types/account.types";

interface AccountTableProps {
  transactions: ITransaction[];
  isLoading: boolean;
  onEdit: (transaction: ITransaction) => void;
  onDelete: (id: string) => void;
  onView: (transaction: ITransaction) => void;
  onChangeStatus: (id: string) => void;
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
}: AccountTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Usar UTC para evitar problemas de zona horaria
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
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => (
        <span className={row.original.tipo === TType.INCOME ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
          {formatCurrency(parseFloat(row.original.monto))}
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
              onClick={() => onChangeStatus(row.original.id)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Cambiar Estado
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
      pageSize={10}
    />
  );
};