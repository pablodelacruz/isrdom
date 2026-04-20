import React from 'react';
import { ISRCalculator } from './components/ISRCalculator';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ISRCalculator />
    </ErrorBoundary>
  );
}

export default App;
