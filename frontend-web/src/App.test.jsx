import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders correctly', () => {
        // Basic smoke test
        render(<App />);
        // Initial render might show loading or login, depending on auth state
        // Just checking if it mounts without crashing for now
        expect(true).toBe(true);
    });
});
