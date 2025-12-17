"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DollarSign, CreditCard, Plus, Trash2, User, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EditRestrictions } from "./NewContractForm";

// Schema de validación para el paso 3
const installmentSchema = z.object({
  description: z.string().min(1, "La descripción es obligatoria"),
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  dueDate: z.date(),
});

const collaboratorPaymentSchema = z.object({
  userId: z.string().min(1, "El ID del colaborador es obligatorio"),
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  dueDate: z.date(),
  description: z.string().min(1, "La descripción es obligatoria"),
});

const step3Schema = z.object({
  costTotal: z.number().min(1, "El costo total debe ser mayor a 0"),
  currency: z.enum(["PEN", "USD"]),
  startDate: z.date(),
  endDate: z.date(),
  paymentType: z.enum(["cash", "installments"]),
  installments: z.array(installmentSchema).optional(),
  collaboratorPayments: z.array(collaboratorPaymentSchema).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate < data.endDate;
  }
  return true;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
});

export type Step3FormData = z.infer<typeof step3Schema>;
export type InstallmentData = z.infer<typeof installmentSchema>;
export type CollaboratorPaymentData = z.infer<typeof collaboratorPaymentSchema>;

interface ContractFormStep3Props {
  initialData?: Partial<Step3FormData>;
  onNext: (data: Step3FormData) => void;
  onBack: () => void;
  collaboratorId?: string;
  collaboratorRole?: string;
  contractName?: string;
  editRestrictions?: EditRestrictions;
}

