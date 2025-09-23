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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Shield, DollarSign, Calendar, Book } from 'lucide-react';
import { DateInput } from '@/components/shared';

import { 
  useCreateUser, 
  useUpdateUser
} from '../hooks/use-users';
import type { 
  IUser, 
  ICreateUserDto,
  IUpdateUserDto
} from '../types/user.types';
import { 
  DocumentType,
  AcademicDegree,
  UserRole,
  requiresContract
} from '../types/user.types';

// Esquema de validación con Zod
const userFormSchema = z.object({
  // Información personal
  email: z.string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido')
    .max(150, 'El email no puede exceder 150 caracteres'),
  firstName: z.string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  lastName: z.string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres'),
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string()
    .min(1, 'El número de documento es obligatorio')
    .min(8, 'El número de documento debe tener al menos 8 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  phone: z.string()
    .min(1, 'El teléfono es obligatorio')
    .min(9, 'El teléfono debe tener al menos 9 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  
  // Información académica (opcional)
  university: z.string().max(200, 'La universidad no puede exceder 200 caracteres').optional(),
  faculty: z.string().max(150, 'La facultad no puede exceder 150 caracteres').optional(),
  career: z.string().max(150, 'La carrera no puede exceder 150 caracteres').optional(),
  academicDegree: z.nativeEnum(AcademicDegree).optional(),
  
  // Rol
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  
  // Contrato (condicional para RRHH y COLLABORATOR_INTERNAL)
  salaryMonth: z.number()
    .min(0, 'El salario debe ser mayor o igual a 0')
    .max(999999, 'El salario no puede exceder S/ 999,999')
    .optional(),
  paymentDate: z.date().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSaved: () => void;
  user?: IUser | null;
  mode?: 'create' | 'edit';
}

export function UserForm({
  open,
  onOpenChange,
  onUserSaved,
  user = null,
  mode = 'create'
}: UserFormProps) {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      documentType: DocumentType.DNI,
      documentNumber: '',
      phone: '',
      university: '',
      faculty: '',
      career: '',
      academicDegree: undefined,
      role: UserRole.COLLABORATOR_EXTERNAL,
      isActive: true,
      salaryMonth: undefined,
      paymentDate: undefined,
    },
  });

  // Cargar datos del usuario para edición
  useEffect(() => {
    if (mode === 'edit' && user && open) {
      form.reset({
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        documentType: user.profile.documentType,
        documentNumber: user.profile.documentNumber,
        phone: user.profile.phone,
        university: user.profile.university || '',
        faculty: user.profile.faculty || '',
        career: user.profile.career || '',
        academicDegree: user.profile.academicDegree || undefined,
        role: user.role,
        isActive: user.isActive,
        salaryMonth: user.profile.salaryMonth || undefined,
        paymentDate: user.profile.paymentDate ? new Date(user.profile.paymentDate) : undefined,
      });
    } else if (mode === 'create' && open) {
      form.reset({
        email: '',
        firstName: '',
        lastName: '',
        documentType: DocumentType.DNI,
        documentNumber: '',
        phone: '',
        university: '',
        faculty: '',
        career: '',
        academicDegree: undefined,
        role: UserRole.COLLABORATOR_EXTERNAL,
        isActive: true,
        salaryMonth: undefined,
        paymentDate: undefined,
      });
    }
  }, [mode, user, open, form]);

  // Observar cambios en el rol para mostrar/ocultar sección contrato
  const watchedRole = form.watch('role');
  const showContractSection = requiresContract(watchedRole);

  // Limpiar campos de contrato cuando se cambia a un rol que no los requiere
  useEffect(() => {
    if (!showContractSection) {
      form.setValue('salaryMonth', undefined);
      form.setValue('paymentDate', undefined);
    }
  }, [showContractSection, form]);

  const handleSubmit = async (data: UserFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'edit' && user) {
        // Actualizar usuario existente
        const updateData: IUpdateUserDto = {
          user: {
            email: data.email,
            role: data.role,
            isActive: data.isActive,
          },
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            phone: data.phone,
            university: data.university || undefined,
            faculty: data.faculty || undefined,
            career: data.career || undefined,
            academicDegree: data.academicDegree || undefined,
            salaryMonth: showContractSection ? (data.salaryMonth || null) : null,
            paymentDate: showContractSection ? (data.paymentDate ? data.paymentDate.toISOString() : null) : null,
          },
        };
        
        await updateUserMutation.mutateAsync({ 
          id: user.id, 
          data: updateData 
        });
      } else {
        // Crear nuevo usuario
        const createData: ICreateUserDto = {
          user: {
            email: data.email,
            role: data.role,
            isActive: data.isActive,
          },
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            phone: data.phone,
            university: data.university || undefined,
            faculty: data.faculty || undefined,
            career: data.career || undefined,
            academicDegree: data.academicDegree || undefined,
            // Si el rol NO requiere contrato, enviar null explícitamente
            salaryMonth: showContractSection ? (data.salaryMonth || null) : null,
            paymentDate: showContractSection ? (data.paymentDate ? data.paymentDate.toISOString() : null) : null,
          },
        };
        
        await createUserMutation.mutateAsync(createData);
      }

      // Reset form y cerrar modal
      form.reset();
      onOpenChange(false);
      onUserSaved();
    } catch (error) {
      console.error('Error en operación del usuario:', error);
      // Los errores específicos se manejan en los hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === 'edit' ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Modifica la información del usuario, rol y contrato.' 
              : 'Completa la información para crear un nuevo usuario. El password será generado automáticamente.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="usuario@ejemplo.com" 
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
                        <Input placeholder="+51987654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres *</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Carlos" {...field} />
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
                        <Input placeholder="Pérez García" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                          <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                          <SelectItem value={DocumentType.PASSPORT}>Pasaporte</SelectItem>
                          <SelectItem value={DocumentType.CE}>Carné de Extranjería</SelectItem>
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

              {/* Información Académica (Opcional) */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Información Académica (Opcional)
                 </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Universidad</FormLabel>
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
                        <FormLabel>Facultad</FormLabel>
                        <FormControl>
                          <Input placeholder="Facultad de Ingeniería" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="career"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carrera</FormLabel>
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
                        <FormLabel>Grado Académico</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar grado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={AcademicDegree.BACHILLER}>Bachiller</SelectItem>
                            <SelectItem value={AcademicDegree.LICENCIADO}>Licenciado</SelectItem>
                            <SelectItem value={AcademicDegree.MAGISTER}>Magister</SelectItem>
                            <SelectItem value={AcademicDegree.DOCTOR}>Doctor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Rol y Estado */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rol y Estado
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol del Usuario *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.COLLABORATOR_INTERNAL}>Colaborador Interno</SelectItem>
                          <SelectItem value={UserRole.COLLABORATOR_EXTERNAL}>Colaborador Externo</SelectItem>
                          <SelectItem value={UserRole.RRHH}>RRHH</SelectItem>
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Usuario activo</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          El usuario puede acceder al sistema
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contrato (Solo para RRHH y COLLABORATOR_INTERNAL) */}
            {showContractSection && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Contrato CECAGEM
                </h3>
                <p className="text-sm text-muted-foreground">
                  Información del salario que CECAGEM pagará a este usuario
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Salario Mensual (S/)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="2500.50"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha de Pago
                        </FormLabel>
                        <FormControl>
                          <DateInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Seleccionar fecha"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

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
                {mode === 'edit' ? 'Actualizar Usuario' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}