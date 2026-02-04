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
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAvatar,
  CButton,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilUser, cilPeople, cilChevronLeft, cilChevronRight } from '@coreui/icons'

const TeacherStudents = () => {
  const API_URL = 'http://localhost:3001'

  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    setCurrentUser(user)
    if (user) {
      fetchStudents(user.assignedSemester)
    }
  }, [])

  const fetchStudents = async (semester) => {
    try {
      // Obtener todos los usuarios y filtrar en el cliente
      // porque json-server no soporta bien el formato "X° Semestre"
      const res = await axios.get(`${API_URL}/users`)
      
      // Filtrar solo estudiantes del semestre asignado al docente
      const semesterString = `${semester}° Semestre`
      const filteredStudents = res.data.filter(user => 
        user.role === 'student' && user.semestre === semesterString
      )
      
      setStudents(filteredStudents)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const fullName = `${student.nombre || ''} ${student.apellido || ''}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase()) || 
           (student.cedula && student.cedula.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

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
        .student-row {
          transition: all 0.2s ease;
        }
        .student-row:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }
        .search-box {
          border-radius: 50px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .search-box:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">
            <CIcon icon={cilPeople} className="me-2 text-primary" />
            Mis Estudiantes
          </h2>
          <span className="text-muted">
            Semestre {currentUser?.assignedSemester} • {students.length} estudiantes
          </span>
        </div>
      </div>

      {/* Search */}
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardBody>
          <CInputGroup className="search-box overflow-hidden">
            <CInputGroupText className="bg-transparent border-0">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0"
              style={{ boxShadow: 'none' }}
            />
          </CInputGroup>
        </CCardBody>
      </CCard>

      {/* Students Table */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-transparent border-bottom">
          <strong>Lista de Estudiantes</strong>
        </CCardHeader>
        <CCardBody className="p-0">
          <CTable hover responsive className="mb-0">
            <CTableHead className="bg-light">
              <CTableRow>
                <CTableHeaderCell className="ps-4">Estudiante</CTableHeaderCell>
                <CTableHeaderCell>Cédula</CTableHeaderCell>
                <CTableHeaderCell>Carrera</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Puntuación</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.map((student) => (
                <CTableRow key={student.id} className="student-row">
                  <CTableDataCell className="ps-4">
                    <div className="d-flex align-items-center">
                      {student.foto ? (
                        <CAvatar src={student.foto} size="md" className="me-3" />
                      ) : (
                        <CAvatar color="primary" textColor="white" size="md" className="me-3">
                          {(student.nombre || 'U').charAt(0).toUpperCase()}
                        </CAvatar>
                      )}
                      <div>
                        <div className="fw-semibold">
                          {student.nombre} {student.apellido}
                        </div>
                        <small className="text-muted">@{student.username}</small>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{student.cedula || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{student.carrera || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{student.email || 'N/A'}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge 
                      color={student.puntuacion >= 7 ? 'success' : student.puntuacion >= 5 ? 'warning' : 'danger'}
                      className="px-3 py-2"
                    >
                      {student.puntuacion || 0} pts
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {filteredStudents.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center py-5 text-muted">
                    <CIcon icon={cilUser} size="3xl" className="mb-3 opacity-25" />
                    <p className="mb-0">No se encontraron estudiantes</p>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
              <small className="text-muted">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} de {filteredStudents.length}
              </small>
              <CPagination aria-label="Navegación">
                <CPaginationItem 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <CIcon icon={cilChevronLeft} />
                </CPaginationItem>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  return (
                    <CPaginationItem 
                      key={page} 
                      active={page === currentPage} 
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </CPaginationItem>
                  )
                })}
                <CPaginationItem 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <CIcon icon={cilChevronRight} />
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default TeacherStudents
