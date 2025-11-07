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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

import { 
  useCreateResearchClient, 
  useUpdateResearchClient 
} from '../hooks/use-research-clients';
import type { 
  IResearchClient, 
  ICreateResearchClientDto,
  IUpdateResearchClientDto,
  DocumentType,
  AcademicDegree,
  UserRole
} from '../types/research-clients.types';

// Esquema de validación con Zod (sin contraseña)
const researchClientFormSchema = z.object({
  // Datos de usuario
  email: z.string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Email inválido'
    })
    .refine((val) => !val || val.length <= 100, {
      message: 'El email no puede exceder 100 caracteres'
    }),
  isActive: z.boolean(),
  
  // Datos de perfil
  firstName: z.string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z.string()
    .min(1, 'Los apellidos son obligatorios')
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres'),
  documentType: z.nativeEnum(Object.fromEntries(
    Object.entries({
      DNI: 'DNI',
      PASSPORT: 'PASSPORT',
      CE: 'CE'
    })
  ) as Record<string, DocumentType>),
  documentNumber: z.string()
    .min(1, 'El número de documento es obligatorio')
    .min(8, 'El número de documento debe tener al menos 8 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  phone: z.string()
    .min(1, 'El teléfono es obligatorio')
    .min(9, 'El teléfono debe tener al menos 9 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  university: z.string()
    .min(1, 'La universidad es obligatoria')
    .min(3, 'La universidad debe tener al menos 3 caracteres')
    .max(100, 'La universidad no puede exceder 100 caracteres'),
  faculty: z.string()
    .min(1, 'La facultad es obligatoria')
    .min(3, 'La facultad debe tener al menos 3 caracteres')
    .max(100, 'La facultad no puede exceder 100 caracteres'),
  career: z.string()
    .min(1, 'La carrera es obligatoria')
    .min(3, 'La carrera debe tener al menos 3 caracteres')
    .max(100, 'La carrera no puede exceder 100 caracteres'),
  academicDegree: z.nativeEnum(Object.fromEntries(
    Object.entries({
      Bachiller: 'Bachiller',
      Licenciado: 'Licenciado',
      Magister: 'Magister',
      Doctor: 'Doctor'
    })
  ) as Record<string, AcademicDegree>),
});

type ResearchClientFormData = z.infer<typeof researchClientFormSchema>;

interface ResearchClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientSaved: () => void;
  client?: IResearchClient | null;
  mode?: 'create' | 'edit';
}

export function ResearchClientForm({
  open,
  onOpenChange,
  onClientSaved,
  client = null,
  mode = 'create'
}: ResearchClientFormProps) {
  const createClientMutation = useCreateResearchClient();
  const updateClientMutation = useUpdateResearchClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResearchClientFormData>({
    resolver: zodResolver(researchClientFormSchema),
    defaultValues: {
      email: '',
      isActive: true,
      firstName: '',
      lastName: '',
      documentType: 'DNI' as DocumentType,
      documentNumber: '',
      phone: '',
      university: '',
      faculty: '',
      career: '',
      academicDegree: 'Bachiller' as AcademicDegree,
    },
  });

  // Cargar datos del cliente para edición
  useEffect(() => {
    if (mode === 'edit' && client && open) {
      form.reset({
        email: client.email || '',
        isActive: client.isActive,
        firstName: client.profile.firstName,
        lastName: client.profile.lastName,
        documentType: client.profile.documentType,
        documentNumber: client.profile.documentNumber,
        phone: client.profile.phone,
        university: client.profile.university,
        faculty: client.profile.faculty,
        career: client.profile.career,
        academicDegree: client.profile.academicDegree,
      });
    } else if (mode === 'create' && open) {
      form.reset({
        email: '',
        isActive: true,
        firstName: '',
        lastName: '',
        documentType: 'DNI' as DocumentType,
        documentNumber: '',
        phone: '',
        university: '',
        faculty: '',
        career: '',
        academicDegree: 'Bachiller' as AcademicDegree,
      });
    }
  }, [mode, client, open, form]);

  const handleSubmit = async (data: ResearchClientFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'edit' && client) {
        // Actualizar cliente existente
        const updateData: IUpdateResearchClientDto = {
          user: {
            email: data.email || undefined,
            isActive: data.isActive,
          },
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            phone: data.phone,
            university: data.university,
            faculty: data.faculty,
            career: data.career,
            academicDegree: data.academicDegree,
          },
        };
        
        await updateClientMutation.mutateAsync({ 
          id: client.id, 
          data: updateData 
        });
      } else {
        // Crear nuevo cliente
        const createData: ICreateResearchClientDto = {
          user: {
            email: data.email || undefined,
            password: 'temporal123',
            role: 'CLIENT' as UserRole,
            isActive: data.isActive,
          },
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            phone: data.phone,
            university: data.university,
            faculty: data.faculty,
            career: data.career,
            academicDegree: data.academicDegree,
          },
        };
        
        await createClientMutation.mutateAsync(createData);
      }

      // Reset form y cerrar modal
      form.reset();
      onOpenChange(false);
      onClientSaved();
    } catch (error) {
      console.error('Error en operación del cliente:', error);
      // Los errores específicos se manejan en los hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = createClientMutation.isPending || updateClientMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {mode === 'edit' ? 'Editar Cliente de Investigación' : 'Crear Nuevo Cliente de Investigación'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Modifica la información del cliente de investigación.' 
              : 'Completa la información para crear un nuevo cliente de investigación.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese los nombres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese los apellidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="correo@ejemplo.com (opcional)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <Input placeholder="999 999 999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DNI">DNI</SelectItem>
                          <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                          <SelectItem value="CE">Carné de Extranjería</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Documento *</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Información Académica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Académica</h3>
              
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
                name="faculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facultad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Facultad de Ingeniería" {...field} />
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
                      <Input placeholder="Ingeniería de Sistemas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicDegree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grado Académico *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar grado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bachiller">Bachiller</SelectItem>
                        <SelectItem value="Licenciado">Licenciado</SelectItem>
                        <SelectItem value="Magister">Magister</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Cliente activo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'edit' ? 'Actualizar Cliente' : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}