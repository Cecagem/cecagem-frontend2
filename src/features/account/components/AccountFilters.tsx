"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { ITransactionFilters, TransactionStatus } from "../types/account.types";
import { TransactionType as TType, TransactionStatus as TStatus } from "../types/account.types";

interface AccountFiltersProps {
  filters: Partial<ITransactionFilters>;
  onFiltersChange: (filters: Partial<ITransactionFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const getStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "Pendiente",
    [TStatus.COMPLETED]: "Completado",
    [TStatus.CANCELED]: "Cancelado",
  };
  return labels[status];
};

export const AccountFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: AccountFiltersProps) => {
  const handleInputChange = (field: keyof ITransactionFilters, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== null && value !== "all"
  );

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descripción..."
                value={filters.search || ""}
                onChange={(e) => handleInputChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <Select
              value={filters.tipo || "all"}
              onValueChange={(value) => handleInputChange("tipo", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value={TType.INCOME}>Ingreso</SelectItem>
                <SelectItem value={TType.EXPENSE}>Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div>
            <Select
              value={filters.estado || "all"}
              onValueChange={(value) => handleInputChange("estado", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.values(TStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón Limpiar */}
          <div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                disabled={isLoading}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};