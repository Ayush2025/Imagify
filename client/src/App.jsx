import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './components/Login';
import Verify from './pages/Verify';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          {/* ... rest of your pages ... */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
