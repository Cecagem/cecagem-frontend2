import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";
import type { ICreatePaymentDto} from "../types/payment.types";
import { useToast } from "@/hooks/use-toast";

// Query keys para pagos
export const PAYMENT_QUERY_KEYS = {
  all: ["accounting-payments"] as const,
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
      // Invalidar cache de pagos de la cuota específica
      await queryClient.invalidateQueries({ 
        queryKey: PAYMENT_QUERY_KEYS.byInstallment(variables.installmentId) 
      });
      
      // Invalidar todas las queries de pagos
      await queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      
      // Invalidar TODAS las queries de empresas (incluyendo las que tienen filtros)
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === 'accounting-clients';
        }
      });
      
      // Refrescar inmediatamente todas las queries de empresas activas
      await queryClient.refetchQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === 'accounting-clients';
        },
        type: 'active'
      });
      
      // Mostrar notificación de éxito
      showSuccess("created", {
        title: "Pago enviado",
        description: "El pago ha sido enviado para verificación exitosamente"
      });
      
      return response;
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
      showError("error", {
        title: "Error al enviar pago",
        description: error?.message || "No se pudo enviar el pago para verificación"
      });
    },
  });
};