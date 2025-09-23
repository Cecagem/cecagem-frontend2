"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { IUserFilters } from "../types/user.types";
import { UserRole } from "../types/user.types";

interface UserFiltersProps {
  filters: Partial<IUserFilters>;
  onFiltersChange: (filters: Partial<IUserFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const UserFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: UserFiltersProps) => {
  const handleInputChange = (field: keyof IUserFilters, value: string | boolean | undefined) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
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
                placeholder="Buscar por nombre, email, documento..."
                value={filters.search || ""}
                onChange={(e) => handleInputChange("search", e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Filtro por rol */}
          <div>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  handleInputChange("role", undefined);
                } else {
                  handleInputChange("role", value as UserRole);
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.COLLABORATOR_INTERNAL}>Colaborador Interno</SelectItem>
                <SelectItem value={UserRole.COLLABORATOR_EXTERNAL}>Colaborador Externo</SelectItem>
                <SelectItem value={UserRole.RRHH}>RRHH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div>
            <Select
              value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
              onValueChange={(value) => {
                if (value === "all") {
                  handleInputChange("isActive", undefined);
                } else {
                  handleInputChange("isActive", value === "true");
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
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