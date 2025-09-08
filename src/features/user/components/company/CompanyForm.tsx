"use client";

import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, CreateCompleteUserRequest } from "../../types/user.type";
import { createUserData } from "../../hooks/use-users";
import { useEffect } from "react";

interface CompanyFormProps {
  company?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: CreateCompleteUserRequest) => Promise<void>;
  isLoading?: boolean;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-sm font-medium">
    {children} <span className="text-red-500">*</span>
  </Label>
);

export const CompanyForm = ({
  company,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CompanyFormProps) => {
  const isEditing = !!company;

  const form = useForm({
    defaultValues: {
      email: company?.email || "",
      ruc: company?.company?.ruc || "",
      businessName: company?.company?.businessName || "",
      tradeName: company?.company?.tradeName || "",
      address: company?.company?.address || "",
      contactName: company?.company?.contactName || "",
      contactPhone: company?.company?.contactPhone || "",
      contactEmail: company?.company?.contactEmail || "",
      isActive: company?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      try {
        const companyData = createUserData.company(value.email, {
          ruc: value.ruc,
          businessName: value.businessName,
          tradeName: value.tradeName || undefined,
          address: value.address,
          contactName: value.contactName,
          contactPhone: value.contactPhone,
          contactEmail: value.contactEmail || value.email,
        });

        if (isEditing && companyData.user) {
          companyData.user.isActive = value.isActive;
        }

        await onSubmit(companyData);
      } catch (error) {
        console.error("Error en formulario de empresa:", error);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, company, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Empresa" : "Crear Nueva Empresa"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Información de Usuario */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Información de Usuario
            </h3>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value?.trim())
                    return "El correo electrónico es obligatorio";
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Ingrese un correo electrónico válido";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Correo Electrónico</RequiredLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="empresa@ejemplo.com"
                    disabled={isLoading || isEditing}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Información de la Empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Información de la Empresa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="ruc"
                validators={{
                  onChange: ({ value }) => {
                    if (!value?.trim()) return "El RUC es obligatorio";
                    if (!/^\d{11}$/.test(value.replace(/\s/g, ""))) {
                      return "El RUC debe tener 11 dígitos";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>RUC</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="20123456789"
                      maxLength={11}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="businessName"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim()
                      ? "La razón social es obligatoria"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Razón Social</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="EMPRESA EJEMPLO S.A.C."
                      disabled={isLoading}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="tradeName">
              {(field) => (
                <div className="space-y-2">
                  <Label>Nombre Comercial</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Empresa Ejemplo (opcional)"
                    disabled={isLoading}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="address"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? "La dirección es obligatoria" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Dirección</RequiredLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Av. Ejemplo 123, Distrito, Lima, Perú"
                    disabled={isLoading}
                    rows={3}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Información de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="contactName"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim()
                      ? "El nombre de contacto es obligatorio"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Nombre de Contacto</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Juan Pérez"
                      disabled={isLoading}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="contactPhone"
                validators={{
                  onChange: ({ value }) => {
                    if (!value?.trim())
                      return "El teléfono de contacto es obligatorio";
                    if (!/^\d{9,15}$/.test(value.replace(/\s/g, ""))) {
                      return "El teléfono debe tener entre 9 y 15 dígitos";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Teléfono de Contacto</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="999 999 999"
                      disabled={isLoading}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field
              name="contactEmail"
              validators={{
                onChange: ({ value }) => {
                  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Ingrese un correo electrónico válido";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label>Correo de Contacto</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="contacto@empresa.com (opcional)"
                    disabled={isLoading}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Estado */}
          {isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Estado</h3>

              <form.Field name="isActive">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Estado de la Empresa</Label>
                    <Select
                      value={field.state.value ? "true" : "false"}
                      onValueChange={(value) =>
                        field.handleChange(value === "true")
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activa</SelectItem>
                        <SelectItem value="false">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isLoading || isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting || isLoading
                    ? isEditing
                      ? "Actualizando..."
                      : "Creando..."
                    : isEditing
                    ? "Actualizar Empresa"
                    : "Crear Empresa"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
