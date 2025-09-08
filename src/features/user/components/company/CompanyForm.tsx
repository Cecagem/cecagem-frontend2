"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  CreateCompleteUserRequest,
  createUserData,
} from "@/features/user";

const companyFormSchema = z.object({
  email: z.string().email("Email debe ser válido"),
  ruc: z
    .string()
    .min(11, "RUC debe tener 11 dígitos")
    .max(11, "RUC debe tener 11 dígitos"),
  businessName: z.string().min(1, "Razón social es requerida"),
  tradeName: z.string().optional(),
  address: z.string().min(1, "Dirección es requerida"),
  contactName: z.string().min(1, "Nombre de contacto es requerido"),
  contactPhone: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  contactEmail: z.string().email("Email de contacto debe ser válido"),
  isActive: z.boolean().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: CreateCompleteUserRequest) => Promise<void>;
  isLoading: boolean;
}

export default function CompanyForm({
  company,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      email: "",
      ruc: "",
      businessName: "",
      tradeName: "",
      address: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        email: company.email,
        ruc: company.company?.ruc || "",
        businessName: company.company?.businessName || "",
        tradeName: company.company?.tradeName || "",
        address: company.company?.address || "",
        contactName: company.company?.contactName || "",
        contactPhone: company.company?.contactPhone || "",
        contactEmail: company.company?.contactEmail || company.email,
        isActive: company.isActive,
      });
    } else {
      form.reset({
        email: "",
        ruc: "",
        businessName: "",
        tradeName: "",
        address: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        isActive: true,
      });
    }
  }, [company, form]);

  const handleSubmit = async (data: CompanyFormValues) => {
    try {
      const companyData = createUserData.company(data.email, {
        ruc: data.ruc,
        businessName: data.businessName,
        tradeName: data.tradeName,
        address: data.address,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
      });

      if (company) {
        companyData.user.isActive = data.isActive;
      }

      await onSubmit(companyData);
      form.reset();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? "Editar Empresa" : "Nueva Empresa"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUC</FormLabel>
                    <FormControl>
                      <Input placeholder="20123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="empresa@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa S.A.C." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tradeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Comercial</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre comercial (opcional)"
                      {...field}
                    />
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
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Dirección completa de la empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Contacto</FormLabel>
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
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="987654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico de Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="contacto@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {company && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Activa</SelectItem>
                        <SelectItem value="false">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? company
                    ? "Actualizando..."
                    : "Creando..."
                  : company
                  ? "Actualizar Empresa"
                  : "Crear Empresa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
