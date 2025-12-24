import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/dashboard';
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state. hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#161925',
          padding: '20px'
        }}>
          <div style={{
            background: '#23395b',
            border: '1px solid #ef4444',
            borderRadius:  '16px',
            padding: '40px',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <AlertTriangle size={40} color="#ef4444" />
            </div>

            <h1 style={{
              fontSize: '28px',
              marginBottom: '16px',
              color: '#cbf7ed'
            }}>
              Oops! Something went wrong
            </h1>

            <p style={{
              color: '#8ea8c3',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              We're sorry for the inconvenience. An unexpected error occurred. 
              Please try refreshing the page or go back to the homepage.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                background: '#0F0A1E',
                border: '1px solid #2d3748',
                borderRadius:  '8px',
                padding:  '16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <summary style={{
                  color: '#ef4444',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>
                  Error Details (Development Mode)
                </summary>
                <pre style={{
                  color: '#8ea8c3',
                  fontSize: '12px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error. toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{
              display:  'flex',
              gap:  '12px',
              justifyContent:  'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: '#cbf7ed',
                  color: '#161925',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={18} />
                Try Again
              </button>

              <button
                onClick={this. handleGoHome}
                style={{
                  padding: '12px 24px',
                  background: '#406e8e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius:  '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;