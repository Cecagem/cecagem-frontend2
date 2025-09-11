import { useState, useEffect, useCallback } from 'react';
import { Meeting, CalendarFilters } from '../types';
import { CalendarService } from '../services';

interface UseMeetingsReturn {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMeetings(filters?: CalendarFilters): UseMeetingsReturn {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CalendarService.getMeetings(filters);
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las reuniones');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return {
    meetings,
    loading,
    error,
    refetch: fetchMeetings
  };
}
