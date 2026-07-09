import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../../components/ui/Input';

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Type here..." />);
    const inputElement = screen.getByPlaceholderText(/type here.../i);
    expect(inputElement).toBeInTheDocument();
  });

  it('handles disabled state correctly', () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText(/disabled input/i)).toBeDisabled();
  });
});
