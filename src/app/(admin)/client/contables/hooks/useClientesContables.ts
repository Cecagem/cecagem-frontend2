"use client";

import { useState, useCallback, useMemo } from "react";
import { ClienteContable, ClienteContableStats, SearchFilters, ClienteEstado } from "../types";

// Mock data para desarrollo
const mockClientesContables: ClienteContable[] = [
  {
    id: "1",
    ruc: "20123456789",
    razonSocial: "COMERCIAL LIMA S.A.C.",
    nombreComercial: "Comercial Lima",
    direccion: "Av. Javier Prado Este 123, San Isidro, Lima",
    nombreContacto: "Juan Pérez Rodríguez",
    telefono: "987654321",
    email: "contacto@comerciallima.com",
    estado: ClienteEstado.ACTIVO,
    fechaCreacion: new Date("2024-01-15"),
    fechaActualizacion: new Date("2024-11-01"),
  },
  {
    id: "2",
    ruc: "20987654321",
    razonSocial: "DISTRIBUIDORA DEL NORTE S.R.L.",
    nombreComercial: "Distribuidora Norte",
    direccion: "Jr. Las Flores 456, Trujillo, La Libertad",
    nombreContacto: "María González Castro",
    telefono: "956789012",
    email: "ventas@distribuidoranorte.com",
    estado: ClienteEstado.ACTIVO,
    fechaCreacion: new Date("2024-02-20"),
    fechaActualizacion: new Date("2024-10-15"),
  },
  {
    id: "3",
    ruc: "20555666777",
    razonSocial: "SERVICIOS INTEGRALES DEL SUR E.I.R.L.",
    nombreComercial: "Servicios Sur",
    direccion: "Av. El Sol 789, Cusco, Cusco",
    nombreContacto: "Carlos Mamani Quispe",
    telefono: "984567890",
    email: "admin@serviciosdelsur.com",
    estado: ClienteEstado.INACTIVO,
    fechaCreacion: new Date("2024-03-10"),
    fechaActualizacion: new Date("2024-09-20"),
  },
  {
    id: "4",
    ruc: "20444555666",
    razonSocial: "CONSTRUCTORA AMAZONAS S.A.",
    nombreComercial: "Constructora Amazonas",
    direccion: "Calle Los Ceibos 321, Iquitos, Loreto",
    nombreContacto: "Ana Vásquez Pérez",
    telefono: "965432189",
    email: "proyectos@constructoraamazonas.com",
    estado: ClienteEstado.ACTIVO,
    fechaCreacion: new Date("2024-04-05"),
    fechaActualizacion: new Date("2024-11-10"),
  },
  {
    id: "5",
    ruc: "20333444555",
    razonSocial: "TECNOLOGÍA Y SISTEMAS HUANCAYO S.A.C.",
    nombreComercial: "TechSys Huancayo",
    direccion: "Av. Huancavelica 654, Huancayo, Junín",
    nombreContacto: "Roberto Silva Martinez",
    telefono: "923456781",
    email: "soporte@techsyshuancayo.com",
    estado: ClienteEstado.ACTIVO,
    fechaCreacion: new Date("2024-05-12"),
    fechaActualizacion: new Date("2024-10-25"),
  },
];

export function useClientesContables() {
  const [clientes, setClientes] = useState<ClienteContable[]>(mockClientesContables);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch = !filters.search || 
        cliente.razonSocial.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.nombreComercial.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.ruc.includes(filters.search) ||
        cliente.nombreContacto.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesEstado = !filters.estado || cliente.estado === filters.estado;

      return matchesSearch && matchesEstado;
    });
  }, [clientes, filters]);

  // Calcular estadísticas
  const stats: ClienteContableStats = useMemo(() => {
    const total = clientes.length;
    const activos = clientes.filter(c => c.estado === ClienteEstado.ACTIVO).length;
    const inactivos = clientes.filter(c => c.estado === ClienteEstado.INACTIVO).length;
    
    // Clientes nuevos este mes
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const nuevosEsteMes = clientes.filter(c => 
      c.fechaCreacion && c.fechaCreacion >= inicioMes
    ).length;

    return {
      total,
      activos,
      inactivos,
      nuevosEsteMes,
    };
  }, [clientes]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Crear cliente
  const createCliente = useCallback(async (clienteData: Omit<ClienteContable, 'id'>) => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCliente: ClienteContable = {
      ...clienteData,
      id: Date.now().toString(),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    
    setClientes(prev => [newCliente, ...prev]);
    setIsLoading(false);
  }, []);

  // Actualizar cliente
  const updateCliente = useCallback(async (id: string, clienteData: Partial<ClienteContable>) => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setClientes(prev => prev.map(cliente => 
      cliente.id === id 
        ? { ...cliente, ...clienteData, fechaActualizacion: new Date() }
        : cliente
    ));
    
    setIsLoading(false);
  }, []);

  // Eliminar cliente
  const deleteCliente = useCallback(async (id: string) => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setClientes(prev => prev.filter(cliente => cliente.id !== id));
    setIsLoading(false);
  }, []);

  return {
    clientes: filteredClientes,
    stats,
    filters,
    isLoading,
    applyFilters,
    clearFilters,
    createCliente,
    updateCliente,
    deleteCliente,
  };
}
