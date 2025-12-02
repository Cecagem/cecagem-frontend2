"use client";

import { useState, useMemo, forwardRef, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  emptyMessage?: string;
  // Props para búsqueda en servidor
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
  // Opción seleccionada (para mostrar aunque no esté en options)
  selectedOption?: SearchableSelectOption | null;
}

export const SearchableSelect = forwardRef<HTMLButtonElement, SearchableSelectProps>(
  ({ 
    options = [], 
    value, 
    onValueChange, 
    placeholder = "Seleccionar...", 
    searchPlaceholder = "Buscar...",
    disabled,
    className,
    error,
    emptyMessage = "No se encontraron opciones",
    onSearchChange,
    isLoading = false,
    selectedOption: externalSelectedOption
  }, ref) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filtrar opciones basado en el término de búsqueda (solo si no hay búsqueda en servidor)
    const filteredOptions = useMemo(() => {
      // Si hay búsqueda en servidor, no filtrar localmente
      if (onSearchChange) return options;
      
      if (!searchTerm) return options;
      
      const searchLower = searchTerm.toLowerCase();
      
      return options.filter(option => {
        const labelLower = option.label.toLowerCase();
        const valueLower = option.value.toLowerCase();
        
        // Buscar en el label completo, value, y también extraer el DNI si está en formato "DNI - Nombre"
        const labelMatch = labelLower.includes(searchLower);
        const valueMatch = valueLower.includes(searchLower);
        
        // Si el label tiene formato "DNI - Nombre", también buscar solo en el DNI
        const dniMatch = labelLower.split(' - ')[0]?.includes(searchLower);
        
        return labelMatch || valueMatch || dniMatch;
      });
    }, [options, searchTerm, onSearchChange]);

    // Manejar cambio en búsqueda
    const handleSearchChange = (searchValue: string) => {
      setSearchTerm(searchValue);
      // Si hay callback de búsqueda en servidor, llamarlo
      if (onSearchChange) {
        onSearchChange(searchValue);
      }
    };

    // Encontrar la opción seleccionada
    // Primero buscar en la opción externa, luego en options
    const selectedOption = useMemo(() => {
      if (!value) return undefined;
      
      // Buscar primero en la opción externa
      if (externalSelectedOption && externalSelectedOption.value === value) {
        return externalSelectedOption;
      }
      
      // Luego buscar en las opciones normales
      return options.find(option => option.value === value);
    }, [value, externalSelectedOption, options]);

    const handleSelect = (optionValue: string) => {
      onValueChange?.(optionValue);
      setOpen(false);
      setSearchTerm("");
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
            !selectedOption && "text-muted-foreground",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180"
          )} />
        </button>

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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {isLoading && (
                <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
              )}
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-auto p-1">
              {isLoading ? (
                <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                  Buscando...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={cn(
                      "flex w-full items-center rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      option.disabled && "cursor-not-allowed opacity-50",
                      value === option.value && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";