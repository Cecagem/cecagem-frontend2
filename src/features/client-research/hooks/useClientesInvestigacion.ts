"use client";

import { useState, useCallback, useMemo } from "react";
import { 
  ClienteInvestigacion, 
  ClienteInvestigacionStats, 
  SearchFilters, 
  ClienteInvestigacionEstado,
  Universidad,
  Facultad,
  GradoAcademico
} from "../types/index";

// Mock data para desarrollo
const mockClientesInvestigacion: ClienteInvestigacion[] = [
  {
    id: "1",
    nombres: "María Elena",
    apellidos: "García Rodríguez",
    correo: "maria.garcia@email.com",
    telefono: "987654321",
    universidad: Universidad.UNMSM,
    facultad: Facultad.INGENIERIA,
    carrera: "Ingeniería de Sistemas",
    grado: GradoAcademico.BACHILLER,
    estado: ClienteInvestigacionEstado.ACTIVO,
    fechaCreacion: new Date("2024-01-15"),
    fechaActualizacion: new Date("2024-11-01"),
  },
  {
    id: "2",
    nombres: "Carlos Alberto",
    apellidos: "Mendoza Silva",
    correo: "carlos.mendoza@email.com",
    telefono: "956789012",
    universidad: Universidad.PUCP,
    facultad: Facultad.ADMINISTRACION,
    carrera: "Administración de Empresas",
    grado: GradoAcademico.EGRESADO,
    estado: ClienteInvestigacionEstado.ACTIVO,
    fechaCreacion: new Date("2024-02-20"),
    fechaActualizacion: new Date("2024-10-15"),
  },
  {
    id: "3",
    nombres: "Ana Sofía",
    apellidos: "Ponce de León",
    correo: "ana.ponce@email.com",
    telefono: "984567890",
    universidad: Universidad.UNI,
    facultad: Facultad.INGENIERIA,
    carrera: "Ingeniería Civil",
    grado: GradoAcademico.MAESTRIA,
    estado: ClienteInvestigacionEstado.ACTIVO,
    fechaCreacion: new Date("2024-03-10"),
    fechaActualizacion: new Date("2024-09-20"),
  },
  {
    id: "4",
    nombres: "Roberto",
    apellidos: "Quispe Mamani",
    correo: "roberto.quispe@email.com",
    telefono: "965432189",
    universidad: Universidad.UNFV,
    facultad: Facultad.MEDICINA,
    carrera: "Medicina Humana",
    grado: GradoAcademico.BACHILLER,
    estado: ClienteInvestigacionEstado.INACTIVO,
    fechaCreacion: new Date("2024-04-05"),
    fechaActualizacion: new Date("2024-11-10"),
  },
  {
    id: "5",
    nombres: "Patricia",
    apellidos: "Vásquez Flores",
    correo: "patricia.vasquez@email.com",
    telefono: "923456781",
    universidad: Universidad.UPC,
    facultad: Facultad.COMUNICACIONES,
    carrera: "Comunicación Audiovisual",
    grado: GradoAcademico.EGRESADO,
    estado: ClienteInvestigacionEstado.ACTIVO,
    fechaCreacion: new Date("2024-05-12"),
    fechaActualizacion: new Date("2024-10-25"),
  },
  {
    id: "6",
    nombres: "José Luis",
    apellidos: "Torres Acevedo",
    correo: "jose.torres@email.com",
    telefono: "912345678",
    universidad: Universidad.ULIMA,
    facultad: Facultad.ECONOMIA,
    carrera: "Economía",
    grado: GradoAcademico.MAESTRIA,
    estado: ClienteInvestigacionEstado.ACTIVO,
    fechaCreacion: new Date("2024-06-18"),
    fechaActualizacion: new Date("2024-11-05"),
  },
];

export function useClientesInvestigacion() {
  const [clientes, setClientes] = useState<ClienteInvestigacion[]>(mockClientesInvestigacion);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch = !filters.search || 
        cliente.nombres.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.apellidos.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.carrera.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.universidad.toLowerCase().includes(filters.search.toLowerCase());

      const matchesEstado = !filters.estado || cliente.estado === filters.estado;
      const matchesUniversidad = !filters.universidad || cliente.universidad === filters.universidad;
      const matchesGrado = !filters.grado || cliente.grado === filters.grado;

      return matchesSearch && matchesEstado && matchesUniversidad && matchesGrado;
    });
  }, [clientes, filters]);

  // Calcular estadísticas
  const stats: ClienteInvestigacionStats = useMemo(() => {
    const total = clientes.length;
    const activos = clientes.filter(c => c.estado === ClienteInvestigacionEstado.ACTIVO).length;
    const inactivos = clientes.filter(c => c.estado === ClienteInvestigacionEstado.INACTIVO).length;
    const bachilleres = clientes.filter(c => c.grado === GradoAcademico.BACHILLER).length;
    const egresados = clientes.filter(c => c.grado === GradoAcademico.EGRESADO).length;
    const maestrias = clientes.filter(c => c.grado === GradoAcademico.MAESTRIA).length;

    return {
      total,
      activos,
      inactivos,
      bachilleres,
      egresados,
      maestrias,
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
  const createCliente = useCallback(async (clienteData: Omit<ClienteInvestigacion, 'id'>) => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCliente: ClienteInvestigacion = {
      ...clienteData,
      id: Date.now().toString(),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    
    setClientes(prev => [newCliente, ...prev]);
    setIsLoading(false);
  }, []);

  // Actualizar cliente
  const updateCliente = useCallback(async (id: string, clienteData: Partial<ClienteInvestigacion>) => {
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
