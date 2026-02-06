import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react'
import LoadingOverlay from '../../../components/LoadingOverlay/LoadingOverlay'

const Register = () => {
  const navigate = useNavigate()
  // CAMBIO: Apuntamos al backend real en el puerto 5000
  const API_URL = 'https://aplication-backend-mkdg.onrender.com'

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [cedula, setCedula] = useState('V-')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [semestre, setSemestre] = useState('')
  const [carrera, setCarrera] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showRepeatPass, setShowRepeatPass] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleNombreChange = (e) => {
    const value = e.target.value
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) setNombre(value)
  }

  const handleApellidoChange = (e) => {
    const value = e.target.value
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) setApellido(value)
  }

  const handleCedulaChange = (e) => {
    let value = e.target.value.toUpperCase()
    if (!value.startsWith('V-')) value = 'V-'
    const cedulaNumerica = value.slice(2)
    if (/^\d{0,8}$/.test(cedulaNumerica)) {
      setCedula('V-' + cedulaNumerica)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (
      !nombre ||
      !apellido ||
      cedula === 'V-' ||
      !username ||
      !email ||
      !password ||
      !semestre ||
      !carrera
    ) {
      triggerError('Por favor, completa todos los campos resaltados')
      return
    }

    if (cedula.length < 9) {
      triggerError('La cédula debe tener al menos 7 números')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      triggerError('Por favor, ingresa un correo electrónico válido')
      return
    }

    if (password !== repeatPassword) {
      triggerError('Las contraseñas no coinciden')
      return
    }

    try {
      // CAMBIO: Lógica para enviar datos al Backend Real (Express + SQLite)

      // Mapeamos tus variables a lo que espera el backend
      const payload = {
        username: username,
        email: email,
        password: password,
        role: 'student', // Este formulario es exclusivo de Estudiantes
        // Datos del perfil
        first_name: nombre,
        last_name: apellido,
        cedula: cedula,
        career: carrera,
        current_semester_id: parseInt(semestre) // Convertimos "1" a numero entero
      }

      // Enviamos la petición POST directa al endpoint de registro
      await axios.post(API_URL, payload)

      setIsNavigating(true)
      setTimeout(() => navigate('/login'), 1000)

    } catch (err) {
      console.error(err)
      // Capturamos el error que viene del backend (ej: "Usuario ya existe")
      const errorMsg = err.response?.data?.error || 'Error conectando con el servidor'
      triggerError(errorMsg)
    }
  }

  const triggerError = (msg) => {
    setError(msg)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  // EL RENDER SE MANTIENE EXACTAMENTE IGUAL
  return (
    <>
      <style>
        {`
          @keyframes flowAnimation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
          @keyframes pulseWarning { 0% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7); border: 2px solid #ffa500; } 70% { box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); border: 2px solid #ffa500; } 100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0); border: 2px solid #ffa500; } }

          .main-wrapper {
            background: linear-gradient(-45deg, #003366, #2b87f4, #ffffff, #87cefa);
            background-size: 400% 400%;
            animation: flowAnimation 12s ease infinite;
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
            padding: 40px 0;
          }
          .background-landscape {
            background-image: url('src/assets/images/unefa.jpg');
            background-size: cover;
            background-position: center;
            position: fixed;
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
          }
          .input-empty { animation: pulseWarning 1.5s infinite !important; }
          .label-resaltado {
            color: white;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            margin-bottom: 4px;
            display: block;
          }
          .pass-toggle {
            position: absolute; right: 12px; bottom: 10px; cursor: pointer;
            color: #003366; font-size: 0.7rem; font-weight: 800; z-index: 10;
            background: rgba(255, 255, 255, 0.7); padding: 2px 6px; border-radius: 4px;
          }
        `}
      </style>

      <div className="main-wrapper">
        <div className="background-landscape"></div>
        <CContainer style={{ zIndex: 3 }}>
          <CRow className="justify-content-center">
            <CCol md={10} lg={8}>
              <CCard className={`glass-panel p-4 shadow-lg ${isShaking ? 'shake-animation' : ''}`}>
                <CCardBody>
                  <CForm onSubmit={handleRegister}>
                    <h2
                      className="text-white fw-bold mb-4 text-center"
                      style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}
                    >
                      Registro de Estudiante
                    </h2>

                    <CRow>
                      <CCol md={6} className="mb-3">
                        <label className="label-resaltado">Nombre</label>
                        <CFormInput
                          className={`custom-input ${error && !nombre ? 'input-empty' : ''}`}
                          placeholder="Ej: Juan"
                          value={nombre}
                          onChange={handleNombreChange}
                        />
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <label className="label-resaltado">Apellido</label>
                        <CFormInput
                          className={`custom-input ${error && !apellido ? 'input-empty' : ''}`}
                          placeholder="Ej: Pérez"
                          value={apellido}
                          onChange={handleApellidoChange}
                        />
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6} className="mb-3">
                        <label className="label-resaltado">Cédula</label>
                        <CFormInput
                          className={`custom-input ${error && cedula === 'V-' ? 'input-empty' : ''}`}
                          placeholder="V-12345678"
                          value={cedula}
                          onChange={handleCedulaChange}
                        />
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <label className="label-resaltado">Usuario</label>
                        <CFormInput
                          className={`custom-input ${error && !username ? 'input-empty' : ''}`}
                          placeholder="usuario123"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </CCol>
                    </CRow>

                    <div className="mb-3">
                      <label className="label-resaltado">Correo Electrónico</label>
                      <CFormInput
                        type="email"
                        className={`custom-input ${error && !email ? 'input-empty' : ''}`}
                        placeholder="estudiante@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <CRow>
                      <CCol md={4} className="mb-3">
                        <label className="label-resaltado">Semestre</label>
                        <CFormSelect
                          className={`custom-input ${error && !semestre ? 'input-empty' : ''}`}
                          value={semestre}
                          onChange={(e) => setSemestre(e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n}° Semestre
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={8} className="mb-3">
                        <label className="label-resaltado">Carrera</label>
                        <CFormSelect
                          className={`custom-input ${error && !carrera ? 'input-empty' : ''}`}
                          value={carrera}
                          onChange={(e) => setCarrera(e.target.value)}
                        >
                          <option value="">Seleccionar carrera...</option>
                          <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                          <option value="Ingeniería Civil">Ingeniería Civil</option>
                          <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                          <option value="Licenciatura en Turismo">Licenciatura en Turismo</option>
                          <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6} className="mb-3">
                        <label className="label-resaltado">Contraseña</label>
                        <div className="position-relative">
                          <CFormInput
                            type={showPass ? 'text' : 'password'}
                            className={`custom-input ${error && !password ? 'input-empty' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {password.length > 0 && (
                            <span className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                              {showPass ? 'OCULTAR' : 'VER'}
                            </span>
                          )}
                        </div>
                      </CCol>
                      <CCol md={6} className="mb-4">
                        <label className="label-resaltado">Repetir Contraseña</label>
                        <div className="position-relative">
                          <CFormInput
                            type={showRepeatPass ? 'text' : 'password'}
                            className={`custom-input ${error && !repeatPassword ? 'input-empty' : ''}`}
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                          />
                          {repeatPassword.length > 0 && (
                            <span
                              className="pass-toggle"
                              onClick={() => setShowRepeatPass(!showRepeatPass)}
                            >
                              {showRepeatPass ? 'OCULTAR' : 'VER'}
                            </span>
                          )}
                        </div>
                      </CCol>
                    </CRow>

                    <CButton
                      type="submit"
                      className="w-100 py-2 fw-bold text-white border-0 shadow"
                      style={{ backgroundColor: '#003366', borderRadius: '8px' }}
                    >
                      REGISTRARSE EN LA RED
                    </CButton>

                    <div className="text-center mt-3 text-white fw-bold">
                      ¿Ya tienes cuenta?{' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsNavigating(true)
                          setTimeout(() => navigate('/login'), 700)
                        }}
                        className="text-white text-decoration-underline"
                      >
                        Inicia Sesión
                      </a>
                    </div>

                    {error && (
                      <div className="text-warning mt-3 text-center fw-bold bg-dark bg-opacity-50 rounded py-2">
                        ⚠️ {error}
                      </div>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
        <LoadingOverlay visible={isNavigating} />
      </div>
    </>
  )
}

export default Register