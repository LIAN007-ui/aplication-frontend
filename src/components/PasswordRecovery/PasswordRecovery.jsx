import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'

const PasswordRecovery = ({ visible, onClose }) => {
  const [cedula, setCedula] = useState('V-')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  
  const [errorCedula, setErrorCedula] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)

  // --- FUNCIÓN PARA LIMPIAR TODO EL FORMULARIO ---
  const handleResetAndClose = () => {
    setCedula('V-')
    setEmail('')
    setMessage('')
    setError('')
    setErrorCedula(false)
    setErrorEmail(false)
    setIsShaking(false)
    onClose() // Llama a la función original para cerrar el modal
  }

  const handleCedulaChange = (e) => {
    let value = e.target.value.toUpperCase()
    if (!value.startsWith('V-')) value = 'V-'
    const numPart = value.slice(2)
    if (/^\d{0,8}$/.test(numPart)) {
      setCedula('V-' + numPart)
      setErrorCedula(false)
    }
  }

  const triggerError = (msg, field) => {
    setError(msg)
    setIsShaking(true)
    if (field === 'cedula') setErrorCedula(true)
    if (field === 'email') setErrorEmail(true)
    if (field === 'both') { setErrorCedula(true); setErrorEmail(true); }
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    setMessage('')
    setErrorCedula(false)
    setErrorEmail(false)

    if (cedula === 'V-' || !email) {
      triggerError('Por favor ingresa la cédula y el correo', 'both')
      return
    }

    if (cedula.length < 9) {
      triggerError('La cédula debe tener entre 7 y 8 dígitos', 'cedula')
      return
    }

    const usersJson = localStorage.getItem('users')
    const users = usersJson ? JSON.parse(usersJson) : []
    const userFound = users.find((u) => u.cedula === cedula)

    if (!userFound) {
      triggerError('Esta cédula no está registrada en el sistema', 'cedula')
      return
    }

    if (userFound.email !== email) {
      triggerError('El correo no coincide con la cédula ingresada', 'email')
      return
    }

    setMessage(`Validado. Se ha enviado un enlace a tu correo, ${userFound.nombre}.`)
    setTimeout(() => {
      handleResetAndClose() // Limpia y cierra después del éxito
      window.location.reload()
    }, 3000)
  }

  return (
    <>
      <style>
        {`
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
          @keyframes pulseWarning {
            0% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7); border: 2px solid #ffa500; }
            70% { box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); border: 2px solid #ffa500; }
            100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0); border: 2px solid #ffa500; }
          }
          .glass-modal .modal-content {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 20px !important;
          }
          .glass-modal .modal-header, .glass-modal .modal-footer { border: none !important; }
          .glass-modal .modal-title { color: white !important; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
          .label-resaltado-modal { color: white; font-weight: 700; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); margin-bottom: 5px; display: block; }
          .input-modal-custom { background-color: rgba(255, 255, 255, 0.95) !important; color: #000000 !important; font-weight: 600; border: 2px solid transparent !important; }
          .input-error-pulse { animation: pulseWarning 1.5s infinite !important; }
          .shake-modal { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        `}
      </style>

      <CModal 
        alignment="center" 
        visible={visible} 
        onClose={handleResetAndClose} // Limpia al pulsar la (X)
        className={`glass-modal ${isShaking ? 'shake-modal' : ''}`}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Recuperar Acceso</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="label-resaltado-modal">Cédula de Identidad</label>
              <CFormInput
                className={`input-modal-custom py-2 ${errorCedula ? 'input-error-pulse' : ''}`}
                placeholder="V-12345678"
                value={cedula}
                onChange={handleCedulaChange}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="label-resaltado-modal">Correo Electrónico</label>
              <CFormInput
                type="email"
                className={`input-modal-custom py-2 ${errorEmail ? 'input-error-pulse' : ''}`}
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorEmail(false); }}
              />
            </div>

            {error && <div className="text-warning mt-2 text-center fw-bold bg-dark bg-opacity-60 rounded py-2">⚠️ {error}</div>}
            {message && <div className="text-info mt-2 text-center fw-bold bg-dark bg-opacity-70 rounded py-2">✅ {message}</div>}
          </CForm>
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton color="light" variant="outline" onClick={handleResetAndClose} style={{ fontWeight: 'bold' }}>
            Cancelar
          </CButton>
          <CButton 
            style={{ backgroundColor: '#003366', border: 'none', fontWeight: 'bold' }} 
            onClick={handleSubmit}
          >
            Validar Datos
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default PasswordRecovery