import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
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
import PasswordRecovery from '../../pages/password-recovery/PasswordRecovery'
import LoadingOverlay from '../../../components/LoadingOverlay/LoadingOverlay'
import TeacherLoginModal from '../../../components/auth/TeacherLoginModal'
import img from '../../../assets/images/unefa.jpg'
const Login = () => {
  const navigate = useNavigate()
  const API_URL = 'https://aplication-backend-mkdg.onrender.com'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      triggerError('Por favor, rellena todos los campos')
      return
    }

    try {
      const response = await axios.post(API_URL, {
        identifier: username,
        password: password
      })

      const { token, user } = response.data
      console.log('Login exitoso:', user)

      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('currentUser', JSON.stringify(user))

      setIsNavigating(true)

      let targetDashboard = '/dashboard'
      if (user.role === 'admin') targetDashboard = '/admin/dashboard'
      else if (user.role === 'teacher') targetDashboard = '/dashboard'
      else if (user.role === 'student') targetDashboard = '/perfil'

      setTimeout(() => {
        navigate(targetDashboard)
      }, 1000)

    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.error || 'Usuario o contraseña incorrectos'
      triggerError(msg)
    }
  }

  const handleAdminSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', 'admin')
    localStorage.setItem('currentUser', JSON.stringify({ username: 'Administrador', role: 'admin' }))
    setShowAdminModal(false)
    setIsNavigating(true)
    setTimeout(() => navigate('/admin/dashboard'), 1000)
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
            background-image: 'url(${img})';
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
          .shake-animation { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
          .custom-input {
            border: 2px solid transparent !important;
            border-radius: 8px !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
            color: #000000 !important;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .input-empty { animation: pulseWarning 1.5s infinite !important; }
          .label-resaltado {
            color: white;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            margin-bottom: 5px;
            display: block;
          }
          .pass-toggle {
            position: absolute; right: 12px; bottom: 10px; cursor: pointer;
            color: #003366; font-size: 0.7rem; font-weight: 800; z-index: 10;
            background: rgba(255, 255, 255, 0.7); padding: 2px 6px; border-radius: 4px;
            user-select: none;
          }
          .pass-toggle:hover { background: #ffffff; color: #2b87f4; }
          .admin-modal .modal-content {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white;
            border-radius: 25px !important;
          }
        `}
      </style>

      <div className="main-wrapper">
        <div className="background-landscape"></div>

        <CContainer style={{ zIndex: 3 }}>
          <CRow className="align-items-center">
            <CCol md={7} className="text-white d-none d-md-block px-5">
              <h1 className="display-2 fw-bold" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>UNEFA</h1>
              <p className="fs-5 opacity-90" style={{ textShadow: '1px 1px 4px black' }}>"Explora, participa y descubre lo nuevo en UNEFA."</p>
            </CCol>

            <CCol md={5} lg={4}>
              <CCard className={`glass-panel p-3 shadow-lg ${isShaking ? 'shake-animation' : ''}`}>
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h2 className="text-white fw-bold mb-4 text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Entrar</h2>

                    <div className="mb-3">
                      <label className="label-resaltado">Usuario o Correo</label>
                      <CFormInput
                        className={`custom-input py-2 ${error && !username ? 'input-empty' : ''}`}
                        placeholder="Ingresa tu usuario o correo"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

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
                        {password.length > 0 && (
                          <span className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? 'OCULTAR' : 'VER'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-center mb-4">
                      <Link
                        to="#"
                        onClick={(e) => { e.preventDefault(); setShowRecoveryModal(true); }}
                        className="text-white small text-decoration-underline fw-bold"
                        style={{ textShadow: '1px 1px 2px black', textDecorationColor: 'white' }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>

                      <Link
                        to="#"
                        onClick={(e) => { e.preventDefault(); setShowAdminModal(true); }}
                        className="text-white small text-decoration-underline fw-bold"
                        style={{ textShadow: '1px 1px 2px black', textDecorationColor: 'white' }}
                      >
                        Acceso Administrador
                      </Link>
                    </div>

                    <CButton
                      type="submit"
                      className="w-100 py-2 fw-bold text-white mb-4 border-0 shadow"
                      style={{ backgroundColor: '#003366', borderRadius: '8px' }}
                    >
                      ENTRAR
                    </CButton>

                    <div className="text-center text-white small fw-bold" style={{ textShadow: '1px 1px 3px black' }}>
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

        <TeacherLoginModal
          visible={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onSuccess={handleAdminSuccess}
        />

        <PasswordRecovery visible={showRecoveryModal} onClose={() => setShowRecoveryModal(false)} />
        <LoadingOverlay visible={isNavigating} />
      </div>
    </>
  )
}

export default Login