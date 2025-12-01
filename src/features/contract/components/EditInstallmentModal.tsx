"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { IContractInstallment, IUpdateInstallmentDto } from "../types";
import { useUpdateInstallment } from "../hooks/useContracts";

// Función para parsear fecha ISO a string formato yyyy-MM-dd
const parseISOToDateString = (dateString: string): string => {
  return dateString.split('T')[0];
};

// Schema de validación
const editInstallmentSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  dueDate: z.string().min(1, "La fecha de vencimiento es requerida"),
});

type EditInstallmentFormData = z.infer<typeof editInstallmentSchema>;

interface EditInstallmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installment: IContractInstallment | null;
  contractId: string;
}

export const EditInstallmentModal = ({
  open,
  onOpenChange,
  installment,
  contractId,
}: EditInstallmentModalProps) => {
  const updateInstallmentMutation = useUpdateInstallment();

  const form = useForm<EditInstallmentFormData>({
    resolver: zodResolver(editInstallmentSchema),
    defaultValues: {
      description: "",
      amount: 0,
      dueDate: "",
    },
  });

  // Actualizar el formulario cuando cambie la cuota seleccionada
  useEffect(() => {
    if (installment) {
      form.reset({
        description: installment.description,
        amount: installment.amount,
        dueDate: parseISOToDateString(installment.dueDate),
      });
    }
  }, [installment, form]);

  const onSubmit = async (data: EditInstallmentFormData) => {
    if (!installment) return;

    const updateData: IUpdateInstallmentDto = {
      description: data.description,
      amount: data.amount,
      dueDate: data.dueDate,
    };

    try {
      await updateInstallmentMutation.mutateAsync({
        contractId,
        installmentId: installment.id,
        data: updateData,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error al actualizar cuota:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editar Cuota</DialogTitle>
          <DialogDescription>
            Modifica los datos de la cuota. Los cambios se guardarán
            automáticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cuota 1 de 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateInstallmentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateInstallmentMutation.isPending}
              >
                {updateInstallmentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
