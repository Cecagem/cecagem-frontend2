"use client";

import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
import { Meeting } from '../types';
import { useMeetingActions } from '../hooks';

interface MeetingActionsProps {
  meeting: Meeting;
  onEditMeeting: (meetingId: string) => void;
  onMeetingUpdated: () => void;
}

export function MeetingActions({ 
  meeting, 
  onEditMeeting, 
  onMeetingUpdated
}: MeetingActionsProps) {
  const { deleteMeeting, updateMeetingStatus, loading } = useMeetingActions();

  const handleDeleteMeeting = async () => {
    try {
      await deleteMeeting(meeting.id);
      onMeetingUpdated();
    } catch (error) {
      console.error('Error al eliminar reunión:', error);
    }
  };

  const handleStatusChange = async (status: 'completed' | 'cancelled') => {
    try {
      await updateMeetingStatus(meeting.id, status);
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
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      {/* Botones de estado solo para reuniones programadas */}
      {meeting.status === 'scheduled' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('completed')}
            disabled={loading}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Marcar como completada"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('cancelled')}
            disabled={loading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Cancelar reunión"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
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
