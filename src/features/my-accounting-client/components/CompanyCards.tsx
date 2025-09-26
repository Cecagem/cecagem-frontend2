"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, ChevronRight } from "lucide-react";
import { ICompany } from "@/features/accounting-clients/types/accounting-clients.types";

interface CompanyCardsProps {
  companies: ICompany[];
  onCompanyClick: (companyId: string) => void;
  isLoading?: boolean;
}

export const CompanyCards = ({ companies, onCompanyClick, isLoading }: CompanyCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tienes empresas asignadas</h3>
          <p className="text-muted-foreground">
            Cuando se te asignen empresas, aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => {
        return (
          <Card 
            key={company.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => onCompanyClick(company.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {company.businessName}
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
              {company.tradeName && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {company.tradeName}
                </p>
              )}
              <Badge variant={company.isActive ? "default" : "secondary"} className="w-fit">
                {company.isActive ? "Activa" : "Inactiva"}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{company.ruc}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{company.contactName}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};