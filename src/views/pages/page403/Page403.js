import React from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

const Page403 = () => {
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')

  const handleGoBack = () => {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      navigate('/admin/dashboard')
    } else if (userRole === 'teacher') {
      navigate('/teacher/dashboard')
    } else if (userRole === 'student') {
      navigate('/student/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix text-center">
              <CIcon icon={cilLockLocked} size="4xl" className="text-danger mb-4" />
              <h1 className="display-3 me-4 text-danger">403</h1>
              <h4 className="pt-3">Acceso Denegado</h4>
              <p className="text-body-secondary fs-5">
                No tienes permiso para acceder a esta página.
              </p>
              <CButton color="primary" onClick={handleGoBack}>
                Volver a mi Dashboard
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page403
