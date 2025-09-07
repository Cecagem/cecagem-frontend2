"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type {
  User,
  UserRole,
  UsersResponse,
  UserFilters,
} from "../types/user.type";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash2,
  ArrowUpDown,
  Users,
  Mail,
  Phone,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";

//  helpers roles
const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Administrador",
    CLIENT: "Cliente",
    COMPANY: "Empresa",
    COLLABORATOR_INTERNAL: "Colaborador Interno",
    COLLABORATOR_EXTERNAL: "Colaborador Externo",
    RRHH: "Recursos Humanos",
  };
  return labels[role] || role;
};

const requiresSalary = (role: UserRole): boolean => {
  return ["RRHH", "COLLABORATOR_INTERNAL"].includes(role);
};

interface UserTableProps {
  usersResponse: UsersResponse | undefined;
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView?: (user: User) => void;
  filters: Partial<UserFilters>;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
}

export default function UserTable({
  usersResponse,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onFiltersChange,
}: UserTableProps) {
  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "profile.firstName",
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
            <div className="font-medium">
              {user.profile?.firstName || ""} {user.profile?.lastName || ""}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "profile.phone",
      header: "Contacto",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3" />
            {user.profile?.phone || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
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
            {getRoleLabel(user.role)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "profile.salaryMonth",
      header: "Contrato",
      cell: ({ row }) => {
        const user = row.original;
        if (!requiresSalary(user.role)) {
          return (
            <span className="text-muted-foreground text-sm">No aplica</span>
          );
        }

        if (!user.profile?.salaryMonth) {
          return <Badge variant="destructive">Sin contrato</Badge>;
        }

        return (
          <div className="space-y-1 text-sm">
            <div className="font-medium">
              S/ {user.profile.salaryMonth.toLocaleString()}
            </div>
            <div className="text-muted-foreground">
              {user.profile.paymentDate
                ? (() => {
                    const date = new Date(user.profile.paymentDate);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()
                : "Sin fecha"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
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
          <Badge variant={user.isActive ? "default" : "secondary"}>
            {user.isActive ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
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
            {user.createdAt
              ? format(new Date(user.createdAt), "dd/MM/yyyy", { locale: es })
              : "N/A"}
          </div>
        );
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(user)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <span className="sr-only">Ver usuario</span>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(user)}
              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            >
              <span className="sr-only">Editar usuario</span>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(user)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <span className="sr-only">Eliminar usuario</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        title="Lista de Usuarios"
        icon={Users}
        noDataMessage="No se encontraron usuarios"
        enablePagination={false}
        enableSorting={true}
        enableColumnFilters={false}
      />
      {meta && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {(meta.page - 1) * meta.limit + 1} a{" "}
            {Math.min(meta.page * meta.limit, meta.total)} de {meta.total}{" "}
            resultados
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Filas por página</p>
              <Select
                value={`${meta.limit}`}
                onValueChange={(value) => {
                  onFiltersChange({
                    page: 1,
                    limit: Number(value),
                  });
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={meta.limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Página {meta.page} de {meta.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onFiltersChange({ page: 1 })}
                disabled={!meta.hasPrevious}
              >
                <span className="sr-only">Ir a la primera página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onFiltersChange({ page: meta.page - 1 })}
                disabled={!meta.hasPrevious}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onFiltersChange({ page: meta.page + 1 })}
                disabled={!meta.hasNext}
              >
                <span className="sr-only">Ir a la página siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onFiltersChange({ page: meta.totalPages })}
                disabled={!meta.hasNext}
              >
                <span className="sr-only">Ir a la última página</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
