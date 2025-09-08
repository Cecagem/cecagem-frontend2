"use client";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Trash2,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { User, UsersResponse, UserFilters } from "@/features/user";

interface CompanyTableProps {
  companiesResponse: UsersResponse | undefined;
  isLoading: boolean;
  onEdit: (company: User) => void;
  onDelete: (company: User) => void;
  filters: Partial<UserFilters>;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
}

export default function CompanyTable({
  companiesResponse,
  isLoading,
  onEdit,
  onDelete,
  onFiltersChange,
}: CompanyTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "company.ruc",
      header: "RUC",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.company?.ruc}</div>
      ),
    },
    {
      accessorKey: "company.businessName",
      header: "Razón Social",
      cell: ({ row }) => (
        <div
          className="max-w-[200px] truncate"
          title={row.original.company?.businessName}
        >
          {row.original.company?.businessName}
        </div>
      ),
    },
    {
      accessorKey: "company.contactName",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.company?.contactName}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.company?.contactPhone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="max-w-[180px] truncate" title={row.original.email}>
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "company.address",
      header: "Dirección",
      cell: ({ row }) => (
        <div
          className="max-w-[200px] truncate"
          title={row.original.company?.address || undefined}
        >
          {row.original.company?.address}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "destructive"}>
          {row.original.isActive ? "Activa" : "Inactiva"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={companiesResponse?.data || []}
        isLoading={isLoading}
        title="Lista de Empresas"
        icon={Building}
        noDataMessage="No se encontraron empresas"
        enablePagination={false}
        enableSorting={true}
        enableColumnFilters={false}
      />
      {companiesResponse?.meta && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando{" "}
            {(companiesResponse.meta.page - 1) * companiesResponse.meta.limit +
              1}{" "}
            a{" "}
            {Math.min(
              companiesResponse.meta.page * companiesResponse.meta.limit,
              companiesResponse.meta.total
            )}{" "}
            de {companiesResponse.meta.total} resultados
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Filas por página</p>
              <Select
                value={`${companiesResponse.meta.limit}`}
                onValueChange={(value) => {
                  onFiltersChange({
                    page: 1,
                    limit: Number(value),
                  });
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={companiesResponse.meta.limit} />
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
              Página {companiesResponse.meta.page} de{" "}
              {companiesResponse.meta.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onFiltersChange({ page: 1 })}
                disabled={!companiesResponse.meta.hasPrevious}
              >
                <span className="sr-only">Ir a la primera página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  onFiltersChange({ page: companiesResponse.meta.page - 1 })
                }
                disabled={!companiesResponse.meta.hasPrevious}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  onFiltersChange({ page: companiesResponse.meta.page + 1 })
                }
                disabled={!companiesResponse.meta.hasNext}
              >
                <span className="sr-only">Ir a la página siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() =>
                  onFiltersChange({ page: companiesResponse.meta.totalPages })
                }
                disabled={!companiesResponse.meta.hasNext}
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
