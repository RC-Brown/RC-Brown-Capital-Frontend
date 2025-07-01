import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirectToGoogleOAuth(role: "Investor" | "Sponsor") {
  window.location.href = `${BASE_URL}/api/auth/google/redirect?role=${role}`;
}
