"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { SearchFilters, TipoProyecto, EstadoProyecto, tipoProyectoLabels, estadoProyectoLabels } from "../types";

interface ProyectoFiltersProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export function ProyectoFilters({ filters, onApplyFilters, onClearFilters }: ProyectoFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  // Auto-aplicar filtros cuando cambien
  const debouncedApplyFilters = useCallback(
    (newFilters: SearchFilters) => {
      onApplyFilters(newFilters);
    },
    [onApplyFilters]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedApplyFilters(localFilters);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [localFilters, debouncedApplyFilters]);

  // Sincronizar con filtros externos
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value || undefined }));
  }, []);

  const handleTipoProyectoChange = useCallback((value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      tipoProyecto: value === "all" ? undefined : (value as TipoProyecto),
    }));
  }, []);

  const handleEstadoChange = useCallback((value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      estado: value === "all" ? undefined : (value as EstadoProyecto),
    }));
  }, []);

  const handleColaboradorChange = useCallback((value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      colaboradorId: value === "all" ? undefined : value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setLocalFilters({});
    onClearFilters();
  }, [onClearFilters]);

  const hasActiveFilters = Object.values(localFilters).some(value => value !== undefined && value !== "");

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Búsqueda por texto - Más espacio en desktop */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="search" className="sr-only">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por título, descripción o código..."
                value={localFilters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filtros de select - En fila en desktop, columnas en mobile/tablet */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:gap-3">
            {/* Filtro por tipo de proyecto */}
            <div className="lg:min-w-[200px]">
              <Label className="text-sm font-medium sr-only">Tipo de Proyecto</Label>
              <Select
                value={localFilters.tipoProyecto || "all"}
                onValueChange={handleTipoProyectoChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(tipoProyectoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="lg:min-w-[200px]">
              <Label className="text-sm font-medium sr-only">Estado</Label>
              <Select
                value={localFilters.estado || "all"}
                onValueChange={handleEstadoChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(estadoProyectoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por colaborador */}
            <div className="lg:min-w-[200px]">
              <Label className="text-sm font-medium sr-only">Colaborador</Label>
              <Select
                value={localFilters.colaboradorId || "all"}
                onValueChange={handleColaboradorChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los colaboradores" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">Todos los colaboradores</SelectItem>
                  <SelectItem value="colab-1">Juan Pérez - Especialista en Metodología</SelectItem>
                  <SelectItem value="colab-2">Ana García - Desarrolladora Senior</SelectItem>
                  <SelectItem value="colab-3">Carlos López - Consultor Financiero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
