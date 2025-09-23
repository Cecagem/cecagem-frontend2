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
import { Card, CardContent } from "@/components/ui/card";
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

  const hasActiveFilters =
    localFilters.search ||
    (localFilters.serviceId && localFilters.serviceId !== "all");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contratos..."
              className="pl-10"
              value={localFilters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>

          <div className="min-w-[200px]">
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
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setLocalFilters({ search: "", serviceId: "all" });
                onClearFilters();
              }}
              className="whitespace-nowrap"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
