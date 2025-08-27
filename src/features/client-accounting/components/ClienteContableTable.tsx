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
  Building2,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { ClienteContable, ClienteEstado } from "../types";

interface ClienteContableTableProps {
  clientes: ClienteContable[];
  isLoading: boolean;
  onEdit: (cliente: ClienteContable) => void;
  onDelete: (cliente: ClienteContable) => void;
}

export default function ClienteContableTable({ 
  clientes, 
  isLoading, 
  onEdit, 
  onDelete 
}: ClienteContableTableProps) {
  
  const columns: ColumnDef<ClienteContable>[] = [
    {
      accessorKey: "ruc",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          RUC
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("ruc")}</div>
      ),
    },
    {
      accessorKey: "razonSocial",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Razón Social
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium text-sm truncate">{row.getValue("razonSocial")}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.nombreComercial}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "nombreContacto",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="max-w-[150px]">
          <div className="text-sm truncate">{row.getValue("nombreContacto")}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.telefono}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "direccion",
      header: "Dirección",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {row.getValue("direccion")}
        </div>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado") as ClienteEstado;
        return (
          <Badge 
            variant={estado === ClienteEstado.ACTIVO ? "default" : "secondary"}
            className="text-xs"
          >
            {estado === ClienteEstado.ACTIVO ? "Activo" : "Inactivo"}
          </Badge>
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
                <span className="sr-only">Abrir menú</span>
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
      title="Lista de Clientes Contables"
      icon={Building2}
      noDataMessage="No se encontraron clientes."
      enablePagination={true}
      enableSorting={true}
      pageSize={10}
    />
  );
}
