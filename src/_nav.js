import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cilNotes,
  cilPuzzle,
  cilPencil,
  cilAccountLogout,
  cilEducation,
  cilUser,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// ============================================
// NAVEGACIÓN PARA SUPER ADMINISTRADOR (admin)
// ============================================
export const adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: { color: 'danger', text: 'ADMIN' },
  },
  {
    component: CNavTitle,
    name: 'GESTIÓN DEL SISTEMA',
  },
  {
    component: CNavItem,
    name: 'Estudiantes',
    to: '/admin/estudiantes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Docentes',
    to: '/admin/docentes',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'SESIÓN',
  },
  {
    component: CNavItem,
    name: 'Cerrar Sesión',
    to: '/login',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

// ============================================
// NAVEGACIÓN PARA DOCENTES (teacher)
// ============================================
export const teacherNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: { color: 'info', text: 'DOCENTE' }, // Se sobrescribe en AppSidebar
  },
  {
    component: CNavTitle,
    name: 'MI SEMESTRE',
  },
  {
    component: CNavItem,
    name: 'Estudiantes',
    to: '/estudiantes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Publicaciones',
    to: '/publicaciones',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Banco de Preguntas',
    to: '/banco-preguntas',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Foro Estudiantil',
    to: '/foro',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'SESIÓN',
  },
  {
    component: CNavItem,
    name: 'Cerrar Sesión',
    to: '/login',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

// ============================================
// NAVEGACIÓN PARA ESTUDIANTES (student)
// ============================================
export const studentNav = [
  {
    component: CNavItem,
    name: 'Mi Perfil',
    to: '/perfil',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'APRENDIZAJE',
  },
  {
    component: CNavItem,
    name: 'Contenido',
    to: '/contenido',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Juego Quiz',
    to: '/juego',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'COMUNIDAD',
  },
  {
    component: CNavItem,
    name: 'Foro de Discusión',
    to: '/foro',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'SESIÓN',
  },
  {
    component: CNavItem,
    name: 'Cerrar Sesión',
    to: '/login',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

// Exportación por defecto (para compatibilidad)
const _nav = teacherNav

export default _nav