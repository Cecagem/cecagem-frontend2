import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { IContract } from "../types/contract.type";

interface ContractDeleteDialogProps {
  isOpen: boolean;
  contract: IContract | null;
  onClose: () => void;
  onConfirm: (contractId: string) => void;
  isLoading?: boolean;
}

export const ContractDeleteDialog = ({
  isOpen,
  contract,
  onClose,
  onConfirm,
  isLoading = false,
}: ContractDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar contrato?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            contrato
            {contract && (
              <>
                {" "}
                <strong>&ldquo;{contract.name}&rdquo;</strong>
              </>
            )}{" "}
            y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => contract && onConfirm(contract.id)}
            disabled={isLoading || !contract}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
