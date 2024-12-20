import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { add, format, parse, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateTimeLocal = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const parseDateTimeLocal = (localDateString: string): string => {
  const date = parse(localDateString, "yyyy-MM-dd'T'HH:mm", new Date());
  return date.toISOString();
};

export const addTimezoneToDate = (date: Date) =>
  add(date, { minutes: -date.getTimezoneOffset() });