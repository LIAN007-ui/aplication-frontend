import React from 'react'
import { CContainer, CCard, CCardBody } from '@coreui/react'
import plan6 from 'src/components/PlanDeEvaluacion/6to_semestre.pdf'

const PlanSexto = () => {
  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4">
      <CContainer>
        <CCard>
          <CCardBody>
            <h2>Plan de evaluación - Sexto semestre</h2>
            <p>Mostrando el plan de evaluación embebido:</p>
            <div style={{ height: '75vh', border: '1px solid #ddd' }}>
              <iframe
                title="Plan Sexto Semestre"
                src={plan6}
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

export default PlanSexto