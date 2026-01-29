import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";
import type { ICreatePaymentDto} from "../types/payment.types";
import { useToast } from "@/hooks/use-toast";
import { transactionKeys } from "../../account/hooks/use-account";

// Query keys para cache de pagos
export const PAYMENT_QUERY_KEYS = {
  all: ["payments"] as const,
  lists: () => [...PAYMENT_QUERY_KEYS.all, "list"] as const,
  byInstallment: (installmentId: string) =>
    [...PAYMENT_QUERY_KEYS.lists(), "installment", installmentId] as const,
};

// Hook para crear un pago
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: ICreatePaymentDto) => paymentService.createPayment(data),
    onSuccess: async (response, variables) => {
      // Invalidar cache de pagos
      await queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.byInstallment(variables.installmentId)
      });
      await queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });

      // Invalidar contratos
      await queryClient.invalidateQueries({ queryKey: ["contracts"] });

      // 🆕 INVALIDAR Y REFRESCAR TRANSACCIONES
      await queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: transactionKeys.summary() });

      // 🆕 FORZAR REFETCH INMEDIATO DEL SUMMARY
      await queryClient.refetchQueries({
        queryKey: transactionKeys.summary(),
        exact: true
      });

      showSuccess("created", {
        title: "Pago enviado",
        description: "El pago ha sido enviado para verificación exitosamente"
      });

      return response;
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al enviar pago",
        description: error?.message || "No se pudo enviar el pago para verificación"
      });
    },
  });
};
