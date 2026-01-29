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
  //SECCIÓN ADMINISTRADOR
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: { color: 'info', text: 'ADMIN' },
    permission: 'admin', 
  },
  {
    component: CNavItem,
    name: 'Estudiantes',
    to: '/users',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    permission: 'admin', // <--- SOLO ADMIN
  },
  {
    component: CNavItem,
    name: 'Publicaciones',
    to: '/publications',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />, 
    permission: 'admin', 
  },
  {
    component: CNavItem,
    name: 'Banco de Preguntas',
    to: '/preguntas',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    permission: 'admin',
  },
  
  // SECCIÓN ESTUDIANTES 
  {
    component: CNavItem,
    name: 'Foro Estudiantil',
    to: '/foro',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: 'admin', // oculto para usuarios que no sean admin
  },

  {
    component: CNavTitle,
    name: 'Módulos Estudiantiles',
    permission: 'student',
  },
  {
    component: CNavItem,
    name: 'Contenido',
    to: '/modulos/usuarios',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    permission: 'student',
  },
  {
    component: CNavItem,
    name: 'Foro de Discusión',
    to: '/modulos/foro-discusion',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: 'student',
  },
  {
    component: CNavItem,
    name: 'perfil',
    to: '/modulos/publicaciones',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    permission: 'student',
  },
  {
    component: CNavItem,
    name: 'Juego Educativo',
    to: '/modulos/juego',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    permission: 'student',
  },

  {
    component: CNavTitle,
    name: 'Planes de Evaluación',
  },
  {
    component: CNavGroup,
    name: 'Semestres',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    permission: 'student',
    items: [
      /*{
        component: CNavItem,
        name: 'Primer semestre',
        to: '/base/accordion',
      },*/
      {
        component: CNavItem,
        name: 'Segundo semestre',
        to: '/base/accordion2',
      },
      /*{
        component: CNavItem,
        name: 'Tercer semestre',
        to: '/base/accordion3',
      },
      {
        component: CNavItem,
        name: 'Cuarto semestre',
        to: '/base/accordion4',
      },
      {
        component: CNavItem,
        name: 'Quinto semestre',
        to: '/base/accordion5',
      },
      {
        component: CNavItem,
        name: 'Sexto semestre',
        to: '/base/accordion6',
      },
      {
        component: CNavItem,
        name: 'Séptimo semestre',
        to: '/base/accordion7',
      },
      {
        component: CNavItem,
        name: 'Octavo semestre',
        to: '/base/accordion8',
      },*/
      
    ],
  },
  
  // errar sesión para todos
  {
    component: CNavItem,
    name: 'Cerrar Sesión',
    to: '/login',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
]

export default _nav