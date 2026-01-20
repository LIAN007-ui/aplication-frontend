import React from 'react'
import { CContainer, CCard, CCardBody } from '@coreui/react'
import plan3 from 'src/components/PlanDeEvaluacion/3er_semestre.pdf'

const PlanTercero = () => {
  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4">
      <CContainer>
        <CCard>
          <CCardBody>
            <h2>Plan de evaluación - Tercer semestre</h2>
            <p>Mostrando el plan de evaluación embebido:</p>
            <div style={{ height: '75vh', border: '1px solid #ddd' }}>
              <iframe
                title="Plan Tercer Semestre"
                src={plan3}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}

export default PlanTercero