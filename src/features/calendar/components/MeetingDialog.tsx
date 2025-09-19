"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreateMeeting, useUpdateMeeting } from '../hooks/use-calendar';
import { toast } from 'sonner';
import { MeetingType, MeetingMode, ICreateMeetingDto, IUpdateMeetingDto, IAttendee, IMeeting } from '../types/calendar.types';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

// Esquema de validación con Zod
const meetingFormSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  startDate: z.string()
    .min(1, 'La fecha y hora de inicio es obligatoria'),
  tipo: z.nativeEnum(MeetingType),
  modo: z.nativeEnum(MeetingMode),
  ubicacion: z.string()
    .min(1, 'La ubicación es obligatoria')
    .max(200, 'La ubicación no puede exceder 200 caracteres'),
  asistentes: z.array(z.object({
    email: z.string().email('Email inválido'),
    nombre: z.string().min(1, 'El nombre es requerido')
  })).default([])
}).refine((data) => {
  // Validar que la fecha no sea en el pasado
  const selectedDate = new Date(data.startDate);
  const now = new Date();
  return selectedDate > now;
}, {
  message: 'La fecha debe ser futura',
  path: ['startDate']
});

type MeetingFormData = z.infer<typeof meetingFormSchema>;

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingCreated: () => void;
  meeting?: IMeeting | null; // Para edición
  mode?: 'create' | 'edit'; // Para diferenciar entre crear y editar
}

