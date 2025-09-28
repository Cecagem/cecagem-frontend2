"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Eye, RefreshCw, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useServices, useDeleteService } from "../hooks/useEngagements";
import {
  getServiceStatusColor,
  getServiceStatusText,
  truncateDescription,
  formatServiceDate,
  formatPrice,
} from "../utils/engagements.utils";
import {
  ServiceFilters as IServiceFilters,
  DEFAULT_SERVICE_FILTERS,
  Service,
} from "../types/engagements.type";
import { useToast } from "@/hooks/use-toast";
import { CreateServiceDialog } from "./CreateService";
import { EditServiceDialog } from "./EditService";
import { DeleteServiceDialog } from "./DeleteService";
import { ViewServiceDialog } from "./ViewService";
import { ServiceFilters } from "./ServiceFilters";

export function ServicesPage() {
  const { showSuccess, showError } = useToast();
  const [filters, setFilters] = useState<
    IServiceFilters & { isActive?: boolean | undefined }
  >({
    ...DEFAULT_SERVICE_FILTERS,
    isActive: undefined,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    data: servicesResponse,
    isLoading,
    error,
    refetch,
  } = useServices(filters);
  const deleteServiceMutation = useDeleteService();

  // Get pagination data - Fixed to use meta instead of pagination
  const services = servicesResponse?.data || [];
  const pagination = servicesResponse?.meta;

  const handleFiltersChange = (
    newFilters: Partial<IServiceFilters & { isActive?: boolean | undefined }>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      ...DEFAULT_SERVICE_FILTERS,
      isActive: undefined,
    });
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setSelectedServiceId(service.id);
    setEditDialogOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setDeleteDialogOpen(true);
  };

  const handleView = (service: Service) => {
    setSelectedService(service);
    setSelectedServiceId(service.id);
    setViewDialogOpen(true);
  };

  const confirmDelete: () => Promise<void> = async () => {
    if (!selectedServiceId) return;

    try {
      await deleteServiceMutation.mutateAsync(selectedServiceId);
      showSuccess("deleted", {
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado exitosamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedServiceId("");
    } catch {
      showError("error", {
        title: "Error",
        description: "No se pudo eliminar el servicio. Inténtalo de nuevo.",
      });
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    handleFiltersChange({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    handleFiltersChange({ page: 1, limit: newPageSize });
  };

  const handleFirstPage = () => {
    if (pagination && pagination.page > 1) {
      handlePageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination && pagination.page > 1) {
      handlePageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      handlePageChange(pagination.page + 1);
    }
  };

  const handleLastPage = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      handlePageChange(pagination.totalPages);
    }
  };

  // Pagination state calculations
  const canPreviousPage = pagination ? (pagination.hasPrevious !== undefined ? pagination.hasPrevious : pagination.page > 1) : false;
  const canNextPage = pagination ? (pagination.hasNext !== undefined ? pagination.hasNext : pagination.page < pagination.totalPages) : false;

  const ServicesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex gap-2 w-full">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
            <p className="text-muted-foreground">
              Gestiona los servicios de consultoría disponibles
            </p>
          </div>
          <Button 
            disabled 
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>

        {/* Filters */}
        <ServiceFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Services Skeleton */}
        <ServicesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
            <p className="text-muted-foreground">
              Gestiona los servicios de consultoría disponibles
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>

        {/* Error Card */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <RefreshCw className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Error al cargar los servicios
                </h3>
                <p className="text-muted-foreground mb-4">
                  Hubo un problema al cargar la lista de servicios.
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
          <p className="text-muted-foreground">
            Gestiona los servicios de consultoría disponibles
          </p>
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Filters */}
      <ServiceFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay servicios</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron servicios con los filtros aplicados.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Servicio
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {truncateDescription(service.description, 80)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={getServiceStatusColor(service.isActive)}
                  >
                    {getServiceStatusText(service.isActive)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(service.basePrice)}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Creado:</span>{" "}
                      {formatServiceDate(service.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Actualizado:</span>{" "}
                      {formatServiceDate(service.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(service)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Pagination - Three Columns Responsive */}
      {pagination && services.length > 0 && (
        <div className="pt-4 border-t">
          {/* Single row with three columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
            {/* Left column - Page size selector */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm order-2 sm:order-1">
              <span className="text-muted-foreground">Mostrar:</span>
              <select
                value={filters.limit}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="h-8 px-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted-foreground">por página</span>
            </div>
            
            {/* Center column - Navigation buttons */}
            <div className="flex items-center justify-center gap-1 order-1 sm:order-2">
              {/* First page button */}
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
              
              {/* Previous page button */}
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
              
              {/* Page indicator */}
              <div className="flex items-center px-3">
                <span className="text-sm font-medium whitespace-nowrap">
                  {pagination.page} / {pagination.totalPages || Math.ceil(pagination.total / filters.limit)}
                </span>
              </div>
              
              {/* Next page button */}
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
              
              {/* Last page button */}
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
            
            {/* Right column - Info text */}
            <div className="flex justify-center sm:justify-end order-3">
              <div className="text-sm text-muted-foreground text-center sm:text-right">
                Mostrando {((pagination.page - 1) * filters.limit) + 1} a{' '}
                {Math.min(pagination.page * filters.limit, pagination.total)} de {pagination.total}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CreateServiceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditServiceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        service={selectedService}
      />

      <DeleteServiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={deleteServiceMutation.isPending}
      />

      <ViewServiceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        service={selectedService}
      />
    </div>
  );
}
