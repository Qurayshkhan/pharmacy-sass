import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationProps {
    links?: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
    className?: string;
    showInfo?: boolean;
    infoLabel?: string;
}

const Pagination = ({
    links = [],
    from,
    to,
    total = 0,
    className,
    showInfo = true,
    infoLabel,
}: PaginationProps) => {
    if (!links.length || total === 0) {
        return null;
    }

    const handleClick = (url: string | null, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!url) return;
        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Get previous and next links
    const prevLink = links.find((link) => link.label.includes('Previous') || link.label.includes('«'));
    const nextLink = links.find((link) => link.label.includes('Next') || link.label.includes('»'));

    const pageLinks = links.filter(
        (link) =>
            !link.label.includes('Previous') &&
            !link.label.includes('Next') &&
            !link.label.includes('«') &&
            !link.label.includes('»')
    );

    return (
        <nav
            aria-label="Pagination"
            className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}
        >
            {showInfo && (from !== null || to !== null || total > 0) && (
                <div className="text-sm text-muted-foreground">
                    {infoLabel ? (
                        <span>{infoLabel}</span>
                    ) : (
                        <span>
                            Showing <span className="font-medium text-foreground">{from || 0}</span> to{' '}
                            <span className="font-medium text-foreground">{to || 0}</span> of{' '}
                            <span className="font-medium text-foreground">{total}</span> results
                        </span>
                    )}
                </div>
            )}

            <ul className="flex flex-wrap items-center gap-1">

                {prevLink && (
                    <li>
                        <button
                            onClick={(e) => handleClick(prevLink.url, e)}
                            disabled={!prevLink.url}
                            aria-label="Go to previous page"
                            className={cn(
                                'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                'border border-input bg-background shadow-xs',
                                'hover:bg-accent hover:text-accent-foreground',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                'disabled:pointer-events-none disabled:opacity-50',
                                prevLink.active && 'bg-primary text-primary-foreground hover:bg-primary/90'
                            )}
                        >
                            <ChevronLeft className="size-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>
                    </li>
                )}
                {pageLinks.map((link, index) => {
                    const isEllipsis = link.label.includes('…') || link.label.includes('...');
                    const pageNumber = link.label.match(/\d+/)?.[0];

                    if (isEllipsis) {
                        return (
                            <li key={`ellipsis-${index}`}>
                                <span
                                    className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-muted-foreground"
                                    aria-hidden="true"
                                >
                                    <span className="sr-only">More pages</span>
                                    <span>…</span>
                                </span>
                            </li>
                        );
                    }

                    return (
                        <li key={link.url || `page-${index}`}>
                            <button
                                onClick={(e) => handleClick(link.url, e)}
                                disabled={link.active}
                                aria-label={pageNumber ? `Go to page ${pageNumber}` : `Go to ${link.label}`}
                                aria-current={link.active ? 'page' : undefined}
                                className={cn(
                                    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    'border border-input bg-background shadow-xs min-w-10',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                    'disabled:pointer-events-none disabled:opacity-50',
                                    link.active &&
                                    'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                                )}
                            >
                                {link.label}
                            </button>
                        </li>
                    );
                })}

                {nextLink && (
                    <li>
                        <button
                            onClick={(e) => handleClick(nextLink.url, e)}
                            disabled={!nextLink.url}
                            aria-label="Go to next page"
                            className={cn(
                                'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                'border border-input bg-background shadow-xs',
                                'hover:bg-accent hover:text-accent-foreground',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                'disabled:pointer-events-none disabled:opacity-50',
                                nextLink.active && 'bg-primary text-primary-foreground hover:bg-primary/90'
                            )}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="size-4" />
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
