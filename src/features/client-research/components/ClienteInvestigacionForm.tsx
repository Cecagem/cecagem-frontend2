"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  ClienteInvestigacionFormData,
  clienteInvestigacionSchema,
  ClienteInvestigacion,
  ClienteInvestigacionEstado,
  Universidad,
  Facultad,
  GradoAcademico,
} from "../types/index";

interface ClienteInvestigacionFormProps {
  cliente?: ClienteInvestigacion;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cliente: Omit<ClienteInvestigacion, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export default function ClienteInvestigacionForm({
  cliente,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ClienteInvestigacionFormProps) {
  const form = useForm<ClienteInvestigacionFormData>({
    resolver: zodResolver(clienteInvestigacionSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      correo: "",
      telefono: "",
      universidad: Universidad.UNMSM,
      facultad: Facultad.INGENIERIA,
      carrera: "",
      grado: GradoAcademico.BACHILLER,
      estado: ClienteInvestigacionEstado.ACTIVO,
    },
  });

  // Cargar datos del cliente cuando se abre el modal en modo edición
  useEffect(() => {
    if (isOpen) {
      if (cliente) {
        // Modo edición - cargar datos del cliente
        form.reset({
          nombres: cliente.nombres,
          apellidos: cliente.apellidos,
          correo: cliente.correo,
          telefono: cliente.telefono,
          universidad: cliente.universidad,
          facultad: cliente.facultad,
          carrera: cliente.carrera,
          grado: cliente.grado,
          estado: cliente.estado,
        });
      } else {
        // Modo creación - resetear formulario
        form.reset({
          nombres: "",
          apellidos: "",
          correo: "",
          telefono: "",
          universidad: Universidad.UNMSM,
          facultad: Facultad.INGENIERIA,
          carrera: "",
          grado: GradoAcademico.BACHILLER,
          estado: ClienteInvestigacionEstado.ACTIVO,
        });
      }
    }
  }, [isOpen, cliente, form]);

  const handleSubmit = async (data: ClienteInvestigacionFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente de Investigación" : "Nuevo Cliente de Investigación"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombres"
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
                name="apellidos"
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

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="ejemplo@correo.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            {/* Universidad - Fila separada */}
            <FormField
              control={form.control}
              name="universidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Universidad *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una universidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {Object.values(Universidad).map((universidad) => (
                        <SelectItem key={universidad} value={universidad}>
                          {universidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Facultad - Fila separada */}
            <FormField
              control={form.control}
              name="facultad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facultad *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una facultad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {Object.values(Facultad).map((facultad) => (
                        <SelectItem key={facultad} value={facultad}>
                          {facultad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carrera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrera *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ingeniería de Sistemas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="grado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grado Académico *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un grado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={GradoAcademico.BACHILLER}>
                          Bachiller
                        </SelectItem>
                        <SelectItem value={GradoAcademico.EGRESADO}>
                          Egresado
                        </SelectItem>
                        <SelectItem value={GradoAcademico.MAESTRIA}>
                          Maestría
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ClienteInvestigacionEstado.ACTIVO}>
                          Activo
                        </SelectItem>
                        <SelectItem value={ClienteInvestigacionEstado.INACTIVO}>
                          Inactivo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {cliente ? "Actualizar" : "Crear"} Cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
