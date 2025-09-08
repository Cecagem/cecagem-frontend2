"use client";

import { useState } from "react";
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
import { UserFilters } from "@/features/user";

interface CompanyFiltersProps {
  filters: Partial<UserFilters>;
  onApplyFilters: (filters: Partial<UserFilters>) => void;
  onClearFilters: () => void;
}

export default function CompanyFilters({
  filters,
  onApplyFilters,
  onClearFilters,
}: CompanyFiltersProps) {
  const [localFilters, setLocalFilters] =
    useState<Partial<UserFilters>>(filters);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleStatusChange = (value: string) => {
    const isActive =
      value === "active" ? true : value === "inactive" ? false : undefined;
    const newFilters = { ...localFilters, isActive };
    setLocalFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleClear = () => {
    setLocalFilters({ page: 1, limit: 5, type: "company" });
    onClearFilters();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros de Empresas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="RUC, razón social, nombre comercial o contacto..."
                value={localFilters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={
                localFilters.isActive === true
                  ? "active"
                  : localFilters.isActive === false
                  ? "inactive"
                  : "all"
              }
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="inactive">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={handleClear} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
