"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import { IContract, IContractDeliverable } from "@/features/contract/types/contract.types";
import { useUpdateDeliverable } from "@/features/contract/hooks/useContracts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectDeliverablesTabProps {
  contract: IContract;
}

export const ProjectDeliverablesTab = ({ contract }: ProjectDeliverablesTabProps) => {
  const [loadingDeliverables, setLoadingDeliverables] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  
  // Usar el hook de contratos para actualizar entregables
  const updateDeliverableMutation = useUpdateDeliverable();

  const handleMarkCompleted = async (deliverable: IContractDeliverable) => {
    if (deliverable.isCompleted) return;
    
    setLoadingDeliverables(prev => [...prev, deliverable.deliverableId]);
    try {
      await updateDeliverableMutation.mutateAsync({
        contractId: contract.id,
        deliverableId: deliverable.deliverableId,
        data: {
          isCompleted: true,
          notes: notes[deliverable.deliverableId] || '',
        }
      });
      setNotes(prev => ({ ...prev, [deliverable.deliverableId]: '' }));
    } catch (error) {
      console.error('Error marking deliverable as completed:', error);
    } finally {
      setLoadingDeliverables(prev => prev.filter(id => id !== deliverable.deliverableId));
    }
  };

  const handleNotesChange = (deliverableId: string, value: string) => {
    setNotes(prev => ({ ...prev, [deliverableId]: value }));
  };

  const getDeliverableStatusColor = (deliverable: IContractDeliverable) => {
    if (deliverable.isCompleted && deliverable.isAproved) {
      return 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-300';
    } else if (deliverable.isCompleted && !deliverable.isAproved) {
      return 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 text-yellow-800 dark:text-yellow-200';
    } else {
      return 'bg-gray-100 text-gray-800 dark:text-gray-100 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800/30';
    }
  };

  const getDeliverableStatusText = (deliverable: IContractDeliverable) => {
    if (deliverable.isCompleted && deliverable.isAproved) {
      return 'Aprobado';
    } else if (deliverable.isCompleted && !deliverable.isAproved) {
      return 'En Revisión';
    } else {
      return 'Pendiente';
    }
  };

  const completedDeliverables = contract.contractDeliverables.filter(d => d.isCompleted).length;
  const totalDeliverables = contract.contractDeliverables.length;
  const progress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mis Entregables
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Marca como completados tus entregables y añade notas para el seguimiento
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completedDeliverables}/{totalDeliverables}</div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progreso del proyecto</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de entregables */}
      <div className="space-y-4">
        {contract.contractDeliverables && contract.contractDeliverables.length > 0 ? (
          contract.contractDeliverables.map((deliverable, index) => (
            <Card key={deliverable.id} className={`${deliverable.isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      deliverable.isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                    }`}>
                      {deliverable.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{deliverable.deliverable?.name || `Entregable #${index + 1}`}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {deliverable.deliverable?.description || 'Sin descripción disponible'}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Asignado: {format(new Date(deliverable.assignedAt), 'dd MMM yyyy', { locale: es })}
                      </div>
                      {deliverable.completedAt && (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400 mt-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completado: {format(new Date(deliverable.completedAt), 'dd MMM yyyy', { locale: es })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDeliverableStatusColor(deliverable)}>
                      {getDeliverableStatusText(deliverable)}
                    </Badge>
                  </div>
                </div>

                {/* Notas existentes */}
                {deliverable.notes && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Notas del entregable</span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">{deliverable.notes}</p>
                  </div>
                )}

                {/* Sección para marcar como completado */}
                {!deliverable.isCompleted && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Notas (opcional)
                      </label>
                      <Textarea
                        placeholder="Añade notas sobre el progreso o detalles del entregable..."
                        value={notes[deliverable.deliverableId] || ''}
                        onChange={(e) => handleNotesChange(deliverable.deliverableId, e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleMarkCompleted(deliverable)}
                      disabled={loadingDeliverables.includes(deliverable.deliverableId)}
                      className="w-full sm:w-auto"
                    >
                      {loadingDeliverables.includes(deliverable.deliverableId) ? (
                        'Marcando...'
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Completado
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Mensaje para entregables completados */}
                {deliverable.isCompleted && !deliverable.isAproved && (
                  <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                      Entregable completado, esperando revisión del administrador
                    </span>
                  </div>
                )}

                {deliverable.isCompleted && deliverable.isAproved && (
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      ¡Entregable aprobado! Excelente trabajo.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay entregables asignados</h3>
              <p className="text-muted-foreground">
                Los entregables aparecerán aquí cuando sean asignados por el administrador
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};