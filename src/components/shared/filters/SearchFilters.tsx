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

export interface FilterOption {
  value: string;
  label: string;
}

export interface SelectFilter {
  key: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
  width?: string;
}

export interface SearchFiltersProps<T = Record<string, unknown>> {
  filters: T;
  onApplyFilters: (filters: T) => void;
  onClearFilters: () => void;
  searchPlaceholder?: string;
  searchKey?: keyof T;
  selectFilters?: SelectFilter[];
  title?: string;
  debounceMs?: number;
}

export function SearchFilters<T extends Record<string, unknown>>({
  filters,
  onApplyFilters,
  onClearFilters,
  searchPlaceholder = "Buscar...",
  searchKey = "search" as keyof T,
  selectFilters = [],
  title = "Filtros de Búsqueda",
  debounceMs = 300,
}: SearchFiltersProps<T>) {
  const [localFilters, setLocalFilters] = useState<T>(filters);

  // Auto-aplicar filtros cuando cambien
  const debouncedApplyFilters = useCallback(
    (newFilters: T) => {
      onApplyFilters(newFilters);
    },
    [onApplyFilters]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedApplyFilters(localFilters);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localFilters, debouncedApplyFilters, debounceMs]);

  // Sincronizar con filtros externos
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      [searchKey]: value || undefined 
    } as T));
  }, [searchKey]);

  const handleSelectChange = useCallback((key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    } as T));
  }, []);

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {} as T;
    setLocalFilters(clearedFilters);
    onClearFilters();
  }, [onClearFilters]);

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== ""
  );

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {title}
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
          {/* Búsqueda por texto */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="search" className="sr-only">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder={searchPlaceholder}
                value={(localFilters[searchKey] as string) || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filtros de select */}
          {selectFilters.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:gap-3">
              {selectFilters.map((selectFilter) => (
                <div key={selectFilter.key} className={selectFilter.width || "lg:min-w-[140px]"}>
                  <Label className="text-sm font-medium sr-only">{selectFilter.label}</Label>
                  <Select
                    value={(localFilters[selectFilter.key] as string) || "all"}
                    onValueChange={(value) => handleSelectChange(selectFilter.key, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectFilter.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="all">Todos</SelectItem>
                      {selectFilter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
