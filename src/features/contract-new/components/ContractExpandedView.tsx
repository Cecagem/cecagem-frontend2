"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "../utils";
import { Eye } from "lucide-react";
import type { IContract } from "../types";

interface ContractExpandedViewProps {
  contract: IContract;
}

export const ContractExpandedView = ({ contract }: ContractExpandedViewProps) => {
  const [activeTab, setActiveTab] = useState("general");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    });
  };

  // Handlers para acciones
  const handleView = (type: string, id: string) => {
    console.log(`Ver ${type}:`, id);
  };

  const handleVerify = (type: string, id: string) => {
    console.log(`Verificar ${type}:`, id);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="payments">Pagos y Cuotas</TabsTrigger>
          <TabsTrigger value="deliverables">Entregables</TabsTrigger>
        </TabsList>

        {/* TAB 1: INFORMACIÓN GENERAL */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-base">{contract.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Universidad</label>
                  <p className="text-base">{contract.university}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Carrera</label>
                  <p className="text-base">{contract.career}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Costo Total</label>
                  <p className="text-lg font-semibold">{formatCurrency(contract.costTotal, contract.currency)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Inicio</label>
                  <p className="text-base">{formatDate(contract.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Fin</label>
                  <p className="text-base">{formatDate(contract.endDate)}</p>
                </div>
              </div>

              {/* Progreso */}
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso General</span>
                    <span className="text-sm font-medium">{contract.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${contract.overallProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Entregables</span>
                    <span className="text-sm font-medium">{contract.deliverablesPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{ width: `${contract.deliverablesPercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Pagos</span>
                    <span className="text-sm font-medium">{contract.paymentPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${contract.paymentPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {contract.observation && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                  <p className="text-sm mt-1 bg-muted p-3 rounded">{contract.observation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PAGOS Y CUOTAS */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded"></div>
                Cuotas de Pago ({contract.installments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contract.installments.map((installment, index) => (
                  <Card key={installment.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold text-lg">Cuota {index + 1}</span>
                          <Badge 
                            variant={installment.payments.length > 0 ? "default" : "secondary"}
                            className={installment.payments.length > 0 ? "bg-green-500" : ""}
                          >
                            {installment.payments.length > 0 ? "Pagado" : "Pendiente"}
                          </Badge>
                        </div>
                        
                        {/* Monto */}
                        <div className="bg-green-50 dark:bg-green-200/10 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Monto</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(installment.amount, contract.currency)}
                          </p>
                        </div>
                        
                        {/* Información */}
                        <div className="space-y-2 text-sm">
                          <div className="bg-muted p-2 rounded">
                            <span className="text-muted-foreground">Descripción:</span>
                            <p className="font-medium">{installment.description}</p>
                          </div>
                          <div className="bg-muted p-2 rounded">
                            <span className="text-muted-foreground">Fecha límite:</span>
                            <p className="font-medium">{formatDate(installment.dueDate)}</p>
                          </div>
                          {installment.payments.length > 0 && (
                            <>
                              <div className="bg-green-50 dark:bg-green-200/10 p-2 rounded">
                                <span className="text-muted-foreground">Monto pagado:</span>
                                <p className="font-medium text-green-600">
                                  {formatCurrency(installment.payments[0].amount, contract.currency)}
                                </p>
                              </div>
                              <div className="bg-green-50 dark:bg-green-200/10 p-2 rounded">
                                <span className="text-muted-foreground">Fecha de pago:</span>
                                <p className="font-medium text-green-600">
                                  {formatDate(installment.payments[0].createdAt)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleView("cuota", installment.id)}
                          >
                            <Eye className="h-4 w-4 mr-1 text-blue-500" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-green-200 hover:bg-green-50"
                            onClick={() => handleVerify("cuota", installment.id)}
                          >
                            <span className="text-green-500">✓</span> Verificar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ENTREGABLES */}
        <TabsContent value="deliverables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded"></div>
                Entregables ({contract.contractDeliverables.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contract.contractDeliverables.map((deliverable, index) => (
                  <Card key={deliverable.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold text-lg">Entregable {index + 1}</span>
                          <Badge 
                            variant={deliverable.isCompleted ? "default" : "secondary"}
                            className={deliverable.isCompleted ? "bg-blue-500" : ""}
                          >
                            {deliverable.isCompleted ? "Completado" : "Pendiente"}
                          </Badge>
                        </div>
                        
                        {/* ID */}
                        <div className="bg-blue-50 dark:bg-blue-200/10 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">ID del Entregable</p>
                          <p className="text-xl font-bold text-blue-600">
                            {deliverable.deliverableId}
                          </p>
                        </div>
                        
                        {/* Información */}
                        <div className="space-y-2 text-sm">
                          <div className="bg-muted p-2 rounded">
                            <span className="text-muted-foreground">Fecha asignada:</span>
                            <p className="font-medium">{formatDate(deliverable.assignedAt)}</p>
                          </div>
                          {deliverable.completedAt && (
                            <div className="bg-blue-50 dark:bg-blue-200/10 p-2 rounded">
                              <span className="text-muted-foreground">Fecha completado:</span>
                              <p className="font-medium text-blue-600">
                                {formatDate(deliverable.completedAt)}
                              </p>
                            </div>
                          )}
                          {deliverable.notes && (
                            <div className="bg-muted p-2 rounded">
                              <span className="text-muted-foreground">Notas:</span>
                              <p className="font-medium">{deliverable.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Botón */}
                        <div className="pt-3 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-blue-200 hover:bg-blue-50"
                            onClick={() => handleVerify("entregable", deliverable.id)}
                          >
                            <span className="text-blue-500">✓</span> Verificar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};