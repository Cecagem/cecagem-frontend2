import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
  });
};

// Hook para actualizar reunión
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateMeetingDto }) =>
      calendarService.updateMeeting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
  });
};

// Hook para eliminar reunión
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
    },
  });
};

// Hook para completar reunión
export const useCompleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarService.completeMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.meetings });
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