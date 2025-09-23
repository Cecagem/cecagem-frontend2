"use client";

import { Search } from "lucide-react";
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
import { useServices } from "@/features/engagements/hooks/useEngagements";
import type { IContractFilters } from "../types";

interface ContractFiltersProps {
  filters: Partial<IContractFilters>;
  onFiltersChange: (filters: Partial<IContractFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const ContractFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: ContractFiltersProps) => {
  const { data: servicesData } = useServices({ isActive: true, limit: 100 });

  const handleInputChange = (
    field: keyof IContractFilters,
    value: string | undefined
  ) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined && value !== "" && value !== null && value !== "all"
  );

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda general */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contratos..."
                value={filters.search || ""}
                onChange={(e) => handleInputChange("search", e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Filtro por Servicio */}
          <div>
            <Select
              value={filters.serviceId || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  handleInputChange("serviceId", undefined);
                } else {
                  handleInputChange("serviceId", value);
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los servicios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los servicios</SelectItem>
                {/* TODO: Agregar servicios dinámicamente */}
                {servicesData?.data?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenamiento */}
          <div>
            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={(value) =>
                handleInputChange(
                  "sortBy",
                  value as
                    | "createdAt"
                    | "updatedAt"
                    | "startDate"
                    | "endDate"
                    | "name"
                )
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Fecha de creación</SelectItem>
                <SelectItem value="updatedAt">
                  Fecha de actualización
                </SelectItem>
                <SelectItem value="startDate">Fecha de inicio</SelectItem>
                <SelectItem value="endDate">Fecha de fin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón para limpiar filtros */}
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
