"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxWithAddOption {
  value: string
  label: string
}

interface ComboboxWithAddProps {
  options: ComboboxWithAddOption[]
  value?: string
  onValueChange?: (value: string) => void
  onAddCustom?: (label: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  addText?: string
  className?: string
  disabled?: boolean
}

export function ComboboxWithAdd({
  options,
  value,
  onValueChange,
  onAddCustom,
  placeholder = "Seleccionar opción...",
  searchPlaceholder = "Buscar...",
  addText = "Agregar como personalizado",
  className,
  disabled = false,
}: ComboboxWithAddProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOption = options.find((option) => option.value === value)
  
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (optionValue: string) => {
    if (optionValue.startsWith("custom-")) {
      // Es una opción personalizada
      onAddCustom?.(search)
    } else {
      // Es una opción existente
      const newValue = optionValue === value ? "" : optionValue
      onValueChange?.(newValue)
    }
    setSearch("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  No se encontró &quot;{search}&quot;
                </p>
                {search.trim() && onAddCustom && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onAddCustom(search)
                      setSearch("")
                      setOpen(false)
                    }}
                    className="text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    {addText} &quot;{search}&quot;
                  </Button>
                )}
              </div>
            </CommandEmpty>
            
            <CommandGroup heading="Opciones Disponibles">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            
            {search.trim() && filteredOptions.length > 0 && onAddCustom && (
              <CommandGroup heading="Agregar Personalizado">
                <CommandItem
                  value={`custom-${search}`}
                  onSelect={() => {
                    onAddCustom(search)
                    setSearch("")
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">&quot;{search}&quot;</span>
                    <span className="text-xs text-muted-foreground">{addText}</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
