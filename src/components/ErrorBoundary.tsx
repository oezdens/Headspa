import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-2xl text-white font-semibold mb-3">
              Etwas ist schiefgelaufen
            </h1>
            
            <p className="text-gray-400 mb-6">
              Es tut uns leid, aber ein Fehler ist aufgetreten. Bitte versuchen Sie, die Seite neu zu laden.
            </p>
            
            {this.state.error && (
              <details className="text-left mb-6 bg-black/50 rounded p-4">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                  Technische Details
                </summary>
                <pre className="text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
