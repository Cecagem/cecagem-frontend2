"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useCallback } from "react";
import { User, UsersResponse, UserFilters } from "@/features/user";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";

interface ClientTableProps {
  usersResponse: UsersResponse | undefined;
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  filters: Partial<UserFilters>;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
}

export const ClientTable = ({
  usersResponse,
  isLoading,
  onEdit,
  onDelete,
  onFiltersChange,
}: ClientTableProps) => {
  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;

  const handleEdit = useCallback(
    (user: User) => {
      onEdit(user);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (user: User) => {
      onDelete(user);
    },
    [onDelete]
  );

  const handleFiltersChange = useCallback(
    (filters: Partial<UserFilters>) => {
      onFiltersChange(filters);
    },
    [onFiltersChange]
  );

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "profile.firstName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Nombres
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const profile = row.original.profile;
          if (!profile) return "N/A";
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {profile.firstName} {profile.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "profile.phone",
        header: "Teléfono",
        cell: ({ row }) => {
          const phone = row.original.profile?.phone;
          return phone ? (
            <span className="font-mono text-sm">{phone}</span>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      {
        accessorKey: "profile.university",
        header: "Universidad",
        cell: ({ row }) => {
          const university = row.original.profile?.university;
          return university ? (
            <span className="text-sm">{university}</span>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      {
        accessorKey: "profile.career",
        header: "Carrera",
        cell: ({ row }) => {
          const career = row.original.profile?.career;
          return career ? (
            <span className="text-sm">{career}</span>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      {
        accessorKey: "profile.academicDegree",
        header: "Grado Académico",
        cell: ({ row }) => {
          const degree = row.original.profile?.academicDegree;
          return degree ? (
            <Badge variant="secondary" className="text-xs">
              {degree}
            </Badge>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <Badge variant={isActive ? "default" : "destructive"}>
              {isActive ? "Activo" : "Inactivo"}
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
            className="h-8 px-2"
          >
            Fecha Creación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return (
            <div className="text-sm">
              {format(date, "dd/MM/yyyy", { locale: es })}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(user)}
                className="h-8 w-8 p-0"
                title="Editar cliente"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(user)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Eliminar cliente"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleEdit, handleDelete]
  );

  const pagination = useMemo(() => {
    if (!meta) return null;

    return (
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {(meta.page - 1) * meta.limit + 1} a{" "}
            {Math.min(meta.page * meta.limit, meta.total)} de {meta.total}{" "}
            clientes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-sm text-muted-foreground">Filas por página:</p>
            <Select
              value={meta.limit.toString()}
              onValueChange={(value) =>
                handleFiltersChange({ limit: parseInt(value) })
              }
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltersChange({ page: 1 })}
              disabled={meta.page <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltersChange({ page: meta.page - 1 })}
              disabled={meta.page <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Página</span>
              <span className="text-sm font-medium">
                {meta.page} de {meta.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltersChange({ page: meta.page + 1 })}
              disabled={meta.page >= meta.totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltersChange({ page: meta.totalPages })}
              disabled={meta.page >= meta.totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [meta, handleFiltersChange]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        noDataMessage="No se encontraron clientes"
      />
      {pagination}
    </div>
  );
};
