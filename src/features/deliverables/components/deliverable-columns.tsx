"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
        <div className="max-w-[200px]">
          {service ? (
            <div>
              <div className="font-medium">{service.name}</div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(deliverable)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(deliverable)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(deliverable)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
