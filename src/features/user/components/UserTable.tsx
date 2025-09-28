"use client";

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Eye,
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
import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from "@tanstack/react-table";

import { useDeleteUser } from '../hooks/use-users';
import type { IUser } from '../types/user.types';
import { UserRole, requiresContract } from '../types/user.types';
import { UserViewDialog } from './UserViewDialog';

interface UserTableProps {
  users: IUser[];
  isLoading?: boolean;
  onEditUser: (user: IUser) => void;
  // Props para paginación del servidor
  serverPagination?: boolean;
  paginationMeta?: ServerPaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function UserTable({ 
  users, 
  isLoading = false, 
  onEditUser,
  // Props para paginación del servidor
  serverPagination = false,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
}: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [userToView, setUserToView] = useState<IUser | null>(null);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Crear la fecha considerando que viene en formato ISO y puede tener zona horaria
      const date = new Date(dateString);
      
      // Si la fecha viene con hora 00:00:00.000Z, tratarla como fecha local
      // para evitar problemas de zona horaria
      if (dateString.includes('T00:00:00')) {
        const dateParts = dateString.split('T')[0].split('-');
        const localDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        return format(localDate, 'dd/MM/yyyy', { locale: es });
      }
      
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      [UserRole.SUPER_ADMIN]: { label: 'Super Admin', variant: 'destructive' as const },
      [UserRole.ADMIN]: { label: 'Admin', variant: 'secondary' as const },
      [UserRole.COLLABORATOR_INTERNAL]: { label: 'Colaborador Interno', variant: 'default' as const },
      [UserRole.COLLABORATOR_EXTERNAL]: { label: 'Colaborador Externo', variant: 'outline' as const },
      [UserRole.RRHH]: { label: 'RRHH', variant: 'secondary' as const },
    };

    const config = roleConfig[role] || { label: role, variant: 'outline' as const };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
        {isActive ? "Activo" : "Inactivo"}
      </Badge>
    );
  };

  const columns = useMemo<ColumnDef<IUser>[]>(() => [
    {
      accessorKey: "profile",
      header: "Usuario",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="h-3 w-3 text-blue-500" />
            {row.original.profile.firstName} {row.original.profile.lastName}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {row.original.profile.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "document",
      header: "Documento",
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1">
            <CreditCard className="h-3 w-3 text-gray-500" />
            <span className="font-medium">{row.original.profile.documentType}</span>
          </div>
          <div className="text-muted-foreground">
            {row.original.profile.documentNumber}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "academic",
      header: "Información Académica",
      cell: ({ row }) => {
        const profile = row.original.profile;
        const hasAcademicInfo = profile.university || profile.faculty || profile.career || profile.academicDegree;
        
        if (!hasAcademicInfo) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Sin información académica
            </div>
          );
        }

        return (
          <div className="space-y-1 text-xs">
            {profile.university && (
              <div className="truncate max-w-[200px]" title={profile.university}>
                <strong>Universidad:</strong> {profile.university}
              </div>
            )}
            {profile.faculty && (
              <div className="truncate max-w-[200px]" title={profile.faculty}>
                <strong>Facultad:</strong> {profile.faculty}
              </div>
            )}
            {profile.career && (
              <div className="truncate max-w-[200px]" title={profile.career}>
                <strong>Carrera:</strong> {profile.career}
              </div>
            )}
            {profile.academicDegree && (
              <div>
                <strong>Grado:</strong> {profile.academicDegree}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      accessorKey: "contract",
      header: "Contrato",
      cell: ({ row }) => {
        const user = row.original;
        const hasContract = requiresContract(user.role);
        
        if (!hasContract) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Sin contrato
            </div>
          );
        }

        return (
          <div className="space-y-1 text-sm">
            {user.profile.salaryMonth ? (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-500" />
                <span className="font-medium">
                  {formatCurrency(user.profile.salaryMonth)}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                Sin salario definido
              </div>
            )}
            {user.profile.paymentDate ? (
              <div className="text-xs text-muted-foreground">
                Pago: {formatDate(user.profile.paymentDate)}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                Sin fecha de pago
              </div>
            )}
          </div>
        );
      },
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
            onClick={() => setUserToView(row.original)}
            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditUser(row.original)}
            className="h-8 px-2"
            title="Editar usuario"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUserToDelete(row.original)}
            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Eliminar usuario"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [onEditUser]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        title="Usuarios"
        noDataMessage="No se encontraron usuarios."
        enablePagination={true}
        enableSorting={true}
        pageSize={10}
        // Props para paginación del servidor
        serverPagination={serverPagination}
        paginationMeta={paginationMeta}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <UserViewDialog
        open={!!userToView}
        onOpenChange={(open) => !open && setUserToView(null)}
        user={userToView}
      />

      <AlertDialog 
        open={!!userToDelete} 
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el usuario{' '}
              <strong>
                {userToDelete?.profile.firstName} {userToDelete?.profile.lastName}
              </strong>{' '}
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}