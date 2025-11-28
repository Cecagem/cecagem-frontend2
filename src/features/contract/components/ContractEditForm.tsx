"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import type { IContract } from '../types';

// Esquema de validación completo
const contractFormSchema = z.object({
  // Información básica del contrato
  serviceId: z.string().optional(),
  name: z.string()
    .min(1, 'El nombre del proyecto es obligatorio')
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  university: z.string()
    .min(1, 'La universidad es obligatoria')
    .min(3, 'La universidad debe tener al menos 3 caracteres')
    .max(100, 'La universidad no puede exceder 100 caracteres'),
  
  career: z.string()
    .min(1, 'La carrera es obligatoria')
    .min(3, 'La carrera debe tener al menos 3 caracteres')
    .max(100, 'La carrera no puede exceder 100 caracteres'),
  
  observation: z.string()
    .max(500, 'La observación no puede exceder 500 caracteres')
    .optional(),
  
  costTotal: z.number()
    .min(0, 'El costo total debe ser mayor o igual a 0')
    .max(1000000, 'El costo total no puede exceder 1,000,000'),
  
  currency: z.enum(['PEN', 'USD']),
  
  deliverablesPercentage: z.number()
    .min(0, 'El porcentaje debe ser mayor o igual a 0')
    .max(100, 'El porcentaje no puede exceder 100'),
  
  paymentPercentage: z.number()
    .min(0, 'El porcentaje debe ser mayor o igual a 0')
    .max(100, 'El porcentaje no puede exceder 100'),
  
  overallProgress: z.number()
    .min(0, 'El progreso debe ser mayor o igual a 0')
    .max(100, 'El progreso no puede exceder 100'),
  
  startDate: z.string()
    .min(1, 'La fecha de inicio es obligatoria'),
  
  endDate: z.string()
    .min(1, 'La fecha de fin es obligatoria'),
  
  // Cuotas (Installments) - CORREGIDO
  installments: z.array(z.object({
    id: z.string().optional(),
    description: z.string().min(1, 'La descripción es obligatoria'),
    amount: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
    dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
    userCompanyId: z.string().nullable().optional(), // ✅ CORREGIDO: acepta null
    contractUserId: z.string().optional(),
  })).optional(),
});

type ContractFormData = z.infer<typeof contractFormSchema>;

interface ContractEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractSaved: () => void;
  contract?: IContract | null;
  mode?: 'create' | 'edit';
}

export function ContractEditForm({
  open,
  onOpenChange,
  onContractSaved,
  contract = null,
  mode = 'edit'
}: ContractEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      serviceId: '',
      name: '',
      university: '',
      career: '',
      observation: '',
      costTotal: 0,
      currency: 'PEN',
      deliverablesPercentage: 0,
      paymentPercentage: 0,
      overallProgress: 0,
      startDate: '',
      endDate: '',
      installments: [],
    },
  });

  // Cargar datos del contrato para edición
  useEffect(() => {
    if (mode === 'edit' && contract && open) {
      const formatDateForInput = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0];
      };

      form.reset({
        serviceId: contract.serviceId || '',
        name: contract.name || '',
        university: contract.university || '',
        career: contract.career || '',
        observation: contract.observation || '',
        costTotal: contract.costTotal || 0,
        currency: contract.currency || 'PEN',
        deliverablesPercentage: contract.deliverablesPercentage || 0,
        paymentPercentage: contract.paymentPercentage || 0,
        overallProgress: contract.overallProgress || 0,
        startDate: contract.startDate ? formatDateForInput(contract.startDate) : '',
        endDate: contract.endDate ? formatDateForInput(contract.endDate) : '',
        installments: contract.installments?.map(inst => ({
          id: inst.id,
          description: inst.description,
          amount: inst.amount,
          dueDate: formatDateForInput(inst.dueDate),
          userCompanyId: inst.userCompanyId, // ✅ Ya acepta null
          contractUserId: inst.contractId,
        })) || [],
      });
    } else if (mode === 'create' && open) {
      form.reset({
        serviceId: '',
        name: '',
        university: '',
        career: '',
        observation: '',
        costTotal: 0,
        currency: 'PEN',
        deliverablesPercentage: 0,
        paymentPercentage: 0,
        overallProgress: 0,
        startDate: '',
        endDate: '',
        installments: [],
      });
    }
  }, [mode, contract, open, form]);

  const handleSubmit = async (data: ContractFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Datos del contrato a guardar:', data);
      
      // Aquí iría tu llamada a la API
      // const response = await fetch('/api/contracts', {
      //   method: mode === 'edit' ? 'PUT' : 'POST',
      //   body: JSON.stringify(data),
      // });
      
      setTimeout(() => {
        form.reset();
        onOpenChange(false);
        onContractSaved();
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error en operación del contrato:', error);
      setIsSubmitting(false);
    }
  };

  // Funciones para manejar cuotas
  const addInstallment = () => {
    const currentInstallments = form.getValues('installments') || [];
    form.setValue('installments', [
      ...currentInstallments,
      {
        description: '',
        amount: 0,
        dueDate: '',
      }
    ]);
  };

  const removeInstallment = (index: number) => {
    const currentInstallments = form.getValues('installments') || [];
    form.setValue('installments', currentInstallments.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {mode === 'edit' ? 'Editar Contrato' : 'Crear Nuevo Contrato'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Modifica la información del contrato.' 
              : 'Completa la información para crear un nuevo contrato.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            
            {/* Información Básica del Contrato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información del Proyecto</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Proyecto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Plan de Tesis - Psicología Organizacional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Universidad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Universidad Nacional Mayor de San Marcos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="career"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrera *</FormLabel>
                      <FormControl>
                        <Input placeholder="Psicología" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Investigación sobre clima organizacional en empresas peruanas"
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información Financiera */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información Financiera</h3>
              
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
                          step="0.01"
                          placeholder="1800"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Fechas del Contrato</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inicio *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Fecha de Fin *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cuotas (Installments) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold">Cuotas de Pago</h3>
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

              {form.watch('installments')?.map((_, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Cuota {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstallment(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`installments.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción *</FormLabel>
                          <FormControl>
                            <Input placeholder="Cuota inicial (30%)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`installments.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.01"
                              placeholder="500"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`installments.${index}.dueDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Vencimiento *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {(!form.watch('installments') || form.watch('installments')?.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No hay cuotas registradas. Haz clic en &quot;Agregar Cuota&quot; para comenzar.
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'edit' ? 'Actualizar Contrato' : 'Crear Contrato'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}