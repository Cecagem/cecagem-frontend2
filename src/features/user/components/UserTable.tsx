"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
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
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { User, UserEstado, getRolLabel, getEstadoLabel, requiresContract } from "../types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ 
  users, 
  isLoading, 
  onEdit, 
  onDelete 
}: UserTableProps) {
  
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "nombres",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Nombre Completo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">{user.nombres} {user.apellidos}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "telefono",
      header: "Contacto",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3" />
            {user.telefono}
          </div>
        );
      },
    },
    {
      accessorKey: "rol",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Rol
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge variant="outline" className="font-medium">
            {getRolLabel(user.rol)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contrato",
      header: "Contrato",
      cell: ({ row }) => {
        const user = row.original;
        if (!requiresContract(user.rol)) {
          return <span className="text-muted-foreground text-sm">No aplica</span>;
        }
        
        if (!user.contrato) {
          return <Badge variant="destructive">Sin contrato</Badge>;
        }

        return (
          <div className="space-y-1 text-sm">
            <div className="font-medium">S/ {user.contrato.montoPago.toLocaleString()}</div>
            <div className="text-muted-foreground">
              {(() => {
                const date = new Date(user.contrato.fechaContrato);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              })()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge variant={user.estado === UserEstado.ACTIVO ? "default" : "secondary"}>
            {getEstadoLabel(user.estado)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "fechaCreacion",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Fecha Creación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm">
            {user.fechaCreacion 
              ? format(new Date(user.fechaCreacion), "dd/MM/yyyy", { locale: es })
              : "N/A"
            }
          </div>
        );
      },
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(user)}
                className="text-red-600"
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
      data={users}
      columns={columns}
      isLoading={isLoading}
      title="Lista de Usuarios"
      icon={Users}
      noDataMessage="No se encontraron usuarios"
      enablePagination={true}
      enableSorting={true}
      enableColumnFilters={true}
      pageSize={10}
    />
  );
}
