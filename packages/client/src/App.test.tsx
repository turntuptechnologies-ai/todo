import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('タイトルが表示される', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'todo' })).toBeInTheDocument();
  });
});
