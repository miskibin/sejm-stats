import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePLDate(dateString: string): Date {
  const months: { [key: string]: number } = {
    stycznia: 0,
    lutego: 1,
    marca: 2,
    kwietnia: 3,
    maja: 4,
    czerwca: 5,
    lipca: 6,
    sierpnia: 7,
    września: 8,
    października: 9,
    listopada: 10,
    grudnia: 11,
  };
  const parts = dateString.replace(",", "").split(/\s+/);
  if (parts.length < 4) {
    throw new Error("Invalid date format");
  }
  const day = parseInt(parts[0], 10);
  const month = months[parts[1].toLowerCase()];
  const year = parseInt(parts[2], 10);
  const [hour, minute] = parts[3].split(":").map((num) => parseInt(num, 10));

  if (
    isNaN(day) ||
    month === undefined ||
    isNaN(year) ||
    isNaN(hour) ||
    isNaN(minute)
  ) {
    throw new Error("Invalid date components");
  }

  return new Date(year, month, day, hour, minute);
}
