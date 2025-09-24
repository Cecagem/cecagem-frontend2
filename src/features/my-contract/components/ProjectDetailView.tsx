"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Calendar, 
  FileText, 
  CreditCard,
  GraduationCap,
  Eye
} from "lucide-react";
import { IContract } from "@/features/contract/types/contract.types";
import { useContract } from "@/features/contract/hooks/useContracts";
import { ProjectPaymentTab } from "./ProjectPaymentTab";
import { ProjectDeliverablesTab } from "./ProjectDeliverablesTab";
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
  const [activeTab, setActiveTab] = useState("overview");
  
  // Usar hook para obtener datos actualizados del contrato
  const { data: freshContract, isLoading: contractLoading } = useContract(
    initialContract?.id || ""
  );
  
  // Usar datos frescos si están disponibles, sino usar los iniciales
  const contract = freshContract || initialContract;
  const isLoading = initialLoading || contractLoading;

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
        <Badge className="bg-green-100 text-green-800">
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
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Colaborador</p>
                <p className="font-medium">Por asignar</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="deliverables" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Entregables
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estadísticas del proyecto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{contract.overallProgress}%</p>
                  <p className="text-sm text-muted-foreground">Progreso general</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{contract.deliverablesPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Entregables</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{contract.paymentPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Pagos</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{contract.contractDeliverables.length}</p>
                  <p className="text-sm text-muted-foreground">Total entregables</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progreso visual */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso general</span>
                  <span className="font-medium">{contract.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${contract.overallProgress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Entregables completados</span>
                  <span className="font-medium">{contract.deliverablesPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${contract.deliverablesPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Pagos realizados</span>
                  <span className="font-medium">{contract.paymentPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${contract.paymentPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliverables">
          <ProjectDeliverablesTab 
            contract={contract}
          />
        </TabsContent>

        <TabsContent value="payments">
          <ProjectPaymentTab contract={contract} />
        </TabsContent>
      </Tabs>
    </div>
  );
};