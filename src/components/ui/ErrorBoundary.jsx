import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
          <div className="text-center space-y-5 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} className="text-warning" />
            </div>
            <h2 className="font-[var(--font-display)] text-2xl text-white">
              Something went wrong
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-bg-primary rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all cursor-pointer border-none"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
