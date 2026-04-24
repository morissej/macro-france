"use client";

import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[ErrorBoundary]", error, info);
    }

    private handleReload = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div
                    role="alert"
                    className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950 text-slate-100 px-6 text-center"
                >
                    <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
                    <p className="text-slate-400 max-w-md">
                        L&apos;application a rencontré un problème inattendu. Vous pouvez recharger la page pour réessayer.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                    >
                        Recharger la page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
