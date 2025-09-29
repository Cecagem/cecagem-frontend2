"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Edit,
  Trash2,
} from 'lucide-react';

import { DataTable, ServerPaginationMeta } from '@/components/shared/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from "@tanstack/react-table";

import { useDeleteResearchClient } from '../hooks/use-research-clients';
import type { IResearchClient } from '../types/research-clients.types';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface ResearchClientTableProps {
  clients: IResearchClient[];
  isLoading?: boolean;
  onEditClient: (client: IResearchClient) => void;
  // Props para paginación del servidor
  serverPagination?: boolean;
  paginationMeta?: ServerPaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function ResearchClientTable({ 
  clients, 
  isLoading = false, 
  onEditClient,
  serverPagination = false,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
}: ResearchClientTableProps) {
  const [clientToDelete, setClientToDelete] = useState<IResearchClient | null>(null);
  const deleteClientMutation = useDeleteResearchClient();

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClientMutation.mutateAsync(clientToDelete.id);
      setClientToDelete(null);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const columns = useMemo<ColumnDef<IResearchClient>[]>(() => [
    {
      accessorKey: "profile.firstName",
      header: "Cliente",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.profile.firstName} {row.original.profile.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.profile.career}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "profile.documentNumber",
      header: "Documento",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{row.original.profile.documentType}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.profile.documentNumber}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "profile.phone",
      header: "Teléfono",
    },
    {
      accessorKey: "profile.university",
      header: "Universidad",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.original.profile.university}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.profile.faculty}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "profile.academicDegree",
      header: "Grado",
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.original.isActive),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha Registro",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditClient(row.original);
            }}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setClientToDelete(row.original);
            }}
            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [onEditClient]);

  return (
    <>
      <DataTable
        data={clients}
        columns={columns}
        isLoading={isLoading}
        title="Clientes de Investigación"
        noDataMessage="No se encontraron clientes de investigación"
        enablePagination={true}
        enableSorting={true}
        pageSize={10}
        // Props para paginación del servidor
        serverPagination={serverPagination}
        paginationMeta={paginationMeta}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar al cliente{' '}
              <span className="font-semibold">
                {clientToDelete?.profile.firstName} {clientToDelete?.profile.lastName}
              </span>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteClientMutation.isPending}
            >
              {deleteClientMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}