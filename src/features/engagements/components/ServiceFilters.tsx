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
import { Search, X } from "lucide-react";
import { ServiceFilters as IServiceFilters } from "../types/engagements.type";

interface ServiceFiltersProps {
  filters: IServiceFilters & { isActive?: boolean | undefined };
  onFiltersChange: (
    filters: Partial<IServiceFilters & { isActive?: boolean | undefined }>
  ) => void;
  onClearFilters?: () => void;
}

export const ServiceFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
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
    if (onClearFilters) {
      onClearFilters();
    } else {
      onFiltersChange({
        search: "",
        isActive: undefined,
        page: 1,
      });
    }
  };

  const hasActiveFilters = filters.search || filters.isActive !== undefined;

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div>
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
          <div>
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
          <div>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
