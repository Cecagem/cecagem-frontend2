"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import type { ICompany } from '../types/accounting-clients.types';

interface CompanyExpandedViewProps {
  company: ICompany;
}

export const CompanyExpandedView: React.FC<CompanyExpandedViewProps> = ({ company }) => {
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

  const activeContracts = company.contract.filter(contract => contract.isActive);
  const totalMonthlyRevenue = activeContracts.reduce((total, contract) => total + contract.monthlyPayment, 0);

  return (
    <div className="w-full">
      <Tabs defaultValue="general" className="w-full">
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

              {/* Colaboradores asignados */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Colaboradores Asignados</h4>
                {activeContracts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeContracts.map((contract) => (
                      <div key={contract.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{contract.user.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            Pago mensual: {formatCurrency(contract.monthlyPayment)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    No hay colaboradores asignados actualmente
                  </div>
                )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Ingresos Mensuales</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-2">
                    {formatCurrency(totalMonthlyRevenue)}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Colaboradores Activos</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-2">
                    {activeContracts.length}
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Fecha de Registro</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {formatDate(company.createdAt)}
                  </div>
                </div>
              </div>

              {/* Detalle de pagos por colaborador */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Detalle de Pagos por Colaborador</h4>
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
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {formatCurrency(contract.monthlyPayment)}
                          </div>
                          <div className="text-xs text-muted-foreground">por mes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <div className="text-sm italic">
                      No hay información de pagos disponible
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
                Cuotas Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {company.installments && company.installments.length > 0 ? (
                <div className="space-y-4">
                  {/* Resumen de cuotas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Pendientes</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-700 mt-2">
                        {company.installments.filter(i => i.status === 'PENDING').length}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Pagadas</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700 mt-2">
                        {company.installments.filter(i => i.status === 'PAID').length}
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Vencidas</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700 mt-2">
                        {company.installments.filter(i => i.status === 'OVERDUE').length}
                      </div>
                    </div>
                  </div>

                  {/* Lista de cuotas */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">Detalle de Cuotas</h4>
                    {company.installments.map((installment) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
                          case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
                          default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        }
                      };

                      const getStatusLabel = (status: string) => {
                        switch (status) {
                          case 'PAID': return 'Pagada';
                          case 'OVERDUE': return 'Vencida';
                          default: return 'Pendiente';
                        }
                      };

                      return (
                        <div key={installment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                Vence: {formatDate(installment.dueDate)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Cuota #{installment.id.slice(-8)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-semibold text-foreground">
                                {formatCurrency(installment.amount)}
                              </div>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(installment.status)}`}>
                              {getStatusLabel(installment.status)}
                            </Badge>
                          </div>
                        </div>
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
    </div>
  );
};