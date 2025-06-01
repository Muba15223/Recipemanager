// src/main.jsx
import 'animate.css';
import './styles.css';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Optional Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Placeholder for a global context/provider
const AppProviders = ({ children }) => {
  // Add context providers here if needed
  return children;
};

if (import.meta.env.MODE === 'development') {
  console.log('🚧 Running in development mode');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>
);
