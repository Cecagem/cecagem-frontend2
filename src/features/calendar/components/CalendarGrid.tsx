"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import type { IMeeting } from '../types/calendar.types';
import { MeetingDetailsSheet } from './MeetingDetailsSheet';

interface CalendarGridProps {
  meetings: IMeeting[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  onEditMeeting: (meetingId: string) => void;
  onMeetingDeleted?: () => void;
}

export function CalendarGrid({ 
  meetings, 
  currentMonth,
  onMonthChange,
  onEditMeeting,
  onMeetingDeleted
}: CalendarGridProps) {
  // Removemos el estado local del mes ya que ahora viene desde Calendar
  // const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<IMeeting | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getMeetingsForDate = (date: Date): IMeeting[] => {
    return meetings.filter(meeting => 
      isSameDay(new Date(meeting.startDate), date)
    );
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  // Generar días del calendario mensual (domingo como primer día)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handleMeetingClick = (meeting: IMeeting) => {
    setSelectedMeeting(meeting);
    setIsSheetOpen(true);
  };

  const getMeetingColor = (meeting: IMeeting) => {
    if (meeting.isCompleted) {
      return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    }
    // Para reuniones programadas (no completadas)
    return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  };

  return (
    <>
      <div className="p-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px mb-1 bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden">
          {dayNames.map((day) => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-600 rounded-lg overflow-hidden shadow-sm">
          {calendarDays.map((day) => {
            const dayMeetings = getMeetingsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[110px] p-3 bg-white dark:bg-slate-800 transition-all duration-200
                  ${isCurrentMonth 
                    ? 'hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer' 
                    : 'bg-gray-50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500'
                  }
                  ${isDayToday ? 'border-2 border-primary' : ''}
                `}
              >
                {/* Day number */}
                <div className={`
                  text-sm font-medium mb-2 flex items-center justify-start
                  ${isDayToday 
                    ? 'text-primary font-bold' 
                    : isCurrentMonth 
                      ? 'text-gray-900 dark:text-gray-100' 
                      : 'text-gray-400 dark:text-gray-500'
                  }
                `}>
                  {format(day, 'd')}
                </div>

                {/* Meetings */}
                <div className="space-y-1">
                  {dayMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      className={`
                        text-xs p-2 rounded-md cursor-pointer truncate transition-all duration-200
                        ${getMeetingColor(meeting)}
                        hover:scale-105 hover:shadow-md
                      `}
                      onClick={() => handleMeetingClick(meeting)}
                      title={`${meeting.title} - ${formatTime(meeting.startDate)}`}
                    >
                      <div className="font-semibold truncate">{meeting.title}</div>
                      <div className="text-[10px] opacity-90 mt-0.5">
                        {formatTime(meeting.startDate)}
                      </div>
                    </div>
                  ))}
                  
                  {dayMeetings.length > 2 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="text-[10px] text-primary dark:text-primary font-medium px-2 py-1 cursor-pointer hover:bg-primary/10 rounded transition-colors">
                          +{dayMeetings.length - 2} más
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-3">
                          <h4 className="font-semibold text-sm mb-3">
                            Reuniones del {format(day, 'd \'de\' MMMM', { locale: es })}
                          </h4>
                          <div className="space-y-2">
                            {dayMeetings.map((meeting) => (
                              <div
                                key={meeting.id}
                                className={`
                                  text-xs p-2 rounded-md cursor-pointer transition-all duration-200
                                  ${getMeetingColor(meeting)}
                                  hover:scale-105 hover:shadow-md
                                `}
                                onClick={() => {
                                  handleMeetingClick(meeting);
                                }}
                              >
                                <div className="font-semibold">{meeting.title}</div>
                                <div className="text-[10px] opacity-90 mt-0.5">
                                  {formatTime(meeting.startDate)} - {formatTime(meeting.endDate)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meeting Details Sheet */}
      <MeetingDetailsSheet
        meeting={selectedMeeting}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onEditMeeting={onEditMeeting}
        onMeetingDeleted={onMeetingDeleted}
      />
    </>
  );
}
