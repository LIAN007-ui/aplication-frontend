import React, { useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormInput, CButton, CInputGroup, CInputGroupText
} from '@coreui/react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeClosed, cilLockLocked } from '@coreui/icons'

const PasswordRecovery = ({ visible, onClose }) => {
  const API_URL = 'https://aplication-backend-mkdg.onrender.com'

  const [step, setStep] = useState(1) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  
  const [userType, setUserType] = useState('student') 
  const [email, setEmail] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('') 
  const [resetToken, setResetToken] = useState(null)
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleClose = () => {
    setStep(1)
    setUserType('student')
    setEmail('')
    setSecurityAnswer('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccessMsg('')
    setResetToken(null)
    onClose()
  }

  const handleTypeChange = (type) => {
      setUserType(type)
      setSecurityAnswer('')
      setEmail('') 
      setError('')
      setSuccessMsg('')
  }

  const handleSecurityChange = (e) => {
      let val = e.target.value;
      if (userType === 'student') {
          val = val.replace(/\D/g, '').slice(0, 8);
      } else {
          val = val.slice(0, 20);
      }
      setSecurityAnswer(val);
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !securityAnswer) {
      setError('Por favor completa ambos campos.')
      setLoading(false)
      return
    }
    
    if (userType === 'student' && securityAnswer.length < 7) {
        setError('La cédula debe tener al menos 7 dígitos.')
        setLoading(false)
        return
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: email,
        security_answer: securityAnswer,
        type: userType
      })

      if (res.data.success && res.data.token) {
        setResetToken(res.data.token)
        setSuccessMsg('¡Identidad verificada! Ahora crea tu nueva clave.')
        setTimeout(() => {
            setSuccessMsg('')
            setStep(2)
        }, 1500)
      }

    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Error verificando datos. Revisa que coincidan.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!newPassword || !confirmPassword) {
      setError('Escribe y confirma tu nueva contraseña.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token: resetToken,
        newPassword: newPassword
      })

      setSuccessMsg(res.data.message || 'Contraseña actualizada con éxito.')
      setTimeout(() => {
        handleClose()
      }, 2500)

    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>
        {`
          .recovery-modal .modal-content {
            background: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 25px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          }
          
          .recovery-title {
            color: white !important;
            font-weight: 800;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            letter-spacing: 1px;
          }

          .recovery-label {
            color: white;
            font-weight: 700;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.9);
            margin-bottom: 5px;
            display: block;
          }

          .recovery-input-group .input-group-text {
             background-color: rgba(255, 255, 255, 0.9);
             border: none;
             color: #003366;
          }
          
          .recovery-input {
             background-color: rgba(255, 255, 255, 0.9) !important;
             border: none !important;
             color: #000 !important;
             font-weight: 600;
          }
          
          .recovery-input:focus {
             box-shadow: 0 0 10px rgba(0, 51, 102, 0.5);
             background-color: #fff !important;
          }

          .modal-header, .modal-footer {
             border-color: rgba(255, 255, 255, 0.2);
          }

          .form-check-input:checked {
              background-color: #00df9a;
              border-color: #00df9a;
          }
          .form-check-label {
              color: white;
              font-weight: 600;
              text-shadow: 1px 1px 2px black;
              cursor: pointer;
          }

          .btn-unefa {
             background-color: #003366;
             border: none;
             font-weight: bold;
             box-shadow: 0 4px 6px rgba(0,0,0,0.3);
             transition: all 0.3s;
          }
          .btn-unefa:hover {
             background-color: #004080;
             transform: translateY(-2px);
             box-shadow: 0 6px 8px rgba(0,0,0,0.4);
          }
        `}
      </style>

      <CModal alignment="center" visible={visible} onClose={handleClose} backdrop="static" className="recovery-modal">
        <CModalHeader closeButton={false} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <CModalTitle className="recovery-title">
            {step === 1 ? 'RECUPERAR ACCESO' : 'NUEVA CONTRASEÑA'}
          </CModalTitle>
          <CButton className="btn-close btn-close-white" onClick={handleClose} />
        </CModalHeader>
        
        <CModalBody className="p-4">
          {step === 1 ? (
            <CForm onSubmit={handleVerify}>
              
              <div className="d-flex justify-content-center gap-4 mb-4">
                  <div className="form-check">
                      <input className="form-check-input" type="radio" 
                             checked={userType === 'student'} 
                             onChange={() => handleTypeChange('student')}
                             id="radStudent" />
                      <label className="form-check-label ms-2" htmlFor="radStudent">
                          Soy Estudiante
                      </label>
                  </div>
                  <div className="form-check">
                      <input className="form-check-input" type="radio" 
                             checked={userType === 'teacher'} 
                             onChange={() => handleTypeChange('teacher')}
                             id="radTeacher" />
                      <label className="form-check-label ms-2" htmlFor="radTeacher">
                          Soy Docente
                      </label>
                  </div>
              </div>

              <div className="mb-4">
                <label className="recovery-label">Correo Electrónico</label>
                <CInputGroup className="recovery-input-group mb-1">
                  <CInputGroupText><CIcon icon={cilEnvelopeClosed}/></CInputGroupText>
                  <CFormInput 
                    className="recovery-input"
                    placeholder="tucorreo@ejemplo.com" 
                    type="email"
                    maxLength={50}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </CInputGroup>
                <div className="text-end text-white small opacity-75">{email.length}/50</div>
              </div>

              <div className="mb-3">
                <label className="recovery-label">
                    {userType === 'student' ? 'Cédula de Identidad' : 'Usuario del Sistema'}
                </label>
                <CInputGroup className="recovery-input-group">
                  <CInputGroupText><CIcon icon={cilUser}/></CInputGroupText>
                  <CFormInput 
                    className="recovery-input"
                    placeholder={userType === 'student' ? "Ej: 12345678" : "Ej: profesor.juan"}
                    value={securityAnswer}
                    onChange={handleSecurityChange}
                  />
                </CInputGroup>
                {userType === 'student' && (
                    <div className="text-end text-white small opacity-75">Solo números (Máx 8)</div>
                )}
                {userType === 'teacher' && (
                    <div className="text-end text-white small opacity-75">{securityAnswer.length}/20</div>
                )}
              </div>
            </CForm>
          ) : (
             <CForm onSubmit={handleReset}>
               <p className="recovery-info mb-4 text-center">
                 Identidad confirmada. <br/>Ingresa tu nueva clave segura.
               </p>

               <div className="mb-4">
                 <label className="recovery-label">Nueva Contraseña</label>
                 <CInputGroup className="recovery-input-group mb-1">
                   <CInputGroupText><CIcon icon={cilLockLocked}/></CInputGroupText>
                   <CFormInput 
                     className="recovery-input"
                     type="password"
                     placeholder="••••••••" 
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                   />
                 </CInputGroup>
               </div>

               <div className="mb-3">
                 <label className="recovery-label">Confirmar Contraseña</label>
                 <CInputGroup className="recovery-input-group">
                   <CInputGroupText><CIcon icon={cilLockLocked}/></CInputGroupText>
                   <CFormInput 
                     className="recovery-input"
                     type="password"
                     placeholder="••••••••" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                   />
                 </CInputGroup>
               </div>
             </CForm>
          )}

          {loading && <div className="text-center my-3 text-white fw-bold"><span className="spinner-border spinner-border-sm me-2"/>Verificando...</div>}
          {error && <div className="alert alert-danger py-2 text-center small fw-bold mt-3 shadow border-0">{error}</div>}
          {successMsg && <div className="alert alert-success py-2 text-center small fw-bold mt-3 shadow border-0">{successMsg}</div>}

        </CModalBody>
        <CModalFooter style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }} className="justify-content-center">
          <CButton className="btn-cancel me-2" onClick={handleClose}>
            Cancelar
          </CButton>
          {step === 1 ? (
              <CButton className="btn-unefa text-white px-4" onClick={handleVerify} disabled={loading}>
                VERIFICAR
              </CButton>
          ) : (
              <CButton color="success" className="text-white px-4 fw-bold shadow" onClick={handleReset} disabled={loading || !!successMsg}>
                CAMBIAR CLAVE
              </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}
export default PasswordRecovery