import React, { useState, useRef } from 'react'
import axios from 'axios'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CAlert,
} from '@coreui/react'

const AdminLoginModal = ({ visible, onClose, onSuccess }) => {
  const [cedula, setCedula] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [errorCedula, setErrorCedula] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)
  const cedulaRef = useRef(null)

  const triggerError = (msg, field) => {
    setError(msg)
    setIsShaking(true)
    if (field === 'cedula') setErrorCedula(true)
    if (field === 'password') setErrorPassword(true)
    if (field === 'both') { 
      setErrorCedula(true)
      setErrorPassword(true) 
    }
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleSubmit = async () => {
    setError('')
    setErrorCedula(false)
    setErrorPassword(false)

    if (!cedula || !password) {
      triggerError('Por favor, rellena todos los campos', 'both')
      return
    }

    try {
        const API_URL = 'https://aplication-backend-mkdg.onrender.com/api/auth/login'
        const response = await axios.post(API_URL, {
            identifier: cedula, 
            password: password
        })

        const { token, user } = response.data

        if (user.role !== 'admin') {
            triggerError('Esta cuenta no es de Administrador', 'both')
            return
        }

        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('token', token)
        localStorage.setItem('userRole', user.role)
        localStorage.setItem('currentUser', JSON.stringify(user))

        handleClose()
        if (onSuccess) onSuccess()

    } catch (err) {
        console.error(err)
        triggerError('Credenciales incorrectas', 'both')
    }
  }

  const handleClose = () => {
    setCedula('')
    setPassword('')
    setError('')
    setErrorCedula(false)
    setErrorPassword(false)
    onClose()
  }

  const handleCedulaChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 8) {
      setCedula(value)
      if (errorCedula) setErrorCedula(false)
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
          @keyframes pulseError {
            0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6); border: 2px solid #ffc107; }
            70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); border: 2px solid #ffc107; }
            100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); border: 2px solid #ffc107; }
          }
          .admin-modal-glass .modal-content {
            background: rgba(40, 40, 40, 0.4) !important;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 20px !important;
          }
          .admin-modal-glass .modal-header, .admin-modal-glass .modal-footer { border: none !important; }
          
          .input-custom { 
            background: rgba(255, 255, 255, 0.95) !important; 
            border-radius: 10px !important;
            color: #000000 !important; 
            font-weight: 600 !important;
          }

          .input-custom::placeholder {
            color: #000000 !important;
            font-weight: 800 !important;
            opacity: 1; 
          }

          .input-custom:focus {
            color: #000000 !important;
            background: #ffffff !important;
          }

          .input-error-active { animation: pulseError 1.5s infinite !important; }
          .shake-effect { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
          .btn-hover-effect { transition: transform 0.2s; font-weight: bold; }
          .btn-hover-effect:hover { transform: scale(1.05); }
        `}
      </style>

      <CModal 
        visible={visible} 
        onClose={handleClose} 
        className={`admin-modal-glass ${isShaking ? 'shake-effect' : ''}`} 
        alignment="center" 
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle className="text-white w-100 text-center">🛡️ Administrador</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {error && (
            <CAlert color="danger" className="py-2 small text-center fw-bold">
              {error}
            </CAlert>
          )}

          <div className="mb-3">
            <label className="text-white fw-bold mb-1 d-block">Cédula</label>
            <CFormInput
              className={`input-custom ${errorCedula ? 'input-error-active' : ''}`}
              placeholder="V-"
              value={cedula}
              onChange={handleCedulaChange}
            />
          </div>

          <div className="mb-3">
            <label className="text-white fw-bold mb-1 d-block">Clave Maestra</label>
            <CFormInput
              type="password"
              className={`input-custom ${errorPassword ? 'input-error-active' : ''}`}
              placeholder=""
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if(errorPassword) setErrorPassword(false)
              }}
            />
          </div>
        </CModalBody>

        <CModalFooter className="justify-content-center pt-0">
          <CButton color="danger" className="btn-hover-effect text-white" onClick={handleClose}>
            Cancelar
          </CButton>
          <CButton color="warning" className="btn-hover-effect px-4" onClick={handleSubmit}>
            INGRESAR
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AdminLoginModal