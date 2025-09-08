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

interface CompanyTableProps {
  companiesResponse: UsersResponse | undefined;
  isLoading: boolean;
  onEdit: (company: User) => void;
  onDelete: (company: User) => void;
  filters: Partial<UserFilters>;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
}

export const CompanyTable = ({
  companiesResponse,
  isLoading,
  onEdit,
  onDelete,
  onFiltersChange,
}: CompanyTableProps) => {
  const companies = companiesResponse?.data || [];
  const meta = companiesResponse?.meta;

  const handleEdit = useCallback(
    (company: User) => {
      onEdit(company);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (company: User) => {
      onDelete(company);
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
        accessorKey: "company.ruc",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            RUC
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const ruc = row.original.company?.ruc;
          return ruc ? (
            <span className="font-mono font-medium">{ruc}</span>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      {
        accessorKey: "company.businessName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Razón Social
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const company = row.original.company;
          if (!company) return "N/A";
          return (
            <div className="flex flex-col">
              <span className="font-medium">{company.businessName}</span>
              {company.tradeName && (
                <span className="text-xs text-muted-foreground">
                  {company.tradeName}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          const email = row.original.email;
          return <span className="text-sm font-mono">{email}</span>;
        },
      },
      {
        accessorKey: "company.contactName",
        header: "Contacto",
        cell: ({ row }) => {
          const company = row.original.company;
          if (!company?.contactName) return "N/A";
          return (
            <div className="flex flex-col">
              <span className="font-medium">{company.contactName}</span>
              {company.contactPhone && (
                <span className="text-xs text-muted-foreground">
                  {company.contactPhone}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "company.address",
        header: "Dirección",
        cell: ({ row }) => {
          const address = row.original.company?.address;
          return address ? (
            <span
              className="text-sm max-w-[200px] truncate block"
              title={address}
            >
              {address}
            </span>
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
              {isActive ? "Activa" : "Inactiva"}
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
            Fecha Registro
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
          const company = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(company)}
                className="h-8 w-8 p-0"
                title="Editar empresa"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(company)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Eliminar empresa"
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
            empresas
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
        data={companies}
        isLoading={isLoading}
        noDataMessage="No se encontraron empresas"
      />
      {pagination}
    </div>
  );
};
