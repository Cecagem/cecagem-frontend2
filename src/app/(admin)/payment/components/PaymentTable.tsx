import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { InfoPagoProyecto, EstadoPagoCuota, MonedaPago, TipoPagoProyecto, FiltrosPago } from "../types";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Search
} from "lucide-react";

interface PaymentTableProps {
  proyectos: InfoPagoProyecto[];
  loading?: boolean;
  onValidarPago: (cuotaId: string, observaciones?: string) => Promise<{ success: boolean; error?: string }>;
  onRechazarPago: (cuotaId: string, observaciones: string) => Promise<{ success: boolean; error?: string }>;
  filtros: FiltrosPago;
  onFiltrosChange: (filtros: FiltrosPago) => void;
}

export function PaymentTable({ 
  proyectos, 
  loading, 
  onValidarPago,
  onRechazarPago,
  filtros,
  onFiltrosChange
}: PaymentTableProps) {
  const [proyectoExpandido, setProyectoExpandido] = useState<string | null>(null);
  const [dialogPago, setDialogPago] = useState<{ 
    cuotaId: string; 
    accion: 'validar' | 'rechazar'; 
    proyecto: string;
    monto: number;
    moneda: MonedaPago;
  } | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [procesando, setProcesando] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEstadoBadge = (estado: EstadoPagoCuota) => {
    switch (estado) {
      case EstadoPagoCuota.PENDIENTE:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case EstadoPagoCuota.MARCADO_PAGADO:
        return <Badge variant="secondary"><Eye className="h-3 w-3 mr-1" />Por Validar</Badge>;
      case EstadoPagoCuota.VALIDADO:
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Validado</Badge>;
      case EstadoPagoCuota.RECHAZADO:
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
      case EstadoPagoCuota.VENCIDO:
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Vencido</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const formatMoney = (amount: number, moneda: MonedaPago) => {
    const symbol = moneda === MonedaPago.SOLES ? "S/" : "$";
    return `${symbol} ${amount.toLocaleString()}`;
  };

  const toggleProyecto = (proyectoId: string) => {
    setProyectoExpandido(proyectoExpandido === proyectoId ? null : proyectoId);
  };

  const abrirDialogPago = (cuotaId: string, accion: 'validar' | 'rechazar', proyecto: string, monto: number, moneda: MonedaPago) => {
    setDialogPago({ cuotaId, accion, proyecto, monto, moneda });
    setObservaciones("");
  };

  const confirmarAccion = async () => {
    if (!dialogPago) return;

    setProcesando(true);
    try {
      let resultado;
      if (dialogPago.accion === 'validar') {
        resultado = await onValidarPago(dialogPago.cuotaId, observaciones || undefined);
      } else {
        if (!observaciones.trim()) {
          alert("Las observaciones son obligatorias para rechazar un pago");
          return;
        }
        resultado = await onRechazarPago(dialogPago.cuotaId, observaciones);
      }

      if (resultado.success) {
        setDialogPago(null);
        setObservaciones("");
      } else {
        alert(resultado.error || "Error al procesar la acción");
      }
    } catch {
      alert("Error inesperado al procesar la acción");
    } finally {
      setProcesando(false);
    }
  };

  if (proyectos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Proyectos y Pagos
          </CardTitle>
          <CardDescription>
            Gestiona los pagos y validaciones de todos los proyectos activos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buscador siempre visible */}
          <div className="border-b pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Búsqueda</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por proyecto o colaborador..."
                value={filtros.busqueda || ""}
                onChange={(e) => onFiltrosChange({ ...filtros, busqueda: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Mensaje de no encontrado */}
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron proyectos con los filtros aplicados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Proyectos y Pagos
          </CardTitle>
          <CardDescription>
            Gestiona los pagos y validaciones de todos los proyectos activos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buscador simple */}
          <div className="border-b pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Búsqueda</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por proyecto o colaborador..."
                value={filtros.busqueda || ""}
                onChange={(e) => onFiltrosChange({ ...filtros, busqueda: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de proyectos */}
          <div className="space-y-4">
            {proyectos.map((proyecto) => (
              <div key={proyecto.proyectoId} className="border rounded-lg overflow-hidden">
                {/* Cabecera del proyecto */}
                <div 
                  className="p-4 bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => toggleProyecto(proyecto.proyectoId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {proyectoExpandido === proyecto.proyectoId ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                      <div>
                        <h3 className="font-semibold text-sm">
                          {proyecto.tituloProyecto}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {proyecto.colaboradorNombre} • {proyecto.clienteNombres.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {formatMoney(proyecto.montoTotal, proyecto.moneda)}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant={proyecto.tipoPago === TipoPagoProyecto.CONTADO ? "default" : "secondary"}>
                            {proyecto.tipoPago === TipoPagoProyecto.CONTADO ? "Contado" : "Cuotas"}
                          </Badge>
                          {proyecto.cuotasVencidas > 0 && (
                            <Badge variant="destructive">
                              {proyecto.cuotasVencidas} vencidas
                            </Badge>
                          )}
                          {proyecto.cuotasPendientesValidacion > 0 && (
                            <Badge variant="secondary">
                              {proyecto.cuotasPendientesValidacion} por validar
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles expandibles */}
                {proyectoExpandido === proyecto.proyectoId && (
                  <div className="p-4 border-t">
                    {proyecto.tipoPago === TipoPagoProyecto.CONTADO ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          Proyecto de pago al contado - {formatMoney(proyecto.montoTotal, proyecto.moneda)}
                        </p>
                        <Badge variant="default" className="mt-2">
                          Pago Único
                        </Badge>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cuota</TableHead>
                              <TableHead>Monto</TableHead>
                              <TableHead>Vencimiento</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Fecha Pago</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {proyecto.cuotas?.map((cuota) => (
                              <TableRow key={cuota.id}>
                                <TableCell>
                                  <Badge variant="outline">
                                    Cuota {cuota.numero}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {formatMoney(cuota.monto, proyecto.moneda)}
                                </TableCell>
                                <TableCell>
                                  {cuota.fechaVencimiento.toLocaleDateString('es-PE')}
                                </TableCell>
                                <TableCell>
                                  {getEstadoBadge(cuota.estadoPago)}
                                </TableCell>
                                <TableCell>
                                  {cuota.fechaPago ? 
                                    cuota.fechaPago.toLocaleDateString('es-PE') : 
                                    "-"
                                  }
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    {cuota.comprobantePago && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                      >
                                        <FileText className="h-3 w-3" />
                                        Ver
                                      </Button>
                                    )}
                                    {cuota.estadoPago === EstadoPagoCuota.MARCADO_PAGADO && (
                                      <>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => abrirDialogPago(
                                            cuota.id, 
                                            'validar', 
                                            proyecto.tituloProyecto,
                                            cuota.monto,
                                            proyecto.moneda
                                          )}
                                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-3 w-3" />
                                          Validar
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => abrirDialogPago(
                                            cuota.id, 
                                            'rechazar', 
                                            proyecto.tituloProyecto,
                                            cuota.monto,
                                            proyecto.moneda
                                          )}
                                          className="flex items-center gap-1"
                                        >
                                          <XCircle className="h-3 w-3" />
                                          Rechazar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para confirmar acciones */}
      <Dialog open={!!dialogPago} onOpenChange={() => setDialogPago(null)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] sm:max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {dialogPago?.accion === 'validar' ? 'Validar Pago' : 'Rechazar Pago'}
            </DialogTitle>
            <DialogDescription>
              {dialogPago?.accion === 'validar' 
                ? 'Confirma que el pago ha sido validado correctamente'
                : 'Proporciona el motivo del rechazo del pago'
              }
            </DialogDescription>
          </DialogHeader>
          
          {dialogPago && (
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              <div className="p-3 bg-muted/50 rounded border">
                <p className="font-medium text-sm">{dialogPago.proyecto}</p>
                <p className="text-sm text-muted-foreground">
                  Monto: {formatMoney(dialogPago.monto, dialogPago.moneda)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Observaciones {dialogPago.accion === 'rechazar' && <span className="text-red-500">*</span>}
                </label>
                <Textarea
                  placeholder={dialogPago.accion === 'validar' 
                    ? "Observaciones adicionales (opcional)" 
                    : "Describe el motivo del rechazo..."
                  }
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogPago(null)}
                  disabled={procesando}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  variant={dialogPago.accion === 'validar' ? 'default' : 'destructive'}
                  onClick={confirmarAccion}
                  disabled={procesando}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {procesando ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      {dialogPago.accion === 'validar' ? (
                        <><CheckCircle className="h-4 w-4" />Validar Pago</>
                      ) : (
                        <><XCircle className="h-4 w-4" />Rechazar Pago</>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
