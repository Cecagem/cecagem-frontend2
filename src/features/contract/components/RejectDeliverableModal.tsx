"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

const rejectDeliverableSchema = z.object({
  notes: z.string().min(10, "La nota debe tener al menos 10 caracteres").max(500, "La nota no puede exceder 500 caracteres"),
});

type RejectDeliverableFormData = z.infer<typeof rejectDeliverableSchema>;

interface RejectDeliverableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes: string) => void;
  deliverableName: string;
  isLoading?: boolean;
}

export const RejectDeliverableModal = ({
  open,
  onOpenChange,
  onConfirm,
  deliverableName,
  isLoading = false,
}: RejectDeliverableModalProps) => {
  const form = useForm<RejectDeliverableFormData>({
    resolver: zodResolver(rejectDeliverableSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleSubmit = (data: RejectDeliverableFormData) => {
    onConfirm(data.notes);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Rechazar Entregable
          </DialogTitle>
          <DialogDescription>
            Estás a punto de rechazar el entregable <strong>{deliverableName}</strong>. 
            Por favor, proporciona una nota explicando el motivo del rechazo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Motivo del rechazo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe detalladamente por qué se rechaza este entregable..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/500 caracteres
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? "Rechazando..." : "Rechazar Entregable"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};