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
import { Plus, Edit, Trash2, Eye, RefreshCw, Settings } from "lucide-react";
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

  const handleFiltersChange = (
    newFilters: Partial<IServiceFilters & { isActive?: boolean | undefined }>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Servicios</h1>
            <p className="text-muted-foreground">
              Gestiona los servicios de consultoría disponibles
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="w-full sm:w-[160px] space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Skeleton */}
        <ServicesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Servicios</h1>
            <p className="text-muted-foreground">
              Gestiona los servicios de consultoría disponibles
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
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

  const services = servicesResponse?.data || [];
  const pagination = servicesResponse?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">
            Gestiona los servicios de consultoría disponibles
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <ServiceFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {services.length} de {pagination.total} servicios
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFiltersChange({ page: filters.page - 1 })
                  }
                  disabled={pagination.page <= 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm">
                  {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFiltersChange({ page: filters.page + 1 })
                  }
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
