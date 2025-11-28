import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Estadisticas',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    component: CNavItem,
    name: 'Estudiantes',
    to: '/users',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Publicaciones',
    to: '/publications',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Foro',
    to: '/foro',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Cerrar sesión',
    to: '/login',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Contenido x Semestres',
  },

  {
    component: CNavGroup,
    name: 'Semestres',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Primer semestre',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Segundo semestre',
        to: '/base/breadcrumbs',
      },
      /*{   
        
      
      },*/
      /*{
        component: CNavItem,
        name: 'tercer semestre',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'cuarto semestre',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'quinto semestre',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'sexto semestre',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'septimo semestre',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'octavo semestre',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'cinu',
        to: '/base/placeholders',
      },
      
      },*/
    ],
  },
]

export default _nav
