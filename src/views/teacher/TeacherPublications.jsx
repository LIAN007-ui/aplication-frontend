import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilCheckCircle, cilTrash, cilCalendar } from '@coreui/icons'

const TeacherPublications = () => {
  const API_URL = 'http://localhost:3001'

  const [loading, setLoading] = useState(true)
  const [publications, setPublications] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  // Form
  const [newPublication, setNewPublication] = useState({ title: '', content: '' })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    setCurrentUser(user)
    if (user) {
      fetchPublications(user.assignedSemester)
    }
  }, [])

  const fetchPublications = async (semester) => {
    try {
      const res = await axios.get(`${API_URL}/publications?semester=${semester}`)
      setPublications(res.data.reverse())
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!newPublication.title.trim() || !newPublication.content.trim()) {
      setMessage({ type: 'danger', text: 'Todos los campos son requeridos' })
      return
    }

    setSubmitting(true)
    try {
      const pubData = {
        id: `pub${Date.now()}`,
        title: newPublication.title,
        content: newPublication.content,
        semester: currentUser.assignedSemester,
        teacherId: currentUser.id,
        teacherName: currentUser.name || currentUser.username,
        createdAt: new Date().toISOString(),
      }

      await axios.post(`${API_URL}/publications`, pubData)
      setMessage({ type: 'success', text: '¡Publicación creada exitosamente!' })
      setNewPublication({ title: '', content: '' })
      fetchPublications(currentUser.assignedSemester)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error al crear la publicación' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return
    
    try {
      await axios.delete(`${API_URL}/publications/${id}`)
      setPublications(publications.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <style>{`
        .pub-card {
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }
        .pub-card:hover {
          border-left-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.02);
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">
            <CIcon icon={cilNotes} className="me-2 text-info" />
            Publicaciones
          </h2>
          <span className="text-muted">
            Crea y gestiona contenido para el Semestre {currentUser?.assignedSemester}
          </span>
        </div>
        <CBadge color="info" className="px-3 py-2 fs-6">
          {publications.length} publicaciones
        </CBadge>
      </div>

      <CRow>
        {/* Form */}
        <CCol lg={5}>
          <CCard className="border-0 shadow-sm sticky-top" style={{ top: '1rem' }}>
            <CCardHeader className="bg-info text-white border-0">
              <strong>Nueva Publicación</strong>
            </CCardHeader>
            <CCardBody>
              {message.text && (
                <CAlert 
                  color={message.type} 
                  dismissible 
                  onClose={() => setMessage({ type: '', text: '' })}
                >
                  {message.text}
                </CAlert>
              )}
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Título</CFormLabel>
                  <CFormInput
                    value={newPublication.title}
                    onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                    placeholder="Ej: Material de clase - Tema 5"
                  />
                </div>
                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Contenido</CFormLabel>
                  <CFormTextarea
                    rows={6}
                    value={newPublication.content}
                    onChange={(e) => setNewPublication({ ...newPublication, content: e.target.value })}
                    placeholder="Escribe el contenido de tu publicación..."
                  />
                </div>
                <CButton 
                  type="submit" 
                  color="info" 
                  className="w-100 text-white fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <CSpinner size="sm" className="me-2" />
                  ) : (
                    <CIcon icon={cilCheckCircle} className="me-2" />
                  )}
                  Publicar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Publications List */}
        <CCol lg={7}>
          <h5 className="fw-bold mb-3">Publicaciones Recientes</h5>
          
          {publications.length === 0 ? (
            <CCard className="border-0 shadow-sm text-center py-5">
              <CCardBody>
                <CIcon icon={cilNotes} size="3xl" className="text-muted mb-3 opacity-25" />
                <p className="text-muted mb-0">No hay publicaciones aún</p>
              </CCardBody>
            </CCard>
          ) : (
            publications.map((pub) => (
              <CCard key={pub.id} className="pub-card border-0 shadow-sm mb-3">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-2">{pub.title}</h5>
                      <p className="text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                        {pub.content}
                      </p>
                      <div className="d-flex align-items-center gap-3 text-muted small">
                        <span>
                          <CIcon icon={cilCalendar} className="me-1" />
                          {formatDate(pub.createdAt)}
                        </span>
                        <CBadge color="light" textColor="secondary">
                          Semestre {pub.semester}
                        </CBadge>
                      </div>
                    </div>
                    <CButton 
                      color="danger" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(pub.id)}
                      title="Eliminar"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            ))
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default TeacherPublications
