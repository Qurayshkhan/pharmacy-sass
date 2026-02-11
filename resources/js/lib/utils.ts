import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Highlights matching text in a string by wrapping matches in a span with highlight class
 * @param text - The text to search in
 * @param searchTerm - The term to highlight (case-insensitive)
 * @returns React element with highlighted text
 */
export function highlightText(text: string | null | undefined, searchTerm: string): React.ReactNode {
    if (!text || !searchTerm.trim()) {
        return text || '';
    }

    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
        // Create a new regex for each test to avoid lastIndex issues
        const testRegex = new RegExp(`^${escapedSearchTerm}$`, 'i');
        if (testRegex.test(part)) {
            return React.createElement(
                'mark',
                {
                    key: index,
                    className: 'bg-yellow-200 dark:bg-yellow-800 text-slate-900 dark:text-slate-100 px-0.5 rounded',
                },
                part
            );
        }
        return React.createElement('span', { key: index }, part);
    });
}
