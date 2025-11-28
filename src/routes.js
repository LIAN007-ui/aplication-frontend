import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserCrud = React.lazy(() => import('./components/users/users.jsx'))
const AdminPostCrud = React.lazy(() => import('./components/publications/Publications.jsx'))
const ForumCrud = React.lazy(() => import('./components/foro/Foro.jsx'))
const PlanPrimero = React.lazy(() => import('./views/plan/PlanPrimero'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'UserCrud', element: UserCrud },
  { path: '/publications', name: 'AdminPostCrud', element: AdminPostCrud },
  { path: '/foro', name: 'ForumCrud', element: ForumCrud },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Primer Semestre', element: PlanPrimero },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
]

export default routes
