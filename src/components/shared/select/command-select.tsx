import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export type CommandInputType = {
  id: string | number;
  label: string;
  value: string;
};
interface CommandSelectProps {
  onSelected: (value: CommandInputType) => void;
  onSearch?: (value: string) => void;
  query: string;
  //   onQueryChange: (val: string) => void;
  data?: CommandInputType[];
  placeholder?: string;
  isLoading?: boolean;
  messageLoader?: string;
  messageError?: string;
  children?: (item: {
    id: string | number;
    label: string | number;
    value: string;
  }) => React.ReactNode;
  shouldFilter?: boolean;
  className?: string;
  disabled?: boolean;
}
export default function CommandSelect({
  placeholder,
  data,
  onSelected,
  children,
  query,
  shouldFilter = false,
  isLoading,
  messageLoader,
  messageError,
  onSearch,
  className,
  disabled,
}: CommandSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const displayValue = query ? query : placeholder;

  const handleSelect = (valueId: string) => {
    const findValue = data?.find(({ id }) => id === valueId);
    if (findValue) {
      onSelected(findValue);
    }
    // setSearchQuery(findValue.label.toString());
    setOpen(false);
  };

  const handleValueChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("*:not-first:mt-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full flex justify-between">
          <Button type="button" variant={"outline"} disabled={disabled}>
            <span className={cn("truncate", !query && "text-muted-foreground")}>
              {displayValue}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        >
          <Command shouldFilter={shouldFilter}>
            <CommandInput
              placeholder={placeholder}
              onValueChange={handleValueChange}
              value={searchQuery}
              onFocus={() => setOpen(true)}
            />

            <CommandList>
              {isLoading ? (
                <div className="flex p-4 items-center justify-center text-sm text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {messageLoader || "Buscando resultados..."}
                </div>
              ) : !data || !data.length ? (
                <CommandEmpty>
                  {messageError || "No se encontraron resultados"}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.value}
                      onSelect={handleSelect}
                    >
                      {children ? children(item) : item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
