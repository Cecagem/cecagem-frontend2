"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, CheckSquare, Square } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { useDeliverablesByService } from "@/features/engagements/hooks/useEngagements";

// Schema de validación para el paso 2
const step2Schema = z.object({
  deliverableIds: z.array(z.string()).min(1, "Debe seleccionar al menos un entregable"),
});

export type Step2FormData = z.infer<typeof step2Schema>;

interface ContractFormStep2Props {
  serviceId: string;
  initialData?: Partial<Step2FormData>;
  onNext: (data: Step2FormData) => void;
  onBack: () => void;
}

export const ContractFormStep2 = ({ serviceId, initialData, onNext, onBack }: ContractFormStep2Props) => {
  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      deliverableIds: initialData?.deliverableIds || [],
    },
  });

  // Obtener entregables del servicio seleccionado
  const { data: deliverablesData, isLoading } = useDeliverablesByService(serviceId);

  const selectedIds = form.watch("deliverableIds");
  const deliverables = useMemo(() => deliverablesData?.data || [], [deliverablesData?.data]);

  const handleToggleDeliverable = useCallback((deliverableId: string) => {
    const currentIds = form.getValues("deliverableIds");
    const isSelected = currentIds.includes(deliverableId);
    
    let newIds: string[];
    if (isSelected) {
      newIds = currentIds.filter(id => id !== deliverableId);
    } else {
      newIds = [...currentIds, deliverableId];
    }
    
    form.setValue("deliverableIds", newIds);
  }, [form]);

  const handleSelectAll = useCallback(() => {
    const allIds = deliverables.map(d => d.id);
    const allSelected = allIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      form.setValue("deliverableIds", []);
    } else {
      form.setValue("deliverableIds", allIds);
    }
  }, [deliverables, selectedIds, form]);

  const handleSubmit = (data: Step2FormData) => {
    onNext(data);
  };

  const allSelected = deliverables.length > 0 && deliverables.every(d => selectedIds.includes(d.id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Entregables del Contrato</h2>
          <p className="text-muted-foreground">Cargando entregables...</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Entregables del Contrato</h2>
        <p className="text-muted-foreground">
          Seleccione los entregables que formarán parte de este contrato
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Entregables Disponibles
                  {selectedIds.length > 0 && (
                    <Badge variant="secondary">
                      {selectedIds.length} seleccionados
                    </Badge>
                  )}
                </CardTitle>
                
                {deliverables.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="flex items-center gap-2"
                  >
                    {allSelected ? (
                      <>
                        <CheckSquare className="h-4 w-4" />
                        Deseleccionar Todo
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4" />
                        Seleccionar Todo
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="deliverableIds"
                render={() => (
                  <FormItem>
                    <FormLabel className="sr-only">Entregables</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {deliverables.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="mx-auto h-12 w-12 opacity-50 mb-4" />
                            <p>No hay entregables disponibles para este servicio</p>
                            <p className="text-sm">Contacte al administrador para agregar entregables</p>
                          </div>
                        ) : (
                          deliverables.map((deliverable) => {
                            const isSelected = selectedIds.includes(deliverable.id);
                            
                            return (
                              <div
                                key={deliverable.id}
                                className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50 ${
                                  isSelected ? "bg-primary/5 border-primary/30" : "bg-background border-border"
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleDeliverable(deliverable.id);
                                }}
                              >
                                <div onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggleDeliverable(deliverable.id)}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">{deliverable.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Entregable
                                    </Badge>
                                  </div>
                                  {deliverable.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {deliverable.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>Creado: {new Date(deliverable.createdAt).toLocaleDateString()}</span>
                                    <span>Estado: {deliverable.isActive ? "Activo" : "Inactivo"}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botones de navegación */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Anterior: Información Básica
            </Button>
            
            <Button
              type="submit"
              disabled={selectedIds.length === 0}
            >
              Siguiente: Fechas y Pagos
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};