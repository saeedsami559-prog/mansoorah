import { Component, type ReactNode } from 'react';

/** Last-resort fallback so a rendering error never leaves a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode; resetKey: string }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: false });
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