export const ContractFormStep3 = ({ 
  initialData, 
  onNext, 
  onBack, 
  collaboratorId, 
  collaboratorRole, 
  contractName,
  editRestrictions
}: ContractFormStep3Props) => {
  const [installments, setInstallments] = useState<InstallmentData[]>(
    initialData?.installments?.map(inst => ({
      ...inst,
      dueDate: new Date(inst.dueDate.getTime())
    })) || []
  );
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(
    initialData?.installments?.length || 2
  );
  const [hasManuallyEditedInstallments, setHasManuallyEditedInstallments] = useState<boolean>(
    (initialData?.installments?.length || 0) > 0
  );
  const [collaboratorPayments, setCollaboratorPayments] = useState<CollaboratorPaymentData[]>(
    initialData?.collaboratorPayments?.map(pay => ({
      ...pay,
      dueDate: new Date(pay.dueDate.getTime())
    })) || []
  );

  const isExternalCollaborator = collaboratorRole === "COLLABORATOR_EXTERNAL";

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      costTotal: initialData?.costTotal || 0,
      currency: initialData?.currency || "PEN",
      startDate: initialData?.startDate ? new Date(initialData.startDate.getTime()) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate.getTime()) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentType: initialData?.paymentType || "cash",
      installments: installments.map(inst => ({
        ...inst,
        dueDate: new Date(inst.dueDate.getTime())
      })),
      collaboratorPayments: collaboratorPayments.map(pay => ({
        ...pay,
        dueDate: new Date(pay.dueDate.getTime())
      })),
    },
  });

  const watchedPaymentType = form.watch("paymentType");
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");
  const watchedCostTotal = form.watch("costTotal");

  // Inicializar pago de colaborador externo cuando cambie la fecha final
  useEffect(() => {
    if (isExternalCollaborator && collaboratorId && contractName && watchedEndDate) {
      setCollaboratorPayments(prevPayments => {
        if (prevPayments.length === 0) {
          const newCollaboratorPayment: CollaboratorPaymentData = {
            userId: collaboratorId,
            amount: 0,
            dueDate: new Date(watchedEndDate.getTime()),
            description: `Pago colaborador - ${contractName}`,
          };
          form.setValue("collaboratorPayments", [newCollaboratorPayment]);
          return [newCollaboratorPayment];
        }
        return prevPayments;
      });
    }
  }, [isExternalCollaborator, collaboratorId, contractName, watchedEndDate, form]);

  // ✅ NUEVA FUNCIÓN: Calcular cuotas mensuales desde la fecha de inicio
  const calculateInstallments = useCallback(() => {
    if (watchedPaymentType === "installments" && watchedStartDate && watchedCostTotal > 0 && numberOfInstallments > 0) {
      // Calcular monto base y residuo
      const baseAmount = Math.floor((watchedCostTotal / numberOfInstallments) * 100) / 100;
      const remainder = Math.round((watchedCostTotal - (baseAmount * numberOfInstallments)) * 100) / 100;
      const newInstallments: InstallmentData[] = [];
      
      // 🔧 FIX: Extraer componentes de fecha directamente para evitar conversiones de zona horaria
      const startYear = watchedStartDate.getFullYear();
      const startMonth = watchedStartDate.getMonth();
      const startDay = watchedStartDate.getDate();
      
      for (let i = 0; i < numberOfInstallments; i++) {
        // Calcular el mes y año de cada cuota (sumando i meses)
        let targetMonth = startMonth + i;
        let targetYear = startYear;
        
        // Ajustar año si el mes excede 11 (diciembre)
        while (targetMonth > 11) {
          targetMonth -= 12;
          targetYear += 1;
        }
        
        // 🔧 FIX: Calcular el último día del mes de destino
        // Usando new Date(año, mes+1, 0) que retorna el último día del mes
        const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        
        // Si el día de inicio no existe en el mes destino, usar el último día disponible
        const targetDay = Math.min(startDay, lastDayOfMonth);
        
        // 🔧 FIX CRÍTICO: Crear fecha usando el constructor de Date con componentes individuales
        // y forzar hora a mediodía local (no UTC) para evitar cambios de día
        const dueDate = new Date(targetYear, targetMonth, targetDay);
        dueDate.setHours(12, 0, 0, 0);
        
        // La última cuota incluye el remainder para cuadrar el total exacto
        const amount = i === numberOfInstallments - 1 ? baseAmount + remainder : baseAmount;
        
        newInstallments.push({
          description: `Cuota ${i + 1} de ${numberOfInstallments}`,
          amount: amount,
          dueDate: dueDate,
        });
      }
      
      setInstallments(newInstallments);
      form.setValue("installments", newInstallments);
      setHasManuallyEditedInstallments(true);
    }
  }, [watchedPaymentType, watchedStartDate, watchedCostTotal, numberOfInstallments, form]);

  // Ejecutar cálculo cuando cambien los parámetros (solo si no se ha editado manualmente)
  useEffect(() => {
    if (!hasManuallyEditedInstallments && watchedPaymentType === "installments") {
      calculateInstallments();
    }
  }, [calculateInstallments, hasManuallyEditedInstallments, watchedPaymentType]);

  // Calcular automáticamente cuando se cambia a "installments"
  useEffect(() => {
    if (watchedPaymentType === "installments" && installments.length === 0) {
      calculateInstallments();
    }
  }, [watchedPaymentType, installments.length, calculateInstallments]);

  const addInstallment = () => {
    const newInstallment: InstallmentData = {
      description: `Cuota ${installments.length + 1}`,
      amount: 0,
      dueDate: new Date(),
    };
    
    const newInstallments = [...installments, newInstallment];
    setInstallments(newInstallments);
    form.setValue("installments", newInstallments);
    setHasManuallyEditedInstallments(true);
  };

  const removeInstallment = (index: number) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
    form.setValue("installments", newInstallments);
    setHasManuallyEditedInstallments(true);
  };

  const updateInstallment = (index: number, field: keyof InstallmentData, value: string | number | Date) => {
    const newInstallments = [...installments];
    const finalValue = value instanceof Date ? new Date(value.getTime()) : value;
    newInstallments[index] = { ...newInstallments[index], [field]: finalValue };
    setInstallments(newInstallments);
    form.setValue("installments", newInstallments);
    setHasManuallyEditedInstallments(true);
  };

  const updateCollaboratorPayment = (index: number, field: keyof CollaboratorPaymentData, value: string | number | Date) => {
    const newPayments = [...collaboratorPayments];
    const finalValue = value instanceof Date ? new Date(value.getTime()) : value;
    newPayments[index] = { ...newPayments[index], [field]: finalValue };
    setCollaboratorPayments(newPayments);
    form.setValue("collaboratorPayments", newPayments);
  };

  const handleSubmit = (data: Step3FormData) => {
    const safeData = {
      ...data,
      startDate: new Date(data.startDate.getTime()),
      endDate: new Date(data.endDate.getTime()),
    };
    
    if (safeData.paymentType === "installments") {
      safeData.installments = installments.map(inst => ({
        ...inst,
        dueDate: new Date(inst.dueDate.getTime())
      }));
    } else {
      safeData.installments = [{
        description: "Pago único",
        amount: safeData.costTotal,
        dueDate: new Date(safeData.endDate.getTime()),
      }];
    }
    
    if (isExternalCollaborator) {
      safeData.collaboratorPayments = collaboratorPayments.map(payment => ({
        ...payment,
        dueDate: new Date(payment.dueDate.getTime())
      }));
    }
    
    onNext(safeData);
  };

  const totalInstallments = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const installmentsDifference = watchedCostTotal - totalInstallments;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Fechas y Configuración de Pagos</h2>
        <p className="text-muted-foreground">
          Configure las fechas del proyecto y el esquema de pagos
        </p>
      </div>

      {editRestrictions && (!editRestrictions.canEditInstallments || !editRestrictions.canEditCollaboratorPayments) && (
        <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Campos con restricciones:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {!editRestrictions.canEditInstallments && (
                <li>
                  <strong>🔒 Información financiera y cuotas bloqueadas:</strong> Ya existen pagos completados del cliente. 
                  El costo total, moneda y cuotas no se pueden modificar.
                </li>
              )}
              {!editRestrictions.canEditCollaboratorPayments && (
                <li>
                  <strong>🔒 Pagos del colaborador bloqueados:</strong> El colaborador ya tiene pagos completados. 
                  Sus cuotas no se modificarán al guardar.
                </li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          <Card className={editRestrictions && !editRestrictions.canEditInstallments ? "opacity-75" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información Financiera
                {editRestrictions && !editRestrictions.canEditInstallments && (
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    🔒 Bloqueado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Costo Total *
                        {editRestrictions && !editRestrictions.canEditInstallments && (
                          <span className="text-xs text-amber-600">(No modificable)</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={editRestrictions && !editRestrictions.canEditInstallments}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Moneda *
                        {editRestrictions && !editRestrictions.canEditInstallments && (
                          <span className="text-xs text-amber-600">(No modificable)</span>
                        )}
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={editRestrictions && !editRestrictions.canEditInstallments}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PEN">Soles (PEN)</SelectItem>
                          <SelectItem value="USD">Dólares (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inicio *</FormLabel>
                      <FormControl>
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de inicio"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Finalización *</FormLabel>
                      <FormControl>
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de fin"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {isExternalCollaborator && (
            <Card className={editRestrictions && !editRestrictions.canEditCollaboratorPayments ? "opacity-75" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Pago de Colaborador Externo
                  {editRestrictions && !editRestrictions.canEditCollaboratorPayments && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      🔒 Bloqueado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {collaboratorPayments.map((payment, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Monto del Pago *</label>
                        <Input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => updateCollaboratorPayment(index, "amount", Number(e.target.value))}
                          placeholder="0.00"
                          disabled={editRestrictions && !editRestrictions.canEditCollaboratorPayments}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Fecha de Pago *</label>
                        <DateInput
                          value={payment.dueDate}
                          onChange={(date) => updateCollaboratorPayment(index, "dueDate", date)}
                          placeholder="Seleccionar fecha"
                          disabled={editRestrictions && !editRestrictions.canEditCollaboratorPayments}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Descripción *</label>
                      <Input
                        value={payment.description}
                        onChange={(e) => updateCollaboratorPayment(index, "description", e.target.value)}
                        placeholder="Descripción del pago"
                        disabled={editRestrictions && !editRestrictions.canEditCollaboratorPayments}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className={editRestrictions && !editRestrictions.canEditInstallments ? "opacity-75" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Configuración de Pagos del Cliente
                {editRestrictions && !editRestrictions.canEditInstallments && (
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    🔒 Bloqueado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Pago *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={editRestrictions && !editRestrictions.canEditInstallments}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Pago al Contado</SelectItem>
                        <SelectItem value="installments">Pago en Cuotas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedPaymentType === "installments" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Número de Cuotas *</label>
                    <Select 
                      value={numberOfInstallments.toString()} 
                      onValueChange={(value) => {
                        setNumberOfInstallments(Number(value));
                        setHasManuallyEditedInstallments(false);
                      }}
                      disabled={editRestrictions && !editRestrictions.canEditInstallments}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cuotas" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} cuotas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setHasManuallyEditedInstallments(false);
                        calculateInstallments();
                      }}
                      className="w-full"
                      disabled={editRestrictions && !editRestrictions.canEditInstallments}
                    >
                      Recalcular Cuotas
                    </Button>
                  </div>
                </div>
              )}

              {watchedPaymentType === "installments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Cronograma de Cuotas ({installments.length} cuotas)</h4>
                    <div className="flex items-center gap-2">
                      {installmentsDifference !== 0 && (
                        <Badge variant={installmentsDifference > 0 ? "destructive" : "secondary"}>
                          {installmentsDifference > 0 ? "Faltan" : "Sobran"}: {Math.abs(installmentsDifference).toFixed(2)}
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addInstallment}
                        disabled={editRestrictions && !editRestrictions.canEditInstallments}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Cuota
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {installments.map((installment, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${editRestrictions && !editRestrictions.canEditInstallments ? 'opacity-60' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Cuota {index + 1}</h5>
                          {installments.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeInstallment(index)}
                              disabled={editRestrictions && !editRestrictions.canEditInstallments}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-sm font-medium">Descripción</label>
                            <Input
                              value={installment.description}
                              onChange={(e) => updateInstallment(index, "description", e.target.value)}
                              placeholder="Descripción de la cuota"
                              disabled={editRestrictions && !editRestrictions.canEditInstallments}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Monto</label>
                            <Input
                              type="number"
                              value={installment.amount}
                              onChange={(e) => updateInstallment(index, "amount", Number(e.target.value))}
                              placeholder="0.00"
                              disabled={editRestrictions && !editRestrictions.canEditInstallments}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Fecha de Vencimiento</label>
                            <DateInput
                              value={installment.dueDate}
                              onChange={(date) => updateInstallment(index, "dueDate", date)}
                              placeholder="Seleccionar fecha"
                              disabled={editRestrictions && !editRestrictions.canEditInstallments}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {installments.length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total en Cuotas:</span>
                        <span className="font-bold">
                          {totalInstallments.toFixed(2)} {form.watch("currency")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Anterior: Entregables
            </Button>
            
            <Button
              type="submit"
              disabled={watchedPaymentType === "installments" && installmentsDifference !== 0}
            >
              Siguiente: Resumen
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
