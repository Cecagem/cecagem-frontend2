"use client";

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Video, Edit, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { IMeeting } from '../types/calendar.types';
import { useCompleteMeeting, useDeleteMeeting } from '../hooks/use-calendar';
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
  meeting: IMeeting | null;
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
  const completeMeetingMutation = useCompleteMeeting();
  const deleteMeetingMutation = useDeleteMeeting();

  if (!meeting) return null;

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  const handleDeleteMeeting = async () => {
    try {
      await deleteMeetingMutation.mutateAsync(meeting.id);
      onOpenChange(false);
      onMeetingDeleted?.();
    } catch (error) {
      console.error('Error al eliminar reunión:', error);
    }
  };

  const handleStatusChange = async () => {
    try {
      if (!meeting.isCompleted) {
        // Solo usar el endpoint de completar si no está completada
        await completeMeetingMutation.mutateAsync(meeting.id);
      }
      onOpenChange(false);
      onMeetingDeleted?.();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const getStatusBadge = (isCompleted: boolean) => {
    const variants = {
      false: { variant: 'default' as const, label: 'Programada' },
      true: { variant: 'secondary' as const, label: 'Completada' },
    };
    return variants[isCompleted.toString() as keyof typeof variants];
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
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
                variant={meeting.isCompleted ? 'secondary' : 'default'}
                className={`
                  ${!meeting.isCompleted 
                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' 
                    : 'bg-white/90 text-gray-800 border-white hover:bg-white'
                  }
                `}
              >
                {getStatusBadge(meeting.isCompleted).label}
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
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-100/80 dark:bg-gray-800 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Date and Time Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-100/80 dark:bg-gray-800 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/15 dark:bg-primary/20 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Fecha y hora</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {format(new Date(meeting.startDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-300 ml-11">
                {formatTime(meeting.startDate)} - {formatTime(meeting.endDate)}
              </div>
            </div>

            <div className="bg-gray-100/80 dark:bg-gray-800 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  {meeting.modo === 'VIRTUAL' ? (
                    <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {meeting.modo === 'VIRTUAL' ? 'Reunión virtual' : 'Reunión presencial'}
                  </h4>
                  {meeting.modo === 'VIRTUAL' && isValidUrl(meeting.ubicacion) ? (
                    <a
                      href={meeting.ubicacion}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline break-all transition-colors"
                    >
                      {meeting.ubicacion}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                      {meeting.ubicacion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Asistentes ({meeting.asistentes.length})
              </h4>
            </div>
            <div className="space-y-3">
              {meeting.asistentes.map((attendee, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100/80 dark:bg-gray-800 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                      {attendee.nombre ? attendee.nombre.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '??'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{attendee.nombre || 'Sin nombre'}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{attendee.email || 'Sin email'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-100/50 dark:bg-gray-800/50">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-11 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200/80 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
              onClick={() => {
                onEditMeeting(meeting.id);
                onOpenChange(false);
              }}
            >
              <Edit className="h-4 w-4 mr-3" />
              Editar reunión
            </Button>

            {!meeting.isCompleted && (
              <Button
                variant="outline"
                className="w-full justify-start h-11 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-100/80 hover:text-green-800 hover:border-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 transition-colors"
                onClick={handleStatusChange}
                disabled={completeMeetingMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-3" />
                Marcar como completada
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-11 text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-100/80 hover:text-red-800 hover:border-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                  disabled={deleteMeetingMutation.isPending}
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
