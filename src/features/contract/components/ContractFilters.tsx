import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useServices } from "@/features/engagements/hooks/useEngagements";
import type { IContractFilters } from "../types/contract.type";

interface ContractFiltersProps {
  filters: Partial<IContractFilters>;
  onApplyFilters: (filters: Partial<IContractFilters>) => void;
  onClearFilters: () => void;
}

export const ContractFilters = ({
  filters,
  onApplyFilters,
  onClearFilters,
}: ContractFiltersProps) => {
  const { data: servicesData } = useServices({ isActive: true, limit: 100 });

  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    serviceId: filters.serviceId || "all",
  });

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setLocalFilters((prev) => ({ ...prev, [field]: value }));

      const newFilters: Partial<IContractFilters> = { ...filters };
      if (value.trim() && value !== "all") {
        if (field === "serviceId") {
          newFilters.serviceId = value;
        } else if (field === "search") {
          newFilters.search = value;
        }
      } else {
        if (field === "serviceId") {
          delete newFilters.serviceId;
        } else if (field === "search") {
          delete newFilters.search;
        }
      }
      onApplyFilters(newFilters);
    },
    [filters, onApplyFilters]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="relative lg:col-span-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contratos..."
          className="pl-10"
          value={localFilters.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
        />
      </div>

      <Select
        value={localFilters.serviceId}
        onValueChange={(value) => handleInputChange("serviceId", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los servicios" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los servicios</SelectItem>
          {servicesData?.data?.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => {
          setLocalFilters({ search: "", serviceId: "all" });
          onClearFilters();
        }}
        className="w-full sm:w-auto"
      >
        <X className="mr-2 h-4 w-4" />
        Limpiar filtros
      </Button>
    </div>
  );
};
