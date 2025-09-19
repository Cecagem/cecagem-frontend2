"use client";

import React from 'react';
import { Clock, MapPin, Users, Video, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IMeeting } from '../types/calendar.types';
import { MeetingActions } from './MeetingActions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MeetingListProps {
  meetings: IMeeting[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  onEditMeeting: (meetingId: string) => void;
  onMeetingDeleted?: () => void;
}

export function MeetingList({ meetings, currentMonth, onMonthChange, onEditMeeting, onMeetingDeleted }: MeetingListProps) {

  const getStatusBadge = (isCompleted: boolean) => {
    return isCompleted 
      ? { variant: 'secondary' as const, label: 'Completada', color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' }
      : { variant: 'default' as const, label: 'Programada', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
  };

  const getTypeBadge = (tipo: IMeeting['tipo']) => {
    return tipo === 'PROYECTO' 
      ? { label: 'Proyecto', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }
      : { label: 'Personal', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' };
  };

  if (meetings.length === 0) {
    return (
      <div>
        {/* Header con navegación de mes */}
        <div className="flex items-center justify-between mb-6 p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-semibold min-w-[140px] text-center capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="p-8">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No hay reuniones</h3>
            <p className="text-muted-foreground">No se encontraron reuniones para {format(currentMonth, 'MMMM yyyy', { locale: es })}.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header con navegación de mes */}
      <div className="flex items-center justify-between mb-6 p-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold min-w-[140px] text-center capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const statusBadge = getStatusBadge(meeting.isCompleted);
        const typeBadge = getTypeBadge(meeting.tipo);
        
        return (
          <Card key={meeting.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{meeting.title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={statusBadge.color}>
                        {statusBadge.label}
                      </Badge>
                      <Badge className={typeBadge.color}>
                        {typeBadge.label}
                      </Badge>
                    </div>
                  </div>
                  
                  {meeting.description && (
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2 sm:line-clamp-none">{meeting.description}</p>
                  )}
                </div>
                
                {/* Botones de acción */}
                <div className="flex-shrink-0 self-start">
                  <MeetingActions
                    meeting={meeting}
                    onEditMeeting={onEditMeeting}
                    onMeetingUpdated={() => onMeetingDeleted?.()}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {/* Fecha y hora */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">
                      {format(new Date(meeting.startDate), 'dd/MM/yyyy', { locale: es })}
                    </div>
                    <div className="text-muted-foreground truncate">
                      {format(new Date(meeting.startDate), 'HH:mm', { locale: es })} - {format(new Date(meeting.endDate), 'HH:mm', { locale: es })}
                    </div>
                  </div>
                </div>
                
                {/* Ubicación */}
                <div className="flex items-center gap-2 text-sm">
                  {meeting.modo === 'VIRTUAL' ? (
                    <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">
                      {meeting.modo === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
                    </div>
                    <div className="text-muted-foreground truncate">
                      {meeting.ubicacion}
                    </div>
                  </div>
                </div>
                
                {/* Asistentes */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">
                      {meeting.asistentes.length} asistente{meeting.asistentes.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-muted-foreground truncate">
                      {meeting.asistentes.map((a) => a.nombre).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      </div>
    </div>
  );
}
