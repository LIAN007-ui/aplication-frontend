<<<<<<< HEAD
import React, { useState } from 'react'
=======
import React from 'react'
>>>>>>> 90e20dc (actualizacion visual)
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
<<<<<<< HEAD
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

// Componente que intenta cargar `public/logo.png`. Si la carga falla, muestra el SVG por defecto.
const ImageLogo = () => {
  const [showImg, setShowImg] = useState(true)

  return (
    <>
      {showImg ? (
        <img
          src="assets/images/logo.png"
          alt="Logo"
          className="sidebar-brand-full"
          style={{ height: 32 }}
          onError={() => setShowImg(false)}
        />
      ) : (
        <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
      )}
      <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
    </>
  )
}

=======

import { AppSidebarNav } from './AppSidebarNav'

// Importamos la configuración del menú
import navigation from '../_nav'

>>>>>>> 90e20dc (actualizacion visual)
const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

<<<<<<< HEAD
=======
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

>>>>>>> 90e20dc (actualizacion visual)
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
<<<<<<< HEAD
=======
          {/* TU LOGO ORIGINAL RECUPERADO */}
>>>>>>> 90e20dc (actualizacion visual)
          <CImage align="center" src="src/assets/images/logo.png" height={150} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
<<<<<<< HEAD
      <AppSidebarNav items={navigation} />
=======

      {/* Usamos la lista filtrada 'filteredNav' en lugar de 'navigation' */}
      <AppSidebarNav items={filteredNav} />

>>>>>>> 90e20dc (actualizacion visual)
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

<<<<<<< HEAD
export default React.memo(AppSidebar)
=======
export default React.memo(AppSidebar)
>>>>>>> 90e20dc (actualizacion visual)
