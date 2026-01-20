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
<<<<<<< HEAD
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

=======
  //SECCIÓN ADMINISTRADOR
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: { color: 'info', text: 'ADMIN' },
    permission: 'admin', 
  },
>>>>>>> 90e20dc (actualizacion visual)
  {
    component: CNavItem,
    name: 'Estudiantes',
    to: '/users',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
<<<<<<< HEAD
=======
    permission: 'admin', // <--- SOLO ADMIN
>>>>>>> 90e20dc (actualizacion visual)
  },
  {
    component: CNavItem,
    name: 'Publicaciones',
    to: '/publications',
<<<<<<< HEAD
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
=======
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />, 
    permission: 'admin', 
  },
  
  // SECCIÓN ESTUDIANTES 
  {
    component: CNavItem,
    name: 'Foro Estudiantil',
    to: '/foro',
>>>>>>> 90e20dc (actualizacion visual)
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
<<<<<<< HEAD
    name: 'Contenido x Semestres',
  },

  {
=======
    name: 'Módulos Estudiantiles',
  },
  {
    component: CNavItem,
    name: 'Incio',
    to: '/modulos/usuarios',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Foro de Discusión',
    to: '/modulos/foro-discusion',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'perfil',
    to: '/modulos/publicaciones',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Juego Educativo',
    to: '/modulos/juego',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Planes de Evaluación',
  },
  {
>>>>>>> 90e20dc (actualizacion visual)
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
<<<<<<< HEAD
      /*{
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
=======
      {
        component: CNavItem,
        name: 'Segundo semestre',
        to: '/base/accordion2',
      },
      {
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
      },
      
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
>>>>>>> 90e20dc (actualizacion visual)
