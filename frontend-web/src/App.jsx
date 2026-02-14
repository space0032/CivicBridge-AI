import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Healthcare from './pages/Healthcare';
import VoiceSearch from './pages/VoiceSearch';
import Login from './pages/Login';
import Register from './pages/Register';
import ProgramDetails from './pages/ProgramDetails';
import HealthcareDetails from './pages/HealthcareDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProgram from './pages/admin/AddProgram';
import AddHealthcare from './pages/admin/AddHealthcare';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationPage from './pages/ApplicationPage';
import MyApplications from './pages/MyApplications';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Toaster 
                position="top-center" 
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              <Header />
              <main style={{ flex: 1, padding: '20px 0' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/healthcare" element={<Healthcare />} />
                  <Route path="/voice-search" element={<VoiceSearch />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/programs/:id" element={<ProgramDetails />} />
                  <Route path="/healthcare/:id" element={<HealthcareDetails />} />
                  <Route path="/apply/:id" element={
                    <ProtectedRoute>
                      <ApplicationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications" element={
                    <ProtectedRoute>
                      <MyApplications />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/add-program" element={
                    <ProtectedRoute adminOnly={true}>
                      <AddProgram />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/add-healthcare" element={
                    <ProtectedRoute adminOnly={true}>
                      <AddHealthcare />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
