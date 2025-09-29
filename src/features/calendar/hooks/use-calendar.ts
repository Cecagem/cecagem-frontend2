import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { calendarService } from '../services/calendar.service';
import type { 
  IMeetingFilters, 
  ICreateMeetingDto, 
  IUpdateMeetingDto 
} from '../types/calendar.types';

// Query keys
export const CALENDAR_QUERY_KEYS = {
  meetings: ['meetings'] as const,
  meetingsWithFilters: (filters: Partial<IMeetingFilters>) => 
    ['meetings', filters] as const,
  meeting: (id: string) => ['meetings', id] as const,
};

// Hook para obtener reuniones con filtros
export const useMeetings = (filters: Partial<IMeetingFilters> = {}) => {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.meetingsWithFilters(filters),
    queryFn: () => calendarService.getMeetings(filters),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener una reunión por ID
export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.meeting(id),
    queryFn: () => calendarService.getMeetingById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear reunión
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateMeetingDto) => calendarService.createMeeting(data),
    onSuccess: () => {
      toast.success('Reunión creada exitosamente');
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error creating meeting:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      // Detectar diferentes tipos de errores
      if (errorMessage.toLowerCase().includes('conflict') || 
          errorMessage.toLowerCase().includes('conflicto') ||
          errorMessage.toLowerCase().includes('ya existe') ||
          errorMessage.toLowerCase().includes('horario ocupado') ||
          errorMessage.toLowerCase().includes('overlap')) {
        toast.error('Conflicto de horario: Ya existe una reunión programada en ese horario', {
          duration: 6000,
        });
      } else if (errorMessage.toLowerCase().includes('validation') ||
                 errorMessage.toLowerCase().includes('required') ||
                 errorMessage.toLowerCase().includes('invalid')) {
        toast.error('Datos inválidos: Verifica que todos los campos estén correctos');
      } else {
        toast.error(errorMessage || 'Error al crear la reunión. Intenta nuevamente.');
      }
    },
  });
};

// Hook para actualizar reunión
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateMeetingDto }) => {
      console.log('🔄 Hook useUpdateMeeting ejecutándose:', { id, data });
      return calendarService.updateMeeting(id, data);
    },
    onSuccess: () => {
      toast.success('Reunión actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error updating meeting:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      // Detectar diferentes tipos de errores
      if (errorMessage.toLowerCase().includes('conflict') || 
          errorMessage.toLowerCase().includes('conflicto') ||
          errorMessage.toLowerCase().includes('ya existe') ||
          errorMessage.toLowerCase().includes('horario ocupado') ||
          errorMessage.toLowerCase().includes('overlap')) {
        toast.error('Conflicto de horario: Ya existe una reunión programada en ese horario', {
          duration: 6000,
        });
      } else if (errorMessage.toLowerCase().includes('validation') ||
                 errorMessage.toLowerCase().includes('required') ||
                 errorMessage.toLowerCase().includes('invalid')) {
        toast.error('Datos inválidos: Verifica que todos los campos estén correctos');
      } else if (errorMessage.toLowerCase().includes('not found') ||
                 errorMessage.toLowerCase().includes('no encontrada')) {
        toast.error('Reunión no encontrada');
      } else {
        toast.error(errorMessage || 'Error al actualizar la reunión. Intenta nuevamente.');
      }
    },
  });
};

// Hook para eliminar reunión
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarService.deleteMeeting(id),
    onSuccess: () => {
      toast.success('Reunión eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar la reunión');
    },
  });
};

// Hook para completar reunión
export const useCompleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarService.completeMeeting(id),
    onSuccess: () => {
      toast.success('Reunión marcada como completada');
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Error al completar la reunión');
    },
  });
};

// Helper para obtener rango de fechas del mes actual
export const getCurrentMonthDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

// Helper para obtener rango de fechas de un mes específico
export const getMonthDateRange = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};