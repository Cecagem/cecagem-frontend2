"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { IResearchClientFilters } from "../types/research-clients.types";

interface ResearchClientFiltersProps {
  filters: Partial<IResearchClientFilters>;
  onFiltersChange: (filters: Partial<IResearchClientFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const ResearchClientFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: ResearchClientFiltersProps) => {
  const handleInputChange = (field: keyof IResearchClientFilters, value: string | boolean | number | undefined) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== null && value !== "all"
  );

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={filters.search || ""}
                onChange={(e) => handleInputChange("search", e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <Select
              value={
                filters.isActive === true 
                  ? "active" 
                  : filters.isActive === false 
                  ? "inactive" 
                  : "all"
              }
              onValueChange={(value) => {
                const isActive = value === "active" ? true : value === "inactive" ? false : undefined;
                handleInputChange("isActive", isActive);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
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