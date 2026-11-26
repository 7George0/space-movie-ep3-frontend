
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { Header } from '../../../components/organisms/Header'
import { AuthProvider } from '../../../context/AuthContext'
import { renderConRouter } from '../../helpers'

afterEach(() => {
  localStorage.removeItem('spaceMovieToken')
  localStorage.removeItem('spaceMovieUsuario')
})

describe('Header', () => {
  it('muestra la marca como enlace al inicio', () => {
    renderConRouter(
      <AuthProvider>
        <Header nombre="SpaceMovie" />
      </AuthProvider>
    )

    expect(
      screen.getByRole('link', { name: 'SpaceMovie' })
    ).toHaveAttribute('href', '/')
  })

  it('sin sesion muestra login y registro', () => {
    renderConRouter(
      <AuthProvider>
        <Header nombre="SpaceMovie" />
      </AuthProvider>
    )

    expect(
      screen.getByRole('link', { name: 'Iniciar sesión' })
    ).toHaveAttribute('href', '/login')

    expect(
      screen.getByRole('link', { name: 'Registrarse' })
    ).toHaveAttribute('href', '/registro')
  })

  it('permite cerrar la sesion del administrador', async () => {
    localStorage.setItem('spaceMovieToken', 'token-de-prueba')

    localStorage.setItem(
      'spaceMovieUsuario',
      JSON.stringify({
        correo: 'admin@ejemplo.test',
        rol: 'ADMIN'
      })
    )

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={<Header nombre="SpaceMovie" />}
            />
            <Route
              path="/login"
              element={<p>Pantalla de login</p>}
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', {
        name: 'Administrador (admin@ejemplo.test)'
      })
    ).toHaveAttribute('href', '/admin')

    await userEvent.click(
      screen.getByRole('button', { name: 'Cerrar sesión' })
    )

    expect(localStorage.getItem('spaceMovieToken')).toBeNull()
    expect(localStorage.getItem('spaceMovieUsuario')).toBeNull()

    expect(
      screen.getByText('Pantalla de login')
    ).toBeInTheDocument()
  })
})
