"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { IDeliverable } from "@/features/deliverables";
import {
  getStatusVariant,
  getStatusText,
  formatDate,
  truncateText,
} from "../utils/deliverable.utils";

interface DeliverableColumnsProps {
  onView: (deliverable: IDeliverable) => void;
  onEdit: (deliverable: IDeliverable) => void;
  onDelete: (deliverable: IDeliverable) => void;
}

export const deliverableColumns = ({
  onView,
  onEdit,
  onDelete,
}: DeliverableColumnsProps): ColumnDef<IDeliverable>[] => [
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
      const deliverable = row.original;
      return (
        <div className="max-w-[300px]">
          <div className="font-medium">{deliverable.name}</div>
          <div className="text-sm text-muted-foreground">
            {truncateText(deliverable.description, 60)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: "Servicio",
    cell: ({ row }) => {
      const service = row.original.service;
      return (
        <div className="max-w-[250px] min-w-[200px]">
          {service ? (
            <div>
              <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap" title={service.name}>
                {service.name}
              </div>
              <div className="text-sm text-muted-foreground">
                ${service.basePrice?.toFixed(2)}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Sin servicio</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={getStatusVariant(isActive)}>
          {getStatusText(isActive)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          Fecha de Creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const deliverable = row.original;

      return (
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8"
            onClick={() => onView(deliverable)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8"
            onClick={() => onEdit(deliverable)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(deliverable)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
