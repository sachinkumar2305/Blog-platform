import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type ClassInput = string | null | undefined | { [key: string]: boolean }

export function cn(...inputs: ClassInput[]) {
  return twMerge(clsx(inputs))
}