// Enums
export enum MeetingType {
  PERSONAL = "PERSONAL",
  PROYECTO = "PROYECTO",
}

export enum MeetingMode {
  VIRTUAL = "VIRTUAL",
  OFFICE = "OFFICE",
}

// Interfaces base
export interface IAttendee {
  email: string;
  nombre: string;
}

export interface IMeeting {
  id: string;
  contractId: string;
  contractName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tipo: MeetingType;
  modo: MeetingMode;
  ubicacion: string;
  asistentes: IAttendee[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTOs para API
export interface ICreateMeetingDto {
  contractId: string | null;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tipo: MeetingType;
  modo: MeetingMode;
  ubicacion: string;
  asistentes: IAttendee[];
  isCompleted?: boolean;
}

export interface IUpdateMeetingDto {
  contractId?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tipo?: MeetingType;
  modo?: MeetingMode;
  ubicacion?: string;
  asistentes?: IAttendee[];
  isCompleted?: boolean;
}

// Interfaces para filtros
export interface IMeetingFilters {
  page: number;
  limit: number;
  search?: string;
  tipo?: MeetingType;
  modo?: MeetingMode;
  startDate?: string;
  endDate?: string;
  contractId?: string;
}

// Response de la API
export interface IMeetingResponse {
  data: IMeeting[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Constantes para categorías
export const MEETING_TYPES = [
  { value: MeetingType.PERSONAL, label: "Personal" },
  { value: MeetingType.PROYECTO, label: "Proyecto" },
];

export const MEETING_MODES = [
  { value: MeetingMode.VIRTUAL, label: "Virtual" },
  { value: MeetingMode.OFFICE, label: "Oficina" },
];