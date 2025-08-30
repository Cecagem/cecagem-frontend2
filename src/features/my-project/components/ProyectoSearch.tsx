"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TipoProyecto, EstadoProyecto } from "../types";

interface ProyectoSearchProps {
  onSearch: (termino: string) => void;
  onFilter: (filtros: {
    tipo?: TipoProyecto;
    estado?: EstadoProyecto;
  }) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const tipoProyectoLabels = {
  [TipoProyecto.INVESTIGACION]: "Investigación",
  [TipoProyecto.CONTABLE]: "Contable",
  [TipoProyecto.CONSULTORIA]: "Consultoría",
  [TipoProyecto.DESARROLLO]: "Desarrollo",
};

const estadoProyectoLabels = {
  [EstadoProyecto.PLANIFICACION]: "Planificación",
  [EstadoProyecto.EN_PROGRESO]: "En Progreso",
  [EstadoProyecto.REVISION]: "Revisión",
  [EstadoProyecto.COMPLETADO]: "Completado",
  [EstadoProyecto.PAUSADO]: "Pausado",
  [EstadoProyecto.CANCELADO]: "Cancelado",
};

export function ProyectoSearch({
  onSearch,
  onFilter,
  onClearFilters,
  loading = false,
}: ProyectoSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<TipoProyecto | undefined>();
  const [selectedEstado, setSelectedEstado] = useState<EstadoProyecto | undefined>();
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Custom debounce implementation
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout - solo hacer la búsqueda, no bloquear el input
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleApplyFilters = () => {
    const filtros: {
      tipo?: TipoProyecto;
      estado?: EstadoProyecto;
    } = {};

    if (selectedTipo) filtros.tipo = selectedTipo;
    if (selectedEstado) filtros.estado = selectedEstado;

    setHasActiveFilters(selectedTipo !== undefined || selectedEstado !== undefined);
    onFilter(filtros);
  };

  const handleClearFilters = () => {
    setSelectedTipo(undefined);
    setSelectedEstado(undefined);
    setSearchTerm("");
    setHasActiveFilters(false);
    onClearFilters();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Buscador */}
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
          loading ? 'animate-spin text-primary' : 'text-muted-foreground'
        }`} />
        <Input
          placeholder="Buscar proyectos por título, descripción, colaborador o cliente..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => handleSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  Activos
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="font-medium">Filtrar proyectos</div>
              
              {/* Tipo de Proyecto */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Proyecto</label>
                <Select
                  value={selectedTipo || ""}
                  onValueChange={(value) =>
                    setSelectedTipo(value ? (value as TipoProyecto) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {Object.entries(tipoProyectoLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado del Proyecto */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={selectedEstado || ""}
                  onValueChange={(value) =>
                    setSelectedEstado(value ? (value as EstadoProyecto) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    {Object.entries(estadoProyectoLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2">
                <Button onClick={handleApplyFilters} className="flex-1">
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          {selectedTipo && (
            <Badge variant="secondary" className="gap-1">
              {tipoProyectoLabels[selectedTipo]}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  setSelectedTipo(undefined);
                  handleApplyFilters();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedEstado && (
            <Badge variant="secondary" className="gap-1">
              {estadoProyectoLabels[selectedEstado]}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  setSelectedEstado(undefined);
                  handleApplyFilters();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
