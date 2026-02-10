import React, { useState, useEffect } from 'react'
import api from '../../api'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell,
  CButton, CFormSelect, CFormInput, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CBadge, CInputGroup, CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilUserPlus, cilTrash, cilSearch, cilSchool, cilBriefcase } from '@coreui/icons'

const UsersManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [modalVisible, setModalVisible] = useState(false)
  
  const [newUser, setNewUser] = useState({
    username: '', email: '', password: '', role: 'student', 
    first_name: '', last_name: '', cedula: '', career: 'Ingeniería de Sistemas', current_semester_id: 1, 
    full_name: '', assigned_semester_id: 1 
  })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/all')
      setUsers(res.data)
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await api.delete(`/users/${id}`)
        fetchUsers()
      } catch (e) { alert('Error al eliminar') }
    }
  }

  const handleSave = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
        alert('Por favor completa usuario, correo y contraseña')
        return
    }

    try {
      await api.post('/users/create', newUser)
      setModalVisible(false)
      fetchUsers()
      setNewUser({ ...newUser, username: '', email: '', password: '' }) 
      alert('Usuario creado correctamente')
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear usuario')
    }
  }

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase()
    return (
        (u.name || '').toLowerCase().includes(term) || 
        (u.username || '').toLowerCase().includes(term) || 
        (u.email || '').toLowerCase().includes(term) ||
        (u.first_name || '').toLowerCase().includes(term) ||
        (u.last_name || '').toLowerCase().includes(term) ||
        (u.full_name || '').toLowerCase().includes(term)
    )
  })

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Gestión de Usuarios</strong>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              <CIcon icon={cilUserPlus} className="me-2"/> Nuevo Usuario
            </CButton>
          </CCardHeader>
          <CCardBody>
            
            <CInputGroup className="mb-3 w-50">
                <CInputGroupText><CIcon icon={cilSearch}/></CInputGroupText>
                <CFormInput placeholder="Buscar por nombre o correo..." onChange={e => setSearchTerm(e.target.value)}/>
            </CInputGroup>

            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Rol</CTableHeaderCell>
                  <CTableHeaderCell>Nombre / Usuario</CTableHeaderCell>
                  <CTableHeaderCell>Semestre</CTableHeaderCell>
                  <CTableHeaderCell>Correo</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredUsers.map((u) => (
                  <CTableRow key={u.id}>
                    <CTableDataCell>
                      <CBadge color={u.role === 'admin' ? 'danger' : u.role === 'teacher' ? 'info' : 'success'}>
                        {u.role === 'teacher' ? 'Docente' : u.role === 'student' ? 'Estudiante' : 'Admin'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                        <div className="fw-bold">{u.nombre || u.username}</div>
                        <small className="text-muted">{u.username}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                        {u.role === 'teacher' && u.semestre ? `Prof. ${u.semestre}` : ''}
                        {u.role === 'student' && u.semestre ? u.semestre : ''}
                    </CTableDataCell>
                    <CTableDataCell>{u.email}</CTableDataCell>
                    <CTableDataCell>
                      {u.role !== 'admin' && (
                          <CButton color="danger" variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>
                            <CIcon icon={cilTrash}/>
                          </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Crear Nuevo Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow className="g-3">
                <CCol md={12}>
                    <label className="fw-bold mb-1">Tipo de Usuario</label>
                    <CFormSelect 
                        value={newUser.role} 
                        onChange={e => setNewUser({...newUser, role: e.target.value})}
                        options={[
                            { label: 'Estudiante', value: 'student' },
                            { label: 'Docente', value: 'teacher' },
                            { label: 'Administrador', value: 'admin' }
                        ]}
                    />
                </CCol>

                <CCol md={6}>
                    <label>Usuario (Login)</label>
                    <CFormInput value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                </CCol>
                <CCol md={6}>
                    <label>Correo Electrónico</label>
                    <CFormInput type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                </CCol>
                <CCol md={6}>
                    <label>Contraseña</label>
                    <CFormInput type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </CCol>

                <hr className="my-4"/>

                {newUser.role === 'teacher' && (
                    <>
                        <CCol md={12}><h5 className="text-info"><CIcon icon={cilBriefcase} className="me-2"/>Datos del Docente</h5></CCol>
                        <CCol md={8}>
                            <label>Nombre Completo</label>
                            <CFormInput 
                                placeholder="Ej: Ing. Pedro Pérez"
                                value={newUser.full_name} 
                                onChange={e => setNewUser({...newUser, full_name: e.target.value})} 
                            />
                        </CCol>
                        <CCol md={4}>
                            <label>Semestre Asignado</label>
                            <CFormSelect 
                                value={newUser.assigned_semester_id} 
                                onChange={e => setNewUser({...newUser, assigned_semester_id: e.target.value})}
                            >
                                {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>Semestre {num}</option>)}
                            </CFormSelect>
                        </CCol>
                    </>
                )}

                {newUser.role === 'student' && (
                    <>
                        <CCol md={12}><h5 className="text-success"><CIcon icon={cilSchool} className="me-2"/>Datos del Estudiante</h5></CCol>
                        <CCol md={6}>
                            <label>Nombre</label>
                            <CFormInput value={newUser.first_name} onChange={e => setNewUser({...newUser, first_name: e.target.value})} />
                        </CCol>
                        <CCol md={6}>
                            <label>Apellido</label>
                            <CFormInput value={newUser.last_name} onChange={e => setNewUser({...newUser, last_name: e.target.value})} />
                        </CCol>
                        <CCol md={6}>
                            <label>Cédula</label>
                            <CFormInput value={newUser.cedula} onChange={e => setNewUser({...newUser, cedula: e.target.value})} />
                        </CCol>
                        <CCol md={6}>
                            <label>Semestre Actual</label>
                            <CFormSelect 
                                value={newUser.current_semester_id} 
                                onChange={e => setNewUser({...newUser, current_semester_id: e.target.value})}
                            >
                                {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>Semestre {num}</option>)}
                            </CFormSelect>
                        </CCol>
                    </>
                )}
            </CRow>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancelar</CButton>
            <CButton color="primary" onClick={handleSave}>Guardar Usuario</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default UsersManagement