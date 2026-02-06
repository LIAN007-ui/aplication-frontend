import React, { useState, useEffect } from 'react'
import api from '../../api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CAvatar,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CSpinner,
  CContainer,
  CFormLabel,
  CPagination,
  CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilSearch,
  cilTrash,
  cilStar,
  cilWarning,
  cilPencil,
  cilPlus,
  cilSave,
  cilUser,
  cilCreditCard,
  cilAt,
  cilBook,
  cilLockLocked,
  cilXCircle,
  cilCheckCircle,
  cilFilter
} from '@coreui/icons'

const AdminStudents = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSemester, setFilterSemester] = useState('all')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [successMessage, setSuccessMessage] = useState('¡Operación Exitosa!')

  const [userToDelete, setUserToDelete] = useState(null)
  const [userToEdit, setUserToEdit] = useState({})

  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    username: '',
    email: '',
    password: '',
    carrera: '',
    semestre: '',
    role: 'student',
    puntuacion: 0,
    foto: null
  })

  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/all')
      const students = response.data.filter(u => u.role === 'student')

      const semMap = {
        'Primer Semestre': '1° Semestre',
        'Segundo Semestre': '2° Semestre',
        'Tercer Semestre': '3° Semestre',
        'Cuarto Semestre': '4° Semestre',
        'Quinto Semestre': '5° Semestre',
        'Sexto Semestre': '6° Semestre',
        'Séptimo Semestre': '7° Semestre',
        'Octavo Semestre': '8° Semestre'
      }

      const processedStudents = students.map(s => ({
          ...s,
          semestre: semMap[s.semestre] || s.semestre || 'Sin asignar' 
      }))

      setUsers(processedStudents.reverse())
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    if (value === '') {
      setSearchTerm('')
      return
    }
    const isNumeric = /^\d+$/.test(value)
    if (isNumeric) {
      if (value.length > 8) return
    } else {
      if (value.length > 40) return
    }
    setSearchTerm(value)
  }

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = (
      (user.nombre && user.nombre.toLowerCase().includes(term)) ||
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.cedula && user.cedula.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term))
    )
    const matchesSemester = filterSemester === 'all' || user.semestre === filterSemester
    return matchesSearch && matchesSemester
  })

  useEffect(() => { setCurrentPage(1) }, [searchTerm, filterSemester])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const pageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const validateForm = () => {
    let newErrors = {}
    let isValid = true

    const textOnlyRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/

    if (!newUser.nombre.trim()) { newErrors.nombre = "Nombre obligatorio"; isValid = false }
    else if (!textOnlyRegex.test(newUser.nombre)) { newErrors.nombre = "Solo se permiten letras"; isValid = false }

    if (!newUser.apellido.trim()) { newErrors.apellido = "Apellido obligatorio"; isValid = false }
    else if (!textOnlyRegex.test(newUser.apellido)) { newErrors.apellido = "Solo se permiten letras"; isValid = false }

    const cedulaRegex = /^\d{7,8}$/
    if (!newUser.cedula) { newErrors.cedula = "Cédula obligatoria"; isValid = false }
    else if (!cedulaRegex.test(newUser.cedula)) { newErrors.cedula = "Debe tener 7 u 8 dígitos"; isValid = false }
    else if (users.some(u => u.cedula === newUser.cedula)) { newErrors.cedula = "¡Esta cédula ya existe!"; isValid = false }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!newUser.email) { newErrors.email = "Correo obligatorio"; isValid = false }
    else if (!emailRegex.test(newUser.email)) { newErrors.email = "Formato inválido"; isValid = false }
    else if (users.some(u => u.email === newUser.email)) { newErrors.email = "¡Correo ya registrado!"; isValid = false }

    if (!newUser.username) { newErrors.username = "Usuario requerido"; isValid = false }
    else if (users.some(u => u.username === newUser.username)) { newErrors.username = "Usuario ya ocupado"; isValid = false }

    if (!newUser.password) { newErrors.password = "Contraseña requerida"; isValid = false }
    if (!newUser.semestre) { newErrors.semestre = "Selecciona semestre"; isValid = false }
    if (!newUser.carrera) { newErrors.carrera = "Selecciona carrera"; isValid = false }

    setErrors(newErrors)
    return isValid
  }

  const handleAddChange = (e) => {
    const { name, value } = e.target
    if ((name === 'nombre' || name === 'apellido') && !/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) return;
    if (name === 'cedula' && !/^\d*$/.test(value)) return;
    setNewUser({ ...newUser, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
  }

  const saveNewUser = async () => {
    if (!validateForm()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    try {
      const userToCreate = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: 'student',
        first_name: newUser.nombre,
        last_name: newUser.apellido,
        cedula: newUser.cedula,
        career: newUser.carrera,
        current_semester_id: parseInt(newUser.semestre) || 1 
      }

      await api.post('/auth/register', userToCreate)
      
      fetchUsers() 

      setAddModalVisible(false)
      setSuccessMessage('¡Estudiante registrado exitosamente!')
      setSuccessModalVisible(true)

      setNewUser({
        nombre: '', apellido: '', cedula: '', username: '', email: '', password: '', carrera: '', semestre: '', role: 'student', puntuacion: 0, foto: null
      })
      setErrors({})

      setTimeout(() => { setSuccessModalVisible(false) }, 2500)

    } catch (error) {
      alert(error.response?.data?.error || "Error al crear usuario")
    }
  }

  const openEditModal = (user) => {
    setUserToEdit(user)
    setEditModalVisible(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setUserToEdit({ ...userToEdit, [name]: value })
  }

  const saveEdit = async () => {
    try {
      const payload = {
        username: userToEdit.username,
        email: userToEdit.email,
        first_name: userToEdit.nombre,
        last_name: userToEdit.apellido,
        cedula: userToEdit.cedula,
        career: userToEdit.carrera,
        current_semester_id: parseInt(userToEdit.semestre) || 1 
      }

      await api.patch(`/users/${userToEdit.id}`, payload)
      
      fetchUsers()
      setEditModalVisible(false)
      
      setSuccessMessage('¡Estudiante actualizado correctamente!')
      setSuccessModalVisible(true)
      setTimeout(() => { setSuccessModalVisible(false) }, 2500)
    } catch (error) { 
      console.error(error)
      alert(error.response?.data?.error || "Error al actualizar") 
    }
  }

  const confirmDelete = (user) => {
    setUserToDelete(user)
    setDeleteModalVisible(true)
  }

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await api.delete(`/users/${userToDelete.id}`)
        setUsers(users.filter(u => u.id !== userToDelete.id))
        setDeleteModalVisible(false)
        setUserToDelete(null)
      } catch (error) { 
        console.error("Error eliminando:", error)
        alert(error.response?.data?.error || error.message || "Error al eliminar") 
      }
    }
  }

  const uniqueSemesters = [...new Set(users.map(u => u.semestre).filter(Boolean))].sort()

  return (
    <CContainer fluid>
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); } 25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); }
        }
        .shake-animation .form-control, .shake-animation .form-select {
          animation: shake 0.4s ease-in-out;
          border-color: #e55353 !important;
          background-color: #fff5f5;
        }

        @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }
        .success-icon-anim { animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; }

        .error-msg { color: #e55353; font-size: 0.75rem; margin-top: 4px; font-weight: 600; display: flex; align-items: center; }

        .search-bar-custom .input-group-text { background-color: #fff; border: 1px solid #dee2e6; border-right: none; color: #768192; }
        .search-bar-custom .form-control { background-color: #fff; border: 1px solid #dee2e6; border-left: none; color: #768192; }
        .bg-box-adaptive { background-color: #f8f9fa; border: 1px solid #dee2e6; }
        .modal-footer-adaptive { background-color: #f8f9fa; border-top: 1px solid #dee2e6; }
        .modal-header-custom { background: linear-gradient(90deg, #1f2937 0%, #374151 100%); color: white; border-bottom: none; }
        .modal-header-custom .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }

        [data-coreui-theme="dark"] .search-bar-custom .input-group-text { background-color: #2a303d; border-color: #3b4b60; color: #e5e7eb; }
        [data-coreui-theme="dark"] .search-bar-custom .form-control { background-color: #2a303d; border-color: #3b4b60; color: #fff; }
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        [data-coreui-theme="dark"] .table thead th { background-color: transparent !important; color: #e5e7eb !important; border-bottom-color: #3b4b60; }
        [data-coreui-theme="dark"] .modal-content { background-color: #1e293b; border: 1px solid #4b5563; color: #e5e7eb; }
        [data-coreui-theme="dark"] .modal-body .form-control, [data-coreui-theme="dark"] .modal-body .form-select, [data-coreui-theme="dark"] .modal-body .input-group-text { background-color: #374151; border-color: #4b5563; color: #fff; }
        [data-coreui-theme="dark"] .bg-box-adaptive { background-color: #2a303d !important; border-color: #4b5563 !important; }
        [data-coreui-theme="dark"] .modal-footer-adaptive { background-color: #1e293b !important; border-top-color: #4b5563 !important; }
        [data-coreui-theme="dark"] .shake-animation .form-control { background-color: #4a2323 !important; border-color: #e55353 !important; }
        [data-coreui-theme="dark"] .page-link { background-color: #2a303d; border-color: #3b4b60; color: #fff; }
        [data-coreui-theme="dark"] .page-item.disabled .page-link { background-color: #1e293b; border-color: #3b4b60; color: #6b7280; }
        [data-coreui-theme="dark"] .page-item.active .page-link { background-color: #321fdb; border-color: #321fdb; }
      `}</style>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardHeader className="bg-transparent border-0 p-4">
              <CRow className="align-items-center justify-content-between">
                <CCol md={4} className="mb-3 mb-md-0">
                  <h3 className="m-0 fw-bold d-flex align-items-center gap-2">
                    <CIcon icon={cilPeople} className="text-primary" />
                    Gestión de Estudiantes
                  </h3>
                  <small className="text-muted">{filteredUsers.length} estudiantes {filterSemester !== 'all' ? `en ${filterSemester}` : 'registrados'}</small>
                </CCol>
                <CCol md={8} className="d-flex justify-content-md-end gap-2 flex-wrap">
                  <CInputGroup style={{ maxWidth: '180px' }}>
                    <CInputGroupText><CIcon icon={cilFilter} /></CInputGroupText>
                    <CFormSelect value={filterSemester} onChange={e => setFilterSemester(e.target.value)}>
                      <option value="all">Todos los semestres</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={`${num}° Semestre`}>{num}° Semestre</option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="search-bar-custom shadow-sm rounded" style={{ maxWidth: '250px' }}>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </CInputGroup>

                  <CButton color="success" className="text-white fw-bold shadow-sm" onClick={() => { setAddModalVisible(true); setErrors({}); }}>
                    <CIcon icon={cilPlus} className="me-2 fw-bold" /> Nuevo Estudiante
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>

            <CCardBody className="p-0">
              {loading ? <div className="text-center py-5"><CSpinner color="primary" /></div> : (
                <>
                  <div className="table-responsive">
                    <CTable hover align="middle" className="mb-0 border-top">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell className="ps-4 py-3">Estudiante</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Semestre</CTableHeaderCell>
                          <CTableHeaderCell>Info Académica</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Rendimiento</CTableHeaderCell>
                          <CTableHeaderCell className="text-end pe-4">Acciones</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {currentItems.map((item) => (
                          <CTableRow key={item.id}>
                            <CTableDataCell className="ps-4 py-3">
                              <div className="d-flex align-items-center">
                                <CAvatar src={item.foto} color="primary" textColor="white" size="md" className="me-3">
                                  {item.foto ? null : (item.nombre ? item.nombre.charAt(0).toUpperCase() : 'U')}
                                </CAvatar>
                                <div>
                                  <div className="fw-bold">{item.nombre} {item.apellido}</div>
                                  <div className="small text-muted">{item.email}</div>
                                  <div className="small text-primary fw-bold">{item.cedula}</div>
                                </div>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color="info" shape="rounded-pill" className="fw-bold">{item.semestre || 'N/A'}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="small"><strong>Carrera:</strong> {item.carrera || 'No asignada'}</div>
                              <div className="small text-muted"><strong>Usuario:</strong> {item.username}</div>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <div className="d-flex flex-column align-items-center">
                                <h5 className="mb-0 fw-bold text-warning"><CIcon icon={cilStar} className="me-1" /> {item.puntuacion || 0}</h5>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Puntos</small>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="text-end pe-4">
                              <div className="d-flex gap-2 justify-content-end">
                                <CButton color="info" variant="ghost" size="sm" onClick={() => openEditModal(item)}><CIcon icon={cilPencil} /></CButton>
                                <CButton color="danger" variant="ghost" size="sm" onClick={() => confirmDelete(item)}><CIcon icon={cilTrash} /></CButton>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <CTableRow>
                            <CTableDataCell colSpan="5" className="text-center py-5 text-muted">
                              No se encontraron estudiantes.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>

                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
                      <small className="text-muted">
                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} de {filteredUsers.length}
                      </small>
                      <CPagination aria-label="Navegación">
                        <CPaginationItem disabled={currentPage === 1} onClick={() => pageChange(currentPage - 1)}>«</CPaginationItem>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const page = i + 1
                          return (
                            <CPaginationItem key={page} active={page === currentPage} onClick={() => pageChange(page)}>
                              {page}
                            </CPaginationItem>
                          )
                        })}
                        <CPaginationItem disabled={currentPage === totalPages} onClick={() => pageChange(currentPage + 1)}>»</CPaginationItem>
                      </CPagination>
                    </div>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton className="modal-header-custom">
          <strong><CIcon icon={cilPlus} className="me-2" />Registrar Nuevo Estudiante</strong>
        </CModalHeader>
        <CModalBody className="p-4">
          <h6 className="text-muted text-uppercase fw-bold mb-3 small">Información Personal</h6>
          <CRow className="g-3">
            <CCol md={6} className={errors.nombre && shake ? 'shake-animation' : ''}>
              <CFormLabel>Nombre *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput name="nombre" value={newUser.nombre} onChange={handleAddChange} placeholder="Ej. Juan" invalid={!!errors.nombre} />
              </CInputGroup>
              {errors.nombre && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.nombre}</div>}
            </CCol>
            <CCol md={6} className={errors.apellido && shake ? 'shake-animation' : ''}>
              <CFormLabel>Apellido *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput name="apellido" value={newUser.apellido} onChange={handleAddChange} placeholder="Ej. Pérez" invalid={!!errors.apellido} />
              </CInputGroup>
              {errors.apellido && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.apellido}</div>}
            </CCol>

            <CCol md={6} className={errors.cedula && shake ? 'shake-animation' : ''}>
              <CFormLabel>Cédula * (Solo números)</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilCreditCard} /></CInputGroupText>
                <CFormInput name="cedula" value={newUser.cedula} onChange={handleAddChange} placeholder="12345678" maxLength={8} invalid={!!errors.cedula} />
              </CInputGroup>
              {errors.cedula && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.cedula}</div>}
            </CCol>
            <CCol md={6} className={errors.email && shake ? 'shake-animation' : ''}>
              <CFormLabel>Correo Electrónico *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilAt} /></CInputGroupText>
                <CFormInput name="email" value={newUser.email} onChange={handleAddChange} placeholder="correo@ejemplo.com" invalid={!!errors.email} />
              </CInputGroup>
              {errors.email && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.email}</div>}
            </CCol>
          </CRow>

          <h6 className="text-muted text-uppercase fw-bold mt-4 mb-3 small">Datos Académicos</h6>
          <CRow className="g-3">
            <CCol md={6} className={errors.semestre && shake ? 'shake-animation' : ''}>
              <CFormLabel>Semestre *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilBook} /></CInputGroupText>
                <CFormSelect name="semestre" value={newUser.semestre} onChange={handleAddChange} invalid={!!errors.semestre}>
                  <option value="">Seleccionar...</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (<option key={num} value={`${num}° Semestre`}>{num}° Semestre</option>))}
                </CFormSelect>
              </CInputGroup>
              {errors.semestre && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.semestre}</div>}
            </CCol>

            <CCol md={6} className={errors.carrera && shake ? 'shake-animation' : ''}>
              <CFormLabel>Carrera *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilBook} /></CInputGroupText>
                <CFormSelect name="carrera" value={newUser.carrera} onChange={handleAddChange} invalid={!!errors.carrera}>
                  <option value="">Seleccionar...</option>
                  <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                  <option value="Ingeniería Civil">Ingeniería Civil</option>
                  <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                  <option value="Licenciatura en Turismo">Licenciatura en Turismo</option>
                  <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                </CFormSelect>
              </CInputGroup>
              {errors.carrera && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.carrera}</div>}
            </CCol>
          </CRow>

          <div className="bg-box-adaptive p-3 rounded mt-4">
            <h6 className="text-primary fw-bold mb-3 d-flex align-items-center"><CIcon icon={cilLockLocked} className="me-2" />Credenciales</h6>
            <CRow className="g-3">
              <CCol md={6} className={errors.username && shake ? 'shake-animation' : ''}>
                <CFormLabel>Usuario *</CFormLabel>
                <CFormInput name="username" value={newUser.username} onChange={handleAddChange} placeholder="usuario123" invalid={!!errors.username} />
                {errors.username && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.username}</div>}
              </CCol>
              <CCol md={6} className={errors.password && shake ? 'shake-animation' : ''}>
                <CFormLabel>Contraseña *</CFormLabel>
                <CFormInput name="password" value={newUser.password} onChange={handleAddChange} placeholder="******" invalid={!!errors.password} />
                {errors.password && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.password}</div>}
              </CCol>
            </CRow>
          </div>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" variant="ghost" onClick={() => setAddModalVisible(false)}>Cancelar</CButton>
          <CButton color="success" className="text-white fw-bold px-4" onClick={saveNewUser}>
            <CIcon icon={cilSave} className="me-2" /> Guardar Estudiante
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={successModalVisible} alignment="center" className="border-0">
        <CModalBody className="text-center p-5">
          <div className="mb-4 success-icon-anim">
            <CIcon icon={cilCheckCircle} size="5xl" className="text-success" />
          </div>
          <h2 className="fw-bold text-success mb-2">{successMessage}</h2>
          <p className="text-muted">La operación se completó correctamente.</p>
        </CModalBody>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton className="modal-header-custom"><strong>Editar Estudiante</strong></CModalHeader>
        <CModalBody className="p-4">
          <CRow className="g-3">
            <CCol md={6}><CFormLabel>Nombre</CFormLabel><CFormInput name="nombre" value={userToEdit.nombre || ''} onChange={handleEditChange} /></CCol>
            <CCol md={6}><CFormLabel>Apellido</CFormLabel><CFormInput name="apellido" value={userToEdit.apellido || ''} onChange={handleEditChange} /></CCol>
            <CCol md={6}><CFormLabel>Cédula</CFormLabel><CFormInput name="cedula" value={userToEdit.cedula || ''} onChange={handleEditChange} /></CCol>
            <CCol md={6}><CFormLabel>Usuario</CFormLabel><CFormInput name="username" value={userToEdit.username || ''} onChange={handleEditChange} /></CCol>
            <CCol md={12}><CFormLabel>Correo</CFormLabel><CFormInput name="email" value={userToEdit.email || ''} onChange={handleEditChange} /></CCol>
            <CCol md={6}>
              <CFormLabel>Carrera</CFormLabel>
              <CFormSelect name="carrera" value={userToEdit.carrera || ''} onChange={handleEditChange}>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
                <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                <option value="Licenciatura en Turismo">Licenciatura en Turismo</option>
                <option value="Licenciatura en Administración">Licenciatura en Administración</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Semestre</CFormLabel>
              <CFormSelect name="semestre" value={userToEdit.semestre || ''} onChange={handleEditChange}>
                <option value="">Seleccionar...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (<option key={num} value={`${num}° Semestre`}>{num}° Semestre</option>))}
                <option value="Egresado">Egresado</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancelar</CButton>
          <CButton color="primary" onClick={saveEdit}>Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center" backdrop="static">
        <CModalHeader closeButton><strong className="text-danger">Eliminar Estudiante</strong></CModalHeader>
        <CModalBody className="text-center py-4">
          <CIcon icon={cilWarning} size="4xl" className="text-danger mb-3" />
          <p>¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.nombre}</strong>?</p>
          <p className="text-muted small">Se perderá todo el progreso y datos.</p>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancelar</CButton>
          <CButton color="danger" className="text-white" onClick={handleDelete}>Eliminar</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default AdminStudents
