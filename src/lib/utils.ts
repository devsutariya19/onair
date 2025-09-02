import { clsx, type ClassValue } from "clsx"
import { format } from "path";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const timeAgo = (dateString: any) => {
    const date: any = new Date(dateString);
    const now: any = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

export const formatTotalTimeDisplay = (seconds: any) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);
  return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', s > 0 ? `${s}s` : ''].join(' ').trim() || '0m';
};

export const formatTimeInterval = (seconds: any) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);
  return `${h}:${m}:${s}`;
};

export const formatMinutes = (seconds: number) => `${Math.floor(seconds / 60)} min`;

export const formatDate = (dateString: any) => {
  const dateObject = new Date(dateString);
  const formattedDateTime = dateObject.toLocaleString();
  return formattedDateTime;
};

export const convertToSeconds = (timeString: string) => {
  const regex = /^(\d{1,2}):(\d{2}):(\d{2})$/;
  const match = timeString.match(regex);
  
  if (match) {
    const [, hours, minutes, seconds] = match;
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  }
  
  return null;
};

export const formatStringTime = (timeString: string): string => {
    const cleanedTime = timeString.replace(/[^0-9:]/g, "");
    let timeParts = ["00", "00", "00"];

    if (cleanedTime.includes(":")) {
    timeParts = cleanedTime.split(":");
    
    while (timeParts.length < 3) {
      timeParts.unshift("00");
    }
  } else {
    if (cleanedTime.length >= 5) {
      timeParts = [cleanedTime.slice(0, 2), cleanedTime.slice(2, 4), cleanedTime.slice(4, 6)];
    } else if (cleanedTime.length >= 4) {
      timeParts = ["00", cleanedTime.slice(0, 2), cleanedTime.slice(2, 4)];
    } else if (cleanedTime.length === 3) {
      timeParts = ["00", cleanedTime.slice(0, 1), cleanedTime.slice(1)];
    } else if (cleanedTime.length === 2) {
      timeParts = ["00", cleanedTime, "00"];
    } else if (cleanedTime.length === 1) {
      timeParts = ["00", cleanedTime, "00"];
    }
  }

    timeParts[0] = Math.min(24, parseInt(timeParts[0], 10)).toString().padStart(2, "0");
    timeParts[1] = Math.min(59, parseInt(timeParts[1], 10)).toString().padStart(2, "0");
    timeParts[2] = Math.min(59, parseInt(timeParts[2], 10)).toString().padStart(2, "0");

    return `${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;
};
