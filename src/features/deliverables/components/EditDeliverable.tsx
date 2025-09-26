"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateDeliverable } from "../hooks/useDeliverables";
import { IDeliverable } from "../types/deliverable.types";
import { Service } from "@/features/engagements/types/engagements.type";

interface EditDeliverableDialogProps {
  deliverable: IDeliverable;
  services: Service[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  serviceId: z.string().min(1, "El servicio es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export const EditDeliverableDialog = ({
  deliverable,
  services,
  open,
  onOpenChange,
}: EditDeliverableDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMutation = useUpdateDeliverable();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: deliverable.serviceId,
      name: deliverable.name,
      description: deliverable.description,
      isActive: deliverable.isActive,
    },
  });

  useEffect(() => {
    if (deliverable) {
      form.reset({
        serviceId: deliverable.serviceId,
        name: deliverable.name,
        description: deliverable.description,
        isActive: deliverable.isActive,
      });
    }
  }, [deliverable, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await updateMutation.mutateAsync({
        id: deliverable.id,
        data,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating deliverable:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editar Entregable</DialogTitle>
          <DialogDescription>
            Modifica la información del entregable &quot;{deliverable.name}&quot;.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Información básica</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nombre del entregable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un servicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - ${service.basePrice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del entregable..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Estado */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Entregable activo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        El entregable estará disponible para su uso
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
