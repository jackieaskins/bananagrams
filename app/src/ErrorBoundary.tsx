import { ConvexError } from "convex/values";
import { Component } from "react";

import type { ApplicationError } from "../convex/lib/errors";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { errorMessage: null };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    if (error instanceof ConvexError) {
      return {
        errorMessage: (error as ApplicationError).data.message,
      };
    }

    return { errorMessage: "Internal server error" };
  }

  render(): React.ReactNode {
    if (this.state.errorMessage) {
      return <div>Error: {this.state.errorMessage}</div>;
    }

    return this.props.children;
  }
}
