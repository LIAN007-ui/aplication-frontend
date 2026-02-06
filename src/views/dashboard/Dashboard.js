import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
  CSpinner,
  CProgress,
  CProgressBar
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilChartPie,
  cilUser,
  cilStar,
  cilCheckCircle,
  cilWarning,
  cilXCircle,
  cilSpeedometer
} from '@coreui/icons'

const Dashboard = () => {
  const API_URL = 'https://aplication-backend-mkdg.onrender.com/users'
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageScore: 0,
    highestScore: 0,
    passedCount: 0
  })
  const [topStudents, setTopStudents] = useState([])
  const [distribution, setDistribution] = useState({ low: 0, mid: 0, high: 0 })

  // 1. CARGAR DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL)
        // Filtrar solo estudiantes del primer semestre
        const users = response.data.filter(u => u.role === 'student' && u.semestre === '1° Semestre')
        
        const total = users.length
        
        let sumScores = 0
        let maxScore = 0
        let passed = 0
        
        let rangeLow = 0    // 0 - 4
        let rangeMid = 0    // 5 - 7
        let rangeHigh = 0   // 8 - 10

        users.forEach(user => {
          const score = user.puntuacion || 0
          sumScores += score
          if (score > maxScore) maxScore = score
          if (score >= 5) passed++ 

          if (score < 5) rangeLow++
          else if (score < 8) rangeMid++
          else rangeHigh++
        })

        const avg = total > 0 ? (sumScores / total).toFixed(1) : 0

        // Ordenar Top 5
        const sortedByScore = [...users].sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0)).slice(0, 5)

        setStats({
          totalStudents: total,
          averageScore: avg,
          highestScore: maxScore,
          passedCount: passed
        })
        setTopStudents(sortedByScore)
        setDistribution({ low: rangeLow, mid: rangeMid, high: rangeHigh })

      } catch (error) {
        console.error("Error cargando dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-5"><CSpinner color="primary"/></div>
  }

  // Cálculos para porcentajes de barras
  const totalForBars = stats.totalStudents || 1
  const pctLow = (distribution.low / totalForBars) * 100
  const pctMid = (distribution.mid / totalForBars) * 100
  const pctHigh = (distribution.high / totalForBars) * 100

  return (
    <>
      <style>{`
        .widget-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; border: none; }
        .widget-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        
        /* Ajustes Dark Mode */
        [data-coreui-theme="dark"] .widget-hover { background-color: #1e293b; color: white; }
        [data-coreui-theme="dark"] .card-dashboard { background-color: #1e293b; color: white; border: 1px solid #374151; }
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        [data-coreui-theme="dark"] .text-dark { color: #fff !important; }
      `}</style>

      {/* --- WIDGETS DE ESTADÍSTICAS --- */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 widget-hover shadow-sm"
            color="primary"
            icon={<CIcon icon={cilPeople} height={24} />}
            title="Estudiantes"
            value={stats.totalStudents}
            footer={<span className="text-muted fs-6">Registrados</span>}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 widget-hover shadow-sm"
            color="warning"
            icon={<CIcon icon={cilStar} height={24} className="text-white"/>}
            title="Promedio"
            value={stats.averageScore}
            footer={<span className="text-muted fs-6">Nota Global</span>}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 widget-hover shadow-sm"
            color="success"
            icon={<CIcon icon={cilCheckCircle} height={24} />}
            title="Aprobados"
            value={stats.passedCount}
            footer={<span className="text-muted fs-6">Nota ≥ 5</span>}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3 widget-hover shadow-sm"
            color="info"
            icon={<CIcon icon={cilSpeedometer} height={24} />}
            title="Tasa de Éxito"
            value={`${stats.totalStudents > 0 ? ((stats.passedCount / stats.totalStudents) * 100).toFixed(0) : 0}%`}
            footer={<span className="text-muted fs-6">Rendimiento</span>}
          />
        </CCol>
      </CRow>

      <CRow>
        {/* --- GRÁFICO DE BARRAS (SIMULADO CON CSS PURO) --- */}
        <CCol md={7} className="mb-4">
          <CCard className="h-100 border-0 shadow-sm card-dashboard">
            <CCardHeader className="bg-transparent p-4 border-0">
                <h4 className="mb-0 fw-bold d-flex align-items-center">
                    <CIcon icon={cilChartPie} className="me-2 text-primary"/>
                    Distribución de Notas
                </h4>
                <small className="text-muted">Desglose de rendimiento por niveles</small>
            </CCardHeader>
            <CCardBody className="px-4 pb-5 pt-2">
                
                {/* NIVEL BAJO */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-danger"><CIcon icon={cilXCircle} className="me-1"/>Nivel Bajo (0-4 pts)</span>
                        <span className="text-muted small">{distribution.low} estudiantes ({pctLow.toFixed(0)}%)</span>
                    </div>
                    <CProgress height={10} className="mb-3">
                        <CProgressBar color="danger" value={pctLow} />
                    </CProgress>
                </div>

                {/* NIVEL REGULAR */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-warning"><CIcon icon={cilWarning} className="me-1"/>Nivel Regular (5-7 pts)</span>
                        <span className="text-muted small">{distribution.mid} estudiantes ({pctMid.toFixed(0)}%)</span>
                    </div>
                    <CProgress height={10} className="mb-3">
                        <CProgressBar color="warning" value={pctMid} />
                    </CProgress>
                </div>

                {/* NIVEL EXCELENTE */}
                <div className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-success"><CIcon icon={cilCheckCircle} className="me-1"/>Nivel Excelente (8-10 pts)</span>
                        <span className="text-muted small">{distribution.high} estudiantes ({pctHigh.toFixed(0)}%)</span>
                    </div>
                    <CProgress height={10} className="mb-3">
                        <CProgressBar color="success" value={pctHigh} />
                    </CProgress>
                </div>

                {stats.totalStudents === 0 && <p className="text-center text-muted mt-5">No hay datos suficientes aún.</p>}

            </CCardBody>
          </CCard>
        </CCol>

        {/* --- CUADRO DE HONOR (TOP 5) --- */}
        <CCol md={5} className="mb-4">
          <CCard className="h-100 border-0 shadow-sm card-dashboard">
            <CCardHeader className="bg-transparent p-4 border-0">
                <h4 className="mb-0 fw-bold d-flex align-items-center">
                    <CIcon icon={cilStar} className="me-2 text-warning"/>
                    Cuadro de Honor
                </h4>
                <small className="text-muted">Mejores puntajes registrados</small>
            </CCardHeader>
            <CCardBody className="p-0">
                <CTable hover align="middle" className="mb-0 border-top" responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell className="ps-4 bg-transparent border-bottom-0">Estudiante</CTableHeaderCell>
                            <CTableHeaderCell className="text-end pe-4 bg-transparent border-bottom-0">Nota</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {topStudents.map((student, index) => (
                            <CTableRow key={student.id}>
                                <CTableDataCell className="ps-4 py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="position-relative">
                                            <CAvatar src={student.foto} size="md" color={index === 0 ? "warning" : "primary"} textColor="white">
                                                {student.foto ? null : student.nombre.charAt(0)}
                                            </CAvatar>
                                            {index === 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                                    <span className="visually-hidden">Top 1</span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="ms-3">
                                            <div className="fw-bold">{student.nombre} {student.apellido}</div>
                                            <div className="small text-muted">{student.carrera}</div>
                                        </div>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell className="text-end pe-4">
                                    <div className="fw-bold h5 mb-0 text-dark">
                                        {student.puntuacion} <span className="fs-6 text-muted fw-normal">/10</span>
                                    </div>
                                    <CProgress 
                                        color={index === 0 ? "warning" : "info"} 
                                        value={(student.puntuacion / 10) * 100} 
                                        height={4} 
                                        className="mt-1"
                                    />
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                        {topStudents.length === 0 && (
                            <CTableRow>
                                <CTableDataCell colSpan="2" className="text-center py-5 text-muted">
                                    Sin datos.
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

export default Dashboard