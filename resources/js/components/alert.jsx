import useLang from "@/hooks/useLang";
import React, { useEffect, useState } from "react";

const Alert = ({ pageProps }) => {
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { t } = useLang();

    const closeAlert = () => {
        setShowInfoMessage(false);
        setShowErrorMessage(false);
    };
    useEffect(() => {
        if (pageProps?.alert) {
            setShowInfoMessage(true);
            setInfoMessage(pageProps.alert);
            setShowErrorMessage(false);
            setTimeout(closeAlert, 5000);
        } else if (pageProps?.errors?.message) {
            setShowErrorMessage(true);
            setErrorMessage(pageProps.errors.message);
            setShowInfoMessage(false);
            setTimeout(closeAlert, 5000);
        }
    }, [pageProps]);

    return (
        <>
            {showInfoMessage && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[1000] flex items-center justify-center">
                    <div
                        className="p-8 border border-gray-300 rounded-lg bg-gray-50"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <h3 className="font-semibold text-3xl text-gray-800 leading-tight">
                                {t("Success")}
                            </h3>
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500">
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                            </div>
                            <button
                                onClick={closeAlert}
                                type="button"
                                className="ms-auto -mx-1.5 -my-1.5 bg-gray-50 text-gray-500 rounded-lg
                                            focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200
                                            inline-flex items-center justify-center h-8 w-8"
                                aria-label="Close"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div
                            className="font-semibold text-xl mt-2"
                            dangerouslySetInnerHTML={{ __html: t(infoMessage) }}
                        />
                    </div>
                </div>
            )}

            {showErrorMessage && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[1000] flex items-center justify-center">
                    <div
                        className="p-8 border border-gray-300 rounded-lg bg-gray-50"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <h3 className="font-semibold text-3xl text-gray-800 leading-tight">
                                {t("Error")}
                            </h3>
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 rounded-lg">
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                                </svg>
                            </div>
                            <button
                                onClick={closeAlert}
                                type="button"
                                className="ms-auto -mx-1.5 -my-1.5 bg-gray-50 text-gray-500 rounded-lg
                focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200
                inline-flex items-center justify-center h-8 w-8"
                                aria-label="Close"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div
                            className="font-semibold text-xl mt-2"
                            dangerouslySetInnerHTML={{
                                __html: t(errorMessage),
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Alert;
