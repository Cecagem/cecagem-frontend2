import { useState, useEffect } from 'react';
import { Project, Attendee } from '../types';
import { CalendarService } from '../services';

interface UseCalendarDataReturn {
  projects: Project[];
  attendees: Attendee[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCalendarData(): UseCalendarDataReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsData, attendeesData] = await Promise.all([
        CalendarService.getProjects(),
        CalendarService.getAvailableAttendees()
      ]);

      setProjects(projectsData);
      setAttendees(attendeesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      setError(errorMessage);
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    projects,
    attendees,
    loading,
    error,
    refetch: fetchData
  };
}
