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

  const activeRelations = company.userRelations.filter(relation => relation.isActive);
  const totalMonthlyRevenue = activeRelations.reduce((total, relation) => total + relation.monthlyPayment, 0);

  return (
    <div className="w-full">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="payments">Información de Pagos</TabsTrigger>
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
                {activeRelations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeRelations.map((relation) => (
                      <div key={relation.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{relation.user.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            Pago mensual: {formatCurrency(relation.monthlyPayment)}
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
                    {activeRelations.length}
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
                {activeRelations.length > 0 ? (
                  <div className="space-y-3">
                    {activeRelations.map((relation) => (
                      <div key={relation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{relation.user.fullName}</div>
                            <div className="text-xs text-muted-foreground">Colaborador asignado</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {formatCurrency(relation.monthlyPayment)}
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
      </Tabs>
    </div>
  );
};