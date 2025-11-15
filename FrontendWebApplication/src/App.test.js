import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders Users page by default without requiring login', async () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const heading = await screen.findByRole('heading', { name: /users/i });
  expect(heading).toBeInTheDocument();
});
