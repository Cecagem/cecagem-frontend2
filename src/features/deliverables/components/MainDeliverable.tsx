"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import {
  useDeliverables,
  useServicesForSelect,
  IDeliverable,
  IDeliverableTableFilters,
} from "@/features/deliverables";
import { FileText as DeliverableIcon } from "lucide-react";
import { deliverableColumns } from "./deliverable-columns";
import { DeliverableFilters } from "./DeliverableFilters";
import { CreateDeliverableDialog } from "./CreateDeliverable";
import { EditDeliverableDialog } from "./EditDeliverable";
import { ViewDeliverableDialog } from "./ViewDeliverable";
import { DeleteDeliverableDialog } from "./DeleteDeliverable";

export const DeliverablesPage = () => {
  const [filters, setFilters] = useState<IDeliverableTableFilters>({
    search: "",
    serviceId: "",
    isActive: "",
    page: 1,
    limit: 10,
  });

  const [selectedDeliverable, setSelectedDeliverable] =
    useState<IDeliverable | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Queries
  const { data: deliverablesResponse, isLoading } = useDeliverables({
    search: filters.search || undefined,
    serviceId: filters.serviceId || undefined,
    isActive: filters.isActive === "" ? undefined : filters.isActive === "true",
    page: filters.page,
    limit: filters.limit,
  });

  const { data: servicesResponse } = useServicesForSelect();

  const deliverables = deliverablesResponse?.data || [];
  const services = servicesResponse?.data || [];

  // Handlers
  const handleView = (deliverable: IDeliverable) => {
    setSelectedDeliverable(deliverable);
    setViewDialogOpen(true);
  };

  const handleEdit = (deliverable: IDeliverable) => {
    setSelectedDeliverable(deliverable);
    setEditDialogOpen(true);
  };

  const handleDelete = (deliverable: IDeliverable) => {
    setSelectedDeliverable(deliverable);
    setDeleteDialogOpen(true);
  };

  // Dialog close handlers
  const handleCloseView = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedDeliverable(null);
    }
  };

  const handleCloseEdit = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setSelectedDeliverable(null);
    }
  };

  const handleCloseDelete = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedDeliverable(null);
    }
  };

  const handleCloseCreate = (open: boolean) => {
    setCreateDialogOpen(open);
  };

  const handleFiltersChange = (
    newFilters: Partial<IDeliverableTableFilters>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Columns with actions
  const columns = useMemo(
    () =>
      deliverableColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Entregables</h1>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Entregable
        </Button>
      </div>

      {/* Filters */}
      <DeliverableFilters
        filters={filters}
        services={services}
        onFiltersChange={handleFiltersChange}
      />

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DeliverableIcon className="h-5 w-5" />
            <span>Lista de Entregables</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={deliverables}
            columns={columns}
            isLoading={isLoading}
            noDataMessage="No se encontraron entregables"
            enablePagination={true}
            enableSorting={true}
            pageSize={filters.limit}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateDeliverableDialog
        open={createDialogOpen}
        onOpenChange={handleCloseCreate}
        services={services}
      />

      {selectedDeliverable && (
        <>
          <EditDeliverableDialog
            deliverable={selectedDeliverable}
            services={services}
            open={editDialogOpen}
            onOpenChange={handleCloseEdit}
          />

          <ViewDeliverableDialog
            deliverable={selectedDeliverable}
            open={viewDialogOpen}
            onOpenChange={handleCloseView}
          />

          <DeleteDeliverableDialog
            deliverable={selectedDeliverable}
            open={deleteDialogOpen}
            onOpenChange={handleCloseDelete}
          />
        </>
      )}
    </div>
  );
};
