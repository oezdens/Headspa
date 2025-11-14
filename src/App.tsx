import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Services } from "./components/services";
import { BookingSection } from "./components/booking-section";
import { Footer } from "./components/footer";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Impressum } from "./pages/Impressum";
import { Datenschutz } from "./pages/Datenschutz";
import { NotFound } from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DatabaseHeartbeat } from "./components/DatabaseHeartbeat";
import CookieBanner from "./components/CookieBanner";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        {/* Home page route */}
        <Route path="/" element={
          <div className="min-h-screen bg-black">
            <DatabaseHeartbeat />
            <Header />
            <Hero />
            <Services />
            <BookingSection />
            <Footer />
            <CookieBanner />
            <Toaster />
          </div>
        } />

        {/* Impressum page route */}
        <Route path="/impressum" element={
          <>
            <Header />
            <Impressum />
            <Footer />
            <CookieBanner />
            <Toaster />
          </>
        } />

        {/* Datenschutz page route */}
        <Route path="/datenschutz" element={
          <>
            <Header />
            <Datenschutz />
            <Footer />
            <CookieBanner />
            <Toaster />
          </>
        } />

        {/* Login page route */}
        <Route path="/login" element={
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <CookieBanner />
            <Toaster />
          </>
        } />

        {/* Dashboard route (protected) */}
        <Route path="/dashboard" element={
          isLoggedIn ? (
            <>
              <Dashboard onLogout={handleLogout} />
              <CookieBanner />
              <Toaster />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* 404 Not Found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}