import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 경계 컴포넌트
 * 하위 컴포넌트에서 발생한 에러를 캐치하고 fallback UI를 표시합니다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset);
      }

      if (fallback) {
        return fallback;
      }

      // 기본 에러 UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>문제가 발생했습니다.</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.reset}>다시 시도</button>
        </div>
      );
    }

    return this.props.children;
  }
}
