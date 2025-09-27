import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";
import type { ICreatePaymentDto, IUpdatePaymentDto } from "../types/payment.types";
import { useToast } from "@/hooks/use-toast";

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
      // Invalidar cache de pagos de la cuota específica
      await queryClient.invalidateQueries({ 
        queryKey: PAYMENT_QUERY_KEYS.byInstallment(variables.installmentId) 
      });
      
      // Invalidar todas las queries de pagos
      await queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      
      // También invalidar queries de contratos para actualizar el estado general
      await queryClient.invalidateQueries({ queryKey: ["contracts"] });
      
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

// Hook para actualizar un pago (para colaboradores que validan pagos recibidos)
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: IUpdatePaymentDto }) => 
      paymentService.updatePayment(paymentId, data),
    onSuccess: async (response) => {
      // Invalidar todas las queries de pagos
      await queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      
      // También invalidar queries de contratos para actualizar el estado general
      await queryClient.invalidateQueries({ queryKey: ["contracts"] });
      
      // Refrescar los datos inmediatamente
      await queryClient.refetchQueries({ 
        queryKey: ["contracts"],
        exact: false 
      });
      
      // Mostrar notificación de éxito
      const statusText = response.status === "COMPLETED" ? "confirmado" : 
                        response.status === "FAILED" ? "rechazado" : "actualizado";
      showSuccess("updated", { 
        title: "Pago actualizado",
        description: `El pago ha sido ${statusText} exitosamente`
      });
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
      showError("error", {
        title: "Error al actualizar pago",
        description: error?.message || "No se pudo actualizar el pago"
      });
    },
  });
};