// Componentes
export { ProyectoCard } from "./components/ProyectoCard";
export { ProyectoSearch } from "./components/ProyectoSearch";
export { ProyectoStats } from "./components/ProyectoStats";
export { ProyectosList } from "./components/ProyectosList";
export { ProyectoResumen } from "./components/ProyectoResumen";
export { EntregablesManager } from "./components/EntregablesManager";
export { ProyectoDetalle } from "./components/ProyectoDetalle";

// Hooks
export {
  useMisProyectos,
  useProyecto,
  useBuscarProyectos,
  useFiltrarProyectos,
} from "./hooks";

// Tipos
export type {
  Proyecto,
  Cliente,
  Colaborador,
  Entregable,
  ProyectoFilters,
} from "./types";

export {
  TipoProyecto,
  EstadoProyecto,
  TipoPago,
  Moneda,
} from "./types";

// Servicios
export { proyectosService, ProyectosService } from "./services";
