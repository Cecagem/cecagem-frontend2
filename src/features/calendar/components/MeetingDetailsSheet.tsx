"use client";

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Video, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Meeting } from '../types';
import { useMeetingActions } from '../hooks';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MeetingDetailsSheetProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditMeeting: (meetingId: string) => void;
  onMeetingDeleted?: () => void;
}

export function MeetingDetailsSheet({ 
  meeting, 
  isOpen, 
  onOpenChange, 
  onEditMeeting,
  onMeetingDeleted
}: MeetingDetailsSheetProps) {
  const { deleteMeeting, updateMeetingStatus, loading } = useMeetingActions();

  if (!meeting) return null;

  const formatTime = (date: Date): string => {
    return format(date, 'HH:mm');
  };

  const handleDeleteMeeting = async () => {
    try {
      await deleteMeeting(meeting.id);
      onOpenChange(false);
      onMeetingDeleted?.();
    } catch (error) {
      console.error('Error al eliminar reunión:', error);
    }
  };

  const handleStatusChange = async (status: 'completed' | 'cancelled') => {
    try {
      await updateMeetingStatus(meeting.id, status);
      onOpenChange(false);
      onMeetingDeleted?.();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const getStatusBadge = (status: Meeting['status']) => {
    const variants = {
      scheduled: { variant: 'default' as const, label: 'Programada' },
      completed: { variant: 'secondary' as const, label: 'Completada' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelada' }
    };
    return variants[status];
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[500px] p-0">
        {/* Header Section */}
        <div className="bg-primary dark:bg-primary p-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold mb-2 break-words">{meeting.title}</h2>
              <Badge 
                variant={meeting.status === 'completed' ? 'secondary' : meeting.status === 'cancelled' ? 'destructive' : 'default'}
                className={`
                  ${meeting.status === 'scheduled' 
                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' 
                    : ''
                  }
                `}
              >
                {getStatusBadge(meeting.status).label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
          {/* Description */}
          {meeting.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Descripción</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Date and Time Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Fecha y hora</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {format(meeting.startDate, 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-11">
                {formatTime(meeting.startDate)} - {formatTime(meeting.endDate)}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  {meeting.isOnline ? (
                    <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {meeting.isOnline ? 'Reunión virtual' : 'Reunión presencial'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {meeting.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project info */}
          {meeting.type === 'project' && meeting.projectName && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">Proyecto relacionado</h4>
              <Badge variant="outline" className="text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600">
                {meeting.projectName}
              </Badge>
            </div>
          )}

          {/* Attendees */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Asistentes ({meeting.attendees.length})
              </h4>
            </div>
            <div className="space-y-3">
              {meeting.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                      {attendee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{attendee.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{attendee.email}</div>
                    </div>
                  </div>
                  {attendee.role && (
                    <Badge variant="secondary" className="text-xs">
                      {attendee.role}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Meeting URL */}
          {meeting.isOnline && meeting.meetingUrl && (
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20 dark:border-primary/30">
              <h4 className="text-sm font-semibold text-primary dark:text-primary mb-2">Enlace de reunión</h4>
              <a 
                href={meeting.meetingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 font-medium underline decoration-2 underline-offset-2"
              >
                Unirse a la reunión
              </a>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-11 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onEditMeeting(meeting.id);
                onOpenChange(false);
              }}
            >
              <Edit className="h-4 w-4 mr-3" />
              Editar reunión
            </Button>

            {meeting.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => handleStatusChange('completed')}
                  disabled={loading}
                >
                  <CheckCircle className="h-4 w-4 mr-3" />
                  Marcar como completada
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={loading}
                >
                  <XCircle className="h-4 w-4 mr-3" />
                  Cancelar reunión
                </Button>
              </>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-11 text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Eliminar reunión
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar reunión?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La reunión &quot;{meeting.title}&quot; será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteMeeting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
