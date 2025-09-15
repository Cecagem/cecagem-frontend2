"use client";

import React, { useState } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarViewType } from '../types';
import { useMeetings } from '../hooks';
import { MeetingDialog } from './MeetingDialogSimple';
import { CalendarGrid } from './CalendarGrid';
import { MeetingList } from './MeetingList';

export function Calendar() {
  const [viewType, setViewType] = useState<CalendarViewType['view']>('month');
  const [showGrid, setShowGrid] = useState(true);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const { meetings, loading, error, refetch } = useMeetings();

  const handleMeetingCreated = () => {
    setShowMeetingDialog(false);
    setSelectedMeetingId(null);
    refetch();
  };

  const handleEditMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setShowMeetingDialog(true);
  };

  const handleMeetingDeleted = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          <p>Error al cargar el calendario: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header responsivo */}
      <div className="space-y-4">
        {/* Desktop: todo en una fila, Móvil: separado */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Título y descripción a la izquierda */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
            <p className="text-muted-foreground">Gestiona tus reuniones y eventos</p>
          </div>
          
          {/* Botones a la derecha */}
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowGrid(!showGrid)}
              className="bg-background hover:bg-accent"
            >
              {showGrid ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
              {showGrid ? 'Vista Lista' : 'Vista Cuadrícula'}
            </Button>
            
            <Button 
              onClick={() => setShowMeetingDialog(true)}
              className="text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </div>
        </div>

        {/* Móvil: título centrado y botones en fila separada */}
        <div className="sm:hidden space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
            <p className="text-muted-foreground">Gestiona tus reuniones y eventos</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => setShowMeetingDialog(true)}
              className="text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowGrid(!showGrid)}
              className="bg-background hover:bg-accent"
            >
              {showGrid ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
              {showGrid ? 'Lista' : 'Cuadrícula'}
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {loading ? (
        <div className="bg-card border rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando calendario...</p>
          </div>
        </div>
      ) : (
        <div className="bg-card border rounded-lg">
          {showGrid ? (
            <CalendarGrid 
              meetings={meetings}
              viewType={viewType}
              onViewTypeChange={setViewType}
              onEditMeeting={handleEditMeeting}
              onMeetingDeleted={handleMeetingDeleted}
            />
          ) : (
            <div className="p-4">
              <MeetingList 
                meetings={meetings}
                onEditMeeting={handleEditMeeting}
                onMeetingDeleted={handleMeetingDeleted}
              />
            </div>
          )}
        </div>
      )}

      {/* Meeting Dialog */}
      <MeetingDialog
        open={showMeetingDialog}
        onOpenChange={setShowMeetingDialog}
        meetingId={selectedMeetingId}
        onMeetingCreated={handleMeetingCreated}
        onMeetingUpdated={handleMeetingCreated}
      />
    </div>
  );
}