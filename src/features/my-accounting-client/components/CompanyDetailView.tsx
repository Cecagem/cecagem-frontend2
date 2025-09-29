"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Mail, Phone, MapPin, DollarSign, User } from "lucide-react";
import { ICompany } from "@/features/accounting-clients/types/accounting-clients.types";
import { CompanyInstallmentsView } from "./CompanyInstallmentsView";

interface CompanyDetailViewProps {
  company: ICompany | null;
  onBack: () => void;
  isLoading: boolean;
}

export const CompanyDetailView = ({ 
  company, 
  onBack, 
  isLoading 
}: CompanyDetailViewProps) => {
  if (isLoading || !company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular estadísticas de contratos
  const activeContracts = company.contract?.filter(contract => contract.isActive) || [];
  const totalMonthlyPayment = activeContracts.reduce((sum, contract) => sum + contract.monthlyPayment, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis empresas
          </Button>
        </div>
        <Badge variant={company.isActive ? "default" : "secondary"}>
          {company.isActive ? "Activa" : "Inactiva"}
        </Badge>
      </div>

      {/* Información general de la empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{company.businessName}</CardTitle>
          <p className="text-muted-foreground">{company.tradeName}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">RUC</p>
                <p className="font-medium">{company.ruc}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                <p className="font-medium">{company.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p className="font-medium">{company.contactPhone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{company.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Persona de Contacto</p>
                <p className="font-medium">
                  {company.contactName || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pago mensual total</p>
                <p className="font-medium">S/ {totalMonthlyPayment.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cuotas de la empresa */}
      <CompanyInstallmentsView company={company} />
    </div>
  );
};