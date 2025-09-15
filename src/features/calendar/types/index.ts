// Tipos base
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed';
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  role?: string;
  status: 'accepted' | 'pending' | 'declined';
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'project' | 'personal';
  projectId?: string;
  projectName?: string;
  attendees: Attendee[];
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Requests para API
export interface CreateMeetingRequest {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'project' | 'personal';
  projectId?: string;
  attendees: string[]; // emails
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
}

export interface UpdateMeetingRequest {
  id: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  type?: 'project' | 'personal';
  projectId?: string;
  attendees?: string[]; // emails
  location?: string;
  isOnline?: boolean;
  meetingUrl?: string;
}

// Filtros
export interface CalendarFilters {
  type?: 'project' | 'personal' | 'all';
  projectId?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Tipos para formularios
export interface MeetingFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'project' | 'personal';
  projectId: string;
  attendees: string[];
  location: string;
  isOnline: boolean;
  meetingUrl: string;
}

// Tipos para calendario
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  meetings: Meeting[];
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  month: number;
  year: number;
  weeks: CalendarWeek[];
}

// Tipos de vista del calendario
export interface CalendarViewType {
  view: 'day' | 'week' | 'month';
}

// Tipos para estadísticas
export interface CalendarStats {
  totalMeetings: number;
  scheduledMeetings: number;
  completedMeetings: number;
  cancelledMeetings: number;
  projectMeetings: number;
  personalMeetings: number;
}
