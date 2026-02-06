import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Importar rutas
import routes from '../routes'

const AppContent = () => {
  const userRole = localStorage.getItem('userRole')
  const location = useLocation()
  const isGame = location.pathname === '/juego'

  return (
    <CContainer lg={!isGame} fluid={isGame} className={isGame ? 'px-0' : ''}>
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
                  element={
                    // Check if route has allowedRoles and user's role is not included
                    (route.allowedRoles && !route.allowedRoles.includes(userRole)) ? (
                      <Navigate to="/403" replace />
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            )
          })}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  userRole === 'admin' ? '/admin/dashboard' :
                    userRole === 'teacher' ? '/dashboard' :
                      userRole === 'student' ? '/perfil' :
                        '/login'
                }
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default AppContent