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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Building2, User, Calendar, DollarSign, FileText } from 'lucide-react';
import { DateInput, SearchableSelect, type SearchableSelectOption } from '@/components/shared';

import { 
  useCreateCompany, 
  useUpdateCompany,
  useCollaboratorOptions 
} from '../hooks/use-accounting-clients';
import type { 
  ICompany, 
  ICreateCompanyDto,
  IUpdateCompanyDto,
} from '../types/accounting-clients.types';

// Esquema de validación con Zod
const companyFormSchema = z.object({
  // Datos de la empresa
  ruc: z.string()
    .min(1, 'El RUC es obligatorio')
    .length(11, 'El RUC debe tener exactamente 11 dígitos')
    .regex(/^\d+$/, 'El RUC debe contener solo números'),
  businessName: z.string()
    .min(1, 'La razón social es obligatoria')
    .min(3, 'La razón social debe tener al menos 3 caracteres')
    .max(200, 'La razón social no puede exceder 200 caracteres'),
  tradeName: z.string()
    .min(1, 'El nombre comercial es obligatorio')
    .min(2, 'El nombre comercial debe tener al menos 2 caracteres')
    .max(150, 'El nombre comercial no puede exceder 150 caracteres'),
  address: z.string()
    .min(1, 'La dirección es obligatoria')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(300, 'La dirección no puede exceder 300 caracteres'),
  contactName: z.string()
    .min(1, 'El nombre de contacto es obligatorio')
    .min(2, 'El nombre de contacto debe tener al menos 2 caracteres')
    .max(100, 'El nombre de contacto no puede exceder 100 caracteres'),
  contactPhone: z.string()
    .min(1, 'El teléfono de contacto es obligatorio')
    .min(9, 'El teléfono debe tener al menos 9 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  contactEmail: z.string()
    .min(1, 'El email de contacto es obligatorio')
    .email('Email inválido')
    .max(150, 'El email no puede exceder 150 caracteres'),
  isActive: z.boolean(),
  
  // Datos de la relación de usuario
  userId: z.string()
    .min(1, 'Debe seleccionar un colaborador interno'),
  monthlyPayment: z.number()
    .min(1, 'El pago mensual debe ser mayor a 0')
    .max(999999, 'El pago mensual no puede exceder S/ 999,999'),
  paymentDate: z.date(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanySaved: () => void;
  company?: ICompany | null;
  mode?: 'create' | 'edit';
}

export function CompanyForm({
  open,
  onOpenChange,
  onCompanySaved,
  company = null,
  mode = 'create'
}: CompanyFormProps) {
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook para obtener colaboradores
  const { options: collaboratorOptions } = useCollaboratorOptions();

  // Convertir opciones de colaboradores al formato SearchableSelectOption
  const collaboratorSelectOptions: SearchableSelectOption[] = collaboratorOptions.map(option => ({
    value: option.value,
    label: option.label
  }));

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      ruc: '',
      businessName: '',
      tradeName: '',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      isActive: true,
      userId: '',
      monthlyPayment: 0,
      paymentDate: new Date(),
    },
  });

  // Cargar datos de la empresa para edición
  useEffect(() => {
    if (mode === 'edit' && company && open) {
      const activeRelation = company.userRelations.find(r => r.isActive);
      
      form.reset({
        ruc: company.ruc,
        businessName: company.businessName,
        tradeName: company.tradeName,
        address: company.address,
        contactName: company.contactName,
        contactPhone: company.contactPhone,
        contactEmail: company.contactEmail,
        isActive: company.isActive,
        userId: activeRelation?.user.id || '',
        monthlyPayment: activeRelation?.monthlyPayment || 0,
        paymentDate: activeRelation ? new Date(activeRelation.paymentDate) : new Date(),
      });
    } else if (mode === 'create' && open) {
      form.reset({
        ruc: '',
        businessName: '',
        tradeName: '',
        address: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        isActive: true,
        userId: '',
        monthlyPayment: 0,
        paymentDate: new Date(),
      });
    }
  }, [mode, company, open, form]);

  const handleSubmit = async (data: CompanyFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'edit' && company) {
        // Actualizar empresa existente
        const updateData: IUpdateCompanyDto = {
          ruc: data.ruc,
          businessName: data.businessName,
          tradeName: data.tradeName,
          address: data.address,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          isActive: data.isActive,
          userRelation: {
            userId: data.userId,
            monthlyPayment: data.monthlyPayment,
            paymentDate: data.paymentDate.toISOString(),
            isActive: true,
          },
        };
        
        await updateCompanyMutation.mutateAsync({ 
          id: company.id, 
          data: updateData 
        });
      } else {
        // Crear nueva empresa
        const createData: ICreateCompanyDto = {
          ruc: data.ruc,
          businessName: data.businessName,
          tradeName: data.tradeName,
          address: data.address,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          isActive: data.isActive,
          userRelation: {
            userId: data.userId,
            monthlyPayment: data.monthlyPayment,
            paymentDate: data.paymentDate.toISOString(),
            isActive: true,
          },
        };
        
        await createCompanyMutation.mutateAsync(createData);
      }

      // Reset form y cerrar modal
      form.reset();
      onOpenChange(false);
      onCompanySaved();
    } catch (error) {
      console.error('Error en operación de la empresa:', error);
      // Los errores específicos se manejan en los hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = createCompanyMutation.isPending || updateCompanyMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === 'edit' ? 'Editar Empresa' : 'Crear Nueva Empresa'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Modifica la información de la empresa y su relación con el colaborador.' 
              : 'Completa la información para crear una nueva empresa y asignar un colaborador responsable.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Información de la Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ruc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUC *</FormLabel>
                      <FormControl>
                        <Input placeholder="20123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social *</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa Ejemplo S.A.C." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tradeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Comercial *</FormLabel>
                    <FormControl>
                      <Input placeholder="Empresa Ejemplo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Av. Principal 123, Lima, Perú" 
                        {...field} 
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Contacto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Contacto *</FormLabel>
                      <FormControl>
                        <Input placeholder="+51999999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contacto *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="contacto@empresa.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      <FormLabel>Empresa activa</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Relación con Colaborador */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Asignación de Colaborador
              </h3>
              
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador Interno *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={collaboratorSelectOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Seleccionar colaborador..."
                        searchPlaceholder="Buscar colaborador..."
                        emptyMessage="No se encontraron colaboradores"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Contrato
                    </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monthlyPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Pago Mensual a CECAGEM (S/) *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="1500"
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
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha de Pago Mensual *
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
                {mode === 'edit' ? 'Actualizar Empresa' : 'Crear Empresa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}