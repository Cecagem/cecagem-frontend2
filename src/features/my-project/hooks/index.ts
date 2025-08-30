import { useState, useEffect } from "react";
import { Proyecto, TipoProyecto, EstadoProyecto } from "../types";
import { proyectosService } from "../services";

export const useMisProyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proyectosService.obtenerMisProyectos();
      setProyectos(data);
    } catch {
      setError("Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  return {
    proyectos,
    loading,
    error,
    refetch: cargarProyectos,
  };
};

export const useProyecto = (id: string) => {
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarProyecto = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await proyectosService.obtenerProyectoPorId(id);
        setProyecto(data);
      } catch {
        setError("Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarProyecto();
    }
  }, [id]);

  return {
    proyecto,
    loading,
    error,
  };
};

export const useBuscarProyectos = () => {
  const [resultados, setResultados] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = async (termino: string) => {
    if (!termino.trim()) {
      setResultados([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await proyectosService.buscarProyectos(termino);
      setResultados(data);
    } catch {
      setError("Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  };

  return {
    resultados,
    loading,
    error,
    buscar,
  };
};

export const useFiltrarProyectos = () => {
  const [proyectosFiltrados, setProyectosFiltrados] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtrar = async (filtros: {
    tipo?: TipoProyecto;
    estado?: EstadoProyecto;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await proyectosService.filtrarProyectos(filtros);
      setProyectosFiltrados(data);
    } catch {
      setError("Error al filtrar proyectos");
    } finally {
      setLoading(false);
    }
  };

  return {
    proyectosFiltrados,
    loading,
    error,
    filtrar,
  };
};
