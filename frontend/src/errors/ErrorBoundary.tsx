import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorComponent from './ErrorComponent';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the error component.
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console -- should we log this instead?
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      return <ErrorComponent jsError={error} />;
    }
    return children;
  }
}

export default ErrorBoundary;
