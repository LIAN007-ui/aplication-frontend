import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilUserFollow,
  cilUserUnfollow,
  cilSearch,
  cilPlus,
} from '@coreui/icons'

const Dashboard = () => {
  // Estilo común para el efecto hover en las tarjetas
  const cardHoverStyle = {
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
  }

  // Función para manejar el efecto visual con CSS (puedes mover esto a tu archivo .css)
  const hoverEffectClass = "hover-shadow-lg"

  return (
    <>
      <style>
        {`
          .custom-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(0,0,0,0.05);
          }
          .custom-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            border: 1px solid #321fdb; /* Resalta el borde al pasar el mouse */
          }
          .action-item:hover {
            background-color: #f8f9fa !important;
            padding-left: 10px !important;
            transition: all 0.2s ease;
          }
        `}
      </style>

      {/* Bienvenida */}
      <CCard className="mb-4 border-0 shadow-sm custom-card">
        <CCardBody className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-1 fw-bold">Panel Admistrativo</h3>
            <div className="text-medium-emphasis">Estadísticas de usuarios y registros actuales.</div>
          </div>
          <div className="d-none d-md-block text-success fw-semibold border border-success rounded-pill px-3 py-1">
            ● Sistema En Línea
          </div>
        </CCardBody>
      </CCard>

      {/* Bloques de Estadísticas con Resaltado */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card">
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Usuarios</div>
                <div className="fs-3 fw-bold">1</div>
              </div>
              <div className="bg-primary text-white p-3 rounded-circle shadow-sm">
                <CIcon icon={cilPeople} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card">
            <CCardBody className="d-flex align-items-center">
              <div style={{ width: '50px', marginRight: '15px' }}>
                <CChartDoughnut
                  data={{
                    datasets: [{
                      backgroundColor: ['#4ade80', '#ebebeb'],
                      data: [70, 30],
                      borderWidth: 0,
                    }],
                  }}
                  options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                />
              </div>
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Activos</div>
                <div className="fs-4 fw-bold text-success">10%</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card" style={{ borderLeft: '4px solid #2eb85c' }}>
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Nuevos Hoy</div>
                <div className="fs-3 fw-bold">1</div>
              </div>
              <div className="text-success p-3">
                <CIcon icon={cilUserFollow} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card" style={{ borderLeft: '4px solid #e55353' }}>
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Inactivos</div>
                <div className="fs-3 fw-bold">0</div>
              </div>
              <div className="text-danger p-3">
                <CIcon icon={cilUserUnfollow} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Tabla de Actividad */}
        <CCol md={8}>
          <CCard className="mb-4 border-0 shadow-sm custom-card">
            <CCardHeader className="bg-white border-0 pt-4 px-4 fw-bold">
              Actividad Reciente
            </CCardHeader>
            <CCardBody className="px-4">
              <CTable align="middle" responsive borderless hover>
                <thead className="text-medium-emphasis small border-bottom">
                  <tr>
                    <th>ACCIÓN</th>
                    <th>USUARIO</th>
                    <th className="text-end">HACE</th>
                  </tr>
                </thead>
                <CTableBody>
                  <CTableRow className="align-middle">
                    <CTableDataCell>
                      <span className="badge bg-info bg-opacity-10 text-info p-2 px-3">REGISTRO</span>
                    </CTableDataCell>
                    <CTableDataCell className="fw-semibold">liander</CTableDataCell>
                    <CTableDataCell className="text-end text-medium-emphasis small">2 días</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Acciones Rápidas */}
        <CCol md={4}>
          <CCard className="mb-4 border-0 shadow-sm custom-card">
            <CCardHeader className="bg-white border-0 pt-4 px-4 fw-bold">
              Acciones Rápidas
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem component="button" className="action-item d-flex align-items-center border-0 py-3 bg-transparent">
                   <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                    <CIcon icon={cilPlus} />
                  </div>
                  Nuevo Registro
                </CListGroupItem>
                <CListGroupItem component="button" className="action-item d-flex align-items-center border-0 py-3 bg-transparent">
                  <div className="bg-info bg-opacity-10 p-2 rounded me-3 text-info">
                    <CIcon icon={cilSearch} />
                  </div>
                  Buscar Usuario
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard