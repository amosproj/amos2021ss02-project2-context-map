/* istanbul ignore file */

import React, { ErrorInfo, ReactNode } from 'react';
import { Subscription } from 'rxjs';
import ErrorComponent from './ErrorComponent';
import ErrorStore from '../stores/ErrorStore';

interface Props {
  errorStore?: ErrorStore;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  private errorSubscription?: Subscription;
  private errorStore?: ErrorStore;

  constructor(props: Props) {
    super(props);
    this.errorStore = props.errorStore;
    this.state = {
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the error component.
    return { error };
  }

  public componentDidMount(): void {
    // Subscribe on a subject that contains errors
    // eslint-disable-next-line react/destructuring-assignment
    this.errorSubscription = this.errorStore?.getState().subscribe({
      next: (error) => {
        this.setState({ error });
      },
    });
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console -- should we log this instead?
    console.error('Uncaught error:', error, errorInfo);
  }

  public componentWillUnmount(): void {
    // Unsubscribe and remove current error
    this.errorSubscription?.unsubscribe();
    this.errorStore?.setState(null);
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
