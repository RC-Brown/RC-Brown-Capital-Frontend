"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md'>
            <div className='mb-4 text-6xl text-red-500'>⚠️</div>
            <h2 className='mb-2 text-xl font-semibold text-gray-800'>Something went wrong</h2>
            <p className='mb-4 text-gray-600'>
              We encountered an error while loading the dashboard. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
