import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

<<<<<<< HEAD
// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
=======
// Importar rutas
import routes from '../routes'

const AppContent = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <CContainer lg>
>>>>>>> 90e20dc (actualizacion visual)
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
<<<<<<< HEAD
                  element={<route.element />}
=======
                  element={
                    (route.role && route.role !== userRole) ? (
                      <Navigate to="/404" replace /> 
                    ) : (
                      <route.element />
                    )
                  }
>>>>>>> 90e20dc (actualizacion visual)
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

<<<<<<< HEAD
export default React.memo(AppContent)
=======
export default AppContent
>>>>>>> 90e20dc (actualizacion visual)
