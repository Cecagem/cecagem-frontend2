"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react"; // Agregar Edit
import { formatCurrency } from "../utils";
import type { IContract } from "../types";

interface ContractColumnsProps {
  onDelete?: (contractId: string) => void;
  onEdit?: (contractId: string) => void; // Agregar onEdit
}

export const getContractColumns = ({ 
  onDelete,
  onEdit // Agregar parámetro
}: ContractColumnsProps = {}): ColumnDef<IContract>[] => [
  {
    accessorKey: "name",
    header: "Nombre del Proyecto",
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{contract.name}</div>
          <div className="text-xs text-muted-foreground">
            {contract.university}
          </div>
          {contract.career && (
            <div className="text-xs text-muted-foreground">
              {contract.career}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "costTotal",
    header: "Costo Total",
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div>
          <div className="font-medium">
            {formatCurrency(contract.costTotal, contract.currency)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "overallProgress",
    header: "Progreso General",
    cell: ({ row }) => {
      const progress = row.getValue("overallProgress") as number;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{progress}%</div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "deliverablesPercentage",
    header: "Entregables",
    cell: ({ row }) => {
      const percentage = row.getValue("deliverablesPercentage") as number;
      return (
        <Badge variant={percentage === 100 ? "default" : "secondary"}>
          {percentage}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentPercentage",
    header: "Pagos",
    cell: ({ row }) => {
      const percentage = row.getValue("paymentPercentage") as number;
      return (
        <Badge variant={percentage === 100 ? "default" : "destructive"}>
          {percentage}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Fecha Inicio",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "Fecha Fin",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC"
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const contract = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* Botón de Editar agregado */}
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(contract.id)}
              className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {/* Botón de Eliminar (existente) */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete?.(contract.id)}
            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];