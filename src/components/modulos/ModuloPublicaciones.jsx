import React, { useState, useRef } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CAvatar,
  CBadge,
  CButton,
  CListGroup,
  CListGroupItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilFingerprint, 
  cilEnvelopeClosed, 
  cilEducation, 
  cilCalendar,
  cilAt,
  cilCamera,
  cilDevices,
  cilUser
} from '@coreui/icons'

const PerfilEstudiantil = () => {
  // Referencia para el input de archivo oculto
  const fileInputRef = useRef(null);

  // Estado para los datos del usuario y la foto
  const [usuario, setUsuario] = useState({
    nombre: "Liander",
    apellido: "Rincón",
    cedula: "30163662",
    username: "liander007",
    correo: "liander@gmail.com",
    semestre: "7mo Semestre",
    carrera: "Ingeniería de Sistemas",
    foto: null // Iniciamos sin foto para que veas el placeholder
  })

  // Función para manejar la carga de la imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUsuario({ ...usuario, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para disparar el clic en el input oculto
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={11} lg={9}>
          <CCard className="shadow-lg border-0 overflow-hidden" style={{ borderRadius: '20px' }}>
            
            {/* Banner Estilo Tech */}
            <div style={{ 
              height: '180px', 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              position: 'relative' 
            }}>
              <div className="p-4 text-white opacity-25">
                <CIcon icon={cilDevices} size="9xl" style={{ position: 'absolute', right: '20px', top: '10px' }} />
              </div>
            </div>
            
            <CCardBody className="pt-0 px-5 pb-5">
              {/* Cabecera del Perfil con Lógica de Imagen */}
              <CRow className="align-items-end mb-5" style={{ marginTop: '-60px' }}>
                <CCol xs="auto">
                  <div className="position-relative" style={{ cursor: 'pointer' }} onClick={triggerFileSelect}>
                    {/* Input de archivo oculto */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    
                    {/* Si no hay foto, muestra un icono de usuario por defecto */}
                    <CAvatar 
                      src={usuario.foto} 
                      style={{ 
                        width: '160px', 
                        height: '160px', 
                        border: '6px solid white',
                        backgroundColor: '#f8f9fa' 
                      }} 
                      className="shadow shadow-lg"
                    >
                      {!usuario.foto && <CIcon icon={cilUser} size="xl" className="text-muted" />}
                    </CAvatar>

                    <CButton 
                      color="primary" 
                      size="sm" 
                      className="position-absolute bottom-0 end-0 rounded-circle shadow p-2"
                      style={{ border: '3px solid white' }}
                    >
                      <CIcon icon={cilCamera} className="text-white" />
                    </CButton>
                  </div>
                </CCol>

                <CCol className="mb-2">
                  <h1 className="fw-bold mb-1" style={{ color: '#1e293b' }}>{usuario.nombre} {usuario.apellido}</h1>
                  <div className="d-flex align-items-center gap-2">
                    <CBadge color="primary" variant="soft" className="px-3 py-2" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                      Estudiante Activo
                    </CBadge>
                    <span className="text-muted"><CIcon icon={cilAt} /> {usuario.username}</span>
                  </div>
                </CCol>
                
                <CCol xs="auto" className="mb-2">
                  <CButton color="primary" onClick={triggerFileSelect} className="px-4 rounded-pill fw-semibold">
                    Subir Foto
                  </CButton>
                </CCol>
              </CRow>

              <h4 className="fw-bold mb-4" style={{ color: '#334155' }}>Expediente Académico</h4>
              
              <CRow className="g-4">
                <CCol md={6}>
                  <div className="p-4 rounded-4 border bg-light h-100 shadow-sm">
                    <CListGroup flush>
                      <CListGroupItem className="bg-transparent border-0 px-0 mb-3">
                        <label className="small text-uppercase text-muted fw-bold mb-1 d-block">Cedula</label>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilFingerprint} className="me-2 text-primary" size="lg" />
                          <span className="fs-5 fw-medium text-dark">{usuario.cedula}</span>
                        </div>
                      </CListGroupItem>

                      <CListGroupItem className="bg-transparent border-0 px-0">
                        <label className="small text-uppercase text-muted fw-bold mb-1 d-block">correo</label>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilEnvelopeClosed} className="me-2 text-primary" size="lg" />
                          <span className="fs-5 fw-medium text-dark">{usuario.correo}</span>
                        </div>
                      </CListGroupItem>
                    </CListGroup>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-4 rounded-4 border bg-light h-100 shadow-sm">
                    <CListGroup flush>
                      <CListGroupItem className="bg-transparent border-0 px-0 mb-3">
                        <label className="small text-uppercase text-muted fw-bold mb-1 d-block">Carrera</label>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilEducation} className="me-2 text-primary" size="lg" />
                          <span className="fs-5 fw-bold text-dark">{usuario.carrera}</span>
                        </div>
                      </CListGroupItem>

                      <CListGroupItem className="bg-transparent border-0 px-0">
                        <label className="small text-uppercase text-muted fw-bold mb-1 d-block">Semestre</label>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilCalendar} className="me-2 text-primary" size="lg" />
                          <CBadge color="info" className="fs-6 px-3">{usuario.semestre}</CBadge>
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
    </CContainer>
  )
}

export default PerfilEstudiantil;