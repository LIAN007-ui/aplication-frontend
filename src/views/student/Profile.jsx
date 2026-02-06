import React, { useState, useRef, useEffect } from 'react'
import api from '../../api' 
import {
  CContainer,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CBadge,
  CButton,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CAlert,
  CModal,
  CModalBody,
  CModalHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilFingerprint, 
  cilEnvelopeClosed, 
  cilEducation, 
  cilCalendar,
  cilAt,
  cilCamera,
  cilUser,
  cilCheckCircle,
  cilStar 
} from '@coreui/icons'

const PerfilEstudiantil = () => {
  const fileInputRef = useRef(null)
  
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  
  const [usuario, setUsuario] = useState({
    id: null,
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    carrera: 'Ingeniería de Sistemas',
    semestre: 'Cargando...', 
    cedula: 'No registrada',
    foto: null,
    puntuacion: 0 
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile')
        const data = response.data

        let semestreDisplay = 'Estudiante Activo';
        
        if (data.semester_name) {
            semestreDisplay = data.semester_name;
        } else if (data.current_semester_id) {
            semestreDisplay = `Semestre ${data.current_semester_id}`;
        }

        setUsuario({
            id: data.id,
            nombre: data.first_name || data.username, 
            apellido: data.last_name || '',
            username: data.username,
            email: data.email,
            carrera: data.career || 'Ingeniería de Sistemas',
            semestre: semestreDisplay, 
            cedula: data.cedula || 'Sin Cédula',
            foto: data.photo_url || null,
            puntuacion: data.score || 0
        })

      } catch (error) {
        console.error("Error cargando perfil:", error)
        const storedUserStr = localStorage.getItem('currentUser')
        if (storedUserStr) {
           const stored = JSON.parse(storedUserStr)
           setUsuario(prev => ({...prev, ...stored, nombre: stored.first_name || stored.nombre}))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        setLoading(true)
        const base64Photo = await convertToBase64(file)
        
        setUsuario(prev => ({ ...prev, foto: base64Photo }))
        
        if (usuario.id) {
             await api.put(`/users/${usuario.id}`, { photo_url: base64Photo })
        } 
        
        setSuccessMsg('¡Foto actualizada!')
        setTimeout(() => setSuccessMsg(''), 3000)

      } catch (error) {
        console.error("Error subiendo foto:", error)
        alert("Intenta con una imagen más pequeña.")
      } finally {
        setLoading(false)
      }
    }
  }

  const triggerFileSelect = () => fileInputRef.current.click()

  if (loading) return <div className="text-center py-5"><CSpinner color="primary"/></div>

  return (
    <CContainer className="py-4 fade-in">
      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-animado { animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        .star-trigger { cursor: pointer; transition: transform 0.2s; }
        .star-trigger:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4); }

        @keyframes bannerMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tech-banner {
          background: linear-gradient(270deg, #0f172a, #1e3a8a, #0f172a);
          background-size: 200% 200%;
          animation: bannerMove 10s ease infinite;
          position: relative;
          overflow: hidden;
        }
        .tech-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 30px 30px; opacity: 0.5;
        }

        .info-box-adaptable {
            background-color: #f8f9fa;
            color: #212529;
            border: 1px solid #dee2e6;
        }

        [data-coreui-theme="dark"] .card-profile { background-color: #1e293b !important; color: #fff !important; }
        [data-coreui-theme="dark"] .text-dark-mode { color: #f8fafc !important; }
        [data-coreui-theme="dark"] .bg-light-mode { background-color: #334155 !important; border-color: #475569 !important; }
        [data-coreui-theme="dark"] .icon-dark-mode { color: #60a5fa !important; }
        [data-coreui-theme="dark"] .text-muted-dark { color: #cbd5e1 !important; }
        [data-coreui-theme="dark"] .modal-content { background-color: #1e293b !important; color: white !important; border: 1px solid #475569; }
        [data-coreui-theme="dark"] .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }
        [data-coreui-theme="dark"] .info-box-adaptable { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
        [data-coreui-theme="dark"] .text-muted-modal { color: #cbd5e1 !important; }
      `}</style>

      <CRow className="justify-content-center">
        <CCol md={11} lg={10}>
          <CCard className="card-profile shadow-lg border-0 overflow-hidden" style={{ borderRadius: '20px' }}>
            
            <div className="tech-banner" style={{ height: '200px' }}>
              <div className="tech-overlay"></div>
            </div>
            
            <CCardBody className="pt-0 px-4 px-md-5 pb-5 position-relative">
              
              {successMsg && (
                <CAlert color="success" className="position-absolute top-0 end-0 m-3 shadow-sm d-flex align-items-center" style={{zIndex: 10}}>
                   <CIcon icon={cilCheckCircle} className="me-2"/> {successMsg}
                </CAlert>
              )}

              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end mb-5" style={{ marginTop: '-80px' }}>
                
                <div className="position-relative mb-3 mb-md-0 me-md-4" style={{ cursor: 'pointer' }} onClick={triggerFileSelect}>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                  {usuario.foto ? (
                    <img src={usuario.foto} alt="Perfil" className="rounded-circle shadow-lg bg-white" style={{ width: '160px', height: '160px', border: '6px solid white', objectFit: 'cover', objectPosition: 'center' }} />
                  ) : (
                    <div className="rounded-circle shadow-lg d-flex align-items-center justify-content-center bg-light" style={{ width: '160px', height: '160px', border: '6px solid white' }}>
                      <CIcon icon={cilUser} size="5xl" className="text-secondary" />
                    </div>
                  )}
                  <CButton color="primary" className="position-absolute bottom-0 end-0 rounded-circle shadow p-2 border border-white">
                    <CIcon icon={cilCamera} className="text-white" />
                  </CButton>
                </div>

                <div className="text-center text-md-start mb-2 flex-grow-1">
                  <h2 className="text-dark-mode fw-bold mb-1">
                    {usuario.nombre} {usuario.apellido}
                  </h2>
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                    <span className="text-muted text-muted-dark"><CIcon icon={cilAt} />{usuario.username}</span>
                    <span className="text-muted text-muted-dark">•</span>
                    <span className="text-muted text-muted-dark">{usuario.email}</span>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                    <CBadge color="success" shape="rounded-pill" className="px-3 py-2">
                        {usuario.semestre}
                    </CBadge>

                    {usuario.puntuacion > 0 && (
                        <CBadge 
                            color="warning" 
                            shape="rounded-pill" 
                            className="px-3 py-2 text-dark star-trigger border border-warning"
                            onClick={() => setModalVisible(true)}
                            title="Ver mi rendimiento"
                        >
                            <CIcon icon={cilStar} className="me-1"/> {usuario.puntuacion} pts
                        </CBadge>
                    )}
                  </div>
                </div>

                <div className="mt-3 mt-md-0">
                   <CButton color="primary" variant="outline" shape="rounded-pill" onClick={triggerFileSelect}>
                      Cambiar Foto
                   </CButton>
                </div>
              </div>

              <h4 className="text-dark-mode fw-bold mb-4 border-bottom pb-2">Expediente Académico</h4>
              <CRow className="g-4">
                <CCol md={6}>
                  <div className="bg-light-mode p-4 rounded-4 h-100 border border-light shadow-sm">
                    <CListGroup flush className="bg-transparent">
                      <CListGroupItem className="bg-transparent border-0 px-0 mb-3">
                        <small className="text-muted text-uppercase fw-bold mb-1 d-block">Cédula</small>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                             <CIcon icon={cilFingerprint} className="text-primary icon-dark-mode" size="lg" />
                          </div>
                          <span className="text-dark-mode fs-5 fw-medium">{usuario.cedula}</span>
                        </div>
                      </CListGroupItem>
                      <CListGroupItem className="bg-transparent border-0 px-0">
                        <small className="text-muted text-uppercase fw-bold mb-1 d-block">Correo</small>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                             <CIcon icon={cilEnvelopeClosed} className="text-primary icon-dark-mode" size="lg" />
                          </div>
                          <span className="text-dark-mode fs-5 fw-medium text-truncate">{usuario.email}</span>
                        </div>
                      </CListGroupItem>
                    </CListGroup>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="bg-light-mode p-4 rounded-4 h-100 border border-light shadow-sm">
                    <CListGroup flush className="bg-transparent">
                      <CListGroupItem className="bg-transparent border-0 px-0 mb-3">
                        <small className="text-muted text-uppercase fw-bold mb-1 d-block">Carrera</small>
                        <div className="d-flex align-items-center">
                           <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                             <CIcon icon={cilEducation} className="text-primary icon-dark-mode" size="lg" />
                           </div>
                          <span className="text-dark-mode fs-5 fw-bold">{usuario.carrera}</span>
                        </div>
                      </CListGroupItem>
                      <CListGroupItem className="bg-transparent border-0 px-0">
                        <small className="text-muted text-uppercase fw-bold mb-1 d-block">Periodo</small>
                        <div className="d-flex align-items-center">
                           <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                             <CIcon icon={cilCalendar} className="text-primary icon-dark-mode" size="lg" />
                           </div>
                          <span className="text-dark-mode fs-5 fw-medium">2026-1</span>
                        </div>
                      </CListGroupItem>
                    </CListGroup>
                  </div>
                </CCol>
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        alignment="center"
        className="modal-animado"
      >
        <CModalHeader closeButton className="border-0 pb-0"></CModalHeader>
        <CModalBody className="text-center pb-5 px-5">
            <div className="mb-3 p-3 rounded-circle bg-warning bg-opacity-10 d-inline-block shadow-sm">
                 <CIcon icon={cilStar} size="4xl" className="text-warning"/>
            </div>
            
            <h2 className="fw-bold mb-1">Rendimiento de Juego</h2>
            <p className="text-muted text-muted-modal mb-4">Quiz de Defensa Integral</p>
            
            <div className="display-3 fw-bold text-primary mb-2">
                {usuario.puntuacion}<span className="fs-4 text-muted text-muted-modal">/10</span>
            </div>
            
            <CBadge 
                color={usuario.puntuacion >= 7 ? "success" : "warning"} 
                textColor={usuario.puntuacion >= 7 ? "white" : "dark"}
                shape="rounded-pill" 
                className="px-3 py-2 fs-6 mb-4"
            >
                {usuario.puntuacion >= 7 ? "¡Excelente Desempeño!" : "Sigue Practicando"}
            </CBadge>

            <div className="info-box-adaptable p-3 rounded text-start small">
                <p className="mb-1"><strong>Estudiante:</strong> {usuario.nombre}</p>
                <p className="mb-0"><strong>Última actualización:</strong> Hoy</p>
            </div>
        </CModalBody>
      </CModal>

    </CContainer>
  )
}

export default PerfilEstudiantil