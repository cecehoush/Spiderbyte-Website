import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeEditorPage from './pages/CodeEditor'; // Import your CodeEditorPage

// Suppress the "ResizeObserver loop limit exceeded" warning
const originalConsoleError = console.error;

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
    return;
  }
  originalConsoleError(...args);
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Direct route to CodeEditorPage without redirection */}
        <Route path="/" element={<CodeEditorPage />} />
      </Routes>
    </Router>      
  );
}

export default App;
