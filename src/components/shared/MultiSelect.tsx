"use client";

import { useState, useMemo, forwardRef, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  emptyMessage?: string;
  maxSelections?: number;
  showSelectAll?: boolean;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ 
    options = [], 
    value = [],
    onValueChange, 
    placeholder = "Seleccionar...", 
    searchPlaceholder = "Buscar...",
    disabled,
    className,
    error,
    emptyMessage = "No se encontraron opciones",
    maxSelections,
    showSelectAll = false
  }, ref) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filtrar opciones basado en el término de búsqueda
    const filteredOptions = useMemo(() => {
      if (!searchTerm) return options;
      
      const searchLower = searchTerm.toLowerCase();
      
      return options.filter(option => {
        const labelMatch = option.label.toLowerCase().includes(searchLower);
        const valueMatch = option.value.toLowerCase().includes(searchLower);
        
        // Si el label tiene formato "DNI - Nombre", también buscar solo en el DNI
        const dniMatch = option.label.toLowerCase().split(' - ')[0]?.includes(searchLower);
        
        return labelMatch || valueMatch || dniMatch;
      });
    }, [options, searchTerm]);

    // Encontrar las opciones seleccionadas
    const selectedOptions = options.filter(option => value.includes(option.value));

    const handleSelect = (optionValue: string) => {
      if (disabled) return;
      
      const isSelected = value.includes(optionValue);
      let newValue: string[];
      
      if (isSelected) {
        // Deseleccionar
        newValue = value.filter(v => v !== optionValue);
      } else {
        // Seleccionar si no excede el máximo
        if (maxSelections && value.length >= maxSelections) {
          return; // No permitir más selecciones
        }
        newValue = [...value, optionValue];
      }
      
      onValueChange?.(newValue);
    };

    const handleSelectAll = () => {
      if (disabled) return;
      
      const allFilteredValues = filteredOptions
        .filter(option => !option.disabled)
        .map(option => option.value);
      
      const allSelected = allFilteredValues.every(val => value.includes(val));
      
      if (allSelected) {
        // Deseleccionar todos los filtrados
        const newValue = value.filter(v => !allFilteredValues.includes(v));
        onValueChange?.(newValue);
      } else {
        // Seleccionar todos los filtrados (respetando el límite)
        const currentSelected = value.filter(v => !allFilteredValues.includes(v));
        let toAdd = allFilteredValues;
        
        if (maxSelections) {
          const remainingSlots = maxSelections - currentSelected.length;
          toAdd = allFilteredValues.slice(0, remainingSlots);
        }
        
        onValueChange?.([...currentSelected, ...toAdd]);
      }
    };

    const handleRemoveSelected = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      
      const newValue = value.filter(v => v !== optionValue);
      onValueChange?.(newValue);
    };

    const handleToggle = () => {
      if (!disabled) {
        setOpen(!open);
        setSearchTerm("");
      }
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpen(false);
          setSearchTerm("");
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        // Focus en el input de búsqueda cuando se abre
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open]);

    // Texto para mostrar en el trigger
    const getDisplayText = () => {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} seleccionados`;
    };

    const canSelectAll = showSelectAll && filteredOptions.length > 0;
    const allFilteredSelected = canSelectAll && 
      filteredOptions
        .filter(option => !option.disabled)
        .every(option => value.includes(option.value));

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          ref={ref}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            selectedOptions.length === 0 && "text-muted-foreground",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <span className="truncate">
              {getDisplayText()}
            </span>
            {maxSelections && (
              <span className="text-xs text-muted-foreground ml-2">
                ({value.length}/{maxSelections})
              </span>
            )}
          </div>
          <ChevronDown className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180"
          )} />
        </button>

        {/* Selected items badges (cuando hay selecciones) */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedOptions.map((option) => (
              <Badge key={option.value} variant="secondary" className="text-xs">
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveSelected(option.value, e)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95">
            {/* Search Input */}
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Select All Option */}
            {canSelectAll && (
              <div className="border-b">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex w-full items-center rounded-sm px-2 py-2 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      allFilteredSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>
                    {allFilteredSelected ? "Deseleccionar todo" : "Seleccionar todo"}
                  </span>
                </button>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const canSelect = !option.disabled && (!maxSelections || value.length < maxSelections || isSelected);
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => canSelect && handleSelect(option.value)}
                      disabled={option.disabled || (!canSelect && !isSelected)}
                      className={cn(
                        "flex w-full items-center rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        (option.disabled || (!canSelect && !isSelected)) && "cursor-not-allowed opacity-50",
                        isSelected && "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";