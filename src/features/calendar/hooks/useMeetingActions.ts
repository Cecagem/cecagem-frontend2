import { useState } from 'react';
import { CreateMeetingRequest, UpdateMeetingRequest, Meeting } from '../types';
import { CalendarService } from '../services';

interface UseMeetingActionsReturn {
  createMeeting: (data: CreateMeetingRequest) => Promise<Meeting>;
  updateMeeting: (data: UpdateMeetingRequest) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
  updateMeetingStatus: (id: string, status: 'scheduled' | 'completed' | 'cancelled') => Promise<Meeting>;
  loading: boolean;
  error: string | null;
}

export function useMeetingActions(): UseMeetingActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMeeting = async (data: CreateMeetingRequest): Promise<Meeting> => {
    try {
      setLoading(true);
      setError(null);
      const meeting = await CalendarService.createMeeting(data);
      return meeting;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la reunión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateMeeting = async (data: UpdateMeetingRequest): Promise<Meeting> => {
    try {
      setLoading(true);
      setError(null);
      const meeting = await CalendarService.updateMeeting(data);
      return meeting;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la reunión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeeting = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await CalendarService.deleteMeeting(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la reunión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateMeetingStatus = async (id: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<Meeting> => {
    try {
      setLoading(true);
      setError(null);
      const meeting = await CalendarService.updateMeetingStatus(id, status);
      return meeting;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado de la reunión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createMeeting,
    updateMeeting,
    deleteMeeting,
    updateMeetingStatus,
    loading,
    error
  };
}
