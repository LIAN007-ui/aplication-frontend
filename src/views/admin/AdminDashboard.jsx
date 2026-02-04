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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CProgress,
  CAvatar
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilEducation,
  cilChartPie,
  cilStar,
  cilSpeedometer,
  cilUserFollow,
  cilBook
} from '@coreui/icons'

const AdminDashboard = () => {
  const API_URL = 'http://localhost:3001'

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    averageScore: 0,
  })
  const [teachers, setTeachers] = useState([])
  const [studentsBySemester, setStudentsBySemester] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [recentStudents, setRecentStudents] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      const users = response.data

      const students = users.filter((u) => u.role === 'student')
      const teachersList = users.filter((u) => u.role === 'teacher')

      // Estadísticas básicas
      const totalStudents = students.length
      const totalTeachers = teachersList.length

      let sumScores = 0
      students.forEach((s) => {
        sumScores += s.puntuacion || 0
      })
      const avgScore = totalStudents > 0 ? (sumScores / totalStudents).toFixed(1) : 0

      // Estudiantes por semestre (1-8)
      const bySemester = []
      for (let i = 1; i <= 8; i++) {
        const count = students.filter(s => s.semestre === `${i}° Semestre`).length
        bySemester.push({
          semester: i,
          count,
          percentage: totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(0) : 0
        })
      }

      // Top 5 estudiantes por puntuación
      const sortedByScore = [...students].sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))
      const top5 = sortedByScore.slice(0, 5)

      // Últimos 5 registros
      const recent = students.slice(0, 5)

      setStats({ totalStudents, totalTeachers, averageScore: avgScore })
      setTeachers(teachersList)
      setStudentsBySemester(bySemester)
      setTopStudents(top5)
      setRecentStudents(recent)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSemesterColor = (sem) => {
    const colors = ['primary', 'success', 'info', 'warning', 'danger', 'dark', 'secondary', 'primary']
    return colors[(sem - 1) % colors.length]
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p className="mt-2 text-muted">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .dashboard-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .dashboard-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important; }
        .semester-bar { transition: width 0.5s ease; }
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        [data-coreui-theme="dark"] .table thead th { background-color: transparent !important; color: #e5e7eb !important; }
        [data-coreui-theme="dark"] .text-muted { color: #9ca3af !important; }
      `}</style>

      <h2 className="mb-4 d-flex align-items-center gap-2">
        <CIcon icon={cilSpeedometer} className="text-primary" />
        Panel de Administración Global
      </h2>

      {/* Stats Widgets */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm dashboard-card"
            color="primary"
            icon={<CIcon icon={cilPeople} height={24} />}
            title="Total Estudiantes"
            value={stats.totalStudents}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm dashboard-card"
            color="info"
            icon={<CIcon icon={cilEducation} height={24} />}
            title="Total Docentes"
            value={stats.totalTeachers}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm dashboard-card"
            color="success"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Promedio General"
            value={stats.averageScore}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 shadow-sm dashboard-card"
            color="warning"
            icon={<CIcon icon={cilBook} height={24} />}
            title="Semestres Activos"
            value="8"
          />
        </CCol>
      </CRow>

      <CRow>
        {/* Distribución por Semestre */}
        <CCol lg={8}>
          <CCard className="mb-4 shadow-sm dashboard-card">
            <CCardHeader className="bg-transparent border-0">
              <strong className="d-flex align-items-center gap-2">
                <CIcon icon={cilChartPie} className="text-primary" />
                Distribución de Estudiantes por Semestre
              </strong>
            </CCardHeader>
            <CCardBody>
              {studentsBySemester.map((item) => (
                <div key={item.semester} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-semibold">{item.semester}° Semestre</span>
                    <span className="text-muted">{item.count} estudiantes ({item.percentage}%)</span>
                  </div>
                  <CProgress 
                    value={item.percentage} 
                    color={getSemesterColor(item.semester)} 
                    className="semester-bar"
                    style={{ height: '12px' }}
                  />
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Docentes Registrados */}
        <CCol lg={4}>
          <CCard className="mb-4 shadow-sm dashboard-card h-100">
            <CCardHeader className="bg-transparent border-0">
              <strong className="d-flex align-items-center gap-2">
                <CIcon icon={cilEducation} className="text-info" />
                Docentes Activos
              </strong>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-3">Docente</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Semestre</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {teachers.slice(0, 6).map((teacher) => (
                    <CTableRow key={teacher.id}>
                      <CTableDataCell className="ps-3">
                        <div className="d-flex align-items-center">
                          <CAvatar color="info" textColor="white" size="sm" className="me-2">
                            {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'D'}
                          </CAvatar>
                          <span className="small fw-semibold">{teacher.name || teacher.username}</span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={getSemesterColor(teacher.assignedSemester)} shape="rounded-pill">
                          {teacher.assignedSemester}°
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {teachers.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="2" className="text-center text-muted py-3">
                        No hay docentes registrados
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Top Estudiantes */}
        <CCol lg={6}>
          <CCard className="mb-4 shadow-sm dashboard-card">
            <CCardHeader className="bg-transparent border-0">
              <strong className="d-flex align-items-center gap-2">
                <CIcon icon={cilStar} className="text-warning" />
                Mejores Estudiantes
              </strong>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-3">#</CTableHeaderCell>
                    <CTableHeaderCell>Estudiante</CTableHeaderCell>
                    <CTableHeaderCell>Semestre</CTableHeaderCell>
                    <CTableHeaderCell className="text-end pe-3">Puntos</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {topStudents.map((student, idx) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell className="ps-3">
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
                      <CTableDataCell className="text-end pe-3">
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
          <CCard className="mb-4 shadow-sm dashboard-card">
            <CCardHeader className="bg-transparent border-0">
              <strong className="d-flex align-items-center gap-2">
                <CIcon icon={cilUserFollow} className="text-success" />
                Registros Recientes
              </strong>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-3">Estudiante</CTableHeaderCell>
                    <CTableHeaderCell>Semestre</CTableHeaderCell>
                    <CTableHeaderCell>Carrera</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentStudents.map((student) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell className="ps-3">
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
                      <CTableDataCell>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AdminDashboard
