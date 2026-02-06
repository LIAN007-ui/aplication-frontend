import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CImage,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import img from '../assets/images/logo.png'
// Importamos las configuraciones de navegación por rol
import { adminNav, teacherNav, studentNav } from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // --- LÓGICA DE SEGURIDAD POR ROL ---
  const userRole = localStorage.getItem('userRole') // 'admin', 'teacher' o 'student'
  
  // Obtener información del usuario actual
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }
  
  const currentUser = getCurrentUser()

  // Seleccionar navegación según rol
  const getNavigation = () => {
    if (userRole === 'admin') {
      return adminNav
    } else if (userRole === 'teacher') {
      // Para docentes, modificar el badge del Dashboard con su semestre
      return teacherNav.map((item) => {
        if (item.to === '/dashboard' && item.badge && currentUser?.assignedSemester) {
          return { 
            ...item, 
            badge: { color: 'warning', text: `Semestre ${currentUser.assignedSemester}` } 
          }
        }
        return item
      })
    } else if (userRole === 'student') {
      // Para estudiantes, usar su navegación específica
      return studentNav
    }
    // Por defecto (si no hay rol), mostrar navegación de estudiante
    return studentNav
  }

  const navigation = getNavigation()
  // ---------------------------------------

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CSidebarBrand to="/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {/* LOGO UNEFA */}
          <CImage
            src={img}
            style={{ display: 'block', margin: '0 auto', height: 150, objectFit: 'contain' }}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Navegación según rol */}
      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)