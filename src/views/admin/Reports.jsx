import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,

  CAvatar,
  CPagination,
  CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilStar,
  cilUserFollow,
  cilChartLine
} from '@coreui/icons'

const Reports = () => {
  const API_URL = 'http://localhost:3001'

  const [loading, setLoading] = useState(true)
  const [topStudents, setTopStudents] = useState([])
  const [recentStudents, setRecentStudents] = useState([]) // Almacena TODOS para paginar
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      const users = response.data
      const students = users.filter((u) => u.role === 'student')

      // Top 5 estudiantes por puntuación
      const sortedByScore = [...students].sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))
      const top5 = sortedByScore.slice(0, 8)

      // Últimos registros (ordenados por recientes primero)
      // Invertimos el array para que los registros más nuevos (final del array) queden al principio
      const allRecent = [...students].reverse()

      setTopStudents(top5)
      setRecentStudents(allRecent)
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
        <p className="mt-2 text-muted">Cargando reportes...</p>
      </div>
    )
  }


  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentRecentStudents = recentStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(recentStudents.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  // Generar páginas para paginador
  const paginationPages = []
  for (let i = 1; i <= totalPages; i++) {
     paginationPages.push(i)
  }

  // Mostrar un rango limitado de páginas si son muchas (opcional, simple por ahora)
  // Si son muchas páginas, mostrar un subconjunto sería ideal, pero con "simple" funciona para empezar.

  return (
    <>
      <style>{`
         [data-coreui-theme="dark"] .card-header-adaptive { background-color: transparent !important; border-bottom: 1px solid #374151 !important; }
         [data-coreui-theme="light"] .card-header-adaptive { background-color: #fff !important; }
         
         [data-coreui-theme="dark"] .table { color: #d1d5db !important; }
         [data-coreui-theme="dark"] .table tr:hover { background-color: #374151 !important; color: #fff !important; }
         [data-coreui-theme="dark"] .text-muted { color: #9ca3af !important; }
         [data-coreui-theme="dark"] .fw-semibold { color: #f3f4f6 !important; }
      `}</style>
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <CIcon icon={cilChartLine} className="text-primary" />
        Reportes y Estadísticas Detalladas
      </h2>

      <CRow>
        {/* Top Estudiantes */}
        <CCol lg={6}>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="card-header-adaptive border-bottom-0 pt-4 px-4">
              <strong className="d-flex align-items-center gap-2 fs-5">
                <CIcon icon={cilStar} className="text-warning" />
                Mejores Estudiantes
              </strong>
              <small className="text-muted d-block mt-1">Ranking basado en puntuación acumulada</small>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-4">#</CTableHeaderCell>
                    <CTableHeaderCell>Estudiante</CTableHeaderCell>
                    <CTableHeaderCell>Semestre</CTableHeaderCell>
                    <CTableHeaderCell className="text-end pe-4">Puntos</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {topStudents.map((student, idx) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell className="ps-4">
                        <span className={`fw-bold ${idx < 3 ? 'text-warning' : ''}`}>{idx + 1}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CAvatar src={student.foto} color="primary" textColor="white" size="sm" className="me-2">
                            {student.foto ? null : (student.nombre ? student.nombre.charAt(0).toUpperCase() : 'E')}
                          </CAvatar>
                          <div>
                            <div className="fw-semibold small">{student.nombre} {student.apellido}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{student.carrera}</div>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info" shape="rounded-pill" className="small">{student.semestre || 'N/A'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end pe-4">
                        <span className="fw-bold text-warning">{student.puntuacion || 0}</span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {topStudents.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center text-muted py-3">
                        No hay estudiantes registrados
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Registros Recientes */}
        <CCol lg={6}>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="card-header-adaptive border-bottom-0 pt-4 px-4">
              <strong className="d-flex align-items-center gap-2 fs-5">
                <CIcon icon={cilUserFollow} className="text-success" />
                Registros Recientes
              </strong>
              <small className="text-muted d-block mt-1">Últimos estudiantes incorporados</small>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-4">Estudiante</CTableHeaderCell>
                    <CTableHeaderCell>Semestre</CTableHeaderCell>
                    <CTableHeaderCell className="pe-4">Carrera</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentRecentStudents.map((student) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell className="ps-4">
                        <div className="d-flex align-items-center">
                          <CAvatar src={student.foto} color="success" textColor="white" size="sm" className="me-2">
                            {student.foto ? null : (student.nombre ? student.nombre.charAt(0).toUpperCase() : 'E')}
                          </CAvatar>
                          <div>
                            <div className="fw-semibold small">{student.nombre} {student.apellido}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{student.email}</div>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info" shape="rounded-pill">{student.semestre || 'N/A'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="pe-4">
                        <span className="small text-muted">{student.carrera || '-'}</span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {recentStudents.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center text-muted py-3">
                        No hay registros recientes
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
              
              {/* Controles de Paginación */}
              {totalPages > 1 && (
                  <div className="d-flex justify-content-center py-3 border-top">
                      <CPagination aria-label="Navegación de registros recientes">
                          <CPaginationItem 
                            disabled={currentPage === 1} 
                            onClick={() => handlePageChange(currentPage - 1)}
                            style={{cursor: currentPage === 1 ? 'default' : 'pointer'}}
                          >
                            <span aria-hidden="true">&laquo;</span>
                          </CPaginationItem>
                          
                          {paginationPages.map((page) => (
                              <CPaginationItem 
                                key={page} 
                                active={page === currentPage} 
                                onClick={() => handlePageChange(page)}
                                style={{cursor: 'pointer'}}
                              >
                                {page}
                              </CPaginationItem>
                          ))}

                          <CPaginationItem 
                            disabled={currentPage === totalPages} 
                            onClick={() => handlePageChange(currentPage + 1)}
                            style={{cursor: currentPage === totalPages ? 'default' : 'pointer'}}
                          >
                            <span aria-hidden="true">&raquo;</span>
                          </CPaginationItem>
                      </CPagination>
                  </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Reports
