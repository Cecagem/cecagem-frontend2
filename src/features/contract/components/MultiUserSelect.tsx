import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

interface User {
  id: string;
  profile?: {
    firstName: string;
    lastName: string;
  } | null;
}

interface MultiUserSelectProps {
  users: User[];
  allUsers?: User[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  className?: string;
  label?: string;
  error?: string;
}

export const MultiUserSelect = ({
  users,
  allUsers,
  selectedIds = [],
  onSelectionChange,
  placeholder = "Seleccionar usuarios...",
  searchValue,
  onSearchChange,
  className = "",
  label,
  error,
}: MultiUserSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onSearchChange("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onSearchChange]);

  const handleToggleUser = (userId: string) => {
    const isSelected = selectedIds.includes(userId);
    if (isSelected) {
      onSelectionChange(selectedIds.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedIds, userId]);
      onSearchChange("");
    }
  };

  const getUserDisplayName = (user: User) => {
    if (!user) return "Usuario no encontrado";
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.id || "Sin nombre";
  };

  const getSelectedUsers = () => {
    const userList = allUsers || users;
    return selectedIds.map((id) => {
      const user = userList.find((u) => u.id === id);
      return user || { id, profile: null };
    });
  };

  const handleRemoveUser = (userId: string) => {
    const newSelectedIds = selectedIds.filter((id) => id !== userId);
    onSelectionChange(newSelectedIds);
  };

  const filteredUsers = users.filter((user) => {
    const displayName = getUserDisplayName(user).toLowerCase();
    return displayName.includes(searchValue.toLowerCase());
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        className={`
          flex h-10 w-full items-center justify-between rounded-md border border-input 
          bg-background px-3 py-2 text-sm ring-offset-background 
          placeholder:text-muted-foreground focus:outline-none focus:ring-2 
          focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed 
          disabled:opacity-50 hover:bg-accent hover:text-accent-foreground
          ${error ? "border-destructive" : ""}
        `}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
          setTimeout(() => {
            if (inputRef.current && !isOpen) {
              inputRef.current.focus();
            }
          }, 100);
        }}
      >
        <div className="flex-1 text-left overflow-hidden">
          {selectedIds.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} usuario{selectedIds.length > 1 ? "s" : ""}{" "}
              seleccionado{selectedIds.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Users select */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {getSelectedUsers().map((user) => (
            <div
              key={user.id}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-blue-200"
            >
              <span className="max-w-32 truncate">
                {getUserDisplayName(user)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveUser(user.id);
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown up */}
      {isOpen && (
        <div className="absolute z-50 w-full mb-2 bottom-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 max-h-80 overflow-hidden">
          {/* Search */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar usuarios..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de usuarios */}
          <div
            className="max-h-[200px] overflow-auto p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredUsers.length === 0 ? (
              <div className="py-6 text-center text-sm">
                No se encontraron usuarios
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleUser(user.id);
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span>{getUserDisplayName(user)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};
