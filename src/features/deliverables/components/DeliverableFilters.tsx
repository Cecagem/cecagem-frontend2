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
import { IDeliverableTableFilters } from "../types/deliverable.types";
import { Service } from "@/features/engagements/types/engagements.type";

interface DeliverableFiltersProps {
  filters: IDeliverableTableFilters;
  services: Service[];
  onFiltersChange: (filters: Partial<IDeliverableTableFilters>) => void;
  onClearFilters?: () => void;
}

export const DeliverableFilters = ({
  filters,
  services,
  onFiltersChange,
  onClearFilters,
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
    if (onClearFilters) {
      onClearFilters();
    } else {
      onFiltersChange({
        search: "",
        serviceId: "",
        isActive: "",
        page: 1,
      });
    }
  };

  const hasActiveFilters =
    filters.search || filters.serviceId || filters.isActive;

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripción."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Service Filter */}
          <div>
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
          <div>
            <Select
              value={filters.isActive || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
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
