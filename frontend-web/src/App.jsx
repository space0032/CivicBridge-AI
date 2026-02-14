import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
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
import EditProgram from './pages/admin/EditProgram';
import AddHealthcare from './pages/admin/AddHealthcare';
import EditHealthcare from './pages/admin/EditHealthcare';
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
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.PROGRAMS} element={<Programs />} />
                  <Route path={ROUTES.HEALTHCARE} element={<Healthcare />} />
                  <Route path={ROUTES.VOICE_SEARCH} element={<VoiceSearch />} />
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.REGISTER} element={<Register />} />
                  <Route path={ROUTES.PROGRAM_DETAILS} element={<ProgramDetails />} />
                  <Route path={ROUTES.HEALTHCARE_DETAILS} element={<HealthcareDetails />} />
                  <Route path={ROUTES.APPLY} element={
                    <ProtectedRoute>
                      <ApplicationPage />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.APPLICATIONS} element={
                    <ProtectedRoute>
                      <MyApplications />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.PROFILE} element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.ADMIN_DASHBOARD} element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.ADMIN_ADD_PROGRAM} element={
                    <ProtectedRoute adminOnly={true}>
                      <AddProgram />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.ADMIN_ADD_HEALTHCARE} element={
                    <ProtectedRoute adminOnly={true}>
                      <AddHealthcare />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.ADMIN_EDIT_PROGRAM} element={
                    <ProtectedRoute adminOnly={true}>
                      <EditProgram />
                    </ProtectedRoute>
                  } />
                  <Route path={ROUTES.ADMIN_EDIT_HEALTHCARE} element={
                    <ProtectedRoute adminOnly={true}>
                      <EditHealthcare />
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
