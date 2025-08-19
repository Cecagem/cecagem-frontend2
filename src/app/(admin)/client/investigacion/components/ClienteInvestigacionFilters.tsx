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
import { SearchFilters, ClienteInvestigacionEstado, Universidad, GradoAcademico } from "../types";

interface ClienteInvestigacionFiltersProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export default function ClienteInvestigacionFilters({
  filters,
  onApplyFilters,
  onClearFilters,
}: ClienteInvestigacionFiltersProps) {
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

  const handleEstadoChange = useCallback((value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      estado: value === "all" ? undefined : (value as ClienteInvestigacionEstado),
    }));
  }, []);

  const handleUniversidadChange = useCallback((value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      universidad: value === "all" ? undefined : (value as Universidad),
    }));
  }, []);

  const handleGradoChange = useCallback((value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      grado: value === "all" ? undefined : (value as GradoAcademico),
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
                placeholder="Buscar por nombre, apellido, correo, carrera o universidad..."
                value={localFilters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filtros de select - En fila en desktop, columnas en mobile/tablet */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:gap-3">
            {/* Filtro por estado */}
            <div className="lg:min-w-[140px]">
              <Label className="text-sm font-medium sr-only">Estado</Label>
              <Select
                value={localFilters.estado || "all"}
                onValueChange={handleEstadoChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={ClienteInvestigacionEstado.ACTIVO}>Activo</SelectItem>
                  <SelectItem value={ClienteInvestigacionEstado.INACTIVO}>Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por universidad */}
            <div className="lg:min-w-[180px]">
              <Label className="text-sm font-medium sr-only">Universidad</Label>
              <Select
                value={localFilters.universidad || "all"}
                onValueChange={handleUniversidadChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Universidad" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.values(Universidad).map((universidad) => (
                    <SelectItem key={universidad} value={universidad}>
                      {universidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por grado */}
            <div className="lg:min-w-[140px]">
              <Label className="text-sm font-medium sr-only">Grado</Label>
              <Select
                value={localFilters.grado || "all"}
                onValueChange={handleGradoChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={GradoAcademico.BACHILLER}>Bachiller</SelectItem>
                  <SelectItem value={GradoAcademico.EGRESADO}>Egresado</SelectItem>
                  <SelectItem value={GradoAcademico.MAESTRIA}>Maestría</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
