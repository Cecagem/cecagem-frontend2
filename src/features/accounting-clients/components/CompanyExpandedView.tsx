"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import type { ICompany, IPayment } from '../types/accounting-clients.types';
import { PaymentStatus } from '@/features/contract/types/contract.types';
import { PaymentModal } from './PaymentModal';

interface CompanyExpandedViewProps {
  company: ICompany;
}

export const CompanyExpandedView: React.FC<CompanyExpandedViewProps> = ({ company }) => {
  const searchParams = useSearchParams();
  
  const [isClient, setIsClient] = useState(false);
  
  // Solo renderizar en el cliente para evitar problemas de SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Leer el tab activo desde los query parameters solo en el cliente
  const activeTabFromUrl = isClient ? (searchParams.get('tab') || 'general') : 'general';
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  
  // Función para cambiar tab y actualizar URL sin recargar
  const handleTabChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.replaceState({}, '', url.pathname + url.search);
    setActiveTab(value);
  };

  // Sincronizar el estado local cuando cambien los query parameters
  useEffect(() => {
    setActiveTab(activeTabFromUrl);
  }, [activeTabFromUrl]);

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    payments: IPayment[];
    description: string;
  }>({
    open: false,
    payments: [],
    description: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleViewPayments = (payments: IPayment[], description: string) => {
    setPaymentModal({
      open: true,
      payments,
      description,
    });
  };

  const activeContracts = company.contract.filter(contract => contract.isActive);
  const totalMonthlyRevenue = activeContracts.reduce((total, contract) => total + contract.monthlyPayment, 0);

  // Obtener todas las cuotas de todos los contratos
  const allInstallments = activeContracts.flatMap(contract => contract.installments || []);

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="payments">Información de Pagos</TabsTrigger>
          <TabsTrigger value="installments">Cuotas</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Detalles de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información de la empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground">Datos Empresariales</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Razón Social:</span>
                        <div className="text-sm text-muted-foreground">{company.businessName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Nombre Comercial:</span>
                        <div className="text-sm text-muted-foreground">{company.tradeName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">RUC:</span>
                        <div className="text-sm text-muted-foreground font-mono">{company.ruc}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Dirección:</span>
                        <div className="text-sm text-muted-foreground">{company.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground">Información de Contacto</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Contacto Principal:</span>
                        <div className="text-sm text-muted-foreground">{company.contactName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Teléfono:</span>
                        <div className="text-sm text-muted-foreground">{company.contactPhone}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Email:</span>
                        <div className="text-sm text-muted-foreground">{company.contactEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Estado:</span>
                        <div className="mt-1">
                          <Badge variant={company.isActive ? 'default' : 'destructive'}>
                            {company.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                Información de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen financiero */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Ingresos Mensuales</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-2">
                    {formatCurrency(totalMonthlyRevenue)}
                  </div>
                </div>
              </div>

              {/* Detalle del colaborador asignado */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Detalle del Colaborador Asignado</h4>
                {activeContracts.length > 0 ? (
                  <div className="space-y-3">
                    {activeContracts.map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{contract.user.fullName}</div>
                            <div className="text-xs text-muted-foreground">Colaborador asignado</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <div className="text-sm italic">
                      No hay información del colaborador asignado.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Cuotas de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {allInstallments && allInstallments.length > 0 ? (
                <div className="space-y-4">
                  {/* Lista de cuotas */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">Detalle de Cuotas</h4>
                    {allInstallments.map((installment, index) => {
                      const approvedAmount = installment.payments?.reduce((sum, p) => 
                        p.status === PaymentStatus.COMPLETED ? sum + (p.amount || 0) : sum, 0) || 0;
                      const isPaid = approvedAmount >= installment.amount;
                      const hasPayments = installment.payments && installment.payments.length > 0;
                      const hasPendingPayments = installment.payments?.some(p => p.status === PaymentStatus.PENDING) || false;

                      return (
                        <Card key={installment.id} className={`${isPaid ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}>
                          <CardContent>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${isPaid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{installment.description}</div>
                                  <div className="text-sm text-muted-foreground">
                                    <span className="block sm:inline">Vence: {formatDate(installment.dueDate)}</span>
                                    <span className="hidden sm:inline"> • </span>
                                    <span className="block sm:inline">{formatCurrency(installment.amount)}</span>
                                  </div>
                                  {isPaid && (
                                    <div className="text-sm text-primary font-medium">
                                      Pagado: {formatCurrency(approvedAmount)}
                                    </div>
                                  )}
                                  {hasPendingPayments && !isPaid && (
                                    <div className="text-sm text-yellow-600 font-medium">
                                      En verificación
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                <Badge variant={isPaid ? "default" : hasPendingPayments ? "outline" : "secondary"} 
                                       className={`self-start sm:self-center ${hasPendingPayments && !isPaid ? "border-yellow-500 text-yellow-600" : ""}`}>
                                  {isPaid ? "Pagado" : hasPendingPayments ? "En Verificación" : "Pendiente"}
                                </Badge>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={!hasPayments}
                                  onClick={() => handleViewPayments(installment.payments || [], installment.description)}
                                  className="gap-2 w-full sm:w-auto"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sm:inline">Ver Pagos</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <div className="text-sm italic">
                    No hay cuotas registradas para esta empresa
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de pagos */}
      <PaymentModal
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal(prev => ({ ...prev, open }))}
        payments={paymentModal.payments}
        installmentDescription={paymentModal.description}
        canManagePayments={true} // Los administradores pueden gestionar pagos
      />
    </div>
  );
};