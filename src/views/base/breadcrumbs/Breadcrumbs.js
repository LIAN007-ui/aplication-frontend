import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Breadcrumbs = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Plan de Evaluación - segundo semestre</strong>
          </CCardHeader>
          <CCardBody>
            {/* Contenedor del PDF */}
            <div style={{ width: '100%', height: '800px', border: 'none' }}>
              <iframe
                src=""
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Plan de Evaluación - Defensa Integral de la Nación I"
              >
                Tu navegador no soporta la visualización de PDFs.
                <a href="components/PlanDeEvaluacion">Descargar PDF</a>
              </iframe>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Breadcrumbs
