"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CalendarService } from '../services';
import { useMeetingActions, useCalendarData } from '../hooks';
import { toast } from 'sonner';

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId?: string | null;
  onMeetingCreated: () => void;
  onMeetingUpdated: () => void;
}

interface FormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  type: 'project' | 'personal';
  projectId: string;
  location: string;
  isOnline: boolean;
  meetingUrl: string;
  attendeeEmail: string;
}

export function MeetingDialog({
  open,
  onOpenChange,
  meetingId,
  onMeetingCreated,
  onMeetingUpdated,
}: MeetingDialogProps) {
  const [attendeeEmails, setAttendeeEmails] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'personal',
    projectId: '',
    location: '',
    isOnline: false,
    meetingUrl: '',
    attendeeEmail: ''
  });

    const { projects, loading: dataLoading } = useCalendarData();
  const { createMeeting, updateMeeting, loading: actionLoading } = useMeetingActions();

  const loadMeeting = useCallback(async () => {
    if (!meetingId) return;
    try {
      const meeting = await CalendarService.getMeetingById(meetingId);
      if (meeting) {
        const startDate = new Date(meeting.startDate);
        const endDate = new Date(meeting.endDate);
        
        setFormData({
          title: meeting.title,
          description: meeting.description || '',
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5),
          type: meeting.type,
          projectId: meeting.projectId || '',
          location: meeting.location || '',
          isOnline: meeting.isOnline,
          meetingUrl: meeting.meetingUrl || '',
          attendeeEmail: ''
        });
        
        setAttendeeEmails(meeting.attendees.map(a => a.email));
      }
    } catch (error) {
      console.error('Error loading meeting:', error);
      toast.error('Error al cargar la reunión');
    }
  }, [meetingId]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'personal',
      projectId: '',
      location: '',
      isOnline: false,
      meetingUrl: '',
      attendeeEmail: ''
    });
    setAttendeeEmails([]);
  }, []);

  useEffect(() => {
    if (open && meetingId) {
      loadMeeting();
    } else if (open && !meetingId) {
      resetForm();
    }
  }, [open, meetingId, loadMeeting, resetForm]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAttendee = () => {
    if (formData.attendeeEmail && !attendeeEmails.includes(formData.attendeeEmail)) {
      setAttendeeEmails(prev => [...prev, formData.attendeeEmail]);
      setFormData(prev => ({ ...prev, attendeeEmail: '' }));
    }
  };

  const removeAttendee = (email: string) => {
    setAttendeeEmails(prev => prev.filter(e => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

      const meetingData = {
        title: formData.title,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        type: formData.type,
        projectId: formData.type === 'project' ? formData.projectId : undefined,
        attendees: attendeeEmails,
        location: formData.location,
        isOnline: formData.isOnline,
        meetingUrl: formData.isOnline ? formData.meetingUrl : undefined,
      };

      if (meetingId) {
        await updateMeeting({ id: meetingId, ...meetingData });
        onMeetingUpdated();
      } else {
        await createMeeting(meetingData);
        onMeetingCreated();
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meetingId ? 'Editar Reunión' : 'Nueva Reunión'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Título de la reunión"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción de la reunión"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Inicio</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fin</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'project' | 'personal') => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="project">Proyecto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'project' && (
            <div className="space-y-2">
              <Label htmlFor="project">Proyecto</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleInputChange('projectId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isOnline"
              checked={formData.isOnline}
              onCheckedChange={(checked) => handleInputChange('isOnline', checked as boolean)}
            />
            <Label htmlFor="isOnline">Reunión virtual</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              {formData.isOnline ? 'URL de la reunión' : 'Ubicación'}
            </Label>
            <Input
              id="location"
              value={formData.isOnline ? formData.meetingUrl : formData.location}
              onChange={(e) => handleInputChange(
                formData.isOnline ? 'meetingUrl' : 'location',
                e.target.value
              )}
              placeholder={
                formData.isOnline
                  ? 'https://meet.google.com/...'
                  : 'Sala de reuniones, oficina, etc.'
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Asistentes</Label>
            <div className="flex gap-2">
              <Input
                value={formData.attendeeEmail}
                onChange={(e) => handleInputChange('attendeeEmail', e.target.value)}
                placeholder="Email del asistente"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAttendee();
                  }
                }}
              />
              <Button type="button" onClick={addAttendee} size="sm">
                Agregar
              </Button>
            </div>
            
            {attendeeEmails.length > 0 && (
              <div className="space-y-1">
                {attendeeEmails.map((email, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{email}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttendee(email)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={actionLoading || dataLoading}
              className="flex-1"
            >
              {actionLoading ? 'Guardando...' : meetingId ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}