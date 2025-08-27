import { useState, useEffect } from "react";
import { User, UserStats, SearchFilters, UserEstado, UserRol } from "../types";

// Datos de ejemplo para desarrollo
const mockUsers: User[] = [
  {
    id: "1",
    nombres: "Juan Carlos",
    apellidos: "García López",
    telefono: "987654321",
    email: "juan.garcia@cecagem.com",
    rol: UserRol.ADMINISTRADOR,
    estado: UserEstado.ACTIVO,
    fechaCreacion: new Date("2024-01-15"),
  },
  {
    id: "2",
    nombres: "María Elena",
    apellidos: "Rodríguez Pérez",
    telefono: "987654322",
    email: "maria.rodriguez@cecagem.com",
    rol: UserRol.RRHH,
    estado: UserEstado.ACTIVO,
    fechaCreacion: new Date("2024-02-10"),
    contrato: {
      montoPago: 3500,
      fechaContrato: new Date("2024-02-01"),
    },
  },
  {
    id: "3",
    nombres: "Carlos Alberto",
    apellidos: "Mendoza Silva",
    telefono: "987654323",
    email: "carlos.mendoza@cecagem.com",
    rol: UserRol.COLABORADOR_INTERNO,
    estado: UserEstado.ACTIVO,
    fechaCreacion: new Date("2024-03-05"),
    contrato: {
      montoPago: 2800,
      fechaContrato: new Date("2024-03-01"),
    },
  },
  {
    id: "4",
    nombres: "Ana Patricia",
    apellidos: "Vargas Torres",
    telefono: "987654324",
    email: "ana.vargas@freelance.com",
    rol: UserRol.COLABORADOR_EXTERNO,
    estado: UserEstado.ACTIVO,
    fechaCreacion: new Date("2024-03-20"),
  },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    activos: 0,
    inactivos: 0,
    nuevosEsteMes: 0,
    porRol: {
      administradores: 0,
      rrhh: 0,
      colaboradoresInternos: 0,
      colaboradoresExternos: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Simular carga de datos
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  // Calcular estadísticas
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newStats: UserStats = {
      total: users.length,
      activos: users.filter(user => user.estado === UserEstado.ACTIVO).length,
      inactivos: users.filter(user => user.estado === UserEstado.INACTIVO).length,
      nuevosEsteMes: users.filter(user => {
        if (!user.fechaCreacion) return false;
        const creationDate = new Date(user.fechaCreacion);
        return creationDate.getMonth() === currentMonth && 
               creationDate.getFullYear() === currentYear;
      }).length,
      porRol: {
        administradores: users.filter(user => user.rol === UserRol.ADMINISTRADOR).length,
        rrhh: users.filter(user => user.rol === UserRol.RRHH).length,
        colaboradoresInternos: users.filter(user => user.rol === UserRol.COLABORADOR_INTERNO).length,
        colaboradoresExternos: users.filter(user => user.rol === UserRol.COLABORADOR_EXTERNO).length,
      },
    };

    setStats(newStats);
  }, [users]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(user =>
        user.nombres.toLowerCase().includes(filters.search!.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(filters.search!.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.estado) {
      filtered = filtered.filter(user => user.estado === filters.estado);
    }

    if (filters.rol) {
      filtered = filtered.filter(user => user.rol === filters.rol);
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const createUser = async (userData: Omit<User, 'id'>): Promise<void> => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        fechaCreacion: new Date(),
      };

      setUsers(prev => [...prev, newUser]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Omit<User, 'id'>): Promise<void> => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...userData, id, fechaActualizacion: new Date() }
          : user
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    users: filteredUsers,
    stats,
    isLoading,
    filters,
    createUser,
    updateUser,
    deleteUser,
    applyFilters,
    clearFilters,
  };
}
