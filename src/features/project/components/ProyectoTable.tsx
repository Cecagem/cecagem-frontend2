"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { Proyecto, EstadoProyecto, TipoProyecto, tipoProyectoLabels, estadoProyectoLabels } from "../types";
import { cn } from "@/lib/utils";

interface ProyectoTableProps {
  proyectos: Proyecto[];
  isLoading?: boolean;
  onEdit: (proyecto: Proyecto) => void;
  onDelete: (proyecto: Proyecto) => void;
}

export function ProyectoTable({ proyectos, isLoading = false, onEdit, onDelete }: ProyectoTableProps) {
  const getEstadoBadgeVariant = (estado: EstadoProyecto) => {
    switch (estado) {
      case EstadoProyecto.COMPLETADO:
        return "default";
      case EstadoProyecto.EN_PROGRESO:
        return "secondary";
      case EstadoProyecto.EN_REVISION:
        return "outline";
      case EstadoProyecto.PAUSADO:
        return "secondary";
      case EstadoProyecto.CANCELADO:
        return "destructive";
      case EstadoProyecto.PLANIFICACION:
        return "outline";
      default:
        return "outline";
    }
  };

  const formatFecha = (fecha: Date) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatMonto = (monto: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : 'S/';
    return `${symbol} ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const columns: ColumnDef<Proyecto>[] = useMemo(() => [
    {
      accessorKey: "titulo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Proyecto
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const proyecto = row.original;
        return (
          <div className="max-w-[250px]">
            <div className="font-medium text-sm truncate">
              {proyecto.titulo}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {proyecto.descripcion}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tipoProyecto",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipoProyecto") as TipoProyecto;
        return (
          <Badge variant="outline" className="text-xs">
            {tipoProyectoLabels[tipo]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado") as EstadoProyecto;
        const isCompleted = estado === EstadoProyecto.COMPLETADO;
        const isActive = estado === EstadoProyecto.EN_PROGRESO;
        const isCancelled = estado === EstadoProyecto.CANCELADO;
        
        return (
          <Badge
            variant={getEstadoBadgeVariant(estado)}
            className={cn(
              "text-xs",
              isCompleted
                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                : isActive
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                : isCancelled
                ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                : ""
            )}
          >
            {estadoProyectoLabels[estado]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "datoPago.montoTotal",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Monto
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const proyecto = row.original;
        return (
          <div className="font-mono text-sm">
            {formatMonto(proyecto.datoPago.montoTotal, proyecto.datoPago.moneda)}
          </div>
        );
      },
    },
    {
      accessorKey: "fechaFin",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Fecha Fin
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const fechaFin = new Date(row.getValue("fechaFin"));
        const hoy = new Date();
        const isVencido = fechaFin < hoy && row.original.estado !== EstadoProyecto.COMPLETADO;
        
        return (
          <div className={cn("text-sm", isVencido && "text-red-600 font-medium")}>
            {formatFecha(fechaFin)}
          </div>
        );
      },
    },
    {
      id: "actions", 
      header: "Acciones",
      cell: ({ row }) => {
        const proyecto = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(proyecto)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(proyecto)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [onEdit, onDelete]);

  return (
    <DataTable
      data={proyectos}
      columns={columns}
      isLoading={isLoading}
      title="Lista de Proyectos"
      icon={FolderOpen}
      noDataMessage="No se encontraron proyectos."
      enablePagination={true}
      enableSorting={true}
      pageSize={10}
    />
  );
}
