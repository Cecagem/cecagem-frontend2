"use client";

import React, { useState } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMeetings, getCurrentMonthDateRange, getMonthDateRange } from '../hooks/use-calendar';
import { MeetingDialog } from './MeetingDialog';
import { CalendarGrid } from './CalendarGrid';
import { MeetingList } from './MeetingList';
import type { IMeetingFilters } from '../types/calendar.types';

export function Calendar() {
  const [showGrid, setShowGrid] = useState(true);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  // const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  // Estado compartido para el mes actual entre ambas vistas
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Configurar filtros basados en el mes actual
  const [filters, setFilters] = useState<Partial<IMeetingFilters>>(() => {
    const { startDate, endDate } = getCurrentMonthDateRange();
    return {
      page: 1,
      limit: 100, // Aumentamos el límite para obtener todas las reuniones del mes
      startDate,
      endDate,
    };
  });

  // Actualizar filtros cuando cambie el mes
  const updateFiltersForMonth = (date: Date) => {
    const { startDate, endDate } = getMonthDateRange(date.getFullYear(), date.getMonth());
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  // Función para cambiar mes (será llamada desde CalendarGrid)
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    updateFiltersForMonth(newMonth);
  };

  const handleMeetingCreated = () => {
    setShowMeetingDialog(false);
    refetch(); // Recargar los datos
  };

  const { data: meetingsData, isLoading, error, refetch } = useMeetings(filters);
  const meetings = meetingsData?.data || [];

  // const handleMeetingCreated = () => {
  //   setShowMeetingDialog(false);
  //   setSelectedMeetingId(null);
  //   refetch();
  // };

  const handleEditMeeting = (meetingId: string) => {
    console.log('Edit meeting:', meetingId);
    // TODO: Implementar edición cuando tengamos el dialog funcional
  };

  const handleMeetingDeleted = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          <p>Error al cargar el calendario</p>
          <Button onClick={() => refetch()} className="mt-4">
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
              className="text-white"
              onClick={() => setShowMeetingDialog(true)}
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
              className="text-white"
              onClick={() => setShowMeetingDialog(true)}
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
      {isLoading ? (
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
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              onEditMeeting={handleEditMeeting}
              onMeetingDeleted={handleMeetingDeleted}
            />
          ) : (
            <div className="p-4">
              <MeetingList 
                meetings={meetings}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                onEditMeeting={handleEditMeeting}
              />
            </div>
          )}
        </div>
      )}

      {/* Meeting Dialog */}
      <MeetingDialog
        open={showMeetingDialog}
        onOpenChange={setShowMeetingDialog}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}