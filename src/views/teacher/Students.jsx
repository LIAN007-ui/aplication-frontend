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
  cilLoopCircular
} from '@coreui/icons'

const Users = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCareer, setSelectedCareer] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const userRole = localStorage.getItem('userRole') || 'student'
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }
  const currentUser = getCurrentUser()
  
  const isTeacher = userRole === 'teacher'
  const getTeacherSemesterId = () => {
     if (!currentUser) return null;
     return currentUser.assignedSemester || currentUser.assigned_semester_id;
  }
  const teacherSemId = isTeacher ? getTeacherSemesterId() : null;
  
  const teacherSemester = teacherSemId ? `${teacherSemId}° Semestre` : ''
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [resetModalVisible, setResetModalVisible] = useState(false)
  const [resetSuccessVisible, setResetSuccessVisible] = useState(false)
  const [studentToReset, setStudentToReset] = useState(null)

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
    semestre: teacherSemester || '', 
    role: 'student', 
    puntuacion: 0,
    foto: null
  })

  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(false) 

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/all')
      setUsers(response.data.reverse()) 
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
    setCurrentPage(1) 
  }

  const filteredUsers = users.filter(user => {
    if (user.role === 'teacher' || user.role === 'admin') return false
    
    // Teacher Constraint
    if (isTeacher) {
        let matches = false;
        const teacherId = currentUser?.assignedSemester || currentUser?.assigned_semester_id;
        
        // Strict ID check
        if (teacherId && user.semestre_id) {
            if (user.semestre_id == teacherId) matches = true;
        }

        // Fallback string check
        if (!matches && teacherSemester) { 
            const normalize = (str) => String(str).toLowerCase().trim();
            const mapToNum = (s) => {
                if (!s) return 0;
                const str = normalize(s);
                if(str.includes('1') || str.includes('primer')) return 1;
                if(str.includes('2') || str.includes('segundo')) return 2;
                if(str.includes('3') || str.includes('tercer')) return 3;
                if(str.includes('4') || str.includes('cuarto')) return 4;
                if(str.includes('5') || str.includes('quinto')) return 5;
                if(str.includes('6') || str.includes('sexto')) return 6;
                if(str.includes('7') || str.includes('septimo') || str.includes('séptimo')) return 7;
                if(str.includes('8') || str.includes('octavo')) return 8;
                return 0; 
            }
            if (mapToNum(user.semestre) === mapToNum(teacherSemester)) matches = true;
        }
        
        // If teacher constraint is active but student doesn't match semester, hide them.
        if (!matches) return false;
    }

    // Career Filter
    if (selectedCareer && user.carrera !== selectedCareer) return false
    
    // Text Search Filter
    const term = searchTerm.toLowerCase()
    return (
      (user.nombre && user.nombre.toLowerCase().includes(term)) ||
      (user.apellido && user.apellido.toLowerCase().includes(term)) ||
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.cedula && user.cedula.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term))
    )
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const pageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getSmartPagination = () => {
      const maxButtons = 3;
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) startPage = Math.max(1, endPage - maxButtons + 1);
      const pages = [];
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      return pages;
  }
  const paginationGroup = getSmartPagination();

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
      setSuccessModalVisible(true)

      setNewUser({
        nombre: '', apellido: '', cedula: '', username: '', email: '', password: '', carrera: '', 
        semestre: teacherSemester || '', 
        role: 'student', puntuacion: 0, foto: null
      })
      setErrors({})

      setTimeout(() => { setSuccessModalVisible(false) }, 2500)

    } catch (error) {
       alert(error.response?.data?.error || "Error al crear usuario")
    }
  }

  const openEditModal = (user) => { 
    if (isTeacher && teacherSemester) {
      setUserToEdit({ ...user, semestre: teacherSemester })
    } else {
      setUserToEdit(user)
    }
    setEditModalVisible(true) 
  }
  const handleEditChange = (e) => { const { name, value } = e.target; setUserToEdit({ ...userToEdit, [name]: value }) }
  const saveEdit = async () => {
    try {
      const payload = {
        first_name: userToEdit.nombre,
        last_name: userToEdit.apellido,
        cedula: userToEdit.cedula,
        username: userToEdit.username,
        email: userToEdit.email,
        career: userToEdit.carrera,
        current_semester_id: parseInt(userToEdit.semestre) || 1 
      }

      await api.put(`/users/${userToEdit.id}`, payload)
      
      setEditModalVisible(false)
      fetchUsers() 
      setSuccessModalVisible(true)
      setTimeout(() => setSuccessModalVisible(false), 2000)

    } catch (error) { 
      console.error(error)
      alert("Error al guardar cambios: " + (error.response?.data?.error || "Error desconocido")) 
    }
  }
  const confirmDelete = (user) => { setUserToDelete(user); setDeleteModalVisible(true) }
  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await api.delete(`/users/${userToDelete.id}`)
        setUsers(users.filter(u => u.id !== userToDelete.id))
        setDeleteModalVisible(false)
        setUserToDelete(null)
      } catch (error) { alert('Error al eliminar') }
    }
  }

  const openResetModal = (student) => {
    setStudentToReset(student)
    setResetModalVisible(true)
  }

  const handleResetAttempts = async () => {
    if (!studentToReset) return
    try {
      const semId = teacherSemId || studentToReset.semestre_id
      await api.post('/quiz-attempts/reset', { user_id: studentToReset.id, semester_id: semId })
      setResetModalVisible(false)
      setStudentToReset(null)
      setResetSuccessVisible(true)
      setTimeout(() => setResetSuccessVisible(false), 2500)
    } catch (error) {
      alert('Error al resetear intentos: ' + (error.response?.data?.error || 'Error desconocido'))
    }
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

        .semester-fixed-input {
          background-color: #e9ecef !important;
          color: #495057 !important;
          cursor: not-allowed !important;
          border: 1px solid #ced4da !important;
          font-weight: 600 !important;
        }
        [data-coreui-theme="dark"] .semester-fixed-input {
          background-color: #4b5563 !important;
          color: #f3f4f6 !important;
          border-color: #6b7280 !important;
        }
      `}</style>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardHeader className="bg-transparent border-0 p-4">
              <CRow className="align-items-center justify-content-between">
                <CCol md={5} className="mb-3 mb-md-0">
                  <h3 className="m-0 fw-bold d-flex align-items-center gap-2">
                    <CIcon icon={cilPeople} className="text-primary"/> 
                    Gestión de Estudiantes
                  </h3>
                  <small className="text-muted">{filteredUsers.length} estudiantes registrados</small>
                </CCol>
                <CCol md={7} className="d-flex justify-content-md-end gap-3 flex-column flex-md-row">
                  
                  <CInputGroup className="search-bar-custom shadow-sm rounded" style={{maxWidth: '250px'}}>
                      <CInputGroupText><CIcon icon={cilBook} /></CInputGroupText>
                      <CFormSelect value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}>
                        <option value="">Todas las carreras</option>
                        <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                        <option value="Ingeniería Civil">Ingeniería Civil</option>
                        <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                        <option value="Licenciatura en Turismo">Licenciatura en Turismo</option>
                        <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                      </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="search-bar-custom shadow-sm rounded" style={{maxWidth: '300px'}}>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput 
                        placeholder="Buscar por nombre o cédula..." 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                  </CInputGroup>

                  <CButton color="success" className="text-white fw-bold shadow-sm" onClick={() => { setAddModalVisible(true); setErrors({}); }}>
                    <CIcon icon={cilPlus} className="me-2 fw-bold"/> Nuevo Estudiante
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody className="p-0">
              {loading ? <div className="text-center py-5"><CSpinner color="primary"/></div> : (
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
                            <CBadge color="info" variant="outline" shape="rounded-pill" className="fw-bold">{item.semestre || 'N/A'}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="small"><strong>Carrera:</strong> {item.carrera || 'No asignada'}</div>
                            <div className="small text-muted"><strong>Usuario:</strong> {item.username}</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                             {item.role !== 'admin' && (
                                <div className="d-flex flex-column align-items-center">
                                    <h5 className="mb-0 fw-bold text-warning"><CIcon icon={cilStar} className="me-1"/> {item.puntuacion || 0}</h5>
                                    <small className="text-muted" style={{fontSize: '0.7rem'}}>Puntos</small>
                                </div>
                             )}
                          </CTableDataCell>
                          <CTableDataCell className="text-end pe-4">
                            <div className="d-flex gap-2 justify-content-end">
                                <CButton color="warning" variant="ghost" size="sm" title="Dar otra oportunidad en el Quiz" onClick={() => openResetModal(item)}><CIcon icon={cilLoopCircular} /></CButton>
                                <CButton color="info" variant="ghost" size="sm" onClick={() => openEditModal(item)}><CIcon icon={cilPencil} /></CButton>
                                <CButton color="danger" variant="ghost" size="sm" onClick={() => confirmDelete(item)}><CIcon icon={cilTrash} /></CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              )}
              
              {!loading && filteredUsers.length > 10 && (
                  <div className="d-flex justify-content-center py-4 border-top">
                      <CPagination aria-label="Navegación">
                          <CPaginationItem disabled={currentPage === 1} onClick={() => pageChange(currentPage - 1)} style={{cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}><span>&laquo;</span></CPaginationItem>
                          {paginationGroup.map((item) => (
                              <CPaginationItem key={item} active={item === currentPage} onClick={() => pageChange(item)} style={{cursor: 'pointer'}}>{item}</CPaginationItem>
                          ))}
                          <CPaginationItem disabled={currentPage === totalPages} onClick={() => pageChange(currentPage + 1)} style={{cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}><span>&raquo;</span></CPaginationItem>
                      </CPagination>
                  </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton className="modal-header-custom">
            <strong><CIcon icon={cilPlus} className="me-2"/>Registrar Nuevo Estudiante</strong>
        </CModalHeader>
        <CModalBody className="p-4">
            
            <h6 className="text-muted text-uppercase fw-bold mb-3 small">Información Personal</h6>
            <CRow className="g-3">
                <CCol md={6} className={errors.nombre && shake ? 'shake-animation' : ''}>
                    <CFormLabel>Nombre *</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                        <CFormInput name="nombre" value={newUser.nombre} onChange={handleAddChange} placeholder="Ej. Juan" invalid={!!errors.nombre}/>
                    </CInputGroup>
                    {errors.nombre && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.nombre}</div>}
                </CCol>
                <CCol md={6} className={errors.apellido && shake ? 'shake-animation' : ''}>
                    <CFormLabel>Apellido *</CFormLabel>
                    <CInputGroup>
                         <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                         <CFormInput name="apellido" value={newUser.apellido} onChange={handleAddChange} placeholder="Ej. Pérez" invalid={!!errors.apellido}/>
                    </CInputGroup>
                    {errors.apellido && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.apellido}</div>}
                </CCol>
                
                <CCol md={6} className={errors.cedula && shake ? 'shake-animation' : ''}>
                    <CFormLabel>Cédula * (Solo números)</CFormLabel>
                    <CInputGroup>
                         <CInputGroupText><CIcon icon={cilCreditCard} /></CInputGroupText>
                         <CFormInput name="cedula" value={newUser.cedula} onChange={handleAddChange} placeholder="12345678" maxLength={8} invalid={!!errors.cedula}/>
                    </CInputGroup>
                    {errors.cedula && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.cedula}</div>}
                </CCol>
                <CCol md={6} className={errors.email && shake ? 'shake-animation' : ''}>
                    <CFormLabel>Correo Electrónico *</CFormLabel>
                    <CInputGroup>
                         <CInputGroupText><CIcon icon={cilAt} /></CInputGroupText>
                         <CFormInput name="email" value={newUser.email} onChange={handleAddChange} placeholder="correo@ejemplo.com" invalid={!!errors.email}/>
                    </CInputGroup>
                    {errors.email && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.email}</div>}
                </CCol>
            </CRow>

            <h6 className="text-muted text-uppercase fw-bold mt-4 mb-3 small">Datos Académicos</h6>
            <CRow className="g-3">
                <CCol md={6} className={errors.semestre && shake ? 'shake-animation' : ''}>
                    <CFormLabel>
                      Semestre *
                      {isTeacher && <CBadge color="info" className="ms-2">Fijado a tu semestre</CBadge>}
                    </CFormLabel>
                    <CInputGroup>
                         <CInputGroupText><CIcon icon={cilBook} /></CInputGroupText>
                         {isTeacher && (currentUser?.assignedSemester || currentUser?.assigned_semester_id) ? (
                           (() => {
                             const rawSemester = currentUser?.assignedSemester || currentUser?.assigned_semester_id;
                             let displaySemester = null;
                             if (rawSemester) {
                               const val = rawSemester;
                               if (!isNaN(val)) {
                                 displaySemester = `${val}° Semestre`;
                               } else {
                                 displaySemester = val;
                               }
                             }
                             return (
                               <CFormInput 
                                 value={displaySemester} 
                                 readOnly 
                                 disabled
                                 className="semester-fixed-input"
                               />
                             );
                           })()
                         ) : (
                           <CFormSelect name="semestre" value={newUser.semestre} onChange={handleAddChange} invalid={!!errors.semestre}>
                               <option value="">Seleccionar...</option>
                               {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (<option key={num} value={`${num}° Semestre`}>{num}° Semestre</option>))}
                           </CFormSelect>
                         )}
                    </CInputGroup>
                    {errors.semestre && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.semestre}</div>}
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
                    {errors.carrera && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.carrera}</div>}
                </CCol>
            </CRow>

            <div className="bg-box-adaptive p-3 rounded mt-4">
                <h6 className="text-primary fw-bold mb-3 d-flex align-items-center"><CIcon icon={cilLockLocked} className="me-2"/>Credenciales</h6>
                <CRow className="g-3">
                    <CCol md={6} className={errors.username && shake ? 'shake-animation' : ''}>
                        <CFormLabel>Usuario *</CFormLabel>
                        <CFormInput name="username" value={newUser.username} onChange={handleAddChange} placeholder="usuario123" invalid={!!errors.username}/>
                        {errors.username && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.username}</div>}
                    </CCol>
                    <CCol md={6} className={errors.password && shake ? 'shake-animation' : ''}>
                        <CFormLabel>Contraseña *</CFormLabel>
                        <CFormInput name="password" value={newUser.password} onChange={handleAddChange} placeholder="******" invalid={!!errors.password}/>
                        {errors.password && <div className="error-msg"><CIcon icon={cilXCircle} size="sm" className="me-1"/>{errors.password}</div>}
                    </CCol>
                </CRow>
            </div>

        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
            <CButton color="secondary" variant="ghost" onClick={() => setAddModalVisible(false)}>Cancelar</CButton>
            <CButton color="success" className="text-white fw-bold px-4" onClick={saveNewUser}>
                <CIcon icon={cilSave} className="me-2"/> Guardar Estudiante
            </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={successModalVisible} alignment="center" className="border-0">
         <CModalBody className="text-center p-5">
            <div className="mb-4 success-icon-anim">
                <CIcon icon={cilCheckCircle} size="5xl" className="text-success"/>
            </div>
            <h2 className="fw-bold text-success mb-2">¡Registro Exitoso!</h2>
            <p className="text-muted">El estudiante ha sido creado correctamente en la base de datos.</p>
         </CModalBody>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton><strong>Editar Estudiante</strong></CModalHeader>
        <CModalBody>
            <CRow className="g-3">
                <CCol md={6}><CFormLabel>Nombre</CFormLabel><CFormInput name="nombre" value={userToEdit.nombre} onChange={handleEditChange} /></CCol>
                <CCol md={6}><CFormLabel>Apellido</CFormLabel><CFormInput name="apellido" value={userToEdit.apellido} onChange={handleEditChange} /></CCol>
                <CCol md={6}><CFormLabel>Cédula</CFormLabel><CFormInput name="cedula" value={userToEdit.cedula} onChange={handleEditChange} /></CCol>
                <CCol md={6}><CFormLabel>Usuario</CFormLabel><CFormInput name="username" value={userToEdit.username} onChange={handleEditChange} /></CCol>
                <CCol md={12}><CFormLabel>Correo</CFormLabel><CFormInput name="email" value={userToEdit.email} onChange={handleEditChange} /></CCol>
                <CCol md={6}>
                    <CFormLabel>
                      Carrera
                      {isTeacher && <CBadge color="info" className="ms-2">Fijado</CBadge>}
                    </CFormLabel>
                    {isTeacher ? (
                        <CFormInput 
                          value={userToEdit.carrera} 
                          readOnly 
                          disabled
                          className="semester-fixed-input"
                        />
                    ) : (
                      <CFormSelect name="carrera" value={userToEdit.carrera} onChange={handleEditChange}>
                          <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                          <option value="Ingeniería Civil">Ingeniería Civil</option>
                          <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                          <option value="Licenciatura en Turismo">Licenciatura en Turismo</option>
                          <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                      </CFormSelect>
                    )}
                </CCol>
                <CCol md={6}>
                    <CFormLabel>
                      Semestre
                      {isTeacher && <CBadge color="info" className="ms-2">Fijado</CBadge>}
                    </CFormLabel>
                    {isTeacher && teacherSemester ? (
                      <CFormInput 
                        value={teacherSemester} 
                        readOnly 
                        disabled
                        className="semester-fixed-input"
                      />
                    ) : (
                      <CFormSelect name="semestre" value={userToEdit.semestre} onChange={handleEditChange}>
                          <option value="">Seleccionar...</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (<option key={num} value={`${num}° Semestre`}>{num}° Semestre</option>))}
                          <option value="Egresado">Egresado</option>
                      </CFormSelect>
                    )}
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
            <CIcon icon={cilWarning} size="4xl" className="text-danger mb-3"/>
            <p>¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.nombre}</strong>?</p>
            <p className="text-muted small">Se perderá todo el progreso y datos.</p>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
            <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancelar</CButton>
            <CButton color="danger" className="text-white" onClick={handleDelete}>Eliminar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={resetModalVisible} onClose={() => setResetModalVisible(false)} alignment="center" backdrop="static">
        <CModalHeader closeButton>
          <strong className="text-warning">🔄 Dar Otra Oportunidad</strong>
        </CModalHeader>
        <CModalBody className="text-center py-4">
          <div style={{ fontSize: '3rem' }} className="mb-3">❤️</div>
          <p>¿Otorgar otra oportunidad a <strong>{studentToReset?.nombre} {studentToReset?.apellido}</strong> para intentar el quiz nuevamente?</p>
          <p className="text-muted small">Sus intentos serán reseteados a 0.</p>
        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
          <CButton color="secondary" onClick={() => setResetModalVisible(false)}>Cancelar</CButton>
          <CButton color="warning" className="text-white fw-bold" onClick={handleResetAttempts}>
            <CIcon icon={cilLoopCircular} className="me-2" />Dar Oportunidad
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={resetSuccessVisible} alignment="center" className="border-0">
        <CModalBody className="text-center p-5">
          <div className="mb-4 success-icon-anim" style={{ fontSize: '4rem' }}>❤️</div>
          <h2 className="fw-bold text-warning mb-2">¡Oportunidad Otorgada!</h2>
          <p className="text-muted">El estudiante puede intentar el quiz nuevamente.</p>
        </CModalBody>
      </CModal>
      
    </CContainer>
  )
}

export default Users