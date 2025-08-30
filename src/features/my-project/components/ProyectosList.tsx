"use client";

import { useState, useEffect } from "react";
import { Loader2, FolderOpen, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProyectoCard } from "./ProyectoCard";
import { ProyectoSearch } from "./ProyectoSearch";
import { useMisProyectos, useBuscarProyectos, useFiltrarProyectos } from "../hooks";
import { Proyecto, TipoProyecto, EstadoProyecto } from "../types";

interface ProyectosListProps {
  onProjectClick: (id: string) => void;
}

export function ProyectosList({ onProjectClick }: ProyectosListProps) {
  const { proyectos: todosLosProyectos, loading: loadingTodos, error } = useMisProyectos();
  const { resultados: resultadosBusqueda, loading: loadingBusqueda, buscar } = useBuscarProyectos();
  const { proyectosFiltrados, loading: loadingFiltros, filtrar } = useFiltrarProyectos();
  
  const [proyectosMostrados, setProyectosMostrados] = useState<Proyecto[]>([]);
  const [modoActual, setModoActual] = useState<'todos' | 'busqueda' | 'filtros'>('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Actualizar proyectos mostrados según el modo actual
  useEffect(() => {
    if (modoActual === 'todos') {
      setProyectosMostrados(todosLosProyectos);
    } else if (modoActual === 'busqueda') {
      setProyectosMostrados(resultadosBusqueda);
    } else if (modoActual === 'filtros') {
      setProyectosMostrados(proyectosFiltrados);
    }
  }, [todosLosProyectos, resultadosBusqueda, proyectosFiltrados, modoActual]);

  const handleSearch = async (termino: string) => {
    setTerminoBusqueda(termino);
    if (termino.trim()) {
      setModoActual('busqueda');
      // No esperamos la búsqueda para no bloquear la UI
      buscar(termino);
    } else {
      setModoActual('todos');
    }
  };

  const handleFilter = async (filtros: {
    tipo?: TipoProyecto;
    estado?: EstadoProyecto;
  }) => {
    setModoActual('filtros');
    // No esperamos el filtrado para no bloquear la UI
    filtrar(filtros);
  };

  const handleClearFilters = () => {
    setModoActual('todos');
    setTerminoBusqueda("");
  };


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">Error al cargar los proyectos</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

    return (
    <div className="space-y-6">
      {/* Buscador y Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscador de Proyectos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProyectoSearch
            onSearch={handleSearch}
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
            loading={loadingBusqueda || loadingFiltros}
          />
        </CardContent>
      </Card>      {/* Información de resultados */}
      {!loadingTodos && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {(loadingBusqueda || loadingFiltros) && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {modoActual === 'busqueda' && terminoBusqueda && (
              <span>
                {proyectosMostrados.length} resultado{proyectosMostrados.length !== 1 ? 's' : ''} para &ldquo;{terminoBusqueda}&rdquo;
              </span>
            )}
            {modoActual === 'filtros' && (
              <span>
                {proyectosMostrados.length} proyecto{proyectosMostrados.length !== 1 ? 's' : ''} filtrado{proyectosMostrados.length !== 1 ? 's' : ''}
              </span>
            )}
            {modoActual === 'todos' && (
              <span>
                {proyectosMostrados.length} proyecto{proyectosMostrados.length !== 1 ? 's' : ''} total{proyectosMostrados.length !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading State - Solo para carga inicial */}
      {loadingTodos && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando proyectos...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingTodos && proyectosMostrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted/50 rounded-full p-6 mb-4">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {modoActual === 'busqueda' ? 'No se encontraron proyectos' : 'No hay proyectos'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {modoActual === 'busqueda' 
              ? `No hay proyectos que coincidan con &ldquo;${terminoBusqueda}&rdquo;. Intenta con otros términos de búsqueda.`
              : modoActual === 'filtros'
              ? 'No hay proyectos que coincidan con los filtros seleccionados.'
              : 'Aún no tienes proyectos asignados. Los proyectos aparecerán aquí cuando sean asignados.'
            }
          </p>
        </div>
      )}

      {/* Lista de Proyectos */}
      {!loadingTodos && proyectosMostrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {proyectosMostrados.map((proyecto) => (
            <ProyectoCard
              key={proyecto.id}
              proyecto={proyecto}
              onViewDetails={onProjectClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
