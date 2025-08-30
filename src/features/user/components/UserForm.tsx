"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  User, 
  UserFormData,
  UserRole, 
  DocumentType,
  requiresSalary, 
  availableRoles,
  documentTypes,
} from "../types";

// Schema para el formulario con validación condicional
const FormSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.nativeEnum(UserRole),
  firstName: z.string().min(2, "Nombres son requeridos"),
  lastName: z.string().min(2, "Apellidos son requeridos"),
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(8, "Número de documento inválido"),
  phone: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  salaryMonth: z.number().min(0, "El salario debe ser mayor a 0").optional(),
  paymentDate: z.date().optional(),
}).refine((data) => {
  // Validar que si el rol requiere salario, estos campos sean obligatorios
  if (requiresSalary(data.role)) {
    return data.salaryMonth !== undefined && data.paymentDate !== undefined;
  }
  return true;
}, {
  message: "El salario y fecha de pago son requeridos para este rol",
  path: ["salaryMonth"],
});

type FormData = z.infer<typeof FormSchema>;

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function UserForm({ user, isOpen, onClose, onSubmit, isLoading }: UserFormProps) {
  const isEditing = !!user;
  
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      role: UserRole.COLLABORATOR_EXTERNAL,
      firstName: "",
      lastName: "",
      documentType: DocumentType.DNI,
      documentNumber: "",
      phone: "",
      salaryMonth: undefined,
      paymentDate: undefined,
    },
  });

  const watchedRole = useWatch({
    control: form.control,
    name: "role",
  });

  const showSalaryFields = requiresSalary(watchedRole);

  // Reset form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Modo edición (si llegara a implementarse)
        form.reset({
          email: user.email,
          role: user.role,
          firstName: user.profile?.firstName || "",
          lastName: user.profile?.lastName || "",
          documentType: user.profile?.documentType || DocumentType.DNI,
          documentNumber: user.profile?.documentNumber || "",
          phone: user.profile?.phone || "",
          salaryMonth: user.profile?.salaryMonth,
          paymentDate: user.profile?.paymentDate ? new Date(user.profile.paymentDate) : undefined,
        });
      } else {
        // Modo creación
        form.reset({
          email: "",
          role: UserRole.COLLABORATOR_EXTERNAL,
          firstName: "",
          lastName: "",
          documentType: DocumentType.DNI,
          documentNumber: "",
          phone: "",
          salaryMonth: undefined,
          paymentDate: undefined,
        });
      }
    }
  }, [isOpen, user, form]);

  // Limpiar campos de salario cuando no son necesarios
  useEffect(() => {
    if (!showSalaryFields) {
      form.setValue("salaryMonth", undefined);
      form.setValue("paymentDate", undefined);
    }
  }, [showSalaryFields, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      // Construir el payload según la estructura requerida
      const userFormData: UserFormData = {
        user: {
          email: data.email,
          role: data.role,
        },
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          phone: data.phone,
          // Solo incluir campos de salario si el rol los requiere
          ...(showSalaryFields && {
            salaryMonth: data.salaryMonth!,
            paymentDate: data.paymentDate!.toISOString(),
          }),
        },
      };

      await onSubmit(userFormData);
      onClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información de Usuario */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de Usuario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@ejemplo.com" 
                          {...field} 
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={availableRoles}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar rol"
                          searchPlaceholder="Buscar rol..."
                          emptyText="No se encontró el rol"
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres *</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
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
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={documentTypes}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar tipo"
                          searchPlaceholder="Buscar tipo de documento..."
                          emptyText="No se encontró el tipo de documento"
                        />
                      </FormControl>
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
            </div>

            {/* Información de Contrato (solo para COLABORADOR_INTERNO y RRHH) */}
            {showSalaryFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información de Contrato</h3>
                <p className="text-sm text-muted-foreground">
                  Requerido para {watchedRole === UserRole.RRHH ? "RR.HH" : "Colaborador Interno"}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salario Mensual *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="2500.5" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            value={field.value || ""}
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
                        <FormLabel>Fecha de Pago *</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onValueChange={field.onChange}
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

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
