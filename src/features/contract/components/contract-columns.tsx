"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { IContract } from "../types/contract.type";

interface ContractColumnsProps {
  onView: (contract: IContract) => void;
  onEdit: (contract: IContract) => void;
  onDelete: (contractId: string) => void;
}

export const contractColumns = ({
  onView,
  onEdit,
  onDelete,
}: ContractColumnsProps): ColumnDef<IContract>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{contract.name}</div>
          <div className="text-sm text-muted-foreground">
            {contract.university}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "career",
    header: "Carrera",
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="max-w-[150px]">
          <div className="text-sm">{contract.career || "Sin carrera"}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "costTotal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          Costo Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="text-right font-medium">
          {contract.currency} {contract.costTotal?.toFixed(2) || "0.00"}
        </div>
      );
    },
  },
  {
    accessorKey: "overallProgress",
    header: "Progreso",
    cell: ({ row }) => {
      const contract = row.original;
      const progress = contract.overallProgress || 0;
      
      const getProgressVariant = (progress: number) => {
        if (progress === 100) return "default";
        if (progress >= 75) return "secondary";
        if (progress >= 50) return "outline";
        return "destructive";
      };

      return (
        <Badge variant={getProgressVariant(progress)}>
          {progress.toFixed(0)}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Fecha Inicio",
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="text-sm">
          {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contract = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(contract)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(contract)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contract.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];