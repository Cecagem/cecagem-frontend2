import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
};

export const formatDateLong = (date: string | Date): string => {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), "HH:mm", { locale: es });
};

export const formatMonthName = (date: string | Date): string => {
  return format(new Date(date), "MMMM", { locale: es });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Hoy";
  } else if (diffInDays === 1) {
    return "Ayer";
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} días`;
  } else {
    return formatDate(date);
  }
};
