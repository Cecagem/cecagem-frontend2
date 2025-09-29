"use client";

import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { IMeeting } from '../types/calendar.types';
import { useDeleteMeeting, useCompleteMeeting } from '../hooks/use-calendar';

interface MeetingActionsProps {
  meeting: IMeeting;
  onEditMeeting: (meetingId: string) => void;
  onMeetingUpdated: () => void;
}

export function MeetingActions({ 
  meeting, 
  onEditMeeting, 
  onMeetingUpdated
}: MeetingActionsProps) {
  const deleteMeeting = useDeleteMeeting();
  const completeMeeting = useCompleteMeeting();

  const handleDeleteMeeting = async () => {
    try {
      await deleteMeeting.mutateAsync(meeting.id);
      onMeetingUpdated();
    } catch (error) {
      console.error('Error al eliminar reunión:', error);
    }
  };

  const handleToggleCompleted = async () => {
    try {
      if (!meeting.isCompleted) {
        // Solo usar el endpoint de completar si no está completada
        await completeMeeting.mutateAsync(meeting.id);
      }
      onMeetingUpdated();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEditMeeting(meeting.id)}
        className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200/80 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      {/* Botón para cambiar estado completado */}
      {!meeting.isCompleted && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleCompleted}
          disabled={completeMeeting.isPending}
          className="text-green-700 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-100/80 hover:text-green-800 hover:border-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 transition-colors"
          title="Marcar como completada"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={deleteMeeting.isPending}
            className="text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-100/80 hover:text-red-800 hover:border-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar reunión?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La reunión &ldquo;{meeting.title}&rdquo; será eliminada permanentemente.
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
  );
}
