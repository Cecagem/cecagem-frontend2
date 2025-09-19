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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    INFORMACIÓN BÁSICA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Nombre del contrato:
                    </span>
                    <span className="text-sm">{contract.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Observacion:</span>
                    <span className="text-sm">{contract.observation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Universidad:</span>
                    <span className="text-sm">
                      {contract.university || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Carrera:</span>
                    <span className="text-sm">{contract.career || "N/A"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Usuarios y entregables */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    USUARIOS Y ENTREGABLES
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Usuarios asignados:
                    </span>
                    <div>
                      <span>{contract.contractUsers?.length || 0}</span>
                    </div>

                    {/* <Badge variant="secondary">
                      {contract.contractUsers?.length || 0}
                    </Badge> */}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Entregables:</span>
                    <Badge variant="secondary">
                      {contract.contractDeliverables?.length || 0}
                    </Badge>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fecha inicio:</span>
                    <span className="text-sm">
                      {formatDate(contract.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fecha fin:</span>
                    <span className="text-sm">
                      {formatDate(contract.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Creado:</span>
                    <span className="text-sm">
                      {formatDateTime(contract.createdAt)}
                    </span>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Costo total:</span>
                    <span className="text-sm font-semibold">
                      {contract.currency} {contract.costTotal?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Moneda:</span>
                    <span className="text-sm">{contract.currency}</span>
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
