"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DollarSign, CreditCard, Plus, Trash2, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/shared";
import { Badge } from "@/components/ui/badge";

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
  // Nuevas props para manejar colaboradores externos
  collaboratorId?: string;
  collaboratorRole?: string;
  contractName?: string;
}

export const ContractFormStep3 = ({ 
  initialData, 
  onNext, 
  onBack, 
  collaboratorId, 
  collaboratorRole, 
  contractName 
}: ContractFormStep3Props) => {
  const [installments, setInstallments] = useState<InstallmentData[]>(
    initialData?.installments || []
  );
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(
    initialData?.installments?.length || 2
  );
  const [collaboratorPayments, setCollaboratorPayments] = useState<CollaboratorPaymentData[]>(
    initialData?.collaboratorPayments || []
  );

  // Verificar si el colaborador es externo
  const isExternalCollaborator = collaboratorRole === "COLLABORATOR_EXTERNAL";

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      costTotal: initialData?.costTotal || 0,
      currency: initialData?.currency || "PEN",
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días después
      paymentType: initialData?.paymentType || "cash",
      installments: installments,
      collaboratorPayments: collaboratorPayments,
    },
  });

  const watchedPaymentType = form.watch("paymentType");
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");
  const watchedCostTotal = form.watch("costTotal");

  // Inicializar pago de colaborador externo cuando cambie la fecha final
  useEffect(() => {
    if (isExternalCollaborator && collaboratorId && contractName && watchedEndDate) {
      if (collaboratorPayments.length === 0) {
        const newCollaboratorPayment: CollaboratorPaymentData = {
          userId: collaboratorId,
          amount: 0,
          dueDate: watchedEndDate,
          description: `Pago colaborador - ${contractName}`,
        };
        setCollaboratorPayments([newCollaboratorPayment]);
        form.setValue("collaboratorPayments", [newCollaboratorPayment]);
      } else {
        // Actualizar la fecha de vencimiento si ya existe
        const updatedPayments = collaboratorPayments.map(payment => ({
          ...payment,
          dueDate: watchedEndDate,
        }));
        setCollaboratorPayments(updatedPayments);
        form.setValue("collaboratorPayments", updatedPayments);
      }
    }
  }, [isExternalCollaborator, collaboratorId, contractName, watchedEndDate, form]);

  // Calcular cuotas automáticamente
  const calculateInstallments = useCallback(() => {
    if (watchedPaymentType === "installments" && watchedStartDate && watchedEndDate && watchedCostTotal > 0 && numberOfInstallments > 0) {
      // Generar cuotas automáticas con distribución equitativa
      const baseAmount = Math.floor((watchedCostTotal / numberOfInstallments) * 100) / 100;
      const remainder = Math.round((watchedCostTotal - (baseAmount * numberOfInstallments)) * 100) / 100;
      const newInstallments: InstallmentData[] = [];
      
      // Calcular distribución temporal uniforme
      const totalDays = Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysBetweenInstallments = Math.ceil(totalDays / numberOfInstallments);
      
      for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = new Date(watchedStartDate);
        dueDate.setDate(dueDate.getDate() + (daysBetweenInstallments * (i + 1)));
        
        // La última cuota incluye el remainder para cuadrar el total exacto
        const amount = i === numberOfInstallments - 1 ? baseAmount + remainder : baseAmount;
        
        newInstallments.push({
          description: `Cuota ${i + 1} de ${numberOfInstallments}`,
          amount: amount,
          dueDate,
        });
      }
      
      setInstallments(newInstallments);
      form.setValue("installments", newInstallments);
    }
  }, [watchedPaymentType, watchedStartDate, watchedEndDate, watchedCostTotal, numberOfInstallments, form]);

  // Ejecutar cálculo cuando cambien los parámetros
  useEffect(() => {
    calculateInstallments();
  }, [calculateInstallments]);

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
  };

  const removeInstallment = (index: number) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
    form.setValue("installments", newInstallments);
  };

  const updateInstallment = (index: number, field: keyof InstallmentData, value: string | number | Date) => {
    const newInstallments = [...installments];
    newInstallments[index] = { ...newInstallments[index], [field]: value };
    setInstallments(newInstallments);
    form.setValue("installments", newInstallments);
  };

  const updateCollaboratorPayment = (index: number, field: keyof CollaboratorPaymentData, value: string | number | Date) => {
    const newPayments = [...collaboratorPayments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setCollaboratorPayments(newPayments);
    form.setValue("collaboratorPayments", newPayments);
  };

  const handleSubmit = (data: Step3FormData) => {
    // Si es pago en cuotas, usar las cuotas configuradas
    if (data.paymentType === "installments") {
      data.installments = installments;
    } else {
      // Si es pago al contado, crear una sola cuota
      data.installments = [{
        description: "Pago único",
        amount: data.costTotal,
        dueDate: data.endDate,
      }];
    }
    
    // Agregar pagos de colaborador si es externo
    if (isExternalCollaborator) {
      data.collaboratorPayments = collaboratorPayments;
    }
    
    onNext(data);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          {/* Información de Costos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo Total *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormLabel>Moneda *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Fechas del Proyecto */}
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

          {/* Pago de Colaborador Externo */}
          {isExternalCollaborator && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Pago de Colaborador Externo
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
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Fecha de Pago *</label>
                        <DateInput
                          value={payment.dueDate}
                          onChange={(date) => updateCollaboratorPayment(index, "dueDate", date)}
                          placeholder="Seleccionar fecha"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Descripción *</label>
                      <Input
                        value={payment.description}
                        onChange={(e) => updateCollaboratorPayment(index, "description", e.target.value)}
                        placeholder="Descripción del pago"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Configuración de Pagos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Configuración de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Pago *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {/* Selector de número de cuotas */}
              {watchedPaymentType === "installments" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Número de Cuotas *</label>
                    <Select 
                      value={numberOfInstallments.toString()} 
                      onValueChange={(value) => setNumberOfInstallments(Number(value))}
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
                      onClick={calculateInstallments}
                      className="w-full"
                    >
                      Recalcular Cuotas
                    </Button>
                  </div>
                </div>
              )}

              {/* Cuotas (solo si es pago en cuotas) */}
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
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Cuota
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {installments.map((installment, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Cuota {index + 1}</h5>
                          {installments.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeInstallment(index)}
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
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Monto</label>
                            <Input
                              type="number"
                              value={installment.amount}
                              onChange={(e) => updateInstallment(index, "amount", Number(e.target.value))}
                              placeholder="0.00"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Fecha de Vencimiento</label>
                            <DateInput
                              value={installment.dueDate}
                              onChange={(date) => updateInstallment(index, "dueDate", date)}
                              placeholder="Seleccionar fecha"
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

          {/* Botones de navegación */}
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