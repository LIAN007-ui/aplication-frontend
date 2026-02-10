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
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilEducation,
  cilSearch,
  cilTrash,
  cilWarning,
  cilPencil,
  cilPlus,
  cilSave,
  cilUser,
  cilAt,
  cilBook,
  cilLockLocked,
  cilXCircle,
  cilCheckCircle
} from '@coreui/icons'

const AdminTeachers = () => {


  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [teacherToDelete, setTeacherToDelete] = useState(null)
  const [teacherToEdit, setTeacherToEdit] = useState({})

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    assignedSemester: '1',
    role: 'teacher',
    photo: ''
  })

  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users/all')
      const teachersList = response.data.filter(u => u.role === 'teacher').map(t => ({
        ...t,
        name: t.nombre || t.full_name || t.username || 'Sin nombre'
      }))
      setTeachers(teachersList)
    } catch (error) {
      console.error('Error cargando docentes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter(t => {
    const term = searchTerm.toLowerCase()
    return (
      (t.name && t.name.toLowerCase().includes(term)) ||
      (t.username && t.username.toLowerCase().includes(term)) ||
      (t.email && t.email.toLowerCase().includes(term))
    )
  })

  const validateForm = () => {
    let newErrors = {}
    let isValid = true

    const textOnlyRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/

    if (!newTeacher.name.trim()) { newErrors.name = "Nombre obligatorio"; isValid = false }
    else if (!textOnlyRegex.test(newTeacher.name)) { newErrors.name = "Solo se permiten letras"; isValid = false }

    if (!newTeacher.username) { newErrors.username = "Usuario requerido"; isValid = false }
    else if (teachers.some(t => t.username === newTeacher.username)) { newErrors.username = "Usuario ya existe"; isValid = false }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (newTeacher.email && !emailRegex.test(newTeacher.email)) { newErrors.email = "Formato inválido"; isValid = false }
    else if (newTeacher.email && teachers.some(t => t.email === newTeacher.email)) { newErrors.email = "Correo ya registrado"; isValid = false }

    if (!newTeacher.password) { newErrors.password = "Contraseña requerida"; isValid = false }
    if (!newTeacher.assignedSemester) { newErrors.assignedSemester = "Selecciona semestre"; isValid = false }

    setErrors(newErrors)
    return isValid
  }

  const handleAddChange = (e) => {
    const { name, value } = e.target
    if (name === 'name' && !/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) return;
    setNewTeacher({ ...newTeacher, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
    setFormError('')
  }

  const saveNewTeacher = async () => {
    if (!validateForm()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    try {
      const teacherToCreate = {
        username: newTeacher.username,
        email: newTeacher.email,
        password: newTeacher.password,
        role: 'teacher',
        full_name: newTeacher.name, 
        assigned_semester_id: parseInt(newTeacher.assignedSemester) 
      }

      await api.post('/auth/register', teacherToCreate)
      fetchTeachers()

      setAddModalVisible(false)
      setSuccessMessage('¡Docente creado exitosamente!')
      setSuccessModalVisible(true)

      setNewTeacher({
        name: '', username: '', email: '', password: '', assignedSemester: '1', role: 'teacher', photo: ''
      })
      setErrors({})

      setTimeout(() => { setSuccessModalVisible(false) }, 2500)

    } catch (error) {
      setFormError(error.response?.data?.error || "Error al registrar docente")
    }
  }

  const openEditModal = (teacher) => {
    setTeacherToEdit({ ...teacher })
    setEditModalVisible(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setTeacherToEdit({ ...teacherToEdit, [name]: value })
  }

  const saveEdit = async () => {
    try {
      setEditModalVisible(false)
      alert("La edición estará disponible pronto.")
    } catch (error) { alert("Error al guardar") }
  }

  const confirmDelete = (teacher) => {
    setTeacherToDelete(teacher)
    setDeleteModalVisible(true)
  }

  const handleDelete = async () => {
    if (teacherToDelete) {
      try {
        await api.delete(`/users/${teacherToDelete.id}`)
        setTeachers(teachers.filter(t => t.id !== teacherToDelete.id))
        setDeleteModalVisible(false)
        setTeacherToDelete(null)
      } catch (error) { alert('Error al eliminar') }
    }
  }

  const getSemesterColor = (sem) => {
    const colors = ['primary', 'success', 'info', 'warning', 'danger', 'dark', 'secondary', 'light']
    return colors[(parseInt(sem) - 1) % colors.length] || 'info'
  }

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
        .modal-footer-adaptive { background-color: #f8f9fa; border-top: 1px solid #dee2e6; }
        .modal-header-custom { background: linear-gradient(90deg, #1f2937 0%, #374151 100%); color: white; border-bottom: none; }
        .modal-header-custom .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }
        .bg-box-adaptive { background-color: #f8f9fa; border: 1px solid #dee2e6; }

        [data-coreui-theme="dark"] .search-bar-custom .input-group-text { background-color: #2a303d; border-color: #3b4b60; color: #e5e7eb; }
        [data-coreui-theme="dark"] .search-bar-custom .form-control { background-color: #2a303d; border-color: #3b4b60; color: #fff; }
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        [data-coreui-theme="dark"] .table thead th { background-color: transparent !important; color: #e5e7eb !important; border-bottom-color: #3b4b60; }
        [data-coreui-theme="dark"] .modal-content { background-color: #1e293b; border: 1px solid #4b5563; color: #e5e7eb; }
        [data-coreui-theme="dark"] .modal-body .form-control, [data-coreui-theme="dark"] .modal-body .form-select, [data-coreui-theme="dark"] .modal-body .input-group-text { background-color: #374151; border-color: #4b5563; color: #fff; }
        [data-coreui-theme="dark"] .bg-box-adaptive { background-color: #2a303d !important; border-color: #4b5563 !important; }
        [data-coreui-theme="dark"] .modal-footer-adaptive { background-color: #1e293b !important; border-top-color: #4b5563 !important; }
        [data-coreui-theme="dark"] .shake-animation .form-control { background-color: #4a2323 !important; border-color: #e55353 !important; }
      `}</style>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardHeader className="bg-transparent border-0 p-4">
              <CRow className="align-items-center justify-content-between">
                <CCol md={5} className="mb-3 mb-md-0">
                  <h3 className="m-0 fw-bold d-flex align-items-center gap-2">
                    <CIcon icon={cilEducation} className="text-info" />
                    Gestión de Docentes
                  </h3>
                  <small className="text-muted">{teachers.length} docentes registrados</small>
                </CCol>
                <CCol md={7} className="d-flex justify-content-md-end gap-2">
                  <CInputGroup className="search-bar-custom shadow-sm rounded" style={{ maxWidth: '280px' }}>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput
                      placeholder="Buscar docente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                  <CButton color="info" className="text-white fw-bold shadow-sm" onClick={() => { setAddModalVisible(true); setErrors({}); setFormError(''); }}>
                    <CIcon icon={cilPlus} className="me-2 fw-bold" /> Nuevo Docente
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>

            <CCardBody className="p-0">
              {loading ? <div className="text-center py-5"><CSpinner color="info" /></div> : (
                <div className="table-responsive">
                  <CTable hover align="middle" className="mb-0 border-top">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="ps-4 py-3">Docente</CTableHeaderCell>
                        <CTableHeaderCell>Usuario</CTableHeaderCell>
                        <CTableHeaderCell>Correo</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Semestre Asignado</CTableHeaderCell>
                        <CTableHeaderCell className="text-end pe-4">Acciones</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredTeachers.map((teacher) => (
                        <CTableRow key={teacher.id}>
                          <CTableDataCell className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <div className="me-3 d-flex align-items-center justify-content-center rounded-circle shadow-sm" style={{
                                width: '42px', height: '42px', flexShrink: 0,
                                background: `linear-gradient(135deg, ${['#3b82f6','#10b981','#06b6d4','#f59e0b','#ef4444','#8b5cf6','#6b7280','#ec4899'][((teacher.semestre_id || 1) - 1) % 8]}, ${['#2563eb','#059669','#0891b2','#d97706','#dc2626','#7c3aed','#4b5563','#db2777'][((teacher.semestre_id || 1) - 1) % 8]})`,
                                color: 'white', fontWeight: '800', fontSize: '1.1rem'
                              }}>
                                {teacher.semestre_id || '?'}
                              </div>
                              <div className="fw-bold">{teacher.name}</div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span className="fw-semibold">{teacher.username}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span className="text-muted">{teacher.email || '-'}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge 
                              color={getSemesterColor(teacher.semestre_id)} 
                              shape="rounded-pill" 
                              className="px-3 py-2 fs-6"
                            >
                              {teacher.semestre || `Semestre ${teacher.semestre_id}`}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-end pe-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <CButton color="info" variant="ghost" size="sm" onClick={() => openEditModal(teacher)}>
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton color="danger" variant="ghost" size="sm" onClick={() => confirmDelete(teacher)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                      {filteredTeachers.length === 0 && (
                        <CTableRow>
                          <CTableDataCell colSpan="5" className="text-center py-5 text-muted">
                            No se encontraron docentes.
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton className="modal-header-custom">
          <strong><CIcon icon={cilPlus} className="me-2" />Registrar Nuevo Docente</strong>
        </CModalHeader>
        <CModalBody className="p-4">
          {formError && <CAlert color="danger" dismissible onClose={() => setFormError('')}>{formError}</CAlert>}

          <h6 className="text-muted text-uppercase fw-bold mb-3 small">Información Personal</h6>
          <CRow className="g-3">
            <CCol md={12} className={errors.name && shake ? 'shake-animation' : ''}>
              <CFormLabel>Nombre Completo *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput name="name" value={newTeacher.name} onChange={handleAddChange} placeholder="Ej. María García" invalid={!!errors.name} />
              </CInputGroup>
              {errors.name && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.name}</div>}
            </CCol>

            <CCol md={6} className={errors.email && shake ? 'shake-animation' : ''}>
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilAt} /></CInputGroupText>
                <CFormInput name="email" value={newTeacher.email} onChange={handleAddChange} placeholder="correo@ejemplo.com" invalid={!!errors.email} />
              </CInputGroup>
              {errors.email && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.email}</div>}
            </CCol>

            <CCol md={6} className={errors.assignedSemester && shake ? 'shake-animation' : ''}>
              <CFormLabel>Semestre a Cargo *</CFormLabel>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilBook} /></CInputGroupText>
                <CFormSelect name="assignedSemester" value={newTeacher.assignedSemester} onChange={handleAddChange} invalid={!!errors.assignedSemester}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (<option key={num} value={num}>Semestre {num}</option>))}
                </CFormSelect>
              </CInputGroup>
              {errors.assignedSemester && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.assignedSemester}</div>}
            </CCol>
          </CRow>

          <div className="bg-box-adaptive p-3 rounded mt-4">
            <h6 className="text-info fw-bold mb-3 d-flex align-items-center"><CIcon icon={cilLockLocked} className="me-2" />Credenciales de Acceso</h6>
            <CRow className="g-3">
              <CCol md={6} className={errors.username && shake ? 'shake-animation' : ''}>
                <CFormLabel>Usuario *</CFormLabel>
                <CFormInput name="username" value={newTeacher.username} onChange={handleAddChange} placeholder="docente_maria" invalid={!!errors.username} />
                {errors.username && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.username}</div>}
              </CCol>
              <CCol md={6} className={errors.password && shake ? 'shake-animation' : ''}>
                <CFormLabel>Contraseña *</CFormLabel>
                <CFormInput type="password" name="password" value={newTeacher.password} onChange={handleAddChange} placeholder="******" invalid={!!errors.password} />
                {errors.password && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1" />{errors.password}</div>}
              </CCol>
            </CRow>
          </div>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" variant="ghost" onClick={() => setAddModalVisible(false)}>Cancelar</CButton>
          <CButton color="info" className="text-white fw-bold px-4" onClick={saveNewTeacher}>
            <CIcon icon={cilSave} className="me-2" /> Crear Docente
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={successModalVisible} alignment="center" className="border-0">
        <CModalBody className="text-center p-5">
          <div className="mb-4 success-icon-anim">
            <CIcon icon={cilCheckCircle} size="5xl" className="text-success" />
          </div>
          <h2 className="fw-bold text-success mb-2">¡Operación Exitosa!</h2>
          <p className="text-muted">{successMessage}</p>
        </CModalBody>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton className="modal-header-custom"><strong>Editar Docente</strong></CModalHeader>
        <CModalBody className="p-4">
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>Nombre Completo</CFormLabel>
              <CFormInput name="name" value={teacherToEdit.name || ''} onChange={handleEditChange} />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Usuario</CFormLabel>
              <CFormInput name="username" value={teacherToEdit.username || ''} onChange={handleEditChange} />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Correo</CFormLabel>
              <CFormInput name="email" value={teacherToEdit.email || ''} onChange={handleEditChange} />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Contraseña</CFormLabel>
              <CFormInput type="password" name="password" value={teacherToEdit.password || ''} onChange={handleEditChange} placeholder="Dejar vacío para no cambiar" />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Semestre Asignado</CFormLabel>
              <CFormSelect name="assignedSemester" value={teacherToEdit.assignedSemester || '1'} onChange={handleEditChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (<option key={num} value={num}>Semestre {num}</option>))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancelar</CButton>
          <CButton color="info" onClick={saveEdit}>Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center" backdrop="static">
        <CModalHeader closeButton><strong className="text-danger">Eliminar Docente</strong></CModalHeader>
        <CModalBody className="text-center py-4">
          <CIcon icon={cilWarning} size="4xl" className="text-danger mb-3" />
          <p>¿Estás seguro de que deseas eliminar al docente <strong>{teacherToDelete?.name}</strong>?</p>
          <p className="text-muted small">Se eliminarán sus credenciales de acceso.</p>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancelar</CButton>
          <CButton color="danger" className="text-white" onClick={handleDelete}>Eliminar</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default AdminTeachers
