"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  maxHeight?: string
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Seleccionar opciones...",
  searchPlaceholder = "Buscar...",
  emptyText = "No se encontraron opciones.",
  className,
  disabled = false,
  maxHeight = "300px",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter((option) => value.includes(option.value))

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((val) => val !== optionValue)
      : [...value, optionValue]
    onValueChange?.(newValue)
  }

  const handleRemove = (optionValue: string) => {
    const newValue = value.filter((val) => val !== optionValue)
    onValueChange?.(newValue)
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-[2.5rem] py-2",
              selectedOptions.length === 0 && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <span className="text-left">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} opción${selectedOptions.length !== 1 ? 'es' : ''} seleccionada${selectedOptions.length !== 1 ? 's' : ''}`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList style={{ maxHeight }}>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          value.includes(option.value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mostrar opciones seleccionadas */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-md border">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="max-w-[200px] truncate text-xs">{option.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(option.value)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
