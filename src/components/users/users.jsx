import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CTooltip,
} from '@coreui/react'

const UserCrud = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    apellido: '',
    cedula: '',
    carrera: '',
    semestre: '',
    correo: '',
    telefono: '',
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Carreras universitarias
  const carreras = [
    'Ingeniería de Sistemas',
    'Ingeniería civil',
    'Ingeniería electrónica',
    'Administración',
    'turismo',
  ]

  // Semestres
  const semestres = Array.from({ length: 10 }, (_, i) => (i + 1).toString())

  // carga inicial de usuarios
  useEffect(() => {
    setUsers([
      {
        id: 1,
        nombre: 'liander',
        apellido: 'rincon',
        cedula: '30163662',
        carrera: 'Ingeniería de Sistemas',
        semestre: '6',
        correo: 'lianderclaret@gamil.com',
        telefono: '04127459611',
      },
      {
        id: 2,
        nombre: 'Maria',
        apellido: 'perez',
        cedula: '30134562',
        carrera: 'turismo',
        semestre: '4',
        correo: 'mariaperez@example.com',
        telefono: '04248799757',
      },
    ])
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const { nombre, apellido, cedula, correo, telefono } = form

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !cedula.trim() ||
      !correo.trim() ||
      !telefono.trim()
    ) {
      alert('Todos los campos son obligatorios')
      return false
    }

    if (!/^\d+$/.test(cedula)) {
      alert('La cédula debe contener solo números')
      return false
    }

    if (!/^\d+$/.test(telefono)) {
      alert('El teléfono debe contener solo números')
      return false
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      alert('El correo electrónico no es válido')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (form.id === null) {
      // Crear usuario nuevo
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        ...form,
      }
      setUsers([...users, newUser])
    } else {
      // Editar usuario existente
      setUsers(users.map((user) => (user.id === form.id ? { ...form } : user)))
    }
    resetForm()
  }

  const handleEdit = (user) => {
    setForm(user)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleViewMore = (user) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const resetForm = () => {
    setForm({
      id: null,
      nombre: '',
      apellido: '',
      cedula: '',
      carrera: '',
      semestre: '',
      correo: '',
      telefono: '',
    })
  }

  // Filtrar usuarios basado en la búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCarreraColor = (carrera) => {
    const colors = {
      'Ingeniería de Sistemas': 'primary',
      Medicina: 'danger',
      Derecho: 'warning',
      Administración: 'success',
      Psicología: 'info',
      Contaduría: 'secondary',
      'Ingeniería Civil': 'dark',
      Arquitectura: 'light',
    }
    return colors[carrera] || 'primary'
  }

  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol>
            <h4 className="mb-0">Gestión de Estudiantes Universitarios</h4>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: '250px' }}
            />
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {/* Formulario */}
        <CForm onSubmit={handleSubmit} className="mb-4">
          <CRow className="g-3">
            <CCol md={6}>
              <CFormInput
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                name="cedula"
                placeholder="Cédula"
                value={form.cedula}
                onChange={handleChange}
                required
                maxLength="10"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="tel"
                name="telefono"
                placeholder="Número de Teléfono"
                value={form.telefono}
                onChange={handleChange}
                required
                maxLength="10"
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect name="carrera" value={form.carrera} onChange={handleChange} required>
                <option value="">Seleccione una carrera</option>
                {carreras.map((carrera, index) => (
                  <option key={index} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormSelect name="semestre" value={form.semestre} onChange={handleChange} required>
                <option value="">Seleccione el semestre</option>
                {semestres.map((semestre) => (
                  <option key={semestre} value={semestre}>
                    Semestre {semestre}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={12}>
              <CFormInput
                type="email"
                name="correo"
                placeholder="Correo Electrónico"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol xs={12}>
              <CButton type="submit" color="primary">
                {form.id === null ? 'Agregar Estudiante' : 'Actualizar Estudiante'}
              </CButton>
              {form.id !== null && (
                <CButton color="secondary" className="ms-2" onClick={resetForm}>
                  Cancelar
                </CButton>
              )}
            </CCol>
          </CRow>
        </CForm>

        {/* Tabla */}
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Nombre Completo</CTableHeaderCell>
              <CTableHeaderCell>Cédula</CTableHeaderCell>
              <CTableHeaderCell>Carrera</CTableHeaderCell>
              <CTableHeaderCell>Semestre</CTableHeaderCell>
              <CTableHeaderCell>Contacto</CTableHeaderCell>
              <CTableHeaderCell width="180px">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user) => (
              <CTableRow key={user.id}>
                <CTableDataCell>{user.id}</CTableDataCell>
                <CTableDataCell>
                  {user.nombre} {user.apellido}
                </CTableDataCell>
                <CTableDataCell>{user.cedula}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getCarreraColor(user.carrera)}>{user.carrera}</CBadge>
                </CTableDataCell>
                <CTableDataCell>Semestre {user.semestre}</CTableDataCell>
                <CTableDataCell>
                  <div>
                    <small className="text-muted d-block">{user.correo}</small>
                    <small className="text-muted">{user.telefono}</small>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CTooltip content="Ver detalles">
                    <CButton color="info" size="sm" onClick={() => handleViewMore(user)}>
                      Ver más
                    </CButton>
                  </CTooltip>
                  <CTooltip content="Editar estudiante">
                    <CButton
                      color="warning"
                      size="sm"
                      className="ms-1"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </CButton>
                  </CTooltip>
                  <CTooltip content="Eliminar estudiante">
                    <CButton
                      color="danger"
                      size="sm"
                      className="ms-1"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </CButton>
                  </CTooltip>
                </CTableDataCell>
              </CTableRow>
            ))}
            {filteredUsers.length === 0 && (
              <CTableRow>
                <CTableDataCell colSpan={7} className="text-center">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Modal para ver más información */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Información Completa del Estudiante</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedUser && (
              <CRow className="g-3">
                <CCol xs={6}>
                  <strong>Nombre:</strong>
                  <p>{selectedUser.nombre}</p>
                </CCol>
                <CCol xs={6}>
                  <strong>Apellido:</strong>
                  <p>{selectedUser.apellido}</p>
                </CCol>
                <CCol xs={6}>
                  <strong>Cédula:</strong>
                  <p>{selectedUser.cedula}</p>
                </CCol>
                <CCol xs={6}>
                  <strong>Teléfono:</strong>
                  <p>{selectedUser.telefono}</p>
                </CCol>
                <CCol xs={12}>
                  <strong>Carrera:</strong>
                  <p>
                    <CBadge color={getCarreraColor(selectedUser.carrera)}>
                      {selectedUser.carrera}
                    </CBadge>
                  </p>
                </CCol>
                <CCol xs={6}>
                  <strong>Semestre:</strong>
                  <p>Semestre {selectedUser.semestre}</p>
                </CCol>
                <CCol xs={6}>
                  <strong>ID:</strong>
                  <p>{selectedUser.id}</p>
                </CCol>
                <CCol xs={12}>
                  <strong>Correo Electrónico:</strong>
                  <p>{selectedUser.correo}</p>
                </CCol>
              </CRow>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Cerrar
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default UserCrud
