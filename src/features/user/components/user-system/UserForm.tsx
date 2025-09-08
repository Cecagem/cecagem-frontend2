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
import { DatePicker } from "@/components/ui/date-picker";
import {
  User,
  UserRole,
  DocumentType,
  CreateCompleteUserRequest,
} from "../../types/user.type";
import { createUserData } from "../../hooks/use-users";
import {
  availableRoles,
  documentTypes,
  requiresSalary,
} from "../../utils/user.utils";
import { useEffect } from "react";

interface UserFormProps {
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

export const UserForm = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: UserFormProps) => {
  const isEditing = !!user;

  const form = useForm({
    defaultValues: {
      email: user?.email || "",
      role: user?.role || "COLLABORATOR_EXTERNAL",
      firstName: user?.profile?.firstName || "",
      lastName: user?.profile?.lastName || "",
      documentType: user?.profile?.documentType || "DNI",
      documentNumber: user?.profile?.documentNumber || "",
      phone: user?.profile?.phone || "",
      salaryMonth: user?.profile?.salaryMonth || undefined,
      paymentDate: user?.profile?.paymentDate
        ? new Date(user.profile.paymentDate)
        : undefined,
    },
    onSubmit: async ({ value }) => {
      try {
        let userData;
        const role = value.role as UserRole;

        switch (role) {
          case "RRHH":
            userData = createUserData.rrhh(value.email, {
              firstName: value.firstName,
              lastName: value.lastName,
              documentType: value.documentType as DocumentType,
              documentNumber: value.documentNumber,
              phone: value.phone,
              salaryMonth: value.salaryMonth!,
              paymentDate: value.paymentDate!.toISOString(),
            });
            break;

          case "COLLABORATOR_INTERNAL":
            userData = createUserData.collaboratorInternal(value.email, {
              firstName: value.firstName,
              lastName: value.lastName,
              documentType: value.documentType as DocumentType,
              documentNumber: value.documentNumber,
              phone: value.phone,
              salaryMonth: value.salaryMonth!,
              paymentDate: value.paymentDate!.toISOString(),
            });
            break;

          case "COLLABORATOR_EXTERNAL":
            userData = createUserData.collaboratorExternal(value.email, {
              firstName: value.firstName,
              lastName: value.lastName,
              documentType: value.documentType as DocumentType,
              documentNumber: value.documentNumber,
              phone: value.phone,
            });
            break;

          case "ADMIN":
          default:
            userData = createUserData.admin(value.email, {
              firstName: value.firstName,
              lastName: value.lastName,
              documentType: value.documentType as DocumentType,
              documentNumber: value.documentNumber,
              phone: value.phone,
            });
            break;
        }

        await onSubmit(userData);
        form.reset();
        onClose();
      } catch (error) {
        console.error("Error al crear usuario:", error);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
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
          {/* info del user */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Usuario</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "El email es requerido";
                    if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Email</RequiredLabel>
                    <Input
                      placeholder="admin@ejemplo.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      // disabled={isEditing}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="role"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "El rol es requerido";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Rol</RequiredLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as UserRole)
                      }
                      // disabled={isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* info personl */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="firstName"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Los nombres son requeridos";
                    if (value.length < 2)
                      return "Los nombres deben tener al menos 2 caracteres";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Nombres</RequiredLabel>
                    <Input
                      placeholder="Juan"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
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
                  onChange: ({ value }) => {
                    if (!value) return "Los apellidos son requeridos";
                    if (value.length < 2)
                      return "Los apellidos deben tener al menos 2 caracteres";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Apellidos</RequiredLabel>
                    <Input
                      placeholder="Pérez"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="documentType"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "El tipo de documento es requerido";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Tipo de Documento</RequiredLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as DocumentType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((docType) => (
                          <SelectItem key={docType.value} value={docType.value}>
                            {docType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="documentNumber"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "El número de documento es requerido";
                    if (value.length < 8) return "Número de documento inválido";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Número de Documento</RequiredLabel>
                    <Input
                      placeholder="12345678"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
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
                  onChange: ({ value }) => {
                    if (!value) return "El teléfono es requerido";
                    if (value.length < 9)
                      return "Teléfono debe tener al menos 9 dígitos";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <RequiredLabel>Teléfono</RequiredLabel>
                    <Input
                      placeholder="+51987654321"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* info de contrato */}
          <form.Field name="role">
            {(roleField) => {
              const showSalaryFields = requiresSalary(
                roleField.state.value as UserRole
              );

              return showSalaryFields ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Información de Contrato
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Requerido para{" "}
                    {roleField.state.value === "RRHH"
                      ? "RR.HH"
                      : "Colaborador Interno"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="salaryMonth"
                      validators={{
                        onChange: ({ value }) => {
                          if (
                            showSalaryFields &&
                            (value === undefined || value <= 0)
                          ) {
                            return "El salario debe ser mayor a 0";
                          }
                          return undefined;
                        },
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <RequiredLabel>Salario Mensual</RequiredLabel>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="2500.5"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field
                      name="paymentDate"
                      validators={{
                        onChange: ({ value }) => {
                          if (showSalaryFields && !value) {
                            return "La fecha de pago es requerida";
                          }
                          return undefined;
                        },
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <RequiredLabel>Fecha de Pago</RequiredLabel>
                          <DatePicker
                            value={field.state.value}
                            onValueChange={(date) => field.handleChange(date)}
                            placeholder="Seleccionar fecha"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              ) : null;
            }}
          </form.Field>

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
              {isLoading
                ? isEditing
                  ? "Guardando..."
                  : "Creando..."
                : isEditing
                ? "Guardar Cambios"
                : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
