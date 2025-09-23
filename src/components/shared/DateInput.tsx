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
    // Convertir Date a string para el input
    const getDateString = (date: Date | string | undefined): string => {
      if (!date) return "";
      
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      
      // Formato YYYY-MM-DD para input type="date"
      return dateObj.toISOString().split('T')[0];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateString = e.target.value;
      if (dateString && onChange) {
        const date = new Date(dateString);
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