"use client";

import { useState } from "react";
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
import { useClientesContables } from "./hooks/useClientesContables";
import { ClienteContable } from "./types";
import {
  ClienteStatsCards,
  ClienteFilters,
  ClienteTable,
  ClienteForm,
  DeleteConfirmation,
} from "./components";

export default function ClientesContablesPage() {
  const {
    clientes,
    stats,
    filters,
    isLoading,
    applyFilters,
    clearFilters,
    createCliente,
    updateCliente,
    deleteCliente,
  } = useClientesContables();

  // Estados para modales
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteContable | undefined>();

  // Handlers para crear cliente
  const handleCreateCliente = () => {
    setSelectedCliente(undefined);
    setShowClienteForm(true);
  };

  // Handlers para editar cliente
  const handleEditCliente = (cliente: ClienteContable) => {
    setSelectedCliente(cliente);
    setShowClienteForm(true);
  };

  // Handlers para eliminar cliente
  const handleDeleteCliente = (cliente: ClienteContable) => {
    setSelectedCliente(cliente);
    setShowDeleteConfirmation(true);
  };

  // Handler para submit del formulario
  const handleFormSubmit = async (clienteData: Omit<ClienteContable, 'id'>) => {
    if (selectedCliente?.id) {
      await updateCliente(selectedCliente.id, clienteData);
    } else {
      await createCliente(clienteData);
    }
  };

  // Handler para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (selectedCliente?.id) {
      await deleteCliente(selectedCliente.id);
      setShowDeleteConfirmation(false);
      setSelectedCliente(undefined);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Clientes Contables</BreadcrumbPage>
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
            <h1 className="text-3xl font-bold tracking-tight">Clientes Contables</h1>
            <p className="text-muted-foreground">
              Gestiona los clientes contables y su información empresarial
            </p>
          </div>
          <Button onClick={handleCreateCliente} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Estadísticas */}
        <ClienteStatsCards stats={stats} isLoading={isLoading} />

        {/* Filtros */}
        <ClienteFilters
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* Tabla */}
        <ClienteTable
          clientes={clientes}
          isLoading={isLoading}
          onEdit={handleEditCliente}
          onDelete={handleDeleteCliente}
        />
      </main>

      {/* Modales */}
      <ClienteForm
        cliente={selectedCliente}
        isOpen={showClienteForm}
        onClose={() => {
          setShowClienteForm(false);
          setSelectedCliente(undefined);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setSelectedCliente(undefined);
        }}
        onConfirm={handleConfirmDelete}
        clienteName={selectedCliente?.razonSocial || ""}
        isLoading={isLoading}
      />
    </div>
  );
}
