import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function GlobalAlert() {
    const page = usePage();
    const flash = (page.props as { flash?: { success?: string; error?: string } }).flash;
    const [alertState, setAlertState] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [, startTransition] = useTransition();

    useEffect(() => {
        const currentSuccess = flash?.success;
        const currentError = flash?.error;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        startTransition(() => {
            if (currentSuccess) {
                setAlertState({ type: 'success', message: currentSuccess });

                timeoutRef.current = setTimeout(() => {
                    setAlertState({ type: null, message: '' });
                }, 5000);
            } else if (currentError) {
                setAlertState({ type: 'error', message: currentError });

                timeoutRef.current = setTimeout(() => {
                    setAlertState({ type: null, message: '' });
                }, 5000);
            } else if (!currentSuccess && !currentError) {

                setAlertState({ type: null, message: '' });
            }
        });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [flash, startTransition]);

    const closeAlert = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setAlertState({ type: null, message: '' });
    };

    if (!alertState.type) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 w-full max-w-md">
            {alertState.type === 'success' && (
                <Alert className="relative border-green-500/50 bg-green-50 dark:bg-green-950/20 shadow-lg">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-900 dark:text-green-100">
                        Success
                    </AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        {alertState.message}
                    </AlertDescription>
                    <button
                        onClick={closeAlert}
                        className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4 text-green-900 dark:text-green-100" />
                    </button>
                </Alert>
            )}

            {alertState.type === 'error' && (
                <Alert variant="destructive" className="relative border-red-500/50 shadow-lg">
                    <AlertCircle className="text-red-600 dark:text-red-400" />
                    <AlertTitle className="text-red-900 dark:text-red-100">
                        Error
                    </AlertTitle>
                    <AlertDescription className="text-red-800 dark:text-red-200">
                        {alertState.message}
                    </AlertDescription>
                    <button
                        onClick={closeAlert}
                        className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4 text-red-900 dark:text-red-100" />
                    </button>
                </Alert>
            )}
        </div>
    );
}
