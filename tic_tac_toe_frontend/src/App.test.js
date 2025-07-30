import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  const title = screen.getByText(/Tic Tac Toe/i);
  expect(title).toBeInTheDocument();
});

test('renders the reset button', () => {
  render(<App />);
  expect(screen.getByText(/reset game/i)).toBeInTheDocument();
});
