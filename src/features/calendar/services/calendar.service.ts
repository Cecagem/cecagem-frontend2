import { cecagemApi } from "@/lib/api-client";
import type { 
  IMeeting, 
  IMeetingResponse, 
  IMeetingFilters, 
  ICreateMeetingDto, 
  IUpdateMeetingDto 
} from "../types/calendar.types";

const ENDPOINTS = {
  meetings: "/meetings",
  meeting: (id: string) => `/meetings/${id}`,
};

export const calendarService = {
  // Obtener reuniones con filtros
  async getMeetings(filters: Partial<IMeetingFilters> = {}): Promise<IMeetingResponse> {
    const params = new URLSearchParams();
    
    // Parámetros de paginación
    params.append("page", (filters.page || 1).toString());
    params.append("limit", (filters.limit || 10).toString());
    
    // Filtros opcionales
    if (filters.search) params.append("search", filters.search);
    if (filters.tipo) params.append("tipo", filters.tipo);
    if (filters.modo) params.append("modo", filters.modo);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.contractId) params.append("contractId", filters.contractId);

    return await cecagemApi.get<IMeetingResponse>(
      `${ENDPOINTS.meetings}?${params.toString()}`
    );
  },

  // Obtener reunión por ID
  async getMeetingById(id: string): Promise<IMeeting> {
    return await cecagemApi.get<IMeeting>(ENDPOINTS.meeting(id));
  },

  // Crear nueva reunión
  async createMeeting(data: ICreateMeetingDto): Promise<IMeeting> {
    console.log('📅 Datos enviados al backend para crear reunión:', data);
    return await cecagemApi.post<IMeeting>(
      ENDPOINTS.meetings, 
      data as unknown as Record<string, unknown>
    );
  },

  // Actualizar reunión
  async updateMeeting(id: string, data: IUpdateMeetingDto): Promise<IMeeting> {
    console.log('📝 Actualizando reunión:', { id, data });
    try {
      const result = await cecagemApi.patch<IMeeting>(
        ENDPOINTS.meeting(id), 
        data as unknown as Record<string, unknown>
      );
      console.log('✅ Reunión actualizada correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar reunión:', error);
      throw error;
    }
  },

  // Eliminar reunión
  async deleteMeeting(id: string): Promise<void> {
    await cecagemApi.delete(ENDPOINTS.meeting(id));
  },

  // Marcar reunión como completada
  async completeMeeting(id: string): Promise<IMeeting> {
    return await cecagemApi.patch<IMeeting>(`/meetings/${id}/complete`);
  },
};