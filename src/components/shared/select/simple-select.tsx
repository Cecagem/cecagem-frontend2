import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

interface SimpleSelectProps extends SelectProps {
  items: { id: string | number; value: string; label?: string }[];
  isLoading?: boolean;
  isError?: boolean;
  placeholder?: string;
  className?: string;
}
export default function SimpleSelect({
  items,
  isLoading,
  isError,
  placeholder,
  className,
  ...props
}: SimpleSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="__loading__" disabled>
            Cargando...
          </SelectItem>
        ) : isError ? (
          <SelectItem value="__error__" disabled>
            Error al cargar
          </SelectItem>
        ) : (
          items?.map((item) => (
            <SelectItem key={item.id} value={item.value}>
              {item.label || item.value}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
