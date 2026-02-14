import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders the header and footer', () => {
        render(<App />);

        // Check for header content
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent('CivicBridge AI');

        // Check for footer content
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByText(/© 2024 CivicBridge AI/)).toBeInTheDocument();
    });
});
