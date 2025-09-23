import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateTime } from "../utils/date.utils";
import type { IContract } from "../types/contract.type";

interface ContractDetailsProps {
  contract: IContract;
}

export const ContractDetails = ({ contract }: ContractDetailsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalles del Contrato</span>
          <Badge variant="default">Activo</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="information">Información</TabsTrigger>
            <TabsTrigger value="payments">Pagos y Cuotas</TabsTrigger>
            <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="information" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    INFORMACIÓN BÁSICA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nombre del contrato</p>
                    <p className="text-sm">{contract.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Observación</p>
                    <p className="text-sm">{contract.observation || "Sin observaciones"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Universidad</p>
                    <p className="text-sm">{contract.university || "No especificada"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Carrera</p>
                    <p className="text-sm">{contract.career || "No especificada"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información financiera */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    INFORMACIÓN FINANCIERA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Costo total</p>
                    <p className="text-lg font-semibold text-primary">
                      {contract.currency} {contract.costTotal?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Moneda</p>
                    <p className="text-sm">{contract.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progreso general</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {contract.overallProgress?.toFixed(0) || 0}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fechas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    FECHAS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha inicio</p>
                    <p className="text-sm">{formatDate(contract.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha fin</p>
                    <p className="text-sm">{formatDate(contract.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Creado</p>
                    <p className="text-sm">{formatDateTime(contract.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Usuarios y entregables */}
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    USUARIOS Y ENTREGABLES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{contract.contractUsers?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Usuarios asignados</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{contract.contractDeliverables?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Entregables</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-muted-foreground">
                    Gestión de Pagos y Cuotas
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Aquí se mostrará la información de pagos, cuotas y estados
                    financieros
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="mt-6">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-muted-foreground">
                    Seguimiento de Progreso
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Aquí se mostrará el seguimiento del progreso del contrato y
                    entregables
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
