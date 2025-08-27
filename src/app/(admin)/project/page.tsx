"use client";

import { useState, useCallback } from "react";
import ModeToggle from "@/components/themes/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ProyectoStatsCards,
  ProyectoFilters,
  ProyectoTable,
  ProyectoForm,
  DeleteConfirmation,
  useProyectos,
  Proyecto
} from "@/features/project";

export default function ProyectoPage() {
  const {
    proyectos,
    isLoading,
    filters,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    applyFilters,
    clearFilters,
  } = useProyectos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [proyectoToDelete, setProyectoToDelete] = useState<Proyecto | null>(null);

  const handleCreateProyecto = useCallback(() => {
    setEditingProyecto(null);
    setIsFormOpen(true);
  }, []);

  const handleEditProyecto = useCallback((proyecto: Proyecto) => {
    setEditingProyecto(proyecto);
    setIsFormOpen(true);
  }, []);

  const handleDeleteProyecto = useCallback(async (proyecto: Proyecto) => {
    setProyectoToDelete(proyecto);
    setShowDeleteConfirmation(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (proyectoToDelete?.id) {
      await deleteProyecto(proyectoToDelete.id);
      setShowDeleteConfirmation(false);
      setProyectoToDelete(null);
    }
  }, [proyectoToDelete, deleteProyecto]);

  const handleFormSubmit = useCallback(async (proyectoData: Proyecto) => {
    if (editingProyecto) {
      // Actualizar proyecto existente
      await updateProyecto(editingProyecto.id!, proyectoData);
    } else {
      // Crear nuevo proyecto
      await createProyecto(proyectoData);
    }
    setIsFormOpen(false);
    setEditingProyecto(null);
  }, [editingProyecto, updateProyecto, createProyecto]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingProyecto(null);
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Gestión de Proyectos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto mr-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            className="mr-2"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header con título y botón crear */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Proyectos</h1>
            <p className="text-muted-foreground">
              Administra y supervisa todos los proyectos de la organización
            </p>
          </div>
          <Button onClick={handleCreateProyecto} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>

        {/* Estadísticas */}
        <ProyectoStatsCards proyectos={proyectos} isLoading={isLoading} />
        
        {/* Filtros */}
        <ProyectoFilters
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />
        
        {/* Tabla de proyectos */}
        <ProyectoTable
          proyectos={proyectos}
          isLoading={isLoading}
          onEdit={handleEditProyecto}
          onDelete={handleDeleteProyecto}
        />
      </main>

      {/* Modal de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[98vw] w-full max-h-[98vh] sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] overflow-hidden p-0">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              {editingProyecto ? "Editar Proyecto" : "Nuevo Proyecto"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(98vh-120px)]">
            <ProyectoForm
              proyecto={editingProyecto}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setProyectoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        proyectoTitle={proyectoToDelete?.titulo || ""}
        isLoading={isLoading}
      />
    </div>
  );
}
