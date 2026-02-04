import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsF,
  CSpinner,
  CBadge,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAvatar,
  CButton,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilStar,
  cilChartPie,
  cilCheckCircle,
  cilXCircle,
  cilChevronLeft,
  cilChevronRight,
  cilSearch,
} from '@coreui/icons'

const TeacherDashboard = () => {
  const API_URL = 'http://localhost:3001'

  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [students, setStudents] = useState([])
  const [honorPage, setHonorPage] = useState(0)
  const [honorSearch, setHonorSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Obtener usuario del localStorage
      const storedUser = localStorage.getItem('currentUser')
      const user = storedUser ? JSON.parse(storedUser) : null
      setCurrentUser(user)
      
      // Obtener todos los usuarios de la API
      const response = await axios.get(`${API_URL}/users`)
      const allUsers = response.data
      
      // Obtener el semestre asignado al docente
      let teacherSemester = user?.assignedSemester
      
      // Si no está en localStorage, buscarlo en la API
      if (!teacherSemester && user?.id) {
        const teacherFromApi = allUsers.find(u => u.id === user.id)
        teacherSemester = teacherFromApi?.assignedSemester
      }
      
      // Extraer el número del semestre (ej. "8" o "8° Semestre" -> 8)
      const teacherSemNum = parseInt(String(teacherSemester || '0').match(/\d+/)?.[0] || '0')
      
      console.log('📊 DOCENTE - Semestre asignado:', teacherSemNum)
      
      // Filtrar solo estudiantes del semestre del docente
      const filteredStudents = allUsers.filter(u => {
        if (u.role !== 'student') return false
        if (!u.semestre) return false
        
        // Extraer número del semestre del estudiante (ej. "8° Semestre" -> 8)
        const studentSemNum = parseInt(String(u.semestre).match(/\d+/)?.[0] || '0')
        
        return studentSemNum === teacherSemNum
      })
      
      console.log('📊 DOCENTE - Estudiantes del semestre', teacherSemNum, ':', filteredStudents.length)
      
      setStudents(filteredStudents)
    } catch (error) {
      console.error('📊 DOCENTE - Error al cargar:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate quiz stats
  const getQuizStats = () => {
    if (students.length === 0) {
      return { average: 0, highest: 0, lowest: 0, passRate: 0, passed: 0, failed: 0 }
    }
    
    const scores = students.map(s => s.puntuacion || 0)
    const total = scores.reduce((a, b) => a + b, 0)
    const average = total / scores.length
    const highest = Math.max(...scores)
    const lowest = Math.min(...scores)
    const passed = scores.filter(s => s >= 5).length
    const failed = scores.filter(s => s < 5).length
    const passRate = (passed / scores.length) * 100

    return { average: average.toFixed(1), highest, lowest, passRate: passRate.toFixed(0), passed, failed }
  }

  // Get top performers (Cuadro de Honor) - Muestra los mejores 10 sin importar la nota
  const getTopPerformers = () => {
    return [...students]
      .sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))
      .slice(0, 10)
  }

  // Get students needing improvement
  const getNeedImprovement = () => {
    return students.filter(s => (s.puntuacion || 0) < 5)
  }

  // Score distribution
  const getScoreDistribution = () => {
    const ranges = { '0-2': 0, '3-4': 0, '5-6': 0, '7-8': 0, '9-10': 0 }
    students.forEach(s => {
      const score = s.puntuacion || 0
      if (score <= 2) ranges['0-2']++
      else if (score <= 4) ranges['3-4']++
      else if (score <= 6) ranges['5-6']++
      else if (score <= 8) ranges['7-8']++
      else ranges['9-10']++
    })
    return ranges
  }

  // Ordenar estudiantes por puntuación (de mayor a menor)
  const sortedStudents = [...students].sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))

  // Obtener estado de la nota
  const getScoreStatus = (score) => {
    if (score >= 9) return { color: 'success', label: 'Excelente', icon: cilStar }
    if (score >= 7) return { color: 'info', label: 'Bueno', icon: cilCheckCircle }
    if (score >= 5) return { color: 'warning', label: 'Regular', icon: cilCheckCircle }
    return { color: 'danger', label: 'Reprobado', icon: cilXCircle }
  }

  const stats = getQuizStats()
  const topPerformers = getTopPerformers()
  const needImprovement = getNeedImprovement()
  const distribution = getScoreDistribution()
  const maxDistribution = Math.max(...Object.values(distribution), 1)

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
        .gradient-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        }
        .stat-card {
          transition: all 0.3s ease;
          border: none;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .performer-row {
          transition: all 0.2s ease;
        }
        .performer-row:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }
        .progress-label {
          min-width: 45px;
        }
        .score-badge {
          font-size: 1rem;
          min-width: 50px;
        }
        .student-table-row:hover {
          background-color: rgba(59, 130, 246, 0.03);
        }
        .honor-card {
          border-left: 4px solid #f59e0b !important;
        }
        [data-coreui-theme="dark"] .honor-card {
          border-left: 4px solid #f59e0b !important;
        }
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        [data-coreui-theme="dark"] .table thead th { background-color: #1e293b !important; color: #e5e7eb !important; }
        [data-coreui-theme="dark"] .bg-light { background-color: #1e293b !important; }
        [data-coreui-theme="dark"] .badge.bg-light { 
          background-color: #374151 !important; 
          color: #f3f4f6 !important; 
        }
        [data-coreui-theme="dark"] .text-muted { color: #9ca3af !important; }
        
        /* Animación de agua/olas para las barras */
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1) translateX(-100%);
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1) translateX(100%);
            opacity: 0.6;
          }
        }
        
        @keyframes growBar {
          from {
            width: 0%;
          }
        }
        
        .animated-bar {
          animation: growBar 1s ease-out forwards;
          position: relative;
          overflow: hidden;
          background-size: 200% 200%;
          animation: growBar 1s ease-out forwards, flow 3s ease infinite;
        }
        
        .animated-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 25%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 75%,
            transparent 100%
          );
          animation: wave 2s linear infinite;
        }
        
        .animated-bar::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          animation: ripple 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <CCard className="mb-4 border-0 shadow-sm overflow-hidden">
        <div className="gradient-header text-white p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold">Panel de Control - Semestre {currentUser?.assignedSemester}</h2>
              <p className="mb-0 opacity-75">
                Docente: {currentUser?.name || currentUser?.username || 'Sin nombre'}
              </p>
            </div>
            <div className="text-end">
              <CBadge color="light" textColor="primary" className="fs-5 px-4 py-2">
                {students.length} Estudiantes
              </CBadge>
            </div>
          </div>
        </div>
      </CCard>

      {/* Main Stats */}
      <CRow className="mb-4">

        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm stat-card"
            color="success"
            icon={<CIcon icon={cilCheckCircle} height={24} />}
            title="Aprobados (≥5)"
            value={`${stats.passed} (${stats.passRate}%)`}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm stat-card"
            color="danger"
            icon={<CIcon icon={cilXCircle} height={24} />}
            title="Reprobados (<5)"
            value={stats.failed}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm stat-card"
            color="warning"
            icon={<CIcon icon={cilStar} height={24} />}
            title="Promedio General"
            value={`${stats.average}/10`}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm stat-card"
            color="info"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Tasa de Éxito"
            value={`${stats.passRate}%`}
          />
        </CCol>
      </CRow>

      {/* Cuadro de Honor y Distribución */}
      <CRow className="mb-4">
        {/* Cuadro de Honor */}
        <CCol lg={6}>
          <CCard className="border-0 shadow-sm h-100 honor-card">
            <CCardHeader className="bg-transparent border-0 pb-2">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center">
                  <span className="fs-3 me-2">🏆</span>
                  <div>
                    <h5 className="mb-0 fw-bold">Cuadro de Honor</h5>
                    <small className="text-muted">Top estudiantes ordenados por rendimiento</small>
                  </div>
                </div>
                {/* Flechas de navegación */}
                {(() => {
                  const filtered = topPerformers.filter(s => {
                    if (!honorSearch) return true
                    const term = honorSearch.toLowerCase()
                    return (
                      (s.nombre && s.nombre.toLowerCase().includes(term)) ||
                      (s.apellido && s.apellido.toLowerCase().includes(term)) ||
                      (s.cedula && s.cedula.includes(honorSearch))
                    )
                  })
                  return filtered.length > 5 && (
                    <div className="d-flex align-items-center gap-2">
                      <CButton 
                        color="light" 
                        size="sm" 
                        disabled={honorPage === 0}
                        onClick={() => setHonorPage(prev => prev - 1)}
                      >
                        <CIcon icon={cilChevronLeft} />
                      </CButton>
                      <small className="text-muted">
                        {honorPage + 1} / {Math.ceil(filtered.length / 5)}
                      </small>
                      <CButton 
                        color="light" 
                        size="sm" 
                        disabled={(honorPage + 1) * 5 >= filtered.length}
                        onClick={() => setHonorPage(prev => prev + 1)}
                      >
                        <CIcon icon={cilChevronRight} />
                      </CButton>
                    </div>
                  )
                })()}
              </div>
              {/* Buscador */}
              <div className="mt-3 position-relative">
                <CIcon icon={cilSearch} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <CFormInput
                  type="text"
                  placeholder="Buscar..."
                  value={honorSearch}
                  onChange={(e) => {
                    let value = e.target.value
                    // Si es solo números, limitar a 8 dígitos (cédula)
                    if (/^\d+$/.test(value)) {
                      value = value.slice(0, 8)
                    } else {
                      // Si contiene letras, limitar a 40 caracteres (nombre)
                      value = value.slice(0, 40)
                    }
                    setHonorSearch(value)
                    setHonorPage(0) // Reset to first page on search
                  }}
                  maxLength={40}
                  style={{ paddingLeft: '2.5rem' }}
                  className="rounded-pill"
                />
              </div>
            </CCardHeader>
            <CCardBody className="pt-2">
              {(() => {
                // Filtrar por búsqueda
                const filteredPerformers = topPerformers.filter(s => {
                  if (!honorSearch) return true
                  const term = honorSearch.toLowerCase()
                  return (
                    (s.nombre && s.nombre.toLowerCase().includes(term)) ||
                    (s.apellido && s.apellido.toLowerCase().includes(term)) ||
                    (s.cedula && s.cedula.includes(honorSearch))
                  )
                })
                
                if (filteredPerformers.length === 0) {
                  return <p className="text-muted text-center py-4">{honorSearch ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados aún'}</p>
                }
                
                return (
                <CTable hover responsive className="mb-0">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Estudiante</CTableHeaderCell>
                      <CTableHeaderCell>Cédula</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Nota</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredPerformers.slice(honorPage * 5, (honorPage + 1) * 5).map((student, index) => {
                      const globalIndex = honorPage * 5 + index
                      return (
                        <CTableRow key={student.id} className="performer-row">
                          <CTableDataCell style={{ width: '50px' }}>
                            <CBadge 
                              color={globalIndex === 0 ? 'warning' : globalIndex === 1 ? 'secondary' : globalIndex === 2 ? 'danger' : 'light'} 
                              textColor={globalIndex < 3 ? 'white' : 'dark'}
                              className="rounded-circle"
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {globalIndex + 1}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              {student.foto ? (
                                <CAvatar src={student.foto} size="sm" className="me-2" />
                              ) : (
                                <CAvatar color="primary" textColor="white" size="sm" className="me-2">
                                  {(student.nombre || 'U').charAt(0).toUpperCase()}
                                </CAvatar>
                              )}
                              <div>
                                <div className="fw-bold">{student.nombre} {student.apellido}</div>
                                <small className="text-muted">{student.email}</small>
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="fw-semibold">{student.cedula || 'N/A'}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color="success" className="score-badge px-3 py-2 fs-6">
                              {student.puntuacion || 0}/10
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
                )
              })()}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Distribución de Notas */}
        <CCol lg={6}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader className="bg-transparent border-0">
              <div className="d-flex align-items-center">
                <CIcon icon={cilChartPie} className="text-primary me-2 fs-4" />
                <div>
                  <h5 className="mb-0 fw-bold">Distribución de Notas</h5>
                  <small className="text-muted">Desglose por rangos de puntuación</small>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {Object.entries(distribution).map(([range, count]) => {
                const percentage = students.length > 0 ? ((count / students.length) * 100) : 0
                const colorMap = {
                  '9-10': 'success',
                  '7-8': 'info', 
                  '5-6': 'warning',
                  '0-4': 'danger'
                }
                return (
                  <div key={range} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold">{range} pts</span>
                      <div>
                        <span className="fw-bold me-2">{percentage.toFixed(0)}%</span>
                        <CBadge 
                          color={colorMap[range] || 'secondary'}
                        >
                          {count} estudiante{count !== 1 ? 's' : ''}
                        </CBadge>
                      </div>
                    </div>
                    <div 
                      style={{ 
                        height: '24px', 
                        borderRadius: '12px', 
                        backgroundColor: 'rgba(128, 128, 128, 0.2)',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        className="animated-bar"
                        style={{ 
                          height: '100%', 
                          width: `${percentage}%`,
                          minWidth: count > 0 ? '5%' : '0%',
                          borderRadius: '12px',
                          backgroundColor: colorMap[range] === 'success' ? '#198754' : 
                                          colorMap[range] === 'info' ? '#0dcaf0' : 
                                          colorMap[range] === 'warning' ? '#ffc107' : '#dc3545',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              
              {/* Resumen */}
              <div className="mt-4 p-3 bg-light rounded-3">
                <CRow className="text-center">
                  <CCol>
                    <div className="fs-4 fw-bold text-success">{stats.passed}</div>
                    <small className="text-muted">Aprobados</small>
                  </CCol>
                  <CCol>
                    <div className="fs-4 fw-bold text-danger">{stats.failed}</div>
                    <small className="text-muted">Reprobados</small>
                  </CCol>
                  <CCol>
                    <div className="fs-4 fw-bold text-primary">{stats.average}</div>
                    <small className="text-muted">Promedio</small>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


    </>
  )
}

export default TeacherDashboard
