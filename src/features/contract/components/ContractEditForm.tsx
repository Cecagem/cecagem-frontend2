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
import { Loader2 } from 'lucide-react';

import type { IContract } from '../types';
import { contractService } from '../services/contract.service';
import { useUsers } from '@/features/user/hooks/use-users';

// Esquema de validación SIMPLIFICADO
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
  
  // ID del colaborador responsable (para el dropdown)
  collaboratorId: z.string()
    .min(1, 'Debe seleccionar un colaborador'),
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
  mode = 'edit',
}: ContractEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCollaboratorInfo, setCurrentCollaboratorInfo] = useState<string>('');

  // CARGAR USUARIOS/COLABORADORES IGUAL QUE EN EL FORMULARIO DE CREACIÓN
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    limit: 1000, // Obtener todos los usuarios
  });

  // Filtrar solo colaboradores (rol 'collaborator')
  const availableCollaborators =
  usersData?.data?.filter(
    (user) =>
      user.role === 'COLLABORATOR_INTERNAL' ||
      user.role === 'COLLABORATOR_EXTERNAL'
  ) || [];


  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: '',
      university: '',
      career: '',
      observation: '',
      collaboratorId: '',
    },
  });

  // Cargar datos del contrato para edición
  useEffect(() => {
    if (mode === 'edit' && contract && open) {
      console.log('📋 Contrato completo recibido:', JSON.stringify(contract, null, 2));

      // Extraer información del colaborador actual
      let collaboratorId = '';
      if (contract.collaboratorPayments && contract.collaboratorPayments.length > 0) {
        const firstCollaborator = contract.collaboratorPayments[0];
        collaboratorId = firstCollaborator.userId || firstCollaborator.user?.id || '';
        
        // Información del colaborador actual para mostrar
        const collaboratorName = firstCollaborator.user?.name || firstCollaborator.user?.email || 'Sin nombre';
        setCurrentCollaboratorInfo(collaboratorName);
        
        console.log('💼 Colaborador actual:', { id: collaboratorId, name: collaboratorName });
      }

      const formData = {
        name: contract.name || '',
        university: contract.university || '',
        career: contract.career || '',
        observation: contract.observation || '',
        collaboratorId: collaboratorId,
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
        collaboratorId: '',
      });
      setCurrentCollaboratorInfo('');
    }
  }, [mode, contract, open, form]);

  const handleSubmit = async (data: ContractFormData) => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  setError(null);

  try {
    console.log('📤 Datos del formulario ANTES de procesar:', JSON.stringify(data, null, 2));

    if (!contract) {
      throw new Error("No se encontró el contrato original para editar.");
    }

    // Construir payload EXACTO como lo quiere tu backend
    const payload: any = {
      name: data.name,
      university: data.university,
      career: data.career,
      observation: data.observation || '',

      // 👇 Mantener los que ya existen en el contrato
      userIds: contract.userIds ?? [],
      deliverableIds: contract.deliverableIds ?? [],
      installments: contract.installments ?? [],

      // 👇 Actualizar colaborador AQUÍ
      collaboratorPayments: [
        {
          ...contract.collaboratorPayments?.[0],
          userId: data.collaboratorId, // 👈 ESTE es el campo correcto
        }
      ],
    };

    console.log("📤 PAYLOAD FINAL A ENVIAR:");
    console.log(JSON.stringify(payload, null, 2));

    const response = await contractService.updateContract(contract.id!, payload);

    console.log("✅ Respuesta actualización:", response);

    form.reset();
    onOpenChange(false);
    onContractSaved();

  } catch (error: any) {
    console.error("❌ Error en operación del contrato:", error);
    setError(error?.response?.data?.message || error.message || "Error desconocido");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {mode === 'edit' ? 'Editar Contrato' : 'Crear Nuevo Contrato'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Modifica la información del proyecto y del colaborador responsable.' 
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

            {/* Información Básica del Proyecto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información del Proyecto</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Proyecto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Tesis de Ingeniería de Sistemas - UNI" {...field} />
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
                        <Input placeholder="Ej: Universidad Nacional de Ingeniería" {...field} />
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
                        <Input placeholder="Ej: Ingeniería de Sistemas" {...field} />
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
                        placeholder="Observaciones adicionales sobre el contrato..."
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

            {/* Colaborador Responsable */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Colaborador Responsable</h3>
              
              {/* Mostrar colaborador actual en modo edición */}
              {mode === 'edit' && currentCollaboratorInfo && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Colaborador actual:</span> {currentCollaboratorInfo}
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="collaboratorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isLoadingUsers 
                              ? "Cargando colaboradores..." 
                              : "Seleccionar colaborador..."
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : availableCollaborators.length > 0 ? (
                          availableCollaborators.map((collaborator) => (
                            <SelectItem key={collaborator.id} value={collaborator.id}>
                              {collaborator.name || collaborator.email}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-collaborators" disabled>
                            No hay colaboradores disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      {isLoadingUsers 
                        ? "Cargando lista de colaboradores..." 
                        : `${availableCollaborators.length} colaboradores disponibles`
                      }
                    </p>
                  </FormItem>
                )}
              />
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
                disabled={isSubmitting || isLoadingUsers}
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