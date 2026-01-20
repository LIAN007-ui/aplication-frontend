import React from 'react'
import { CContainer, CCard, CCardBody } from '@coreui/react'
import plan8 from 'src/components/PlanDeEvaluacion/8vo_semestre.pdf'

const PlanOctavo = () => {
  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4">
      <CContainer>
        <CCard>
          <CCardBody>
            <h2>Plan de evaluación - Octavo semestre</h2>
            <p>Mostrando el plan de evaluación embebido:</p>
            <div style={{ height: '75vh', border: '1px solid #ddd' }}>
              <iframe
                title="Plan Octavo Semestre"
                src={plan8}
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

export default PlanOctavo