"use client";

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Edit,
  Trash2,
  Building2,
  User,
} from 'lucide-react';

import { DataTable } from '@/components/shared/data-table';
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

import { useDeleteCompany } from '../hooks/use-accounting-clients';
import type { ICompany, IUserRelation } from "../types/accounting-clients.types";
import { CompanyExpandedView } from './CompanyExpandedView';

interface AccountingClientTableProps {
  data: ICompany[];
  isLoading?: boolean;
  onEdit?: (company: ICompany) => void;
  onDelete?: (company: ICompany) => void;
}

export const AccountingClientTable = ({
  data,
  isLoading = false,
  onEdit,
}: AccountingClientTableProps) => {
  const [companyToDelete, setCompanyToDelete] = useState<ICompany | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const deleteCompanyMutation = useDeleteCompany();

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;
    
    try {
      await deleteCompanyMutation.mutateAsync(companyToDelete.id);
      setCompanyToDelete(null);
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const calculateTotalRevenue = (userRelations: IUserRelation[]) => {
    return userRelations
      .filter(relation => relation.isActive)
      .reduce((total, relation) => total + relation.monthlyPayment, 0);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  const columns = useMemo<ColumnDef<ICompany>[]>(() => {
    const renderUserRelations = (userRelations: IUserRelation[]) => {
      if (userRelations.length === 0) {
        return (
          <div className="text-sm text-muted-foreground italic">
            Sin colaborador asignado
          </div>
        );
      }

      const activeRelations = userRelations.filter(relation => relation.isActive);
      
      return (
        <div className="space-y-1">
          {activeRelations.slice(0, 2).map((relation) => (
            <div key={relation.id} className="flex items-center gap-1 text-sm">
              <User className="h-3 w-3 text-green-500" />
              <span className="font-medium truncate max-w-[120px]">
                {relation.user.fullName}
              </span>
            </div>
          ))}
          {activeRelations.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{activeRelations.length - 2} más
            </div>
          )}
        </div>
      );
    };

    return [
      {
        accessorKey: "businessName",
        header: "Empresa",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium text-sm">{row.original.businessName}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.tradeName}
            </div>
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
              RUC: {row.original.ruc}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "contactName",
        header: "Contacto",
        cell: ({ row }) => (
          <div className="space-y-1 text-sm">
            <div className="font-medium">{row.original.contactName}</div>
            <div className="text-muted-foreground">{row.original.contactPhone}</div>
            <div className="text-muted-foreground truncate max-w-[150px]">
              {row.original.contactEmail}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Dirección",
        cell: ({ row }) => (
          <div className="text-sm truncate max-w-[200px]">
            {row.original.address}
          </div>
        ),
      },
      {
        accessorKey: "userRelations",
        header: "Colaboradores",
        cell: ({ row }) => renderUserRelations(row.original.userRelations),
      },
      {
        accessorKey: "revenue",
        header: "Ingresos",
        cell: ({ row }) => {
          const totalRevenue = calculateTotalRevenue(row.original.userRelations);
          return (
            <div className="text-sm">
              {totalRevenue > 0 ? (
                <Badge variant="secondary" className="font-mono">
                  {formatCurrency(totalRevenue)}
                </Badge>
              ) : (
                <span className="text-muted-foreground italic">
                  S/ 0.00
                </span>
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
              onClick={() => onEdit?.(row.original)}
              className="h-8 px-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompanyToDelete(row.original)}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];
  }, [onEdit]);

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        title="Empresas"
        icon={Building2}
        noDataMessage="No se encontraron empresas registradas"
        enablePagination={true}
        enableSorting={true}
        pageSize={10}
        selectedItem={selectedCompany}
        detailComponent={(company: ICompany) => <CompanyExpandedView company={company} />}
        detailTitle={(company: ICompany) => company.businessName}
        onRowClick={(company: ICompany) => {
          setSelectedCompany(selectedCompany?.id === company.id ? null : company);
        }}
      />

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={!!companyToDelete} onOpenChange={() => setCompanyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Empresa?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la empresa{' '}
              <span className="font-semibold">
                {companyToDelete?.businessName}
              </span>?
              Esta acción no se puede deshacer y eliminará todas las relaciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};