"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building2,
  Calendar, 
  FileText, 
  CreditCard,
  GraduationCap,
  DollarSign,
} from "lucide-react";
import { IContract } from "@/features/contract/types/contract.types";
import { useContract } from "@/features/contract/hooks/useContracts";
import { useAuthStore } from "@/features/auth";
import { ProjectPaymentTab } from "./ProjectPaymentTab";
import { ProjectDeliverablesTab } from "./ProjectDeliverablesTab";
import { ProjectMyPaymentTab } from "./ProjectMyPaymentTab";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectDetailViewProps {
  contract: IContract | null;
  onBack: () => void;
  isLoading?: boolean;
}

export const ProjectDetailView = ({ 
  contract: initialContract, 
  onBack, 
  isLoading: initialLoading 
}: ProjectDetailViewProps) => {
  const [activeTab, setActiveTab] = useState("deliverables");
  
  // Obtener usuario actual
  const { user } = useAuthStore();
  
  // Usar hook para obtener datos actualizados del contrato
  const { data: freshContract, isLoading: contractLoading } = useContract(
    initialContract?.id || ""
  );
  
  // Usar datos frescos si están disponibles, sino usar los iniciales
  const contract = freshContract || initialContract;
  const isLoading = initialLoading || contractLoading;

  // Verificar si el usuario actual es un colaborador externo
  const isExternalCollaborator = user?.role === 'COLLABORATOR_EXTERNAL';

  if (isLoading || !contract) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: contract.currency || 'PEN'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis proyectos
          </Button>
        </div>
        <Badge variant="default">
          Activo
        </Badge>
      </div>

      {/* Información general del proyecto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{contract.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Universidad</p>
                <p className="font-medium">{contract.university}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Carrera</p>
                <p className="font-medium">{contract.career}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de inicio</p>
                <p className="font-medium">
                  {format(new Date(contract.startDate), 'dd MMM yyyy', { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de fin</p>
                <p className="font-medium">
                  {format(new Date(contract.endDate), 'dd MMM yyyy', { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo total</p>
                <p className="font-medium">{formatCurrency(contract.costTotal)}</p>
              </div>
            </div>
          </div>

          {contract.observation && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Observaciones</h4>
              <p className="text-sm text-muted-foreground">{contract.observation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${isExternalCollaborator ? 'grid-cols-2' : 'grid-cols-2'}`}>
          <TabsTrigger value="deliverables" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Entregables
          </TabsTrigger>
          {isExternalCollaborator ? (
            <TabsTrigger value="my-payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Mis Pagos
            </TabsTrigger>
          ) : (
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pagos
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="deliverables">
          <ProjectDeliverablesTab 
            contract={contract}
          />
        </TabsContent>

        {!isExternalCollaborator && (
          <TabsContent value="payments">
            <ProjectPaymentTab contract={contract} />
          </TabsContent>
        )}

        {isExternalCollaborator && (
          <TabsContent value="my-payments">
            <ProjectMyPaymentTab contract={contract} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};