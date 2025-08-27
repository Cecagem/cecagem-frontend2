import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FiltrosPago, TipoPagoProyecto, MonedaPago } from "../types";
import { Search, Filter, X } from "lucide-react";

interface PaymentFiltersProps {
  filtros: FiltrosPago;
  onFiltrosChange: (filtros: FiltrosPago) => void;
  colaboradores?: Array<{ id: string; nombre: string }>;
}

export function PaymentFilters({ 
  filtros, 
  onFiltrosChange, 
  colaboradores = [] 
}: PaymentFiltersProps) {
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  const actualizarFiltro = (campo: keyof FiltrosPago, valor: string | boolean | undefined) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.busqueda) count++;
    if (filtros.tipoPago) count++;
    if (filtros.colaboradorId) count++;
    if (filtros.moneda) count++;
    if (filtros.soloVencidos) count++;
    if (filtros.soloPendientesValidacion) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por proyecto o colaborador..."
            value={filtros.busqueda || ""}
            onChange={(e) => actualizarFiltro("busqueda", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {filtrosActivos > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filtrosActivos}
            </Badge>
          )}
        </Button>
        {filtrosActivos > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarFiltros}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 border rounded-lg bg-muted/50">
          {/* Tipo de pago */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Pago</label>
            <Select
              value={filtros.tipoPago || ""}
              onValueChange={(value) => 
                actualizarFiltro("tipoPago", value || undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value={TipoPagoProyecto.CONTADO}>Al Contado</SelectItem>
                <SelectItem value={TipoPagoProyecto.CUOTAS}>En Cuotas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Colaborador */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Colaborador</label>
            <Select
              value={filtros.colaboradorId || ""}
              onValueChange={(value) => 
                actualizarFiltro("colaboradorId", value || undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {colaboradores.map((colaborador) => (
                  <SelectItem key={colaborador.id} value={colaborador.id}>
                    {colaborador.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Moneda */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Moneda</label>
            <Select
              value={filtros.moneda || ""}
              onValueChange={(value) => 
                actualizarFiltro("moneda", value || undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value={MonedaPago.SOLES}>Soles (S/)</SelectItem>
                <SelectItem value={MonedaPago.DOLARES}>Dólares ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estados especiales */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estados Especiales</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filtros.soloVencidos || false}
                  onChange={(e) => 
                    actualizarFiltro("soloVencidos", e.target.checked || undefined)
                  }
                  className="rounded border-input"
                />
                <span>Solo vencidos</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filtros.soloPendientesValidacion || false}
                  onChange={(e) => 
                    actualizarFiltro("soloPendientesValidacion", e.target.checked || undefined)
                  }
                  className="rounded border-input"
                />
                <span>Pendientes validación</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Badges de filtros activos */}
      {filtrosActivos > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtros.busqueda && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Búsqueda: {filtros.busqueda}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => actualizarFiltro("busqueda", undefined)}
              />
            </Badge>
          )}
          {filtros.tipoPago && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filtros.tipoPago === TipoPagoProyecto.CONTADO ? "Al Contado" : "En Cuotas"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => actualizarFiltro("tipoPago", undefined)}
              />
            </Badge>
          )}
          {filtros.colaboradorId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Colaborador: {colaboradores.find(c => c.id === filtros.colaboradorId)?.nombre || filtros.colaboradorId}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => actualizarFiltro("colaboradorId", undefined)}
              />
            </Badge>
          )}
          {filtros.moneda && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filtros.moneda === MonedaPago.SOLES ? "Soles" : "Dólares"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => actualizarFiltro("moneda", undefined)}
              />
            </Badge>
          )}
          {filtros.soloVencidos && (
            <Badge variant="destructive" className="flex items-center gap-1">
              Solo vencidos
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => actualizarFiltro("soloVencidos", undefined)}
              />
            </Badge>
          )}
          {filtros.soloPendientesValidacion && (
            <Badge variant="default" className="flex items-center gap-1">
              Pendientes validación
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => actualizarFiltro("soloPendientesValidacion", undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
