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
import {
  User,
  DocumentType,
  AcademicDegree,
  CreateCompleteUserRequest,
} from "../../types/user.type";
import { createUserData } from "../../hooks/use-users";
import { documentTypes } from "../../utils/user.utils";
import { useEffect } from "react";

interface ClientFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: CreateCompleteUserRequest) => Promise<void>;
  isLoading?: boolean;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-sm font-medium">
    {children} <span className="text-red-500">*</span>
  </Label>
);

const academicDegrees: AcademicDegree[] = [
  "Bachiller",
  "Licenciado",
  "Magister",
  "Doctor",
];

export const ClientForm = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ClientFormProps) => {
  const isEditing = !!user;

  const form = useForm({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.profile?.firstName || "",
      lastName: user?.profile?.lastName || "",
      documentType: user?.profile?.documentType || "DNI",
      documentNumber: user?.profile?.documentNumber || "",
      phone: user?.profile?.phone || "",
      university: user?.profile?.university || "",
      faculty: user?.profile?.faculty || "",
      career: user?.profile?.career || "",
      academicDegree: user?.profile?.academicDegree || "Bachiller",
      isActive: user?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      try {
        const userData = createUserData.client(value.email, {
          firstName: value.firstName,
          lastName: value.lastName,
          documentType: value.documentType as DocumentType,
          documentNumber: value.documentNumber,
          phone: value.phone,
          university: value.university,
          faculty: value.faculty,
          career: value.career,
          academicDegree: value.academicDegree as AcademicDegree,
        });

        if (isEditing && userData.user) {
          userData.user.isActive = value.isActive;
        }

        await onSubmit(userData);
      } catch (error) {
        console.error("Error en formulario de cliente:", error);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, user, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
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
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="firstName"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? "Los nombres son obligatorios" : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Nombres</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ingrese los nombres"
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
                name="lastName"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim()
                      ? "Los apellidos son obligatorios"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Apellidos</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ingrese los apellidos"
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
                    placeholder="correo@ejemplo.com"
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

            <form.Field
              name="phone"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? "El teléfono es obligatorio" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Teléfono</RequiredLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="documentType">
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Tipo de Documento</RequiredLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as DocumentType)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field
                name="documentNumber"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim()
                      ? "El número de documento es obligatorio"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Número de Documento</RequiredLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="12345678"
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
          </div>

          {/* Información Académica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Información Académica
            </h3>

            <form.Field
              name="university"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? "La universidad es obligatoria" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Universidad</RequiredLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Universidad Nacional Mayor de San Marcos"
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
              name="faculty"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? "La facultad es obligatoria" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Facultad</RequiredLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Facultad de Ingeniería"
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
              name="career"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? "La carrera es obligatoria" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Carrera</RequiredLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ingeniería de Sistemas"
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

            <form.Field name="academicDegree">
              {(field) => (
                <div className="space-y-2">
                  <RequiredLabel>Grado Académico</RequiredLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as AcademicDegree)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione grado académico" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicDegrees.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          {isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Estado</h3>

              <form.Field name="isActive">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Estado del Cliente</Label>
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
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>
          )}

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
                    ? "Actualizar Cliente"
                    : "Crear Cliente"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
