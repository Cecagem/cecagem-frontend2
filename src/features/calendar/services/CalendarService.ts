import { 
  Meeting, 
  CreateMeetingRequest, 
  UpdateMeetingRequest, 
  CalendarFilters,
  Project,
  Attendee
} from '../types';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sistema ERP',
    description: 'Implementación del nuevo sistema ERP',
    status: 'active'
  },
  {
    id: '2',
    name: 'App Móvil',
    description: 'Desarrollo de aplicación móvil corporativa',
    status: 'active'
  },
  {
    id: '3',
    name: 'Migración Cloud',
    description: 'Migración de servicios a la nube',
    status: 'paused'
  }
];

const mockAttendees: Attendee[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@company.com',
    role: 'Project Manager',
    status: 'accepted'
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@company.com',
    role: 'Developer',
    status: 'pending'
  },
  {
    id: '3',
    name: 'María Silva',
    email: 'maria.silva@company.com',
    role: 'Designer',
    status: 'accepted'
  },
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'juan.perez@company.com',
    role: 'QA Tester',
    status: 'declined'
  }
];

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Revisión Sprint Planning',
    description: 'Planificación del próximo sprint para el sistema ERP',
    startDate: new Date('2025-09-15T10:00:00'),
    endDate: new Date('2025-09-15T11:30:00'),
    type: 'project',
    projectId: '1',
    projectName: 'Sistema ERP',
    attendees: [mockAttendees[0], mockAttendees[1]],
    location: 'Sala de Juntas A',
    isOnline: false,
    status: 'scheduled',
    createdBy: 'current-user',
    createdAt: new Date('2025-09-10T08:00:00'),
    updatedAt: new Date('2025-09-10T08:00:00')
  },
  {
    id: '2',
    title: 'Demo App Móvil',
    description: 'Presentación del progreso de la aplicación móvil',
    startDate: new Date('2025-09-16T14:00:00'),
    endDate: new Date('2025-09-16T15:00:00'),
    type: 'project',
    projectId: '2',
    projectName: 'App Móvil',
    attendees: [mockAttendees[0], mockAttendees[2]],
    location: 'Virtual',
    isOnline: true,
    meetingUrl: 'https://meet.google.com/abc-def-ghi',
    status: 'scheduled',
    createdBy: 'current-user',
    createdAt: new Date('2025-09-09T16:00:00'),
    updatedAt: new Date('2025-09-09T16:00:00')
  },
  {
    id: '3',
    title: 'Reunión Personal - Evaluación',
    description: 'Evaluación de desempeño trimestral',
    startDate: new Date('2025-09-12T09:00:00'),
    endDate: new Date('2025-09-12T10:00:00'),
    type: 'personal',
    attendees: [mockAttendees[0]],
    location: 'Oficina del Director',
    isOnline: false,
    status: 'completed',
    createdBy: 'current-user',
    createdAt: new Date('2025-09-05T10:00:00'),
    updatedAt: new Date('2025-09-12T10:30:00')
  },
  {
    id: '4',
    title: 'Reunión Semanal Equipo',
    description: 'Sincronización semanal del equipo de desarrollo',
    startDate: new Date('2025-09-17T11:00:00'),
    endDate: new Date('2025-09-17T12:00:00'),
    type: 'personal',
    attendees: [mockAttendees[1], mockAttendees[2], mockAttendees[3]],
    location: 'Virtual',
    isOnline: true,
    meetingUrl: 'https://teams.microsoft.com/xyz-abc-def',
    status: 'scheduled',
    createdBy: 'current-user',
    createdAt: new Date('2025-09-10T14:00:00'),
    updatedAt: new Date('2025-09-10T14:00:00')
  }
];

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CalendarService {
  // Obtener todas las reuniones con filtros
  static async getMeetings(filters?: CalendarFilters): Promise<Meeting[]> {
    await delay(300);
    
    let filteredMeetings = [...mockMeetings];

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        filteredMeetings = filteredMeetings.filter(meeting => meeting.type === filters.type);
      }

      if (filters.projectId) {
        filteredMeetings = filteredMeetings.filter(meeting => meeting.projectId === filters.projectId);
      }

      if (filters.status && filters.status !== 'all') {
        filteredMeetings = filteredMeetings.filter(meeting => meeting.status === filters.status);
      }

      if (filters.dateRange) {
        filteredMeetings = filteredMeetings.filter(meeting => {
          const meetingDate = new Date(meeting.startDate);
          return meetingDate >= filters.dateRange!.start && meetingDate <= filters.dateRange!.end;
        });
      }
    }

    return filteredMeetings;
  }

  // Obtener reunión por ID
  static async getMeetingById(id: string): Promise<Meeting | null> {
    await delay(200);
    return mockMeetings.find(meeting => meeting.id === id) || null;
  }

  // Crear nueva reunión
  static async createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
    await delay(500);
    
    const newMeeting: Meeting = {
      id: (mockMeetings.length + 1).toString(),
      ...data,
      projectName: data.projectId ? mockProjects.find(p => p.id === data.projectId)?.name : undefined,
      attendees: data.attendees.map(email => {
        const existingAttendee = mockAttendees.find(a => a.email === email);
        return existingAttendee || {
          id: Math.random().toString(),
          name: email.split('@')[0],
          email,
          status: 'pending' as const
        };
      }),
      status: 'scheduled',
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockMeetings.push(newMeeting);
    return newMeeting;
  }

  // Actualizar reunión
  static async updateMeeting(data: UpdateMeetingRequest): Promise<Meeting> {
    await delay(400);
    
    const index = mockMeetings.findIndex(meeting => meeting.id === data.id);
    if (index === -1) {
      throw new Error('Reunión no encontrada');
    }

    const updatedMeeting: Meeting = {
      ...mockMeetings[index],
      ...data,
      attendees: data.attendees ? data.attendees.map(email => {
        const existingAttendee = mockAttendees.find(a => a.email === email);
        return existingAttendee || {
          id: Math.random().toString(),
          name: email.split('@')[0],
          email,
          status: 'pending' as const
        };
      }) : mockMeetings[index].attendees,
      projectName: data.projectId ? mockProjects.find(p => p.id === data.projectId)?.name : mockMeetings[index].projectName,
      updatedAt: new Date()
    };

    mockMeetings[index] = updatedMeeting;
    return updatedMeeting;
  }

  // Eliminar reunión
  static async deleteMeeting(id: string): Promise<void> {
    await delay(300);
    
    const index = mockMeetings.findIndex(meeting => meeting.id === id);
    if (index === -1) {
      throw new Error('Reunión no encontrada');
    }

    mockMeetings.splice(index, 1);
  }

  // Cambiar estado de reunión
  static async updateMeetingStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<Meeting> {
    await delay(300);
    
    const index = mockMeetings.findIndex(meeting => meeting.id === id);
    if (index === -1) {
      throw new Error('Reunión no encontrada');
    }

    mockMeetings[index] = {
      ...mockMeetings[index],
      status,
      updatedAt: new Date()
    };

    return mockMeetings[index];
  }

  // Obtener proyectos disponibles
  static async getProjects(): Promise<Project[]> {
    await delay(200);
    return mockProjects.filter(project => project.status === 'active');
  }

  // Obtener asistentes disponibles
  static async getAvailableAttendees(): Promise<Attendee[]> {
    await delay(200);
    return mockAttendees;
  }

  // Verificar disponibilidad de horario
  static async checkAvailability(startDate: Date, endDate: Date, excludeMeetingId?: string): Promise<boolean> {
    await delay(250);
    
    const conflictingMeetings = mockMeetings.filter(meeting => {
      if (excludeMeetingId && meeting.id === excludeMeetingId) {
        return false;
      }

      const meetingStart = new Date(meeting.startDate);
      const meetingEnd = new Date(meeting.endDate);

      return (
        (startDate >= meetingStart && startDate < meetingEnd) ||
        (endDate > meetingStart && endDate <= meetingEnd) ||
        (startDate <= meetingStart && endDate >= meetingEnd)
      );
    });

    return conflictingMeetings.length === 0;
  }
}
