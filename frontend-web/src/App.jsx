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

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main style={{ minHeight: 'calc(100vh - 140px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/healthcare" element={<Healthcare />} />
                <Route path="/voice-search" element={<VoiceSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/programs/:id" element={<ProgramDetails />} />
                <Route path="/healthcare/:id" element={<HealthcareDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/add-program" element={<AddProgram />} />
                <Route path="/admin/add-healthcare" element={<AddHealthcare />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
