import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarComponent from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FoodListingPage from './pages/FoodListingPage';
import AddFood from './pages/AddFood';
import MyListings from './pages/MyListings';
import MyRequests from './pages/MyRequests';
import RequestsReceived from './pages/RequestsReceived';
import FoodDetail from './pages/FoodDetail';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

import './styles/global.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <div className="app-wrapper">
              <NavbarComponent />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/food" element={<FoodListingPage />} />
                  <Route path="/food/:id" element={<FoodDetail />} />
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<Dashboard />} />}
                  />
                  <Route
                    path="/add-food"
                    element={
                      <ProtectedRoute
                        element={<AddFood />}
                        requiredRole="donor"
                      />
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <ProtectedRoute
                        element={<MyListings />}
                        requiredRole="donor"
                      />
                    }
                  />
                  <Route
                    path="/requests-received"
                    element={
                      <ProtectedRoute
                        element={<RequestsReceived />}
                        requiredRole="donor"
                      />
                    }
                  />
                  <Route
                    path="/my-requests"
                    element={
                      <ProtectedRoute
                        element={<MyRequests />}
                        requiredRole="receiver"
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    element={<ProtectedRoute element={<Profile />} />}
                  />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
