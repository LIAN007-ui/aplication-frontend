import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilNotes } from '@coreui/icons'

const StudentDashboard = () => {
  const API_URL = 'http://localhost:3001'

  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [publications, setPublications] = useState([])
  const [forumPosts, setForumPosts] = useState([])

  // Función para extraer el número del semestre del formato "X° Semestre"
  const extractSemesterNumber = (semestreStr) => {
    if (!semestreStr) return null
    const match = semestreStr.match(/(\d+)/)
    return match ? match[1] : null
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    setCurrentUser(user)
    if (user) {
      // Extraer el número del semestre del formato "8° Semestre"
      const semesterNumber = extractSemesterNumber(user.semestre)
      fetchData(semesterNumber)
    }
  }, [])

  const fetchData = async (semester) => {
    try {
      // Get publications for this semester
      const pubRes = await axios.get(`${API_URL}/publications?semester=${semester}`)
      setPublications(pubRes.data)

      // Get forum posts for this semester
      const forumRes = await axios.get(`${API_URL}/forum_posts?semester=${semester}`)
      setForumPosts(forumRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Bienvenido, {currentUser?.nombre || 'Estudiante'}</h2>
          <p className="text-muted mb-0">{currentUser?.carrera}</p>
        </div>
        <CBadge color="success" className="fs-6 px-3 py-2">
          {currentUser?.semestre}
        </CBadge>
      </div>

      <CRow>
        {/* Publications */}
        <CCol md={8}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="d-flex align-items-center">
              <CIcon icon={cilNotes} className="me-2" />
              <strong>Publicaciones de mi Semestre</strong>
            </CCardHeader>
            <CCardBody>
              {publications.length > 0 ? (
                publications.map((pub) => (
                  <CCard key={pub.id} className="mb-3 border-start border-primary border-4">
                    <CCardBody>
                      <h5>{pub.title}</h5>
                      <p className="mb-2">{pub.content}</p>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Por: {pub.teacherName}</small>
                        <small className="text-muted">
                          {new Date(pub.createdAt).toLocaleDateString('es-VE')}
                        </small>
                      </div>
                    </CCardBody>
                  </CCard>
                ))
              ) : (
                <p className="text-center text-muted py-4">
                  No hay publicaciones para tu semestre aún.
                </p>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Sidebar */}
        <CCol md={4}>
          {/* User Info */}
          <CCard className="mb-4 shadow-sm">
            <CCardHeader>
              <strong>Mi Información</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between">
                  <span>Cédula:</span>
                  <strong>{currentUser?.cedula}</strong>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between">
                  <span>Usuario:</span>
                  <strong>{currentUser?.username}</strong>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between">
                  <span>Puntuación:</span>
                  <CBadge color={currentUser?.puntuacion >= 5 ? 'success' : 'danger'}>
                    {currentUser?.puntuacion || 0} pts
                  </CBadge>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>

          {/* Recent Forum Activity */}
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>Actividad del Foro</strong>
            </CCardHeader>
            <CCardBody>
              {forumPosts.length > 0 ? (
                <CListGroup flush>
                  {forumPosts.slice(0, 5).map((post) => (
                    <CListGroupItem key={post.id}>
                      <div className="fw-bold">{post.title}</div>
                      <small className="text-muted">Por: {post.authorName}</small>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              ) : (
                <p className="text-muted text-center mb-0">No hay actividad en el foro</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default StudentDashboard
