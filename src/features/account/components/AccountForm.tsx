"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest,
  TransactionCategory,
  TransactionStatus,
  TransactionType
} from "../types/account.types";
import { 
  TransactionType as TType, 
  TransactionCategory as TCategory, 
  TransactionStatus as TStatus 
} from "../types/account.types";

interface AccountFormProps {
  transaction?: Transaction;
  onSubmit: (data: CreateTransactionRequest | UpdateTransactionRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const getCategoryLabel = (category: TransactionCategory): string => {
  const labels: Record<TransactionCategory, string> = {
    // Ingresos
    [TCategory.SALARY]: "Salario",
    [TCategory.FREELANCE]: "Freelance",
    [TCategory.INVESTMENT]: "Inversión",
    [TCategory.BUSINESS]: "Negocio",
    [TCategory.OTHER_INCOME]: "Otros Ingresos",
    
    // Egresos
    [TCategory.FOOD]: "Comida",
    [TCategory.TRANSPORT]: "Transporte",
    [TCategory.UTILITIES]: "Servicios",
    [TCategory.ENTERTAINMENT]: "Entretenimiento",
    [TCategory.HEALTHCARE]: "Salud",
    [TCategory.EDUCATION]: "Educación",
    [TCategory.SHOPPING]: "Compras",
    [TCategory.RENT]: "Alquiler",
    [TCategory.OTHER_EXPENSE]: "Otros Gastos",
  };
  return labels[category];
};

const getStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "Pendiente",
    [TStatus.COMPLETED]: "Completado",
    [TStatus.CANCELLED]: "Cancelado",
  };
  return labels[status];
};

const incomeCategories = [TCategory.SALARY, TCategory.FREELANCE, TCategory.INVESTMENT, TCategory.BUSINESS, TCategory.OTHER_INCOME];
const expenseCategories = [TCategory.FOOD, TCategory.TRANSPORT, TCategory.UTILITIES, TCategory.ENTERTAINMENT, TCategory.HEALTHCARE, TCategory.EDUCATION, TCategory.SHOPPING, TCategory.RENT, TCategory.OTHER_EXPENSE];

const transactionSchema = z.object({
  type: z.string().min(1, "Seleccione un tipo de transacción"),
  category: z.string().min(1, "Seleccione una categoría"),
  amount: z.string().min(1, "El monto es requerido").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "El monto debe ser un número positivo"),
  description: z.string().min(1, "La descripción es requerida").max(200, "La descripción no puede exceder 200 caracteres"),
  date: z.string().min(1, "La fecha es requerida"),
  status: z.string().min(1, "Seleccione un estado"),
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
      type: transaction?.type || TType.INCOME,
      category: transaction?.category || TCategory.SALARY,
      amount: transaction?.amount.toString() || "",
      description: transaction?.description || "",
      date: transaction?.date || new Date().toISOString().split('T')[0],
      status: transaction?.status || TStatus.COMPLETED,
    },
  });

  const watchedType = form.watch("type");

  const handleSubmit = (data: TransactionFormData) => {
    const submitData = {
      type: data.type as TransactionType,
      category: data.category as TransactionCategory,
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date,
      status: data.status as TransactionStatus,
    };
    onSubmit(submitData);
  };

  const getAvailableCategories = (type: string) => {
    return type === TType.INCOME ? incomeCategories : expenseCategories;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">
        {mode === "create" ? "Nueva Transacción" : "Editar Transacción"}
      </h2>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset category when type changes
                        const newCategories = getAvailableCategories(value as TransactionType);
                        form.setValue("category", newCategories[0]);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableCategories(watchedType).map(category => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monto */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Estado */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese una descripción de la transacción..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
};