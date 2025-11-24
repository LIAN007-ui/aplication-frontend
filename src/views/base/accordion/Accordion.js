import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Breadcrumbs = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Plan de Evaluación - Defensa Integral de la Nación I</strong>
          </CCardHeader>
          <CCardBody>
            {/* Contenedor del PDF */}
            <div style={{ width: '100%', height: '800px', border: 'none' }}>
              <iframe
                src="components/Plan_de_Evaluacion_DEFENSA_INTEGRAL_DE_LA_NACION_I_1er_semestre.pdf"
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
