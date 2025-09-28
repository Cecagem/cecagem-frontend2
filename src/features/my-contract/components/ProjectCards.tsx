"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, User, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { IContract, IContractMeta, IContractFilters } from "@/features/contract/types/contract.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectCardsProps {
  contracts: IContract[];
  onProjectClick: (contractId: string) => void;
  isLoading?: boolean;
  // Nuevas props para paginación
  paginationMeta?: IContractMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  filters?: Partial<IContractFilters>;
}

export const ProjectCards = ({ 
  contracts, 
  onProjectClick, 
  isLoading,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
  filters
}: ProjectCardsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tienes proyectos</h3>
          <p className="text-muted-foreground">
            {filters?.search ? 
              "No se encontraron proyectos que coincidan con tu búsqueda" :
              "Cuando se te asignen proyectos, aparecerán aquí"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  // Handlers de paginación
  const handleFirstPage = () => {
    if (paginationMeta && paginationMeta.page > 1 && onPageChange) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationMeta && paginationMeta.page > 1 && onPageChange) {
      onPageChange(paginationMeta.page - 1);
    }
  };

  const handleNextPage = () => {
    if (paginationMeta && paginationMeta.page < paginationMeta.totalPages && onPageChange) {
      onPageChange(paginationMeta.page + 1);
    }
  };

  const handleLastPage = () => {
    if (paginationMeta && paginationMeta.page < paginationMeta.totalPages && onPageChange) {
      onPageChange(paginationMeta.totalPages);
    }
  };

  // Estados de paginación
  const canPreviousPage = paginationMeta ? (paginationMeta.hasPrevious !== undefined ? paginationMeta.hasPrevious : paginationMeta.page > 1) : false;
  const canNextPage = paginationMeta ? (paginationMeta.hasNext !== undefined ? paginationMeta.hasNext : paginationMeta.page < paginationMeta.totalPages) : false;

  return (
    <div className="space-y-6">
      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((contract) => (
          <Card 
            key={contract.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => onProjectClick(contract.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {contract.name}
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
              <Badge variant="default">
                Activo
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{contract.university}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{contract.career}</span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  {format(new Date(contract.createdAt), 'dd MMM yyyy', { locale: es })}
                </span>
              </div>

              {contract.observation && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {contract.observation}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación mejorada */}
      {paginationMeta && contracts.length > 0 && (
        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
            {/* Columna izquierda - Selector de tamaño de página */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm order-2 sm:order-1">
              <span className="text-muted-foreground">Mostrar:</span>
              <select
                value={filters?.limit || 12}
                onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                className="h-8 px-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <span className="text-muted-foreground">por página</span>
            </div>
            
            {/* Columna central - Botones de navegación */}
            <div className="flex items-center justify-center gap-1 order-1 sm:order-2">
              {/* Botón primera página */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFirstPage}
                disabled={!canPreviousPage}
                className="h-8 w-8 p-0"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Botón página anterior */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!canPreviousPage}
                className="h-8 px-3"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Anterior</span>
              </Button>
              
              {/* Indicador de página */}
              <div className="flex items-center px-3">
                <span className="text-sm font-medium whitespace-nowrap">
                  {paginationMeta.page} / {paginationMeta.totalPages || Math.ceil(paginationMeta.total / (filters?.limit || 12))}
                </span>
              </div>
              
              {/* Botón página siguiente */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!canNextPage}
                className="h-8 px-3"
                title="Página siguiente"
              >
                <span className="hidden md:inline">Siguiente</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              
              {/* Botón última página */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLastPage}
                disabled={!canNextPage}
                className="h-8 w-8 p-0"
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Columna derecha - Información */}
            <div className="flex justify-center sm:justify-end order-3">
              <div className="text-sm text-muted-foreground text-center sm:text-right">
                Mostrando {((paginationMeta.page - 1) * (filters?.limit || 12)) + 1} a{' '}
                {Math.min(paginationMeta.page * (filters?.limit || 12), paginationMeta.total)} de {paginationMeta.total}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};