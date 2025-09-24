"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, User, Users, ChevronRight } from "lucide-react";
import { IContract } from "@/features/contract/types/contract.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectCardsProps {
  contracts: IContract[];
  onProjectClick: (contractId: string) => void;
  isLoading?: boolean;
}

export const ProjectCards = ({ contracts, onProjectClick, isLoading }: ProjectCardsProps) => {
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

  if (contracts.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tienes proyectos</h3>
          <p className="text-muted-foreground">
            Cuando se te asignen proyectos, aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contracts.map((contract) => (
        <Card 
          key={contract.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
          onClick={() => onProjectClick(contract.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {contract.name}
              </CardTitle>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
            <Badge className="w-fit bg-green-100 text-green-800">
              Activo
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{contract.university}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{contract.career}</span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">Por asignar</span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {format(new Date(contract.createdAt), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>

            {contract.observation && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {contract.observation}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};