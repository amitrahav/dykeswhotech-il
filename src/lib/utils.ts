import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function parseEventDate(dateStr: string | undefined): number {
    if (!dateStr) return 0;
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const parts = dateStr.split('/');
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
    }
    if (dateStr.match(/^\d{2}-\d{2}\/\d{2}\/\d{4}$/)) {
        const parts = dateStr.split('/');
        const day = parts[0].split('-')[0];
        return new Date(`${parts[2]}-${parts[1]}-${day}`).getTime();
    }
    const sortDate = new Date(dateStr);
    if (isNaN(sortDate.getTime())) {
        if (dateStr.match(/2024/)) return new Date('2024-04-01').getTime();
        if (dateStr.match(/2025/)) return new Date('2025-04-01').getTime();
        return 0;
    }
    return sortDate.getTime();
}
