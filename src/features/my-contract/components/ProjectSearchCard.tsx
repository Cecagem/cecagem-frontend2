"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProjectSearchCardProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

export const ProjectSearchCard = ({ onSearch, searchTerm }: ProjectSearchCardProps) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearch(value);
  };

  return (
    <Card className="w-full">
      <CardContent className="">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar mis proyectos por nombre, universidad o carrera..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </CardContent>
    </Card>
  );
};