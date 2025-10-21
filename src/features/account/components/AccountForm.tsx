"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { 
  ITransaction, 
  ICreateTransactionDto, 
  IUpdateTransactionDto,
  TransactionStatus,
  TransactionType
} from "../types/account.types";
import { 
  TransactionType as TType, 
  TransactionStatus as TStatus
} from "../types/account.types";

interface AccountFormProps {
  transaction?: ITransaction;
  onSubmit: (data: ICreateTransactionDto | IUpdateTransactionDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const getStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "Pendiente",
    [TStatus.COMPLETED]: "Completado",
    [TStatus.CANCELED]: "Cancelado",
  };
  return labels[status];
};

const transactionSchema = z.object({
  tipo: z.string().min(1, "Seleccione un tipo de transacción"),
  categoria: z.string().min(1, "La categoría es requerida").max(50, "La categoría no puede exceder 50 caracteres"),
  currency: z.string().min(1, "Seleccione una moneda"),
  monto: z.string().min(1, "El monto es requerido").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "El monto debe ser un número positivo"),
  descripcion: z.string().min(1, "La descripción es requerida").max(200, "La descripción no puede exceder 200 caracteres"),
  fecha: z.string().min(1, "La fecha es requerida"),
  estado: z.string().min(1, "Seleccione un estado"),
  isRecurrent: z.boolean(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const AccountForm = ({
  transaction,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: AccountFormProps) => {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      tipo: transaction?.tipo || TType.INCOME,
      categoria: transaction?.categoria || "",
      currency: transaction?.currency || "PEN",
      monto: transaction?.monto || "",
      descripcion: transaction?.descripcion || "",
      fecha: transaction?.fecha ? new Date(transaction.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      estado: transaction?.estado || TStatus.COMPLETED,
      isRecurrent: transaction?.isRecurrent || false,
    },
  });

  // Actualizar el formulario cuando cambie la transacción
  useEffect(() => {
    if (transaction) {
      form.reset({
        tipo: transaction.tipo,
        categoria: transaction.categoria,
        currency: transaction.currency || "PEN",
        monto: transaction.monto?.toString() || "",
        descripcion: transaction.descripcion,
        fecha: new Date(transaction.fecha).toISOString().split('T')[0],
        estado: transaction.estado,
        isRecurrent: transaction.isRecurrent || false,
      });
    }
  }, [transaction, form]);

  const handleSubmit = (data: TransactionFormData) => {
    const submitData = {
      tipo: data.tipo as TransactionType,
      categoria: data.categoria,
      currency: data.currency,
      monto: data.monto,
      descripcion: data.descripcion,
      fecha: data.fecha,
      estado: data.estado as TransactionStatus,
      isRecurrent: data.isRecurrent,
    };
    onSubmit(submitData);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header fijo */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          {mode === "create" ? "Nueva Transacción" : "Editar Transacción"}
        </h2>
      </div>
      
      {/* Contenido del formulario con scroll */}
      <div className="flex-1 overflow-y-auto pr-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Tipo */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TType.INCOME}>Ingreso</SelectItem>
                        <SelectItem value={TType.EXPENSE}>Gasto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoría */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Categoría *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Salario, Comida, Transporte..."
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Moneda */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Moneda *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione una moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PEN">PEN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Monto */}
              <FormField
                control={form.control}
                name="monto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Monto *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Fecha */}
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Fecha *</FormLabel>
                  <FormControl>
                    <Input type="date" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            {/* Transacción Recurrente */}
            <FormField
              control={form.control}
              name="isRecurrent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Transacción Recurrente
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Esta transacción se repetirá mensualmente
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Estado *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese una descripción de la transacción..."
                      className="resize-none w-full min-h-[100px]"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="pt-6 border-t mt-8">
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {isLoading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};