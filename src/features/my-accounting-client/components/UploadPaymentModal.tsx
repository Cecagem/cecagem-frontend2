"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePayment } from "../hooks/usePayments";
import { PaymentMethod } from "../types/payment.types";

const paymentSchema = z.object({
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  currency: z.enum(["PEN", "USD"], {
    message: "Selecciona una moneda válida",
  }),
  method: z.nativeEnum(PaymentMethod, {
    message: "Selecciona un método de pago",
  }),
  reference: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface UploadPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installmentId: string;
  installmentAmount: number;
  installmentCurrency: string;
}

const paymentMethodLabels = {
  [PaymentMethod.CASH]: "Efectivo",
  [PaymentMethod.BANK_TRANSFER]: "Transferencia Bancaria",
  [PaymentMethod.CARD]: "Tarjeta",
  [PaymentMethod.YAPE]: "Yape",
  [PaymentMethod.PLIN]: "Plin",
  [PaymentMethod.OTHER]: "Otro",
};

const currencyOptions = [
  { value: "PEN", label: "PEN - Soles" },
  { value: "USD", label: "USD - Dólares" },
];

export function UploadPaymentModal({
  open,
  onOpenChange,
  installmentId,
  installmentAmount,
  installmentCurrency,
}: UploadPaymentModalProps) {
  const createPaymentMutation = useCreatePayment();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: installmentAmount,
      currency: installmentCurrency as "PEN" | "USD",
      method: PaymentMethod.BANK_TRANSFER,
      reference: "",
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      await createPaymentMutation.mutateAsync({
        installmentId,
        ...data,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir Comprobante de Pago</DialogTitle>
          <DialogDescription>
            Completa la información del pago realizado. El pago será verificado por el equipo administrativo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Monto - Campo completo */}
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
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Moneda - Campo completo */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Método de Pago - Campo completo */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(paymentMethodLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de Operación - Campo completo */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Operación (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el número de operación"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createPaymentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createPaymentMutation.isPending}
              >
                {createPaymentMutation.isPending ? "Enviando..." : "Enviar Pago"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}