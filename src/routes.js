import React from 'react'

// Dashboard para Docentes (su semestre)
const Dashboard = React.lazy(() => import('./views/teacher/TeacherDashboard.jsx'))

// Dashboard para Super Admin (global)
const AdminDashboard = React.lazy(() => import('./views/admin/AdminDashboard.jsx'))

// Módulos de Admin
const AdminStudents = React.lazy(() => import('./views/admin/AdminStudents.jsx'))
const AdminTeachers = React.lazy(() => import('./views/admin/AdminTeachers.jsx'))

// Módulos de Docente
const UserCrud = React.lazy(() => import('./components/ModuloProfesor/users.jsx'))
const AdminPostCrud = React.lazy(() => import('./components/ModuloProfesor/Publications.jsx'))
const ForumCrud = React.lazy(() => import('./components/foro/Foro.jsx'))
const BancoDePreguntas = React.lazy(() => import('./components/ModuloProfesor/BancoDePreguntas.jsx'))

// Módulos de Estudiante
const Perfil = React.lazy(() => import('./components/ModulosEstudiantil/Perfil.jsx'))
const Contenido = React.lazy(() => import('./components/ModulosEstudiantil/Contenido.jsx'))
const Juego = React.lazy(() => import('./components/ModulosEstudiantil/Juego.jsx'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  
  // ============================================
  // RUTAS SUPER ADMIN
  // ============================================
  { 
    path: '/admin/dashboard', 
    name: 'Dashboard Admin', 
    element: AdminDashboard 
  },
  { 
    path: '/admin/estudiantes', 
    name: 'Estudiantes (Admin)', 
    element: AdminStudents 
  },
  { 
    path: '/admin/docentes', 
    name: 'Docentes', 
    element: AdminTeachers 
  },

  // ============================================
  // RUTAS DOCENTE
  // ============================================
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    element: Dashboard 
  },
  { 
    path: '/estudiantes', 
    name: 'Estudiantes', 
    element: UserCrud 
  },
  { 
    path: '/publicaciones', 
    name: 'Publicaciones', 
    element: AdminPostCrud 
  },
  { 
    path: '/banco-preguntas', 
    name: 'Banco de Preguntas', 
    element: BancoDePreguntas 
  },
  { 
    path: '/foro', 
    name: 'Foro', 
    element: ForumCrud 
  },

  // ============================================
  // RUTAS ESTUDIANTE
  // ============================================
  { 
    path: '/perfil', 
    name: 'Mi Perfil', 
    element: Perfil 
  },
  { 
    path: '/contenido', 
    name: 'Contenido', 
    element: Contenido 
  },
  { 
    path: '/juego', 
    name: 'Juego Quiz', 
    element: Juego 
  },
]

export default routes

