/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { contractService } from '../services/contract.service';

// ✅ Esquema con IDs ocultos para el usuario
const contractFormSchema = z.object({
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
  
  currency: z.enum(['PEN', 'USD']),
  
  startDate: z.string()
    .min(1, 'La fecha de inicio es obligatoria'),
  
  endDate: z.string()
    .min(1, 'La fecha de fin es obligatoria'),
  
  userNames: z.array(z.string()).optional(),
  
  installments: z.array(z.object({
    id: z.number().optional(), // ✅ ID oculto (solo interno)
    description: z.string().min(1, 'La descripción es obligatoria'),
    amount: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
    dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
  })).optional(),
  
  collaboratorPayments: z.array(z.object({
    id: z.number().optional(), // ✅ ID oculto (solo interno)
    userId: z.string().optional(), // ✅ userId oculto (solo interno)
    userName: z.string().min(1, 'El nombre del colaborador es obligatorio'),
    amount: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
    dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
    description: z.string().min(1, 'La descripción es obligatoria'),
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
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: '',
      university: '',
      career: '',
      observation: '',
      currency: 'PEN',
      startDate: '',
      endDate: '',
      userNames: [],
      installments: [],
      collaboratorPayments: [],
    },
  });

  // Función para formatear fechas para input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | Date) => {
    if (!dateString) return '';
    
    try {
      if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return '';
      
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };

  // ✅ Cargar datos del contrato para edición (con IDs ocultos)
  useEffect(() => {
    if (mode === 'edit' && contract && open) {
      console.log('📋 Contrato completo recibido:', JSON.stringify(contract, null, 2));

      const userNames = contract.users?.map((user: { name: any; email: any; }) => user.name || user.email || 'Usuario sin nombre') || [];
      
      console.log('👥 Usuarios extraídos:', userNames);

      // ✅ Extraer colaboradores CON sus IDs y userId (OCULTOS)
      const collaboratorPayments = contract.collaboratorPayments?.map((cp: any) => {
        console.log('💰 Pago colaborador:', cp);
        return {
          id: cp.id, // ✅ ID del pago (oculto para el usuario)
          userId: cp.userId || cp.user?.id, // ✅ userId del colaborador (oculto)
          userName: cp.user?.name || cp.user?.email || cp.userName || 'Colaborador sin nombre',
          amount: cp.amount || 0,
          dueDate: formatDateForInput(cp.dueDate),
          description: cp.description || '',
        };
      }) || [];

      console.log('💼 Pagos a colaboradores extraídos (con IDs ocultos):', collaboratorPayments);

      // ✅ Extraer cuotas CON sus IDs (OCULTOS)
      const installments = contract.installments?.map((inst: any) => {
        const formattedDate = formatDateForInput(inst.dueDate);
        console.log('📄 Cuota:', inst, '-> Fecha formateada:', formattedDate);
        return {
          id: inst.id, // ✅ ID de la cuota (oculto para el usuario)
          description: inst.description || '',
          amount: inst.amount || 0,
          dueDate: formattedDate,
        };
      }) || [];

      console.log('📋 Cuotas extraídas (con IDs ocultos):', installments);

      const formData = {
        name: contract.name || '',
        university: contract.university || '',
        career: contract.career || '',
        observation: contract.observation || '',
        currency: contract.currency || 'PEN',
        startDate: formatDateForInput(contract.startDate),
        endDate: formatDateForInput(contract.endDate),
        userNames: userNames,
        installments: installments,
        collaboratorPayments: collaboratorPayments,
      };

      console.log('📝 Datos del formulario a cargar:', formData);

      form.reset(formData);

      console.log('✅ Datos cargados en el formulario');
    } else if (mode === 'create' && open) {
      form.reset({
        name: '',
        university: '',
        career: '',
        observation: '',
        currency: 'PEN',
        startDate: '',
        endDate: '',
        userNames: [],
        installments: [],
        collaboratorPayments: [],
      });
    }
  }, [mode, contract, open, form]);

  const handleSubmit = async (data: ContractFormData) => {
    console.log('🚀 handleSubmit ejecutado');
    console.log('📊 Datos recibidos:', data);
    
    if (isSubmitting) {
      console.log('⏸️ Ya hay un submit en proceso, cancelando...');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('📤 Datos del formulario ANTES de procesar:', JSON.stringify(data, null, 2));

      const payload: any = {
        name: data.name,
        university: data.university,
        career: data.career,
        observation: data.observation || '',
        currency: data.currency,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      console.log('📅 Fechas del contrato:', {
        startDate: payload.startDate,
        endDate: payload.endDate,
      });

      // ✅ Procesar installments CON IDs (ocultos para usuario)
      if (data.installments && data.installments.length > 0) {
        payload.installments = data.installments.map((i, index) => {
          let amountValue = typeof i.amount === 'string' 
            ? parseFloat(i.amount) 
            : Number(i.amount);

          amountValue = Math.round(amountValue * 100) / 100;

          if (isNaN(amountValue) || !isFinite(amountValue)) {
            throw new Error(`El monto de la cuota "${i.description}" debe ser un número válido`);
          }

          console.log(`📋 Procesando cuota ${index + 1}:`, {
            id: i.id, // ✅ Se ve en consola pero NO en UI
            description: i.description,
            amount: amountValue,
            dueDate: i.dueDate,
          });

          const installment: any = {
            description: i.description,
            amount: amountValue, 
            dueDate: i.dueDate,
          };

          // ✅ IMPORTANTE: Incluir el ID si existe (para actualizar)
          if (i.id) {
            installment.id = i.id;
          }

          return installment;
        });

        console.log('📋 Cuotas procesadas para enviar:', JSON.stringify(payload.installments, null, 2));
      }

      // ✅ Procesar collaboratorPayments CON IDs y userId (ocultos para usuario)
      if (data.collaboratorPayments && data.collaboratorPayments.length > 0) {
        payload.collaboratorPayments = data.collaboratorPayments.map((cp, index) => {
          let amountValue = typeof cp.amount === 'string' 
            ? parseFloat(cp.amount) 
            : Number(cp.amount);

          amountValue = Math.round(amountValue * 100) / 100;

          if (isNaN(amountValue) || !isFinite(amountValue)) {
            throw new Error(`El monto del pago al colaborador debe ser un número válido`);
          }

          console.log(`💼 Procesando pago colaborador ${index + 1}:`, {
            id: cp.id, // ✅ Se ve en consola pero NO en UI
            userId: cp.userId, // ✅ Se ve en consola pero NO en UI
            userName: cp.userName,
            amount: amountValue,
            dueDate: cp.dueDate,
            description: cp.description,
          });

          const payment: any = {
            amount: amountValue,
            dueDate: cp.dueDate,
            description: cp.description,
          };

          // ✅ IMPORTANTE: Incluir el ID si existe (para actualizar)
          if (cp.id) {
            payment.id = cp.id;
          }

          // ✅ IMPORTANTE: Incluir el userId si existe
          if (cp.userId) {
            payment.userId = cp.userId;
          }

          return payment;
        });

        console.log('💼 Pagos a colaboradores procesados:', JSON.stringify(payload.collaboratorPayments, null, 2));
      }

      console.log("📤 ====================================");
      console.log("📤 PAYLOAD COMPLETO A ENVIAR:");
      console.log("📤 ====================================");
      console.log(JSON.stringify(payload, null, 2));
      console.log("📤 ====================================");
      console.log("📝 Modo:", mode);

      let response;

      if (mode === "edit" && contract?.id) {
        console.log("🔄 Actualizando contrato con ID:", contract.id);
        response = await contractService.updateContract(contract.id, payload);
        console.log("✅ Respuesta actualización:", response);
      } else {
        console.log("➕ Creando contrato nuevo");
        response = await contractService.createContract(payload);
        console.log("✅ Respuesta creación:", response);
      }

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      console.log("🎉 Operación exitosa, cerrando modal...");

      form.reset();
      onOpenChange(false);
      onContractSaved();

    } catch (error: unknown) {
      console.error("❌ Error en operación del contrato:", error);
      
      let errorMessage = 'Ocurrió un error al guardar el contrato.';
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      console.log("⚠️ Modal permanece abierto debido al error");
    } finally {
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
    ], { shouldValidate: false, shouldDirty: true });
  };

  const removeInstallment = (index: number) => {
    const currentInstallments = form.getValues('installments') || [];
    form.setValue('installments', currentInstallments.filter((_, i) => i !== index), { shouldValidate: false, shouldDirty: true });
  };

  // Funciones para manejar pagos a colaboradores
  const addCollaboratorPayment = () => {
    const currentPayments = form.getValues('collaboratorPayments') || [];
    form.setValue('collaboratorPayments', [
      ...currentPayments,
      {
        userName: '',
        amount: 0,
        dueDate: '',
        description: '',
      }
    ], { shouldValidate: false, shouldDirty: true });
  };

  const removeCollaboratorPayment = (index: number) => {
    const currentPayments = form.getValues('collaboratorPayments') || [];
    form.setValue('collaboratorPayments', currentPayments.filter((_, i) => i !== index), { shouldValidate: false, shouldDirty: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
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
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

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
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
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

            {/* Usuarios Asignados - SOLO LECTURA */}
            {mode === 'edit' && form.watch('userNames') && form.watch('userNames')!.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Usuarios Asignados</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <ul className="list-disc list-inside space-y-1">
                    {form.watch('userNames')?.map((userName, index) => (
                      <li key={index} className="text-sm text-gray-700">{userName}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Los usuarios asignados no se pueden modificar desde este formulario
                  </p>
                </div>
              </div>
            )}

            {/* Cuotas (Installments) - IDs OCULTOS */}
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

              {form.watch('installments')?.map((installment, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    {/* ✅ SIN mostrar el ID al usuario */}
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
                              min="0"
                              placeholder="500"
                              value={field.value || ''}
                              onChange={e => {
                                const value = e.target.value;
                                if (value === '') {
                                  field.onChange(0);
                                  return;
                                }
                                const numValue = parseFloat(value);
                                field.onChange(isNaN(numValue) ? 0 : numValue);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
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
                            <Input 
                              type="date" 
                              {...field}
                              value={field.value || ''}
                            />
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

            {/* Pagos a Colaboradores - IDs OCULTOS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold">Pagos a Colaboradores</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addCollaboratorPayment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Pago
                </Button>
              </div>

              {form.watch('collaboratorPayments')?.map((payment, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-blue-50">
                  <div className="flex justify-between items-center">
                    {/* ✅ SIN mostrar el ID ni userId al usuario */}
                    <h4 className="font-medium">Pago a Colaborador {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollaboratorPayment(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`collaboratorPayments.${index}.userName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Colaborador *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Juan Pérez" 
                              {...field}
                              disabled={mode === 'edit'}
                            />
                          </FormControl>
                          <FormMessage />
                          {mode === 'edit' && (
                            <p className="text-xs text-gray-500">
                              El colaborador no se puede cambiar en modo edición
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`collaboratorPayments.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="1200.50"
                              value={field.value || ''}
                              onChange={e => {
                                const value = e.target.value;
                                if (value === '') {
                                  field.onChange(0);
                                  return;
                                }
                                const numValue = parseFloat(value);
                                field.onChange(isNaN(numValue) ? 0 : numValue);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`collaboratorPayments.${index}.dueDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Vencimiento *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`collaboratorPayments.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción *</FormLabel>
                          <FormControl>
                            <Input placeholder="Pago colaborador - Desarrollo capítulo 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {(!form.watch('collaboratorPayments') || form.watch('collaboratorPayments')?.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No hay pagos a colaboradores registrados. Haz clic en &quot;Agregar Pago&quot; para comenzar.
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