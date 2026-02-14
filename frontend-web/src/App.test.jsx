import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './components/Header';
import { MemoryRouter } from 'react-router-dom';

// Mock Translation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            changeLanguage: () => new Promise(() => { }),
            language: 'en',
            on: () => { },
            off: () => { }
        }
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { }
    }
}));

// Mock AuthContext
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock('./contexts/AuthContext', async () => {
    return {
        useAuth: () => ({
            user: global.mockUser,
            login: mockLogin,
            logout: mockLogout,
            loading: false,
            isAdmin: global.mockUser?.roles?.includes('ROLE_ADMIN')
        }),
        // We don't need AuthProvider here as we are testing Header in isolation, 
        // but if Header uses other context hooks, we might need wrappers.
        // Header uses useLanguage from LanguageContext? 
        // Header line 4: const { currentLanguage, changeLanguage } = useLanguage();
    };
});

// Mock LanguageContext
vi.mock('./contexts/LanguageContext', () => ({
    useLanguage: () => ({
        currentLanguage: 'en',
        changeLanguage: vi.fn(),
    })
}));

describe('Header Component Tests', () => {

    beforeEach(() => {
        global.mockUser = null;
        vi.clearAllMocks();
    });

    it('renders the branding', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('CivicBridge AI')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('programs')).toBeInTheDocument();
        expect(screen.getByText('healthcare')).toBeInTheDocument();
        // Since t returns key, we expect 'programs'.
    });

    it('shows login button when not authenticated', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('login')).toBeInTheDocument();
    });

    it('shows user profile and logout when authenticated', () => {
        global.mockUser = { name: 'Test User', roles: ['ROLE_USER'] };
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('logout')).toBeInTheDocument();
    });

    it('shows admin link when user is admin', () => {
        global.mockUser = { name: 'Admin User', roles: ['ROLE_ADMIN'] };
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('admin')).toBeInTheDocument();
    });
});
