import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("MathSight Error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-main dark:bg-surface-dark">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="w-12 h-12 text-amber mx-auto" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              문제가 발생했습니다
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {this.state.error?.message || "알 수 없는 오류가 발생했습니다."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                다시 시도
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-warm dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Home className="w-4 h-4" />
                홈으로
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
