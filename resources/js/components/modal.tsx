import type { ReactNode } from "react";
import React, { useEffect, useRef } from "react";

type ModalProps = {
    show: boolean;
    onClose: () => void;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    closeable?: boolean;
    children: ReactNode;
};

const maxWidthClasses: Record<string, string> = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
    show,
    onClose,
    maxWidth = "2xl",
    closeable = true,
    children,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        if (closeable) onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();
            if (show) handleClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [show]);

    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "";
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                ref={dialogRef}
                className={`relative z-50 mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 sm:mx-auto sm:w-full ${maxWidthClasses[maxWidth]}`}
            >
                {children}
            </div>
        </div>
    );
};
