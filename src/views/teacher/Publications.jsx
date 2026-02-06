import React, { useState, useEffect, useRef } from 'react'
import api from '../../api'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell,
  CButton, CFormInput, CFormTextarea, CInputGroup, CInputGroupText, CModal, CModalHeader, CModalBody, CModalFooter, CSpinner, CContainer, CFormLabel,
  CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilNewspaper, cilPlus, cilPencil, cilTrash, cilSave, cilSearch, 
  cilWarning, cilImage, cilAlignLeft, cilCalendar, cilCheckCircle, cilFile, cilXCircle
} from '@coreui/icons'

const Publications = () => {
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef(null)
  
  const [teacherProfile, setTeacherProfile] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [fileErrorModalVisible, setFileErrorModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState({
    id: '', 
    title: '',      
    content: '',       
    createdAt: '',       
    mediaUrl: null,
    fileRaw: null 
  })
  const [postToDelete, setPostToDelete] = useState(null)

  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      
      const profileRes = await api.get('/users/profile')
      const profile = profileRes.data
      setTeacherProfile(profile)
      
      const semesterId = profile.assigned_semester_id

      if (semesterId) {
        const response = await api.get(`/publications/semester/${semesterId}`)
        
        const mappedPosts = response.data.map(p => ({
            ...p,
            createdAt: p.created_at, 
            mediaUrl: p.file_attachment_url 
        }))
        
        setPosts(mappedPosts)
      } else {
        setPosts([])
      }
    } catch (error) { 
      console.error("Error cargando posts:", error)
      setPosts([]) 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const filteredPosts = posts.filter(p => 
    (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => { setCurrentPage(1) }, [searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)

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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
        if (file.size > 10 * 1024 * 1024) { 
            setFileErrorModalVisible(true)
            e.target.value = null
            return
        }
        try {
            const base64 = await convertToBase64(file)
            setCurrentPost({ ...currentPost, mediaUrl: base64, fileRaw: file })
        } catch (err) { console.error(err) }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentPost({ ...currentPost, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
  }

  const validateForm = () => {
    let newErrors = {}
    let isValid = true
    if (!currentPost.title.trim()) { newErrors.title = true; isValid = false }
    if (!currentPost.content.trim()) { newErrors.content = true; isValid = false }
    setErrors(newErrors)
    return isValid
  }

  const handleSave = async () => {
    if (!validateForm()) {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        return
    }

    const formData = new FormData();
    formData.append('title', currentPost.title);
    formData.append('content', currentPost.content);
    formData.append('semester_id', teacherProfile?.assigned_semester_id);
    
    if (currentPost.fileRaw) {
        formData.append('file', currentPost.fileRaw);
    }

    try {
        if (isEditing) {
             await api.put(`/publications/${currentPost.id}`, formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
             })
        } else {
            await api.post('/publications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }
        
        setModalVisible(false)
        setSuccessModalVisible(true)
        fetchPosts() 
        
        setTimeout(() => {
            setSuccessModalVisible(false)
            resetForm()
        }, 2000)

    } catch (error) { 
        console.error(error)
        alert("Error al guardar. Verifica el tamaño del archivo o tu conexión.") 
    }
  }

  const handleDelete = async () => {
    if (postToDelete) {
        try {
            await api.delete(`/publications/${postToDelete.id}`)
            setPosts(posts.filter(p => p.id !== postToDelete.id))
            setDeleteModalVisible(false)
        } catch (error) { 
            alert("Error al eliminar") 
        }
    }
  }

  const openModal = (post = null) => {
    setErrors({})
    if (post) {
        setIsEditing(true)
        setCurrentPost(post)
    } else {
        resetForm()
        setIsEditing(false)
    }
    setModalVisible(true)
  }

  const resetForm = () => {
    setCurrentPost({ id: '', title: '', content: '', createdAt: '', mediaUrl: null, fileRaw: null })
    if (fileInputRef.current) fileInputRef.current.value = ""
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
        .shake-animation .form-control, .shake-animation .form-select, .shake-animation .form-textarea { animation: shake 0.4s ease-in-out; border-color: #e55353 !important; background-color: #fff5f5; }

        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        .success-icon-anim { animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; }

        [data-coreui-theme="dark"] .search-bar-custom .input-group-text { background-color: #2a303d; border-color: #3b4b60; color: #e5e7eb; }
        [data-coreui-theme="dark"] .search-bar-custom .form-control { background-color: #2a303d; border-color: #3b4b60; color: #fff; }
        [data-coreui-theme="dark"] .table { color: #e5e7eb; }
        [data-coreui-theme="dark"] .table thead th { background-color: transparent !important; color: #e5e7eb !important; border-bottom-color: #3b4b60; }
        [data-coreui-theme="dark"] .modal-content { background-color: #1e293b; border: 1px solid #4b5563; color: #e5e7eb; }
        [data-coreui-theme="dark"] .modal-body .form-control, [data-coreui-theme="dark"] .modal-body .form-select, [data-coreui-theme="dark"] .modal-body .form-textarea, [data-coreui-theme="dark"] .modal-body .input-group-text { background-color: #374151; border-color: #4b5563; color: #fff; }
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
                    <CIcon icon={cilNewspaper} className="text-primary"/> 
                    Gestión de Noticias
                  </h3>
                  <small className="text-muted">{posts.length} publicaciones registradas</small>
                </CCol>
                
                <CCol md={6} className="d-flex justify-content-md-end gap-3 flex-column flex-md-row">
                   <CInputGroup className="search-bar-custom shadow-sm rounded" style={{maxWidth: '300px'}}>
                      <CInputGroupText><CIcon icon={cilSearch}/></CInputGroupText>
                      <CFormInput 
                        placeholder="Buscar publicación..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                      />
                   </CInputGroup>
                   <CButton color="success" className="text-white fw-bold shadow-sm" onClick={() => openModal()}>
                      <CIcon icon={cilPlus} className="me-2 fw-bold"/>Publicar
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
                                    <CTableHeaderCell className="ps-4 py-3">Noticia / Contenido</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">Fecha</CTableHeaderCell>
                                    <CTableHeaderCell className="text-end pe-4">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentItems.map(item => (
                                    <CTableRow key={item.id}>
                                        
                                        <CTableDataCell className="ps-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="me-3 bg-light border d-flex align-items-center justify-content-center rounded overflow-hidden shadow-sm" style={{width: '60px', height: '60px', flexShrink: 0}}>
                                                    {item.mediaUrl ? (
                                                        item.mediaUrl.startsWith('data:image') ? 
                                                            <img src={item.mediaUrl} alt="Img" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> 
                                                            : <CIcon icon={cilFile} size="xl" className="text-info"/>
                                                    ) : (
                                                        <CIcon icon={cilNewspaper} className="text-secondary"/>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-wrap" style={{maxWidth: '400px'}}>{item.title}</div>
                                                    <div className="small text-muted text-truncate" style={{maxWidth: '350px'}}>{item.content}</div>
                                                </div>
                                            </div>
                                        </CTableDataCell>

                                        <CTableDataCell className="text-center">
                                            <div className="small text-muted fw-semibold">
                                                <CIcon icon={cilCalendar} size="sm" className="me-2 text-primary"/>
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-VE') : 'Sin fecha'}
                                            </div>
                                        </CTableDataCell>

                                        <CTableDataCell className="text-end pe-4">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <CButton color="info" variant="ghost" size="sm" onClick={() => openModal(item)} title="Editar"><CIcon icon={cilPencil}/></CButton>
                                                <CButton color="danger" variant="ghost" size="sm" onClick={() => { setPostToDelete(item); setDeleteModalVisible(true) }} title="Eliminar"><CIcon icon={cilTrash}/></CButton>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                                {filteredPosts.length === 0 && (
                                    <CTableRow>
                                        <CTableDataCell colSpan="3" className="text-center py-5 text-muted">
                                            No hay publicaciones registradas.
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
            <strong><CIcon icon={isEditing ? cilPencil : cilPlus} className="me-2"/>{isEditing ? 'Editar Publicación' : 'Nueva Publicación'}</strong>
        </CModalHeader>
        <CModalBody className="p-4">
            
            <div className="mb-4">
                <CFormLabel className="fw-bold">Título del Anuncio *</CFormLabel>
                <CInputGroup className={errors.title && shake ? 'shake-animation' : ''}>
                    <CInputGroupText><CIcon icon={cilAlignLeft}/></CInputGroupText>
                    <CFormInput name="title" value={currentPost.title} onChange={handleInputChange} placeholder="Ej: Suspensión de actividades..." invalid={!!errors.title}/>
                </CInputGroup>
            </div>
            
            <div className="mb-4">
                <CFormLabel className="fw-bold">Contenido *</CFormLabel>
                <CFormTextarea name="content" rows={6} value={currentPost.content} onChange={handleInputChange} placeholder="Detalles de la noticia..." invalid={!!errors.content} className={errors.content && shake ? 'shake-animation' : ''}/>
            </div>

            <div className="bg-box-adaptive p-3 rounded d-flex align-items-center">
                <div className="me-3 bg-white border d-flex align-items-center justify-content-center rounded overflow-hidden shadow-sm" style={{width: '100px', height: '100px', cursor: 'pointer', flexShrink: 0}} onClick={() => fileInputRef.current.click()}>
                    {currentPost.mediaUrl ? (
                         currentPost.mediaUrl.startsWith('data:image') ? 
                            <img src={currentPost.mediaUrl} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                            : <CIcon icon={cilFile} size="3xl" className="text-info"/>
                    ) : (
                        <div className="text-center text-muted small fw-bold"><CIcon icon={cilImage} size="xl" className="mb-1"/><br/>Subir</div>
                    )}
                </div>
                <div>
                    <h6 className="mb-1 fw-bold text-primary">Archivo Adjunto (PDF, Word, Imagen)</h6>
                    <small className="text-muted d-block mb-2">Máximo 10MB.</small>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{display: 'none'}} />
                    <div className="d-flex gap-2">
                        <CButton color="primary" size="sm" onClick={() => fileInputRef.current.click()}>Seleccionar Archivo</CButton>
                        {currentPost.mediaUrl && <CButton color="danger" variant="ghost" size="sm" onClick={() => setCurrentPost({...currentPost, mediaUrl: null})}>Quitar</CButton>}
                    </div>
                </div>
            </div>

        </CModalBody>
        <CModalFooter className="modal-footer-adaptive">
            <CButton color="secondary" variant="ghost" onClick={() => setModalVisible(false)}>Cancelar</CButton>
            <CButton color="primary" onClick={handleSave} className="px-4 fw-bold"><CIcon icon={cilSave} className="me-2"/>Publicar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center" backdrop="static">
        <CModalHeader closeButton className="border-bottom-0"></CModalHeader>
        <CModalBody className="text-center p-4">
            <CIcon icon={cilWarning} size="4xl" className="text-danger mb-3"/>
            <h4 className="fw-bold text-danger">¿Eliminar publicación?</h4>
            <p className="text-muted mb-4">Esta noticia dejará de ser visible.</p>
            <div className="d-flex justify-content-center gap-2">
                <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancelar</CButton>
                <CButton color="danger" className="text-white" onClick={handleDelete}>Sí, Eliminar</CButton>
            </div>
        </CModalBody>
      </CModal>

      <CModal visible={fileErrorModalVisible} onClose={() => setFileErrorModalVisible(false)} size="xl" alignment="center">
         <CModalBody className="text-center p-5 d-flex flex-column align-items-center justify-content-center" style={{minHeight: '400px'}}>
             <div className="mb-4 shake-animation">
                <CIcon icon={cilXCircle} size="6xl" className="text-danger"/>
             </div>
             <h1 className="fw-bold text-danger display-4 mb-3">¡Archivo Demasiado Pesado!</h1>
             <p className="lead text-muted mb-5">El archivo que intentas subir excede el límite permitido de <strong>10MB</strong>.</p>
             <CButton color="dark" size="lg" shape="rounded-pill" className="px-5" onClick={() => setFileErrorModalVisible(false)}>
                 Intenta con uno más ligero
             </CButton>
         </CModalBody>
      </CModal>

      <CModal visible={successModalVisible} alignment="center" className="border-0">
          <CModalBody className="text-center p-5">
            <div className="mb-4 success-icon-anim">
                <CIcon icon={cilCheckCircle} size="5xl" className="text-success"/>
            </div>
            <h2 className="fw-bold text-success mb-2">¡Publicación Exitosa!</h2>
            <p className="text-muted">El contenido ha sido guardado y es visible para los estudiantes.</p>
          </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default Publications