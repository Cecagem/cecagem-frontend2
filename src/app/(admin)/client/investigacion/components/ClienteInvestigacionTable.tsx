"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { ClienteInvestigacion, ClienteInvestigacionEstado, GradoAcademico } from "../types";

interface ClienteInvestigacionTableProps {
  clientes: ClienteInvestigacion[];
  isLoading: boolean;
  onEdit: (cliente: ClienteInvestigacion) => void;
  onDelete: (cliente: ClienteInvestigacion) => void;
}

export default function ClienteInvestigacionTable({ clientes, isLoading, onEdit, onDelete }: ClienteInvestigacionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<ClienteInvestigacion>[] = [
    {
      accessorKey: "nombres",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Nombres
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const cliente = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{cliente.nombres} {cliente.apellidos}</span>
            <span className="text-xs text-muted-foreground">{cliente.correo}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("telefono")}</span>
      ),
    },
    {
      accessorKey: "universidad",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Universidad
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const cliente = row.original;
        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-medium text-sm truncate" title={cliente.universidad}>
              {cliente.universidad}
            </span>
            <span className="text-xs text-muted-foreground truncate" title={cliente.facultad}>
              {cliente.facultad}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "carrera",
      header: "Carrera",
      cell: ({ row }) => (
        <span className="text-sm max-w-[180px] truncate block" title={row.getValue("carrera")}>
          {row.getValue("carrera")}
        </span>
      ),
    },
    {
      accessorKey: "grado",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Grado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const grado = row.getValue("grado") as GradoAcademico;
        const gradoLabels = {
          [GradoAcademico.BACHILLER]: "Bachiller",
          [GradoAcademico.EGRESADO]: "Egresado",
          [GradoAcademico.MAESTRIA]: "Maestría",
        };
        const gradoVariants = {
          [GradoAcademico.BACHILLER]: "secondary" as const,
          [GradoAcademico.EGRESADO]: "default" as const,
          [GradoAcademico.MAESTRIA]: "destructive" as const,
        };

        return (
          <Badge variant={gradoVariants[grado]} className="text-xs">
            {gradoLabels[grado]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const estado = row.getValue("estado") as ClienteInvestigacionEstado;
        return (
          <Badge
            variant={estado === ClienteInvestigacionEstado.ACTIVO ? "default" : "secondary"}
            className="text-xs"
          >
            {estado === ClienteInvestigacionEstado.ACTIVO ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "fechaCreacion",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Creado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("fechaCreacion") as Date;
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString("es-PE")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const cliente = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(cliente)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(cliente)}
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
    data: clientes,
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
            <GraduationCap className="h-5 w-5" />
            Lista de Clientes de Investigación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
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
          <GraduationCap className="h-5 w-5" />
          Lista de Clientes de Investigación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-10 px-6">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron clientes de investigación.
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
            de {table.getFilteredRowModel().rows.length} clientes
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
