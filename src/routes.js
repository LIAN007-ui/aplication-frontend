import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserCrud = React.lazy(() => import('./components/users/users.jsx'))
const AdminPostCrud = React.lazy(() => import('./components/publications/Publications.jsx'))
const ForumCrud = React.lazy(() => import('./components/foro/Foro.jsx'))
const PlanPrimero = React.lazy(() => import('./views/plan/PlanPrimero'))
const PlanSegundo = React.lazy(() => import('./views/plan/PlanSegundo'))
const PlanTercero = React.lazy(() => import('./views/plan/PlanTercero'))
const PlanCuarto = React.lazy(() => import('./views/plan/PlanCuarto'))
const PlanQuinto = React.lazy(() => import('./views/plan/PlanQuinto'))
const PlanSexto = React.lazy(() => import('./views/plan/PlanSexto'))
const PlanSeptimo = React.lazy(() => import('./views/plan/PlanSeptimo'))
const PlanOctavo = React.lazy(() => import('./views/plan/PlanOctavo'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const ModuloUsuarios = React.lazy(() => import('./components/modulos/ModuloUsuarios'))
const ModuloForoDiscusion = React.lazy(() => import('./components/modulos/ModuloForoDiscusion'))
const ModuloPublicaciones = React.lazy(() => import('./components/modulos/ModuloPublicaciones'))
const ModuloJuego = React.lazy(() => import('./components/modulos/ModuloJuego'))
const Preguntas = React.lazy(() => import('./views/preguntas/Preguntas'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  
  // Rutas SOLO para Administradores
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, role: 'admin' },
  { path: '/users', name: 'UserCrud', element: UserCrud, role: 'admin' },
  { path: '/publications', name: 'AdminPostCrud', element: AdminPostCrud, role: 'admin' },
  { path: '/foro', name: 'ForumCrud', element: ForumCrud, role: 'admin' },
  { path: '/preguntas', name: 'Banco de Preguntas', element: Preguntas },
  
  // Rutas para Estudiantes
  { path: '/base', name: 'Base', element: Cards, exact: true }, 
  { path: '/base/accordion', name: 'Primer Semestre', element: PlanPrimero, role: 'student' }, 
  { path: '/base/accordion2', name: 'Segundo Semestre', element: PlanSegundo, role: 'student' }, 
  { path: '/base/accordion3', name: 'Tercer Semestre', element: PlanTercero, role: 'student' }, 
  { path: '/base/accordion4', name: 'Cuarto Semestre', element: PlanCuarto, role: 'student' }, 
  { path: '/base/accordion5', name: 'Quinto Semestre', element: PlanQuinto, role: 'student' }, 
  { path: '/base/accordion6', name: 'Sexto Semestre', element: PlanSexto, role: 'student' }, 
  { path: '/base/accordion7', name: 'Séptimo Semestre', element: PlanSeptimo, role: 'student' }, 
  { path: '/base/accordion8', name: 'Octavo Semestre', element: PlanOctavo, role: 'student' }, 
  { path: '/modulos/usuarios', name: 'Usuarios', element: ModuloUsuarios, role: 'student' },
  { path: '/modulos/foro-discusion', name: 'Foro de Discusión', element: ModuloForoDiscusion, role: 'student' },
  { path: '/modulos/publicaciones', name: 'Publicaciones', element: ModuloPublicaciones, role: 'student' },
  { path: '/modulos/juego', name: 'Juego Educativo', element: ModuloJuego, role: 'student' },
   { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
]
 


export default routes
