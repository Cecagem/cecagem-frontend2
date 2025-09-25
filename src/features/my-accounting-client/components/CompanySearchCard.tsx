"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanySearchCardProps {
  searchTerm: string;
  onSearch: (search: string) => void;
}

export const CompanySearchCard = ({ searchTerm, onSearch }: CompanySearchCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar empresas por nombre, RUC o razón social..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </CardContent>
    </Card>
  );
};