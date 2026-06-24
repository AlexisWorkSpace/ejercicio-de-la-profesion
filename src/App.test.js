import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.sessionStorage.clear();
});

test('permits login with admin credentials and shows the selector', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /empezar/i }));
  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'pass123!' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  expect(screen.getByRole('heading', { name: /selecciona el tipo de circuito/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /calculadora de circuitos electrónicos/i })).not.toBeInTheDocument();
});

test('shows an error message for invalid credentials', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /empezar/i }));
  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'invitado' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  expect(screen.getByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument();
});

test('asks which parameter to calculate before showing the relevant fields', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /empezar/i }));
  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'pass123!' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /elegir/i })[0]);

  expect(screen.getByText(/¿qué parámetro deseas calcular/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /corriente/i }));

  expect(screen.getByLabelText(/tensión \(v\)/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/resistencia \(ω\)/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/corriente \(a\)/i)).not.toBeInTheDocument();
});

test('calculates the selected ohm law parameter', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /empezar/i }));
  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'pass123!' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /elegir/i })[0]);
  fireEvent.click(screen.getByRole('button', { name: /corriente/i }));

  fireEvent.change(screen.getByLabelText(/tensión \(v\)/i), { target: { value: '12' } });
  fireEvent.change(screen.getByLabelText(/resistencia \(ω\)/i), { target: { value: '4' } });
  fireEvent.click(screen.getByRole('button', { name: /^calcular$/i }));

  expect(screen.getByText(/resultado/i)).toBeInTheDocument();
  expect(screen.getByText(/3\.00 a/i)).toBeInTheDocument();
});
