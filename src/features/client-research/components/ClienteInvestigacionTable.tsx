"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  GraduationCap,
} from "lucide-react";
import { DataTable } from "@/components/shared";
import { ClienteInvestigacion, ClienteInvestigacionEstado, GradoAcademico } from "../types/index";

interface ClienteInvestigacionTableProps {
  clientes: ClienteInvestigacion[];
  isLoading: boolean;
  onEdit: (cliente: ClienteInvestigacion) => void;
  onDelete: (cliente: ClienteInvestigacion) => void;
}

export default function ClienteInvestigacionTable({ 
  clientes, 
  isLoading, 
  onEdit, 
  onDelete 
}: ClienteInvestigacionTableProps) {
  
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

  return (
    <DataTable
      data={clientes}
      columns={columns}
      isLoading={isLoading}
      title="Lista de Clientes de Investigación"
      icon={GraduationCap}
      noDataMessage="No se encontraron clientes de investigación."
      enablePagination={true}
      enableSorting={true}
      pageSize={10}
    />
  );
}
