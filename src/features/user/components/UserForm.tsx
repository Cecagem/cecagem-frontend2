"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
  UserSchema, 
  UserRol, 
  UserEstado, 
  requiresContract, 
  getRolLabel, 
  getEstadoLabel 
} from "../types";

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export default function UserForm({ user, isOpen, onClose, onSubmit, isLoading }: UserFormProps) {
  const form = useForm<Omit<User, 'id'>>({
    resolver: zodResolver(UserSchema.omit({ id: true })),
    defaultValues: {
      nombres: "",
      apellidos: "",
      telefono: "",
      email: "",
      rol: UserRol.COLABORADOR_EXTERNO,
      estado: UserEstado.ACTIVO,
      contrato: undefined,
    },
  });

  // Watch para el rol seleccionado
  const selectedRol = useWatch({
    control: form.control,
    name: "rol",
  });

  // Resetear el formulario cuando cambie el usuario o se abra el modal
  useEffect(() => {
    if (isOpen) {
      const contratoData = user?.contrato ? {
        montoPago: user.contrato.montoPago,
        fechaContrato: user.contrato.fechaContrato instanceof Date 
          ? user.contrato.fechaContrato 
          : new Date(user.contrato.fechaContrato)
      } : undefined;

      form.reset({
        nombres: user?.nombres || "",
        apellidos: user?.apellidos || "",
        telefono: user?.telefono || "",
        email: user?.email || "",
        rol: user?.rol || UserRol.COLABORADOR_EXTERNO,
        estado: user?.estado || UserEstado.ACTIVO,
        contrato: contratoData,
      });
    }
  }, [user, isOpen, form]);

  // Limpiar contrato cuando el rol no lo requiere
  useEffect(() => {
    if (!requiresContract(selectedRol)) {
      form.setValue("contrato", undefined);
    } else if (!form.getValues("contrato")) {
      const today = new Date();
      form.setValue("contrato", {
        montoPago: 0,
        fechaContrato: today,
      });
    }
  }, [selectedRol, form]);

  const handleSubmit = async (data: Omit<User, 'id'>) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleClose = () => {
    form.reset({
      nombres: "",
      apellidos: "",
      telefono: "",
      email: "",
      rol: UserRol.COLABORADOR_EXTERNO,
      estado: UserEstado.ACTIVO,
      contrato: undefined,
    });
    onClose();
  };

  const showContractFields = requiresContract(selectedRol);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <FormField
                  control={form.control}
                  name="nombres"
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

                {/* Apellidos */}
                <FormField
                  control={form.control}
                  name="apellidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos *</FormLabel>
                      <FormControl>
                        <Input placeholder="García López" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teléfono */}
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono *</FormLabel>
                      <FormControl>
                        <Input placeholder="987654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="usuario@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información del Sistema</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rol */}
                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(UserRol).map((rol) => (
                            <SelectItem key={rol} value={rol}>
                              {getRolLabel(rol)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estado */}
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(UserEstado).map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {getEstadoLabel(estado)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Información de Contrato - Solo para roles que lo requieren */}
            {showContractFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información de Contrato</h3>
                <p className="text-sm text-muted-foreground">
                  Estos campos son requeridos para el rol seleccionado.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monto de Pago */}
                  <FormField
                    control={form.control}
                    name="contrato.montoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto de Pago Mensual (S/) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="3500" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha de Contrato */}
                  <FormField
                    control={form.control}
                    name="contrato.fechaContrato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Contrato *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? (() => {
                              const date = new Date(field.value);
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              return `${year}-${month}-${day}`;
                            })() : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                // Crear fecha en zona horaria local para evitar problemas de UTC
                                const [year, month, day] = e.target.value.split('-').map(Number);
                                const localDate = new Date(year, month - 1, day);
                                field.onChange(localDate);
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : (user ? "Actualizar Usuario" : "Crear Usuario")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
