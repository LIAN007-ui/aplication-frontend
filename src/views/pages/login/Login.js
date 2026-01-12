import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
} from '@coreui/react'
import PasswordRecovery from '../../../components/PasswordRecovery/PasswordRecovery'
import LoadingOverlay from '../../../components/LoadingOverlay/LoadingOverlay'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // Estado para mostrar modal de recuperación (se usa el componente externo)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      triggerError('Por favor, rellena todos los campos')
      return
    }

    const usersJson = localStorage.getItem('users')
    const users = usersJson ? JSON.parse(usersJson) : []
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ username: user.username, email: user.email }),
      )
      navigate('/dashboard')
    } else {
      triggerError('Usuario o contraseña incorrectos')
    }
  }

  const triggerError = (msg) => {
    setError(msg)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  return (
    <>
      <style>
        {`
          @keyframes flowAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          @keyframes pulseWarning {
            0% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7); border: 2px solid #ffa500; }
            70% { box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); border: 2px solid #ffa500; }
            100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0); border: 2px solid #ffa500; }
          }

          .main-wrapper {
            background: linear-gradient(-45deg, #0011fbff, #2b87f4, #a19cb4ff, #87cefa);
            background-size: 400% 400%;
            animation: flowAnimation 12s ease infinite;
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
          }

          .background-landscape {
            background-image: url('src/assets/images/unefa.jpg');
            background-size: cover;
            background-position: center;
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            opacity: 0.35;
            z-index: 1;
          }

          .glass-panel {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 25px !important;
            z-index: 2;
          }

          /* ANIMACIÓN DE SACUDIDA RECUPERADA */
          .shake-animation {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          }

          .custom-input {
            border: 2px solid transparent !important;
            border-radius: 8px !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
            color: #000000 !important;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          /* ANIMACIÓN DE PULSO RECUPERADA */
          .input-empty {
            animation: pulseWarning 1.5s infinite !important;
          }

          .label-resaltado {
            color: white;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            margin-bottom: 5px;
            display: block;
          }

          /* BOTÓN VER/OCULTAR POSICIONADO CORRECTAMENTE */
          .pass-toggle {
            position: absolute;
            right: 12px;
            bottom: 10px; /* Ajustado para que no choque con la etiqueta */
            cursor: pointer;
            color: #003366;
            font-size: 0.7rem;
            font-weight: 800;
            z-index: 10;
            background: rgba(255, 255, 255, 0.7);
            padding: 2px 6px;
            border-radius: 4px;
            user-select: none;
          }
          .pass-toggle:hover {
            background: #ffffff;
            color: #2b87f4;
          }
        `}
      </style>

      <div className="main-wrapper">
        <div className="background-landscape"></div>

        <CContainer style={{ zIndex: 3 }}>
          <CRow className="align-items-center">
            <CCol md={7} className="text-white d-none d-md-block px-5">
              <h1
                className="display-2 fw-bold"
                style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}
              >
                UNEFA
              </h1>
              <p className="fs-5 opacity-90" style={{ textShadow: '1px 1px 4px black' }}>
                "Explora, participa y descubre lo nuevo en UNEFA."
              </p>
            </CCol>

            <CCol md={5} lg={4}>
              {/* CCARD CON SACUDIDA */}
              <CCard className={`glass-panel p-3 shadow-lg ${isShaking ? 'shake-animation' : ''}`}>
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h2
                      className="text-white fw-bold mb-4 text-center"
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                    >
                      Entrar
                    </h2>

                    <div className="mb-3">
                      <label className="label-resaltado">Usuario / Email</label>
                      <CFormInput
                        className={`custom-input py-2 ${error && !username ? 'input-empty' : ''}`}
                        placeholder="Ingresa tu usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    {/* CONTENEDOR DE CONTRASEÑA */}
                    <div className="mb-2 position-relative d-flex flex-column">
                      <label className="label-resaltado">Contraseña</label>
                      <div className="position-relative">
                        <CFormInput
                          type={showPassword ? 'text' : 'password'}
                          className={`custom-input py-2 ${error && !password ? 'input-empty' : ''}`}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* BOTÓN VER CONDICIONAL */}
                        {password.length > 0 && (
                          <span
                            className="pass-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? 'OCULTAR' : 'VER'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-end mb-4">
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowRecoveryModal(true)
                        }}
                        className="text-white small text-decoration-none fw-bold"
                        style={{ textShadow: '1px 1px 2px black' }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <CButton
                      type="submit"
                      className="w-100 py-2 fw-bold text-white mb-4 border-0 shadow"
                      style={{ backgroundColor: '#003366', borderRadius: '8px' }}
                    >
                      ENTRAR
                    </CButton>

                    <div
                      className="text-center text-white small fw-bold"
                      style={{ textShadow: '1px 1px 3px black' }}
                    >
                      ¿No tienes cuenta?{' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsNavigating(true)
                          setTimeout(() => navigate('/register'), 700)
                        }}
                        className="text-white text-decoration-underline"
                      >
                        Regístrate
                      </a>
                    </div>

                    {error && (
                      <div className="text-warning mt-3 text-center fw-bold bg-dark bg-opacity-50 rounded py-2 shadow-sm">
                        ⚠️ {error}
                      </div>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>

        {/* Componente separado de recuperación */}
        <PasswordRecovery visible={showRecoveryModal} onClose={() => setShowRecoveryModal(false)} />

        {/* Overlay de carga al navegar */}
        <LoadingOverlay visible={isNavigating} />

      </div>
    </>
  )
}

export default Login
