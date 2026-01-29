import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const getCurrentRole = () => {
    try {
      const s = localStorage.getItem('currentUser')
      if (!s) return null
      const u = JSON.parse(s)
      return u && (u.role || u.permission || u.type) ? (u.role || u.permission || u.type) : null
    } catch (e) {
      return null
    }
  }

  const allowed = (item) => {
    // If no permission specified, show to everyone
    if (!item || !item.permission) return true
    const role = getCurrentRole()
    if (!role) return false
    if (Array.isArray(item.permission)) return item.permission.includes(role)
    return item.permission === role
  }
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    if (!allowed(item)) return null
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    const filteredItems = items?.filter((it) => allowed(it))
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {filteredItems?.map((child, idx) => (child.items ? navGroup(child, idx) : navItem(child, idx, true)))}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items && items.filter((it) => allowed(it)).map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
