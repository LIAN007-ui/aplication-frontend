import React, { useState, useEffect } from 'react'
import api from '../../api'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell,
  CButton, CFormInput, CFormSelect, CInputGroup, CInputGroupText, CModal, CModalHeader, CModalBody, CModalFooter, CSpinner, CContainer, CFormLabel, CBadge,
  CAvatar, CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilList, 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilSave, 
  cilCheckCircle, 
  cilSearch, 
  cilWarning, 
  cilPuzzle, 
  cilText
} from '@coreui/icons'

const Preguntas = () => {
  
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [teacherProfile, setTeacherProfile] = useState(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [currentQ, setCurrentQ] = useState({
    id: '', question: '', option1: '', option2: '', option3: '', option4: '', answer: '' 
  })
  const [qToDelete, setQToDelete] = useState(null)
  
  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(false)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      
      const profileRes = await api.get('/users/profile')
      const profile = profileRes.data
      console.log("Perfil Docente Cargado:", profile)
      setTeacherProfile(profile)
      
      const semesterId = profile.assigned_semester_id || profile.assignedSemester
      console.log("ID Semestre detectado:", semesterId)

      if (semesterId) {
        const response = await api.get(`/questions/semester/${semesterId}`)
        
        const mappedQuestions = response.data.map(q => ({
            id: q.id,
            question: q.question_text, 
            answer: q.correct_answer,
            options: q.options || [], 
        }))
        
        setQuestions(mappedQuestions.reverse())
      }
    } catch (error) { 
        console.error(error) 
    } finally { 
        setLoading(false) 
    }
  }

  useEffect(() => { fetchQuestions() }, [])

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => { setCurrentPage(1) }, [searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentQ({ ...currentQ, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
  }

  const validateForm = () => {
    let newErrors = {}
    let isValid = true
    if (!currentQ.question.trim()) { newErrors.question = true; isValid = false }
    if (!currentQ.option1.trim()) { newErrors.option1 = true; isValid = false }
    if (!currentQ.option2.trim()) { newErrors.option2 = true; isValid = false }
    if (!currentQ.option3.trim()) { newErrors.option3 = true; isValid = false }
    if (!currentQ.option4.trim()) { newErrors.option4 = true; isValid = false }
    if (!currentQ.answer.trim()) { newErrors.answer = true; isValid = false }
    setErrors(newErrors)
    return isValid
  }

  const handleSave = async () => {
    if (!validateForm()) {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        return
    }
    
    const payload = {
        question_text: currentQ.question, 
        options: [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4], 
        correct_answer: currentQ.answer,
        semester_id: teacherProfile?.assigned_semester_id || teacherProfile?.assignedSemester 
    }

    try {
        if (isEditing) {
            alert("La edición estará disponible en la próxima actualización del servidor.")
            return;
        } else {
            await api.post('/questions', payload)
        }
        
        setModalVisible(false)
        setSuccessModalVisible(true)
        fetchQuestions() 
        
        setTimeout(() => {
            setSuccessModalVisible(false)
            resetForm()
        }, 2000)

    } catch (error) { 
        console.error(error)
        alert("Error al guardar") 
    }
  }

  const handleDelete = async () => {
    if (qToDelete) {
        try {
            await api.delete(`/questions/${qToDelete.id}`)
            setQuestions(questions.filter(q => q.id !== qToDelete.id))
            setDeleteModalVisible(false)
        } catch (error) { alert("Error al eliminar") }
    }
  }

  const openModal = (question = null) => {
    setErrors({})
    if (question) {
        setIsEditing(true)
        setCurrentQ({
            id: question.id,
            question: question.question,
            option1: question.options[0] || '',
            option2: question.options[1] || '',
            option3: question.options[2] || '',
            option4: question.options[3] || '',
            answer: question.answer
        })
    } else {
        resetForm()
        setIsEditing(false)
    }
    setModalVisible(true)
  }

  const resetForm = () => {
    setCurrentQ({ id: '', question: '', option1: '', option2: '', option3: '', option4: '', answer: '' })
  }

  return (
    <CContainer fluid>
      <style>{`
        .search-bar-custom .input-group-text { background-color: #fff; border: 1px solid #dee2e6; border-right: none; color: #768192; }
        .search-bar-custom .form-control { background-color: #fff; border: 1px solid #dee2e6; border-left: none; color: #768192; }
        
        .bg-box-adaptive { background-color: #f8f9fa; border: 1px solid #dee2e6; }
        .modal-footer-adaptive { background-color: #f8f9fa; border-top: 1px solid #dee2e6; }
        .modal-header-custom { background: linear-gradient(90deg, #1f2937 0%, #374151 100%); color: white; border-bottom: none; }
        .modal-header-custom .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }
        
        @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } }
        .shake-animation .form-control, .shake-animation .form-select { animation: shake 0.4s ease-in-out; border-color: #e55353 !important; background-color: #fff5f5; }

        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        .success-icon-anim { animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; }

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
                <CCol md={6} className="mb-3 mb-md-0">
                  <h3 className="m-0 fw-bold d-flex align-items-center gap-2">
                    <CIcon icon={cilPuzzle} className="text-primary"/> 
                    Banco de Preguntas
                  </h3>
                  <small className="text-muted">{questions.length} preguntas activas en el cuestionario</small>
                </CCol>
                
                <CCol md={6} className="d-flex justify-content-md-end gap-3 flex-column flex-md-row">
                   <CInputGroup className="search-bar-custom shadow-sm rounded" style={{maxWidth: '300px'}}>
                      <CInputGroupText><CIcon icon={cilSearch}/></CInputGroupText>
                      <CFormInput 
                        placeholder="Buscar..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                      />
                   </CInputGroup>
                   <CButton color="success" className="text-white fw-bold shadow-sm" onClick={() => openModal()}>
                      <CIcon icon={cilPlus} className="me-2 fw-bold"/>Nueva
                   </CButton>
                </CCol>
              </CRow>
            </CCardHeader>

            <CCardBody className="p-0">
                {loading ? <div className="text-center py-5"><CSpinner color="primary"/></div> : (
                    <>
                    <div className="table-responsive">
                        <CTable hover align="middle" className="mb-0 border-top">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="ps-4 py-3">Enunciado / Pregunta</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">Respuesta</CTableHeaderCell>
                                    <CTableHeaderCell className="text-end pe-4">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentItems.map(item => (
                                    <CTableRow key={item.id}>
                                        
                                        <CTableDataCell className="ps-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <CAvatar color="primary" textColor="white" size="md" className="me-3">
                                                    <CIcon icon={cilPuzzle} size="sm"/>
                                                </CAvatar>
                                                
                                                <div>
                                                    <div className="fw-bold text-wrap" style={{maxWidth: '450px'}}>
                                                        {item.question}
                                                    </div>
                                                    <div className="small text-muted text-truncate" style={{maxWidth: '350px'}}>
                                                        {item.options.join(' • ')}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>

                                        <CTableDataCell className="text-center">
                                            <CBadge color="success" shape="rounded-pill" className="fw-bold px-3">
                                                <CIcon icon={cilCheckCircle} className="me-1"/>
                                                {item.answer}
                                            </CBadge>
                                        </CTableDataCell>

                                        <CTableDataCell className="text-end pe-4">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <CButton color="info" variant="ghost" size="sm" onClick={() => openModal(item)}>
                                                    <CIcon icon={cilPencil}/>
                                                </CButton>
                                                <CButton color="danger" variant="ghost" size="sm" onClick={() => { setQToDelete(item); setDeleteModalVisible(true) }}>
                                                    <CIcon icon={cilTrash}/>
                                                </CButton>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                                {filteredQuestions.length === 0 && (
                                    <CTableRow>
                                        <CTableDataCell colSpan="3" className="text-center py-5 text-muted">
                                            No se encontraron preguntas.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    </div>

                    {totalPages > 1 && (
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
                    </>
                )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton className="modal-header-custom">
            <strong><CIcon icon={isEditing ? cilPencil : cilPlus} className="me-2"/>{isEditing ? 'Editar Pregunta' : 'Nueva Pregunta'}</strong>
        </CModalHeader>
        <CModalBody className="p-4">
            
            <div className="mb-4">
                <CFormLabel className="fw-bold">Enunciado de la Pregunta</CFormLabel>
                <CInputGroup className={errors.question && shake ? 'shake-animation' : ''}>
                    <CInputGroupText><CIcon icon={cilText}/></CInputGroupText>
                    <CFormInput 
                        name="question" 
                        value={currentQ.question} 
                        onChange={handleInputChange} 
                        placeholder="Ej: ¿Qué organismo dirige las operaciones militares?" 
                        invalid={!!errors.question}
                    />
                </CInputGroup>
            </div>
            
            <h6 className="text-muted text-uppercase fw-bold mb-3 small"><CIcon icon={cilList} className="me-1"/>Opciones de Respuesta</h6>
            
            <div className="bg-box-adaptive p-3 rounded mb-4">
                <CRow className="g-3">
                    {['option1', 'option2', 'option3', 'option4'].map((optKey, idx) => (
                        <CCol md={6} key={optKey}>
                            <CFormLabel className="small text-muted">Opción {String.fromCharCode(65 + idx)}</CFormLabel>
                            <CFormInput 
                                name={optKey} 
                                value={currentQ[optKey]} 
                                onChange={handleInputChange} 
                                placeholder={`Respuesta ${idx + 1}`}
                                invalid={!!errors[optKey]}
                                className={errors[optKey] && shake ? 'shake-animation' : ''}
                            />
                        </CCol>
                    ))}
                </CRow>
            </div>

            <div className="bg-light border rounded p-3">
                <CFormLabel className="fw-bold text-success d-flex align-items-center">
                    <CIcon icon={cilCheckCircle} className="me-2"/>Selecciona la Respuesta Correcta
                </CFormLabel>
                <CFormSelect 
                    name="answer" 
                    value={currentQ.answer} 
                    onChange={handleInputChange}
                    invalid={!!errors.answer}
                    className={errors.answer && shake ? 'shake-animation' : ''}
                >
                    <option value="">-- Selecciona la correcta --</option>
                    {currentQ.option1 && <option value={currentQ.option1}>{currentQ.option1}</option>}
                    {currentQ.option2 && <option value={currentQ.option2}>{currentQ.option2}</option>}
                    {currentQ.option3 && <option value={currentQ.option3}>{currentQ.option3}</option>}
                    {currentQ.option4 && <option value={currentQ.option4}>{currentQ.option4}</option>}
                </CFormSelect>
            </div>

        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
            <CButton color="secondary" variant="ghost" onClick={() => setModalVisible(false)}>Cancelar</CButton>
            <CButton color="primary" onClick={handleSave} className="px-4 fw-bold">
                <CIcon icon={cilSave} className="me-2"/>Guardar
            </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center" backdrop="static">
        <CModalHeader closeButton className="border-bottom-0"></CModalHeader>
        <CModalBody className="text-center p-4">
            <CIcon icon={cilWarning} size="4xl" className="text-danger mb-3"/>
            <h4 className="fw-bold text-danger">¿Eliminar esta pregunta?</h4>
            <p className="text-muted mb-4">Esta acción no se puede deshacer.</p>
            <div className="d-flex justify-content-center gap-2">
                <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancelar</CButton>
                <CButton color="danger" className="text-white" onClick={handleDelete}>Sí, Eliminar</CButton>
            </div>
        </CModalBody>
      </CModal>

      <CModal visible={successModalVisible} alignment="center" className="border-0">
          <CModalBody className="text-center p-5">
            <div className="mb-4 success-icon-anim">
                <CIcon icon={cilCheckCircle} size="5xl" className="text-success"/>
            </div>
            <h2 className="fw-bold text-success mb-2">¡Pregunta Guardada!</h2>
            <p className="text-muted">La pregunta ha sido añadida al banco de preguntas con éxito.</p>
          </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default Preguntas