import React, { useState, useEffect } from 'react'
import api from '../../api'
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
  CAvatar
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilEducation,
  cilChartPie,
  cilSpeedometer,
  cilBook
} from '@coreui/icons'

const AdminDashboard = () => {

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    averageScore: 0,
  })
  const [teachers, setTeachers] = useState([])
  const [studentsBySemester, setStudentsBySemester] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api.get('/users/all')
      const users = response.data

      const students = users.filter((u) => u.role === 'student')
      const teachersList = users.filter((u) => u.role === 'teacher')

      const totalStudents = students.length
      const totalTeachers = teachersList.length

      let sumScores = 0
      students.forEach((s) => {
        sumScores += s.puntuacion || 0
      })
      const avgScore = totalStudents > 0 ? (sumScores / totalStudents).toFixed(1) : 0

      const bySemester = []
      
      for (let i = 1; i <= 8; i++) {
        const count = students.filter(s => s.semestre_id === i).length
        
        const percentageValue = totalStudents > 0 ? ((count / totalStudents) * 100) : 0
        const realPercentage = percentageValue.toFixed(0)

        bySemester.push({
          semester: i,
          count,
          barPercentage: percentageValue,
          realPercentage
        })
      }

      setStats({ totalStudents, totalTeachers, averageScore: avgScore })
      setTeachers(teachersList)
      setStudentsBySemester(bySemester)
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
        
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        
        @keyframes slide-in {
          0% { width: 0; opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes gloss-flow {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        .liquid-bar {
          height: 100%;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); 
          animation: slide-in 1s ease-out forwards;
        }

        .liquid-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%) skewX(-15deg);
          animation: gloss-flow 3s infinite ease-in-out;
        }
        
        .liquid-bar::before { content: none; }

        .bg-gradient-primary { background: linear-gradient(90deg, #321fdb 0%, #5647e3 100%); }
        .bg-gradient-success { background: linear-gradient(90deg, #2eb85c 0%, #51cb79 100%); }
        .bg-gradient-info { background: linear-gradient(90deg, #39f 0%, #68b4ff 100%); }
        .bg-gradient-warning { background: linear-gradient(90deg, #f9b115 0%, #fccc57 100%); }
        
        .color-sem-1 { background: linear-gradient(90deg, #6366f1, #818cf8); } 
        .color-sem-2 { background: linear-gradient(90deg, #3b82f6, #60a5fa); } 
        .color-sem-3 { background: linear-gradient(90deg, #10b981, #34d399); } 
        .color-sem-4 { background: linear-gradient(90deg, #f59e0b, #fbbf24); } 
        .color-sem-5 { background: linear-gradient(90deg, #f97316, #fb923c); } 
        .color-sem-6 { background: linear-gradient(90deg, #ef4444, #f87171); } 
        .color-sem-7 { background: linear-gradient(90deg, #ec4899, #f472b6); } 
        .color-sem-8 { background: linear-gradient(90deg, #8b5cf6, #a78bfa); } 
      `}</style>

      <h2 className="mb-4 d-flex align-items-center gap-2">
        <CIcon icon={cilSpeedometer} className="text-primary" />
        Panel de Administración Global
      </h2>

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
                    <span className="text-muted">{item.count} estudiantes ({item.realPercentage}%)</span>
                  </div>
                  <div 
                    style={{ 
                      height: '24px', 
                      borderRadius: '12px', 
                      backgroundColor: 'rgba(200, 200, 200, 0.2)',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div 
                      className={`liquid-bar color-sem-${item.semester}`}
                      style={{ 
                        width: `${item.barPercentage}%`,
                        minWidth: item.count > 0 ? '8%' : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

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
                        <CBadge color={getSemesterColor(teacher.assignedSemester || 1)} shape="rounded-pill">
                          {teacher.assignedSemester ? `${teacher.assignedSemester}°` : 'N/A'}
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
    </>
  )
}

export default AdminDashboard