export function MeetingDialog({
  open,
  onOpenChange,
  onMeetingCreated,
  meeting = null,
  mode = 'create'
}: MeetingDialogProps) {
  const createMeetingMutation = useCreateMeeting();
  const updateMeetingMutation = useUpdateMeeting();
  const [duration, setDuration] = useState<number>(30);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<MeetingFormData>>({
    title: '',
    description: '',
    startDate: '',
    tipo: MeetingType.PERSONAL,
    modo: MeetingMode.OFFICE,
    ubicacion: '',
    asistentes: [],
  });

  // Cargar datos de la reunión para edición
  useEffect(() => {
    if (mode === 'edit' && meeting && open) {
      const startDate = new Date(meeting.startDate);
      const endDate = new Date(meeting.endDate);
      const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
      
      // Formatear fecha para datetime-local sin problemas de zona horaria
      const formatDateTimeLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      setFormData({
        title: meeting.title,
        description: meeting.description || '',
        startDate: formatDateTimeLocal(startDate),
        tipo: meeting.tipo,
        modo: meeting.modo,
        ubicacion: meeting.ubicacion || '',
        asistentes: meeting.asistentes || [],
      });
      setDuration(duration);
    } else if (mode === 'create' && open) {
      // Reset form para crear nueva reunión
      setFormData({
        title: '',
        description: '',
        startDate: '',
        tipo: MeetingType.PERSONAL,
        modo: MeetingMode.OFFICE,
        ubicacion: '',
        asistentes: [],
      });
      setDuration(30);
      setNewAttendeeEmail('');
      setErrors({});
    }
  }, [mode, meeting, open]);

  const validateForm = (data: Partial<MeetingFormData>): boolean => {
    try {
      // Crear un esquema dinámico que permita fechas pasadas en modo edición
      const dynamicSchema = mode === 'edit' 
        ? meetingFormSchema.omit({ startDate: true }).extend({
            startDate: z.string().min(1, 'La fecha y hora de inicio es obligatoria')
          })
        : meetingFormSchema;
        
      dynamicSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      console.log('📝 Datos del formulario antes de enviar:', formData);
      
      // Calcular fecha fin basada en la duración
      const startDateTime = new Date(formData.startDate!);
      const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));
      
      // Preparar datos para envío, asegurando formato correcto
      const meetingData = {
        title: formData.title!,
        description: formData.description || '',
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        tipo: formData.tipo!,
        modo: formData.modo!,
        ubicacion: formData.ubicacion || '',
        asistentes: formData.asistentes || [],
      };
      
      console.log('📤 Datos finales enviados:', meetingData);
      
      if (mode === 'edit' && meeting) {
        // Actualizar reunión existente
        await updateMeetingMutation.mutateAsync({ 
          id: meeting.id, 
          data: meetingData as IUpdateMeetingDto 
        });
      } else {
        // Crear nueva reunión
        await createMeetingMutation.mutateAsync(meetingData as ICreateMeetingDto);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        startDate: '',
        tipo: MeetingType.PERSONAL,
        modo: MeetingMode.OFFICE,
        ubicacion: '',
        asistentes: [],
      });
      setDuration(30);
      setNewAttendeeEmail('');
      setErrors({});
      onOpenChange(false);
      onMeetingCreated();
    } catch (error) {
      console.error('Error en operación de reunión:', error);
      // Los errores específicos se manejan en los hooks
    }
  };

  const handleInputChange = (field: keyof MeetingFormData, value: string | MeetingType | MeetingMode | IAttendee[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addAttendee = () => {
    if (!newAttendeeEmail.trim()) return;
    
    // Validar email
    try {
      z.string().email().parse(newAttendeeEmail.trim());
    } catch {
      toast.error('Por favor ingresa un email válido');
      return;
    }
    
    // Verificar que el email no esté duplicado
    const existingEmails = (formData.asistentes || []).map(a => a.email);
    if (existingEmails.includes(newAttendeeEmail.trim())) {
      toast.error('Este email ya está en la lista');
      return;
    }

    const newAttendee: IAttendee = {
      email: newAttendeeEmail.trim(),
      nombre: newAttendeeEmail.split('@')[0],
    };

    const updatedAttendees = [...(formData.asistentes || []), newAttendee];
    handleInputChange('asistentes', updatedAttendees);
    setNewAttendeeEmail('');
  };

  const removeAttendee = (emailToRemove: string) => {
    const updatedAttendees = (formData.asistentes || []).filter(a => a.email !== emailToRemove);
    handleInputChange('asistentes', updatedAttendees);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle>{mode === 'edit' ? 'Editar Reunión' : 'Nueva Reunión'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Título de la reunión"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción de la reunión"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Fecha/Hora y Duración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha y hora inicio *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>Duración</Label>
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1.5 horas</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tipo y Modo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de reunión</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => handleInputChange('tipo', value as MeetingType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MeetingType.PERSONAL}>Personal</SelectItem>
                  <SelectItem value={MeetingType.PROYECTO}>Proyecto</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
            </div>
            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Select 
                value={formData.modo} 
                onValueChange={(value) => handleInputChange('modo', value as MeetingMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MeetingMode.VIRTUAL}>Virtual</SelectItem>
                  <SelectItem value={MeetingMode.OFFICE}>Presencial</SelectItem>
                </SelectContent>
              </Select>
              {errors.modo && <p className="text-sm text-red-500">{errors.modo}</p>}
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              value={formData.ubicacion || ''}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              placeholder={formData.modo === MeetingMode.VIRTUAL ? "URL de la reunión" : "Dirección o sala"}
              className={errors.ubicacion ? 'border-red-500' : ''}
            />
            {errors.ubicacion && <p className="text-sm text-red-500">{errors.ubicacion}</p>}
          </div>

          {/* Asistentes */}
          <div className="space-y-3">
            <Label>Asistentes</Label>
            
            {/* Agregar nuevo asistente */}
            <div className="flex gap-2">
              <Input
                value={newAttendeeEmail}
                onChange={(e) => setNewAttendeeEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
              <Button 
                type="button" 
                onClick={addAttendee}
                size="sm"
                className="shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>

            {/* Lista de asistentes */}
            {formData.asistentes && formData.asistentes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Asistentes agregados ({formData.asistentes.length}):
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.asistentes.map((attendee, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{attendee.nombre}</span>
                        <span className="text-xs text-muted-foreground">{attendee.email}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttendee(attendee.email)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 border-t pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMeetingMutation.isPending || updateMeetingMutation.isPending}
            >
              {(createMeetingMutation.isPending || updateMeetingMutation.isPending) 
                ? (mode === 'edit' ? 'Actualizando...' : 'Creando...') 
                : (mode === 'edit' ? 'Actualizar Reunión' : 'Crear Reunión')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}