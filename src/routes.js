import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserCrud = React.lazy(() => import('./components/ModuloProfesor/users.jsx'))
const AdminPostCrud = React.lazy(() => import('./components/ModuloProfesor/Publications.jsx'))
const ForumCrud = React.lazy(() => import('./components/foro/Foro.jsx'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const ModuloUsuarios = React.lazy(() => import('./components/ModulosEstudiantil/Contenido.jsx'))
const ModuloForoDiscusion = React.lazy(() => import('./components/ModulosEstudiantil/ForoDiscusion.jsx'))
const ModuloPublicaciones = React.lazy(() => import('./components/ModulosEstudiantil/Perfil.jsx'))
const ModuloJuego = React.lazy(() => import('./components/ModulosEstudiantil/Juego.jsx'))
const Preguntas = React.lazy(() => import('./components/ModuloProfesor/BancoDePreguntas.jsx'))

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
  { path: '/modulos/usuarios', name: 'Usuarios', element: ModuloUsuarios, role: 'student' },
  { path: '/modulos/foro-discusion', name: 'Foro de Discusión', element: ModuloForoDiscusion, role: 'student' },
  { path: '/modulos/publicaciones', name: 'Publicaciones', element: ModuloPublicaciones, role: 'student' },
  { path: '/modulos/juego', name: 'Juego Educativo', element: ModuloJuego, role: 'student' },
]
 


export default routes
