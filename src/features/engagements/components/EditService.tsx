"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateService } from "../hooks/useEngagements";
import { updateServiceSchema } from "../utils/engagements.utils";
import { UpdateServiceRequest, Service } from "../types/engagements.type";

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
}: EditServiceDialogProps) {
  const updateServiceMutation = useUpdateService();

  const form = useForm<UpdateServiceRequest>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (service && open) {
      form.reset({
        name: service.name || "",
        description: service.description || "",
        basePrice: Number(service.basePrice) || 0,
        isActive: Boolean(service.isActive),
      });
    }
  }, [service, form, open]);

  const onSubmit = async (data: UpdateServiceRequest) => {
    if (!service) return;

    try {
      await updateServiceMutation.mutateAsync({
        serviceId: service.id,
        serviceData: {
          ...data,
          basePrice: Number(data.basePrice),
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      {" "}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
          <DialogDescription>
            Modifica los datos del servicio seleccionado.
          </DialogDescription>
        </DialogHeader>

        {!service ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-muted-foreground">
              No hay datos del servicio disponibles.
            </span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Servicio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Plan de Tesis, Artículo Científico..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el servicio que se ofrecerá..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Base (S/.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Servicio activo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={updateServiceMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateServiceMutation.isPending}
                >
                  {updateServiceMutation.isPending
                    ? "Actualizando..."
                    : "Actualizar Servicio"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
