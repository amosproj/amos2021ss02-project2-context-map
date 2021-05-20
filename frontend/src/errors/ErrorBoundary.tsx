import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorComponent from './ErrorComponent';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | undefined;
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: undefined,
      hasError: false,
    };
  }

  public static getDerivedStateFromError(e: Error): State {
    // Update state so the next render will show the error component.
    return { error: e, hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console -- should we log this instead?
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ErrorComponent jsError={error} />;
    }

    return children;
  }
}

export default ErrorBoundary;
