"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { AccountStatsCards, AccountFilters, AccountTable, AccountForm, TransactionDetailsModal, ChangeStatusModal } from "./index";
import { 
  useTransactions, 
  useCreateTransaction, 
  useUpdateTransaction, 
  useUpdateTransactionStatus,
  useDeleteTransaction,
  useTransactionSummary
} from "../hooks/use-account";
import type { 
  ITransaction, 
  ITransactionFilters, 
  ICreateTransactionDto, 
  IUpdateTransactionDto,
  ITransactionStatsByCurrency
} from "../types/account.types";
import { 
  TransactionStatus,
} from "../types/account.types";

export const MainAccount = () => {
  const [filters, setFilters] = useState<Partial<ITransactionFilters>>({
    page: 1,
    limit: 10,
    sortBy: "fecha" as const,
    sortOrder: "desc" as const,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [transactionToChangeStatus, setTransactionToChangeStatus] = useState<ITransaction | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Query para datos paginados de la tabla
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(filters);
  
  // Query para el resumen de estadísticas desde la API
  const { data: summaryData, isLoading: summaryLoading } = useTransactionSummary();

  // Transformar datos de la API al formato esperado por el componente
  const statsData = useMemo((): ITransactionStatsByCurrency => {
    if (!summaryData) {
      return {
        pen: {
          currency: "PEN",
          totalBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          transactionCount: 0,
        },
        usd: {
          currency: "USD",
          totalBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          transactionCount: 0,
        },
      };
    }

    return {
      pen: {
        currency: "PEN",
        totalBalance: summaryData.pen.total,
        totalIncome: summaryData.pen.income,
        totalExpenses: summaryData.pen.expense,
        transactionCount: summaryData.pen.transactions,
      },
      usd: {
        currency: "USD",
        totalBalance: summaryData.usd.total,
        totalIncome: summaryData.usd.income,
        totalExpenses: summaryData.usd.expense,
        transactionCount: summaryData.usd.transactions,
      },
    };
  }, [summaryData]);

  const handleFiltersChange = (newFilters: Partial<ITransactionFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: filters.limit || 10 });
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ ...filters, limit: pageSize, page: 1 });
  };

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleViewTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleChangeStatus = (id: string) => {
    const transaction = transactionsData?.data?.find(t => t.id === id);
    if (transaction) {
      setTransactionToChangeStatus(transaction);
      setIsChangeStatusModalOpen(true);
    }
  };

  const handleConfirmStatusChange = (id: string, newStatus: TransactionStatus) => {
    updateStatusMutation.mutate(
      { id, estado: newStatus },
      {
        onSuccess: () => {
          toast.success("Estado actualizado correctamente");
          setIsChangeStatusModalOpen(false);
          setTransactionToChangeStatus(null);
        },
        onError: (error) => {
          toast.error(`Error al cambiar estado: ${error.message}`);
        },
      }
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete, {
        onSuccess: () => {
          toast.success("Transacción eliminada correctamente");
          setIsDeleteDialogOpen(false);
          setTransactionToDelete(null);
        },
        onError: (error) => {
          toast.error(`Error al eliminar transacción: ${error.message}`);
        },
      });
    }
  };

  const handleFormSubmit = (data: ICreateTransactionDto | IUpdateTransactionDto) => {
    if (formMode === "create") {
      createMutation.mutate(data as ICreateTransactionDto, {
        onSuccess: () => {
          toast.success("Transacción creada correctamente");
          setIsFormOpen(false);
        },
        onError: (error) => {
          toast.error(`Error al crear transacción: ${error.message}`);
        },
      });
    } else if (selectedTransaction) {
      updateMutation.mutate(
        { id: selectedTransaction.id, data: data as IUpdateTransactionDto },
        {
          onSuccess: () => {
            toast.success("Transacción actualizada correctamente");
            setIsFormOpen(false);
            setSelectedTransaction(null);
          },
          onError: (error) => {
            toast.error(`Error al actualizar transacción: ${error.message}`);
          },
        }
      );
    }
  };

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const updateStatusMutation = useUpdateTransactionStatus();
  const deleteMutation = useDeleteTransaction();

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ingresos y Egresos</h1>
            <p className="text-muted-foreground">
              Gestiona tus ingresos y gastos en soles y dólares
            </p>
          </div>
          <Button onClick={handleCreateTransaction} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Transacción
          </Button>
        </div>

        <AccountStatsCards
          stats={statsData}
          isLoading={summaryLoading}
        />
      </div>

      {/* Filtros */}
      <AccountFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        isLoading={transactionsLoading}
      />

      {/* Tabla de transacciones */}
      <AccountTable
        transactions={transactionsData?.data || []}
        isLoading={transactionsLoading}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onView={handleViewTransaction}
        onChangeStatus={handleChangeStatus}
        paginationMeta={transactionsData?.meta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Dialog para crear/editar transacción */}
      <Dialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
      >
        <DialogContent 
          className="max-w-4xl w-[95vw] max-h-[95vh] flex flex-col p-0"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">
            {formMode === "create" ? "Nueva Transacción" : "Editar Transacción"}
          </DialogTitle>
          <div className="flex-1 overflow-y-auto p-6">
            <AccountForm
              transaction={selectedTransaction || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={createMutation.isPending || updateMutation.isPending}
              mode={formMode}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={() => {}}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La transacción será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTransaction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de detalles de transacción */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTransaction(null);
        }}
      />

      {/* Modal para cambiar estado */}
      <ChangeStatusModal
        transaction={transactionToChangeStatus}
        isOpen={isChangeStatusModalOpen}
        onClose={() => {
          setIsChangeStatusModalOpen(false);
          setTransactionToChangeStatus(null);
        }}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
};