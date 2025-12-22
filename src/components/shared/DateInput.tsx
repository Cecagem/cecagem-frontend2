"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value?: Date | string;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, placeholder = "Seleccionar fecha", disabled, className, error, ...props }, ref) => {
    // ✅ FIX: Convertir Date a string sin usar UTC
    const getDateString = (date: Date | string | undefined): string => {
      if (!date) return "";
      
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      
      // 🔧 SOLUCIÓN: Usar componentes de fecha local en vez de toISOString()
      // toISOString() convierte a UTC y puede cambiar el día
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateString = e.target.value; // formato: "YYYY-MM-DD"
      if (dateString && onChange) {
        // 🔧 SOLUCIÓN: Crear fecha en zona horaria local
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month-1 porque Date usa 0-11
        date.setHours(12, 0, 0, 0); // Establecer hora al mediodía para evitar problemas
        
        if (!isNaN(date.getTime())) {
          onChange(date);
        }
      }
    };

    return (
      <Input
        ref={ref}
        type="date"
        value={getDateString(value)}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";