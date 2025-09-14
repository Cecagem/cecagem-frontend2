"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";
import { ServiceFilters as IServiceFilters } from "../types/engagements.type";

interface ServiceFiltersProps {
  filters: IServiceFilters & { isActive?: boolean | undefined };
  onFiltersChange: (
    filters: Partial<IServiceFilters & { isActive?: boolean | undefined }>
  ) => void;
}

export const ServiceFilters = ({
  filters,
  onFiltersChange,
}: ServiceFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    let isActive: boolean | undefined;
    if (value === "all") {
      isActive = undefined;
    } else if (value === "true") {
      isActive = true;
    } else {
      isActive = false;
    }
    onFiltersChange({ isActive, page: 1 });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      isActive: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = filters.search || filters.isActive !== undefined;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-[160px] space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive
                  ? "true"
                  : "false"
              }
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="whitespace-nowrap"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filtros activos:</span>
            {filters.search && (
              <span className="bg-secondary px-2 py-1 rounded text-xs">
                Buscar: &quot;{filters.search}&quot;
              </span>
            )}
            {filters.isActive !== undefined && (
              <span className="bg-secondary px-2 py-1 rounded text-xs">
                Estado: {filters.isActive ? "Activos" : "Inactivos"}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
