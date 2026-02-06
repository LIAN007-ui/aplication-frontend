import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CAvatar,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilNewspaper, cilUser, cilSchool, cilCalendar } from '@coreui/icons'
import api from '../../api'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await api.get('/users/profile')
        const userData = profileResponse.data
        
        setUser(userData)
        console.log("🎓 Perfil Estudiante Cargado:", userData)

        if (userData.current_semester_id) {
           console.log(`📡 Buscando noticias para el Semestre ID: ${userData.current_semester_id}`)
           
           const newsResponse = await api.get(`/publications/semester/${userData.current_semester_id}`)
           setPublications(newsResponse.data)
        } else {
           console.warn("⚠️ Este estudiante no tiene un 'current_semester_id' asignado en la BD.")
        }

      } catch (err) {
        console.error('❌ Error cargando dashboard:', err)
        setError('No se pudo cargar la información. Verifica tu conexión.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" variant="grow"/>
        <p className="mt-2 text-muted">Cargando tu aula virtual...</p>
      </div>
    )
  }

  return (
    <>
      <CCard className="mb-4 border-top-primary border-top-3 shadow-sm">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={2} className="text-center mb-3 mb-md-0">
              <div className="p-1 border rounded-circle d-inline-block">
                 {user?.photo_url ? (
                   <img 
                      src={user.photo_url} 
                      alt="Perfil" 
                      className="rounded-circle" 
                      style={{width: '80px', height: '80px', objectFit: 'cover'}} 
                   />
                 ) : (
                   <CAvatar color="primary" textColor="white" size="xl">
                     {user?.first_name ? user.first_name.charAt(0).toUpperCase() : <CIcon icon={cilUser}/>}
                   </CAvatar>
                 )}
              </div>
            </CCol>
            <CCol md={10}>
              <h2 className="text-primary fw-bold">
                ¡Hola, {user?.first_name} {user?.last_name}!
              </h2>
              <div className="d-flex flex-wrap gap-2 align-items-center text-medium-emphasis mb-2">
                <span>
                    <CIcon icon={cilSchool} className="me-1" />
                    {user?.career || 'Ingeniería de Sistemas'}
                </span>
                <span>•</span>
                <CBadge color="info" shape="rounded-pill">
                    {user?.semester_name || `Semestre ${user?.current_semester_id}`}
                </CBadge>
              </div>
              <p className="small text-muted mb-0">
                Bienvenido al panel de gestión académica. Aquí encontrarás las últimas novedades exclusivas para tu semestre.
              </p>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && <CAlert color="danger">{error}</CAlert>}

      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary text-white p-2 rounded me-2">
            <CIcon icon={cilNewspaper} />
        </div>
        <h4 className="mb-0 text-dark">Cartelera Informativa</h4>
      </div>

      <CRow>
        {publications.length > 0 ? (
          publications.map((news) => (
            <CCol xs={12} key={news.id} className="mb-4 fade-in">
              <CCard className="h-100 shadow-sm border-0 hover-effect">
                <CCardHeader className="bg-white border-bottom-0 pt-3 px-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="mb-1 text-dark fw-bold">{news.title}</h5>
                        <small className="text-primary fw-semibold">
                            Por: {news.teacher_name || news.author_name || 'Docente'}
                        </small>
                    </div>
                    <CBadge color="light" textColor="secondary" className="border">
                        <CIcon icon={cilCalendar} className="me-1"/>
                        {new Date(news.created_at).toLocaleDateString()}
                    </CBadge>
                  </div>
                </CCardHeader>
                <CCardBody className="px-4 pb-4">
                  {news.mediaUrl && (
                      <div className="mb-3 rounded overflow-hidden border" style={{maxHeight: '200px'}}>
                          <img src={news.mediaUrl} alt="Adjunto" style={{width: '100%', objectFit: 'cover'}} />
                      </div>
                  )}
                  
                  <p className="card-text text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {news.content}
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <CCol xs={12}>
            <div className="text-center py-5 bg-light rounded border border-dashed">
                <CIcon icon={cilNewspaper} size="4xl" className="text-muted mb-3"/>
                <h5 className="text-muted">No hay noticias recientes</h5>
                <p className="small text-muted">Tu docente aún no ha publicado anuncios para el Semestre {user?.current_semester_id}.</p>
            </div>
          </CCol>
        )}
      </CRow>
      
      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hover-effect { transition: transform 0.2s; }
        .hover-effect:hover { transform: translateY(-3px); }
      `}</style>
    </>
  )
}

export default Dashboard