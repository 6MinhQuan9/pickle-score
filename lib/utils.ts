import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
  // Format: "05/02/2024"
  const d = new Date(date);
  return format(d, "dd/MM/yyyy");
};

export const formatDateTime = (date: string | Date) => {
  // Format: "05/02/2024 15:30"
  const d = new Date(date);
  return format(d, "dd/MM/yyyy HH:mm");
};

// For API and database operations - always use ISO format
export const formatDateTimeISO = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString();
};
