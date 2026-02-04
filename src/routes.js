import React from 'react'

// Teacher Dashboard (Assigned Semester)
const TeacherDashboard = React.lazy(() => import('./views/teacher/Dashboard.jsx'))

// Super Admin Dashboard (Global)
const AdminDashboard = React.lazy(() => import('./views/admin/Dashboard.jsx'))

// Admin Modules
const AdminStudents = React.lazy(() => import('./views/admin/Students.jsx'))
const AdminTeachers = React.lazy(() => import('./views/admin/Teachers.jsx'))
const AdminReports = React.lazy(() => import('./views/admin/Reports.jsx'))

// Teacher Modules
const TeacherStudents = React.lazy(() => import('./views/teacher/Students.jsx'))
const TeacherPublications = React.lazy(() => import('./views/teacher/Publications.jsx'))
const TeacherQuestions = React.lazy(() => import('./views/teacher/QuestionsBank.jsx'))
const Forum = React.lazy(() => import('./components/forum/Forum.jsx'))

// Student Modules
const StudentProfile = React.lazy(() => import('./views/student/Profile.jsx'))
const StudentContent = React.lazy(() => import('./views/student/Content.jsx'))
const StudentGame = React.lazy(() => import('./views/student/Game.jsx'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // ============================================
  // SUPER ADMIN ROUTES
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
  {
    path: '/admin/reportes',
    name: 'Reportes y Estadísticas',
    element: AdminReports
  },

  // ============================================
  // TEACHER ROUTES
  // ============================================
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: TeacherDashboard
  },
  {
    path: '/estudiantes',
    name: 'Estudiantes',
    element: TeacherStudents
  },
  {
    path: '/publicaciones',
    name: 'Publicaciones',
    element: TeacherPublications
  },
  {
    path: '/banco-preguntas',
    name: 'Banco de Preguntas',
    element: TeacherQuestions
  },
  {
    path: '/foro',
    name: 'Foro',
    element: Forum
  },

  // ============================================
  // STUDENT ROUTES
  // ============================================
  {
    path: '/perfil',
    name: 'Mi Perfil',
    element: StudentProfile
  },
  {
    path: '/contenido',
    name: 'Contenido',
    element: StudentContent
  },
  {
    path: '/juego',
    name: 'Juego Quiz',
    element: StudentGame
  },
]

export default routes

