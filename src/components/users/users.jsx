import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
  const API_URL = 'http://localhost:3001/users'
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
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalViewVisible, setModalViewVisible] = useState(false)
  const [errorBanner, setErrorBanner] = useState({ message: '', visible: false })
  const [errorFields, setErrorFields] = useState([])
  const errorStyle = {
    boxShadow: '0 0 0 4px rgba(255,165,0,0.18)',
    borderColor: '#ff8c00',
    transition: 'box-shadow 300ms, border-color 300ms',
  }
  const [searchTerm, setSearchTerm] = useState('')

  const carreras = ['Ingeniería de Sistemas', 'Ingeniería civil', 'Ingeniería electrica', 'Administración', 'turismo']
  const semestres = Array.from({ length: 8 }, (_, i) => (i + 1).toString())

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL)
      setUsers(response.data)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      setErrorBanner({ message: 'Error de conexión con el servidor', visible: true })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (errorBanner.visible) setErrorBanner({ message: '', visible: false })
    if (errorFields.includes(name)) setErrorFields((prev) => prev.filter((f) => f !== name))
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumericChange = (e, name, maxLen) => {
    const raw = e.target.value || ''
    const digits = raw.replace(/\D/g, '').slice(0, maxLen)
    if (errorBanner.visible) setErrorBanner({ message: '', visible: false })
    if (errorFields.includes(name)) setErrorFields((prev) => prev.filter((f) => f !== name))
    setForm((prev) => ({ ...prev, [name]: digits }))
  }

  const handlePasteNumeric = (e, name, maxLen) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text') || ''
    if (!/^\d+$/.test(paste)) {
      e.preventDefault()
      return
    }
    const filtered = paste.replace(/\D/g, '').slice(0, maxLen)
    e.preventDefault()
    setForm((prev) => ({ ...prev, [name]: (prev[name] + filtered).slice(0, maxLen) }))
  }

  const validateForm = () => {
    const { nombre, apellido, cedula, correo, telefono } = form
    const missing = []
    if (!nombre) missing.push('nombre')
    if (!apellido) missing.push('apellido')
    if (!cedula) missing.push('cedula')
    if (!correo) missing.push('correo')
    if (!telefono) missing.push('telefono')
    if (missing.length > 0) {
      setErrorFields(missing)
      setErrorBanner({ message: 'Complete los campos obligatorios.', visible: true })
      setTimeout(() => {
        setErrorBanner({ message: '', visible: false })
        setErrorFields([])
      }, 3000)
      return false
    }
    if (!/^\d{8}$/.test(cedula)) {
      setErrorFields(['cedula'])
      setErrorBanner({ message: 'La cédula debe contener exactamente 8 dígitos.', visible: true })
      setTimeout(() => {
        setErrorBanner({ message: '', visible: false })
        setErrorFields([])
      }, 3000)
      return false
    }
    if (!/^\d{11}$/.test(telefono)) {
      setErrorFields(['telefono'])
      setErrorBanner({ message: 'El teléfono debe contener exactamente 11 dígitos.', visible: true })
      setTimeout(() => {
        setErrorBanner({ message: '', visible: false })
        setErrorFields([])
      }, 3000)
      return false
    }
    // Verificar duplicados en la lista local (ya cargada)
    const conflict = users.find((u) => u.id !== form.id && (u.cedula === cedula || u.correo === correo || u.telefono === telefono))
    if (conflict) {
      let field = ''
      let fieldKey = ''
      if (conflict.cedula === cedula) { field = 'Cédula'; fieldKey = 'cedula' }
      else if (conflict.correo === correo) { field = 'Correo'; fieldKey = 'correo' }
      else if (conflict.telefono === telefono) { field = 'Teléfono'; fieldKey = 'telefono' }
      setErrorFields(fieldKey ? [fieldKey] : [])
      setErrorBanner({ message: `${field} ya existe en otro registro.`, visible: true })
      setTimeout(() => {
        setErrorBanner({ message: '', visible: false })
        setErrorFields([])
      }, 3000)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (form.id === null) {
        // Crear nuevo usuario (POST)
        const { id, ...newUser } = form // Quitamos el ID null para que json-server lo genere
        await axios.post(API_URL, newUser)
      } else {
        // Editar usuario existente (PUT)
        await axios.put(`${API_URL}/${form.id}`, form)
      }
      fetchUsers() // Recargar datos
      closeFormModal()
    } catch (error) {
      console.error('Error guardando usuario:', error)
      setErrorBanner({ message: 'Error guardando datos', visible: true })
    }
  }

  const handleEdit = (user) => {
    setForm(user)
    setErrorBanner({ message: '', visible: false })
    setErrorFields([])
    setModalFormVisible(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        fetchUsers() // Recargar datos
      } catch (error) {
        console.error('Error eliminando usuario:', error)
        alert('Error eliminando usuario')
      }
    }
  }

  const handleViewMore = (user) => {
    setSelectedUser(user)
    setModalViewVisible(true)
  }

  const closeFormModal = () => {
    setModalFormVisible(false)
    setForm({ id: null, nombre: '', apellido: '', cedula: '', carrera: '', semestre: '', correo: '', telefono: '' })
    setErrorBanner({ message: '', visible: false })
    setErrorFields([])
  }

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm)
  )

  const getCarreraColor = (carrera) => {
    const colors = { 'Ingeniería de Sistemas': 'primary', 'Administración': 'success', 'turismo': 'info' }
    return colors[carrera] || 'secondary'
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-window py-3">
        <CRow className="align-items-center">
          <CCol>
            <h5 className="mb-0 text-primary">Estudiantes registrados</h5>
          </CCol>
          <CCol xs="auto" className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
            <CTooltip content="Agregar nuevo estudiante">
              <CButton color="primary" onClick={() => setModalFormVisible(true)}>
                <span style={{ fontSize: '1.2rem' }}>✎</span>
              </CButton>
            </CTooltip>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCardBody>
        <CTable align="middle" hover responsive borderless className="mb-0">
          <CTableHead className="text-muted border-bottom">
            <CTableRow>
              <CTableHeaderCell>Estudiante</CTableHeaderCell>
              <CTableHeaderCell>Cédula</CTableHeaderCell>
              <CTableHeaderCell>Carrera</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user) => (
              <CTableRow key={user.id}>
                <CTableDataCell>
                  <div className="fw-bold">{user.nombre} {user.apellido}</div>
                  <div className="small text-muted">{user.correo}</div>
                </CTableDataCell>
                <CTableDataCell>{user.cedula}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getCarreraColor(user.carrera)} shape="pill">
                    {user.carrera}
                  </CBadge>
                  <div className="small text-muted">Semestre {user.semestre}</div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton color="window" size="sm" className="me-1" onClick={() => handleViewMore(user)}>👁️</CButton>
                  <CButton color="window" size="sm" className="me-1 text-warning" onClick={() => handleEdit(user)}>✏️</CButton>
                  <CButton color="window" size="sm" className="text-danger" onClick={() => handleDelete(user.id)}>🗑️</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* MODAL PARA FORMULARIO (AGREGAR/EDITAR) */}
        <CModal backdrop="static" visible={modalFormVisible} onClose={closeFormModal} alignment="center" size="lg">
          <CModalHeader>
            <CModalTitle>{form.id ? 'Editar Estudiante' : 'Nuevo Registro'}</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <div
                style={{
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  transition: 'transform 300ms ease, opacity 300ms ease',
                  transform: errorBanner.visible ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: errorBanner.visible ? 1 : 0,
                  color: '#842029',
                  background: errorBanner.visible ? '#f8d7da' : 'transparent',
                  borderRadius: 6,
                  border: errorBanner.visible ? '1px solid #f5c2c7' : 'none',
                  fontSize: 14,
                }}
              >
                {errorBanner.visible ? errorBanner.message : ''}
              </div>
              <CRow className="g-3">
                <CCol md={6}>
                  <label className="small mb-1">Nombre</label>
                  <CFormInput name="nombre" value={form.nombre} onChange={handleChange} required style={errorFields.includes('nombre') ? errorStyle : {}} />
                </CCol>
                <CCol md={6}>
                  <label className="small mb-1">Apellido</label>
                  <CFormInput name="apellido" value={form.apellido} onChange={handleChange} required style={errorFields.includes('apellido') ? errorStyle : {}} />
                </CCol>
                <CCol md={6}>
                  <label className="small mb-1">Cédula</label>
                  <CFormInput
                    name="cedula"
                    value={form.cedula}
                    onChange={(e) => handleNumericChange(e, 'cedula', 8)}
                    onPaste={(e) => handlePasteNumeric(e, 'cedula', 8)}
                    inputMode="numeric"
                    maxLength={8}
                    required
                    style={errorFields.includes('cedula') ? errorStyle : {}}
                  />
                </CCol>
                <CCol md={6}>
                  <label className="small mb-1">Teléfono</label>
                  <CFormInput
                    name="telefono"
                    value={form.telefono}
                    onChange={(e) => handleNumericChange(e, 'telefono', 11)}
                    onPaste={(e) => handlePasteNumeric(e, 'telefono', 11)}
                    inputMode="tel"
                    maxLength={11}
                    required
                    style={errorFields.includes('telefono') ? errorStyle : {}}
                  />
                </CCol>
                <CCol md={6}>
                  <label className="small mb-1">Carrera</label>
                  <CFormSelect name="carrera" value={form.carrera} onChange={handleChange} required style={errorFields.includes('carrera') ? errorStyle : {}}>
                    <option value="">Seleccionar...</option>
                    {carreras.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <label className="small mb-1">Semestre</label>
                  <CFormSelect name="semestre" value={form.semestre} onChange={handleChange} required style={errorFields.includes('semestre') ? errorStyle : {}}>
                    <option value="">Seleccionar...</option>
                    {semestres.map(s => <option key={s} value={s}>Semestre {s}</option>)}
                  </CFormSelect>
                </CCol>
                <CCol md={12}>
                  <label className="small mb-1">Correo Electrónico</label>
                  <CFormInput type="email" name="correo" value={form.correo} onChange={handleChange} required style={errorFields.includes('correo') ? errorStyle : {}} />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" variant="ghost" onClick={closeFormModal}>Cancelar</CButton>
              <CButton color="primary" type="submit">
                {form.id ? 'Guardar Cambios' : 'Registrar Estudiante'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>

        {/* MODAL PARA VER DETALLES */}
        <CModal visible={modalViewVisible} onClose={() => setModalViewVisible(false)} alignment="center">
          <CModalHeader>
            <CModalTitle>Detalles del Estudiante</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedUser && (
              <div className="p-2">
                <div className="text-center mb-4">
                  <div className="display-6">{selectedUser.nombre}</div>
                  <CBadge color="primary">{selectedUser.carrera}</CBadge>
                </div>
                <hr />
                <p><strong>Cédula:</strong> {selectedUser.cedula}</p>
                <p><strong>Correo:</strong> {selectedUser.correo}</p>
                <p><strong>Teléfono:</strong> {selectedUser.telefono}</p>
                <p><strong>Semestre:</strong> {selectedUser.semestre}º Semestre</p>
              </div>
            )}
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default UserCrud