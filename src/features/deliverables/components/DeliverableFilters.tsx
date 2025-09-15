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
import { IDeliverableTableFilters } from "../types/deliverable.types";
import { Service } from "@/features/engagements/types/engagements.type";

interface DeliverableFiltersProps {
  filters: IDeliverableTableFilters;
  services: Service[];
  onFiltersChange: (filters: Partial<IDeliverableTableFilters>) => void;
}

export const DeliverableFilters = ({
  filters,
  services,
  onFiltersChange,
}: DeliverableFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value, page: 1 });
  };

  const handleServiceChange = (value: string) => {
    const serviceId = value === "all" ? "" : value;
    onFiltersChange({ serviceId, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === "all" ? "" : value;
    onFiltersChange({ isActive, page: 1 });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      serviceId: "",
      isActive: "",
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search || filters.serviceId || filters.isActive;

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
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Service Filter */}
          <div className="w-full sm:w-[200px] space-y-2">
            <label className="text-sm font-medium">Servicio</label>
            <Select
              value={filters.serviceId || "all"}
              onValueChange={handleServiceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los servicios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los servicios</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-[160px] space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={filters.isActive || "all"}
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
            {filters.serviceId && (
              <span className="bg-secondary px-2 py-1 rounded text-xs">
                Servicio:{" "}
                {services.find((s) => s.id === filters.serviceId)?.name}
              </span>
            )}
            {filters.isActive && (
              <span className="bg-secondary px-2 py-1 rounded text-xs">
                Estado: {filters.isActive === "true" ? "Activos" : "Inactivos"}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
