"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
} from "lucide-react";

import { Proyecto, EstadoProyecto, TipoProyecto, tipoProyectoLabels, estadoProyectoLabels } from "../types";
import { cn } from "@/lib/utils";

interface ProyectoTableProps {
  proyectos: Proyecto[];
  isLoading?: boolean;
  onEdit: (proyecto: Proyecto) => void;
  onDelete: (proyecto: Proyecto) => void;
}

export function ProyectoTable({ proyectos, isLoading = false, onEdit, onDelete }: ProyectoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(fecha));
  };

  const formatMonto = (monto: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : 'S/';
    return `${symbol} ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const columns: ColumnDef<Proyecto>[] = [
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
  ];

  const table = useReactTable({
    data: proyectos,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Lista de Proyectos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Lista de Proyectos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border-b">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 border-b"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-b">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron proyectos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            de {table.getFilteredRowModel().rows.length} proyectos
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
