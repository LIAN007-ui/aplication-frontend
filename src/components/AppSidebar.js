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

// Importamos la configuración del menú
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // --- LÓGICA DE SEGURIDAD (Agregada) ---
  const userRole = localStorage.getItem('userRole') // 'admin' o 'student'

  const filteredNav = navigation.filter((item) => {
    // Si el item requiere permiso 'admin' y el usuario NO es admin -> OCULTAR
    if (item.permission === 'admin' && userRole !== 'admin') {
      return false
    }
    // Si no -> MOSTRAR
    return true
  })
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
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          {/* TU LOGO ORIGINAL RECUPERADO */}
          <CImage align="center" src="src/assets/images/logo.png" height={150} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Usamos la lista filtrada 'filteredNav' en lugar de 'navigation' */}
      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)