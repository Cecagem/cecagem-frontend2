"use client";

import { useForm } from "react-hook-form";
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
import { ClienteContable, ClienteContableSchema, ClienteEstado } from "../types";

interface ClienteContableFormProps {
  cliente?: ClienteContable;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cliente: Omit<ClienteContable, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export default function ClienteContableForm({ cliente, isOpen, onClose, onSubmit, isLoading }: ClienteContableFormProps) {
  const form = useForm<Omit<ClienteContable, 'id'>>({
    resolver: zodResolver(ClienteContableSchema.omit({ id: true })),
    defaultValues: {
      ruc: "",
      razonSocial: "",
      nombreComercial: "",
      direccion: "",
      nombreContacto: "",
      telefono: "",
      email: "",
      estado: ClienteEstado.ACTIVO,
    },
  });

  // Resetear el formulario cuando cambie el cliente o se abra el modal
  useEffect(() => {
    if (isOpen) {
      form.reset({
        ruc: cliente?.ruc || "",
        razonSocial: cliente?.razonSocial || "",
        nombreComercial: cliente?.nombreComercial || "",
        direccion: cliente?.direccion || "",
        nombreContacto: cliente?.nombreContacto || "",
        telefono: cliente?.telefono || "",
        email: cliente?.email || "",
        estado: cliente?.estado || ClienteEstado.ACTIVO,
      });
    }
  }, [cliente, isOpen, form]);

  const handleSubmit = async (data: Omit<ClienteContable, 'id'>) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  const handleClose = () => {
    form.reset({
      ruc: "",
      razonSocial: "",
      nombreComercial: "",
      direccion: "",
      nombreContacto: "",
      telefono: "",
      email: "",
      estado: ClienteEstado.ACTIVO,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente Contable" : "Crear Nuevo Cliente Contable"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RUC */}
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
                        <SelectItem value={ClienteEstado.ACTIVO}>Activo</SelectItem>
                        <SelectItem value={ClienteEstado.INACTIVO}>Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Razón Social */}
            <FormField
              control={form.control}
              name="razonSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social *</FormLabel>
                  <FormControl>
                    <Input placeholder="COMERCIAL LIMA S.A.C." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre Comercial */}
            <FormField
              control={form.control}
              name="nombreComercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Comercial *</FormLabel>
                  <FormControl>
                    <Input placeholder="Comercial Lima" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dirección */}
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección *</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Javier Prado Este 123, San Isidro, Lima" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre de Contacto */}
              <FormField
                control={form.control}
                name="nombreContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Contacto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez Rodríguez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contacto@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : (cliente ? "Actualizar Cliente" : "Crear Cliente")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
