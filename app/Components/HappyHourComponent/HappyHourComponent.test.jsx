import React from 'react';
import { render, screen } from '@testing-library/react';
import HappyHourComponent from './HappyHourComponent';

describe('HappyHourComponent', () => {
    it('renders correctly', () => {
        render(<HappyHourComponent />);
        expect(screen.getByText(/happy hour/i)).toBeInTheDocument();
    });
    
    it('displays the correct message', () => {
        render(<HappyHourComponent />);
        expect(screen.getByText(/enjoy your drinks/i)).toBeInTheDocument();
    });
});