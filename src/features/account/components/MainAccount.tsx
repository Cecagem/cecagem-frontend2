"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { AccountStatsCards, AccountFilters, AccountTable, AccountForm } from "./index";
import { 
  useTransactions, 
  useTransactionStats, 
  useCreateTransaction, 
  useUpdateTransaction, 
  useDeleteTransaction 
} from "../hooks/use-account";
import type { 
  Transaction, 
  TransactionFilters, 
  CreateTransactionRequest, 
  UpdateTransactionRequest 
} from "../types/account.types";

export const MainAccount = () => {
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({
    page: 1,
    limit: 10,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Queries
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(filters);
  const { data: stats, isLoading: statsLoading } = useTransactionStats();

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleFiltersChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    // Aquí podrías abrir un modal de vista detallada
    toast.info(`Viendo transacción: ${transaction.description}`);
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

  const handleFormSubmit = (data: CreateTransactionRequest | UpdateTransactionRequest) => {
    if (formMode === "create") {
      createMutation.mutate(data as CreateTransactionRequest, {
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
        { id: selectedTransaction.id, data: data as UpdateTransactionRequest },
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

  const defaultStats = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0,
    transactionCount: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contabilidad</h1>
            <p className="text-muted-foreground">
              Gestiona tus ingresos y gastos personales
            </p>
          </div>
          <Button onClick={handleCreateTransaction} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Transacción
          </Button>
        </div>

        <AccountStatsCards
          stats={stats || defaultStats}
          isLoading={statsLoading}
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
        transactions={transactionsData?.transactions || []}
        isLoading={transactionsLoading}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onView={handleViewTransaction}
      />

      {/* Dialog para crear/editar transacción */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AccountForm
            transaction={selectedTransaction || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
            mode={formMode}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La transacción será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
    </div>
  );
};