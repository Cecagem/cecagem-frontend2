import { useState, useEffect } from "react";
import { 
  InfoPagoProyecto, 
  EstadisticasPago, 
  FiltrosPago,
  EstadoPagoCuota,
  TipoPagoProyecto,
  MonedaPago
} from "../types";

// Hook para gestionar los datos de pagos
export function usePagos() {
  const [proyectos, setProyectos] = useState<InfoPagoProyecto[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPago | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos de ejemplo (luego se conectará con API)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const proyectosEjemplo: InfoPagoProyecto[] = [
          {
            proyectoId: "proj-1",
            tituloProyecto: "Tesis de Ingeniería de Sistemas - UNMSM",
            tipoProyecto: "tesis",
            colaboradorId: "colab-1",
            colaboradorNombre: "Juan Pérez",
            clienteIds: ["client-1"],
            clienteNombres: ["UNMSM - Universidad Nacional Mayor de San Marcos"],
            tipoPago: TipoPagoProyecto.CUOTAS,
            moneda: MonedaPago.SOLES,
            montoTotal: 3000,
            cuotas: [
              {
                id: "cuota-1",
                numero: 1,
                monto: 1000,
                fechaVencimiento: new Date("2025-01-15"),
                fechaPago: new Date("2025-01-10"),
                estadoPago: EstadoPagoCuota.VALIDADO,
                comprobantePago: "/comprobantes/comp-1.pdf",
                validadoPorAdmin: "admin-1",
                fechaValidacion: new Date("2025-01-11"),
              },
              {
                id: "cuota-2",
                numero: 2,
                monto: 1000,
                fechaVencimiento: new Date("2025-02-15"),
                fechaPago: new Date("2025-02-14"),
                estadoPago: EstadoPagoCuota.MARCADO_PAGADO,
                comprobantePago: "/comprobantes/comp-2.pdf",
                marcadoPorColaborador: "colab-1",
              },
              {
                id: "cuota-3",
                numero: 3,
                monto: 1000,
                fechaVencimiento: new Date("2025-03-15"),
                estadoPago: EstadoPagoCuota.PENDIENTE,
              },
            ],
            fechaInicio: new Date("2024-12-01"),
            fechaFin: new Date("2025-06-01"),
            estadoProyecto: "en_progreso",
            totalPagado: 1000,
            totalPendiente: 2000,
            cuotasVencidas: 0,
            cuotasPendientesValidacion: 1,
          },
          {
            proyectoId: "proj-2",
            tituloProyecto: "Consultoría Financiera - Empresa ABC",
            tipoProyecto: "consultoria",
            colaboradorId: "colab-2",
            colaboradorNombre: "Ana García",
            clienteIds: ["client-2"],
            clienteNombres: ["Empresa Constructora ABC S.A.C."],
            tipoPago: TipoPagoProyecto.CONTADO,
            moneda: MonedaPago.DOLARES,
            montoTotal: 2500,
            fechaInicio: new Date("2025-01-01"),
            fechaFin: new Date("2025-04-01"),
            estadoProyecto: "completado",
            totalPagado: 2500,
            totalPendiente: 0,
            cuotasVencidas: 0,
            cuotasPendientesValidacion: 0,
          },
          {
            proyectoId: "proj-3",
            tituloProyecto: "Investigación de Mercado - UNI",
            tipoProyecto: "investigacion",
            colaboradorId: "colab-3",
            colaboradorNombre: "Carlos López",
            clienteIds: ["client-3"],
            clienteNombres: ["UNI - Universidad Nacional de Ingeniería"],
            tipoPago: TipoPagoProyecto.CUOTAS,
            moneda: MonedaPago.SOLES,
            montoTotal: 4000,
            cuotas: [
              {
                id: "cuota-4",
                numero: 1,
                monto: 2000,
                fechaVencimiento: new Date("2025-01-01"),
                estadoPago: EstadoPagoCuota.VENCIDO,
              },
              {
                id: "cuota-5",
                numero: 2,
                monto: 2000,
                fechaVencimiento: new Date("2025-03-01"),
                estadoPago: EstadoPagoCuota.PENDIENTE,
              },
            ],
            fechaInicio: new Date("2024-12-15"),
            fechaFin: new Date("2025-05-15"),
            estadoProyecto: "pausado",
            totalPagado: 0,
            totalPendiente: 4000,
            cuotasVencidas: 1,
            cuotasPendientesValidacion: 0,
          },
        ];

        const estadisticasEjemplo: EstadisticasPago = {
          totalProyectos: 3,
          totalMontoGeneral: 9500,
          totalPagado: 3500,
          totalPendiente: 6000,
          proyectosAlContado: 1,
          proyectosEnCuotas: 2,
          totalCuotas: 5,
          cuotasPagadas: 1,
          cuotasPendientes: 3,
          cuotasVencidas: 1,
          cuotasPendientesValidacion: 1,
          ultimosPagos: [
            {
              proyectoTitulo: "Tesis de Ingeniería de Sistemas",
              colaborador: "Juan Pérez",
              monto: 1000,
              fecha: new Date("2025-01-10"),
              moneda: MonedaPago.SOLES,
            },
            {
              proyectoTitulo: "Consultoría Financiera",
              colaborador: "Ana García",
              monto: 2500,
              fecha: new Date("2025-01-05"),
              moneda: MonedaPago.DOLARES,
            },
          ],
        };

        setProyectos(proyectosEjemplo);
        setEstadisticas(estadisticasEjemplo);
      } catch {
        setError("Error al cargar los datos de pagos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para validar un pago
  const validarPago = async (cuotaId: string, observaciones?: string) => {
    try {
      // Aquí iría la lógica para validar el pago en la API
      console.log("Validando pago:", cuotaId, observaciones);
      
      // Actualizar el estado local
      setProyectos(prev => prev.map(proyecto => ({
        ...proyecto,
        cuotas: proyecto.cuotas?.map(cuota => 
          cuota.id === cuotaId 
            ? { 
                ...cuota, 
                estadoPago: EstadoPagoCuota.VALIDADO,
                validadoPorAdmin: "admin-current",
                fechaValidacion: new Date(),
                observaciones
              }
            : cuota
        )
      })));

      return { success: true };
    } catch {
      return { success: false, error: "Error al validar el pago" };
    }
  };

  // Función para rechazar un pago
  const rechazarPago = async (cuotaId: string, observaciones: string) => {
    try {
      // Aquí iría la lógica para rechazar el pago en la API
      console.log("Rechazando pago:", cuotaId, observaciones);
      
      // Actualizar el estado local
      setProyectos(prev => prev.map(proyecto => ({
        ...proyecto,
        cuotas: proyecto.cuotas?.map(cuota => 
          cuota.id === cuotaId 
            ? { 
                ...cuota, 
                estadoPago: EstadoPagoCuota.RECHAZADO,
                validadoPorAdmin: "admin-current",
                fechaValidacion: new Date(),
                observaciones
              }
            : cuota
        )
      })));

      return { success: true };
    } catch {
      return { success: false, error: "Error al rechazar el pago" };
    }
  };

  // Función para filtrar proyectos
  const filtrarProyectos = (filtros: FiltrosPago) => {
    return proyectos.filter(proyecto => {
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        if (!proyecto.tituloProyecto.toLowerCase().includes(busqueda) &&
            !proyecto.colaboradorNombre.toLowerCase().includes(busqueda)) {
          return false;
        }
      }

      if (filtros.tipoPago && proyecto.tipoPago !== filtros.tipoPago) {
        return false;
      }

      if (filtros.colaboradorId && proyecto.colaboradorId !== filtros.colaboradorId) {
        return false;
      }

      if (filtros.moneda && proyecto.moneda !== filtros.moneda) {
        return false;
      }

      if (filtros.soloVencidos && proyecto.cuotasVencidas === 0) {
        return false;
      }

      if (filtros.soloPendientesValidacion && proyecto.cuotasPendientesValidacion === 0) {
        return false;
      }

      return true;
    });
  };

  return {
    proyectos,
    estadisticas,
    loading,
    error,
    validarPago,
    rechazarPago,
    filtrarProyectos,
    refrescar: () => {
      setLoading(true);
      setError(null);
      // Recargar datos
    }
  };
}
