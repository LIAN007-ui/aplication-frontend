import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CCol,
  CBadge
} from '@coreui/react'

const AdminPostCrud = () => {
  const API_URL = 'http://localhost:3001/posts'
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ id: null, title: '', body: '', mediaUrl: '', mediaType: '', date: '' })
  const [fileInputKey, setFileInputKey] = useState(Date.now())
  const [modalVisible, setModalVisible] = useState(false)
  const [errorBanner, setErrorBanner] = useState({ message: '', visible: false })
  const [errorFields, setErrorFields] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  const errorStyle = {
    boxShadow: '0 0 0 4px rgba(255,165,0,0.18)',
    borderColor: '#ff8c00',
    transition: 'all 300ms ease-in-out',
    transform: 'translateX(0)',
  }

  const shakeAnimation = {
    animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
  }

  // Cargar posts al iniciar
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_URL)
      setPosts(res.data)
    } catch (e) { console.error('Error cargando posts:', e) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (errorBanner.visible) setErrorBanner({ message: '', visible: false })
    if (errorFields.includes(name)) setErrorFields((prev) => prev.filter((f) => f !== name))
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (errorFields.includes('media')) setErrorFields((prev) => prev.filter((f) => f !== 'media'))
    
    if (file) {
      // NOTA: json-server no maneja archivos binarios reales.
      // Usamos createObjectURL para simular la carga y ver la preview en la sesión actual.
      // En un backend real, aquí subirías el archivo y obtendrías una URL del servidor.
      setForm({ 
        ...form, 
        mediaUrl: URL.createObjectURL(file),
        mediaType: file.type 
      })
    } else {
      setForm({ ...form, mediaUrl: '', mediaType: '' })
    }
  }

  const renderMediaPreview = () => {
    const { mediaUrl, mediaType } = form
    if (!mediaUrl) return null

    if (mediaType.startsWith('image/')) {
      return <img src={mediaUrl} alt="preview" style={{ maxWidth: '100%', borderRadius: '4px' }} />
    } 
    
    if (mediaType.startsWith('video/')) {
      return <video src={mediaUrl} controls style={{ maxWidth: '100%', borderRadius: '4px' }} />
    }

    if (mediaType === 'application/pdf') {
      return (
        <div className="p-3 bg-light border rounded text-center">
          <div style={{ fontSize: '30px' }}>📄</div>
          <small className="text-primary fw-bold">Archivo PDF Seleccionado</small>
          <iframe src={mediaUrl} width="100%" height="150px" title="pdf-prev" className="mt-2" />
        </div>
      )
    }

    return (
      <div className="p-3 bg-light border rounded text-center">
        <div style={{ fontSize: '30px' }}>📁</div>
        <small className="text-dark fw-bold">Documento: {mediaType.split('/')[1]?.toUpperCase() || 'FILE'}</small>
        <div className="mt-1 small text-muted">Vista previa no disponible para este formato, pero el archivo está cargado.</div>
      </div>
    )
  }

  const resetForm = () => {
    setForm({ id: null, title: '', body: '', mediaUrl: '', mediaType: '', date: '' })
    setFileInputKey(Date.now())
    setErrorBanner({ message: '', visible: false })
    setErrorFields([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const missing = []
    if (!form.title.trim()) missing.push('title')
    if (!form.body.trim()) missing.push('body')
    if (form.id === null && !form.mediaUrl) missing.push('media')

    if (missing.length > 0) {
      setErrorFields(missing)
      setErrorBanner({ message: 'Complete los campos resaltados.', visible: true })
      setTimeout(() => { setErrorBanner({ message: '', visible: false }); setErrorFields([]) }, 3500)
      return
    }

    try {
      if (form.id === null) {
        // CREAR
        const { id, ...newPost } = form
        newPost.date = new Date().toLocaleString()
        await axios.post(API_URL, newPost)
      } else {
        // EDITAR
        await axios.put(`${API_URL}/${form.id}`, form)
      }
      fetchPosts()
      closeModal()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (post) => { setForm(post); setFileInputKey(Date.now()); setModalVisible(true) }
  const requestDelete = (id) => { setPostToDelete(id); setDeleteModalVisible(true) }
  
  const confirmDelete = async () => { 
    try {
      await axios.delete(`${API_URL}/${postToDelete}`)
      fetchPosts()
      setDeleteModalVisible(false)
      setPostToDelete(null)
    } catch (err) { console.error(err) }
  }
  
  const openModalForCreate = () => { resetForm(); setModalVisible(true) }
  const closeModal = () => { setModalVisible(false); resetForm() }

  return (
    <CRow>
      <style>{`@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }`}</style>

      {/* CABECERA Y TABLA */}
      <CCol xs={12} className="mb-4">
        <CCard className="shadow-sm border-top-primary border-top-3">
          <CCardHeader className="d-flex align-items-center justify-content-between">
            <strong>Gestión de Publicaciones</strong>
            <CButton color="primary" onClick={openModalForCreate}>Nueva Publicación ✎ </CButton>
          </CCardHeader>
          <CCardBody><div className="small text-muted">Administrar publicaciones existentes.</div></CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="shadow-sm">
          <CCardHeader><strong>Gestión de Publicaciones Existentes</strong></CCardHeader>
          <CCardBody>
            <CTable align="middle" responsive hover>
              <CTableHead color="windows-light">
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={{ width: '60px' }}>ID</CTableHeaderCell>
                  <CTableHeaderCell>Publicación</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '100px' }}>Archivo</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '480px' }}>Fecha</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {posts.map((post) => (
                    <CTableRow key={post.id}>
                      <CTableDataCell className="text-center fw-bold">{post.id}</CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-bold text-primary">{post.title}</div>
                        <div className="small text-muted">{post.body.substring(0, 80)}...</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center" style={{ width: '150px' }}>
                        <CBadge color={post.mediaUrl ? 'info' : 'secondary'} shape="rounded-pill">
                          {post.mediaUrl ? 'Archivo Listo' : 'Sin Archivo'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center" style={{ width: '180px' }}>
                        <div className="small text-muted">{post.date ? post.date : ''}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CButton size="sm" color="warning" variant="outline" className="me-2" onClick={() => handleEdit(post)}>Editar</CButton>
                        <CButton size="sm" color="danger" variant="outline" onClick={() => requestDelete(post.id)}>Eliminar</CButton>
                      </CTableDataCell>
                    </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* MODAL PRINCIPAL */}
      <CModal backdrop="static" visible={modalVisible} onClose={closeModal} alignment="center" size="lg">
        <CModalHeader><CModalTitle>{form.id === null ? 'Nueva Publicación' : 'Editar Publicación'}</CModalTitle></CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, transition: 'all 300ms ease', transform: errorBanner.visible ? 'translateY(0)' : 'translateY(-10px)', opacity: errorBanner.visible ? 1 : 0, color: '#842029', background: '#f8d7da', borderRadius: 6, border: '1px solid #f5c2c7', fontSize: 14, visibility: errorBanner.visible ? 'visible' : 'hidden' }}>
              {errorBanner.message}
            </div>
            <CRow>
              <CCol md={6}>
                <CFormLabel>Título</CFormLabel>
                <CFormInput type="text" name="title" value={form.title} onChange={handleChange} className="mb-3" style={{ ...(errorFields.includes('title') ? { ...errorStyle, ...shakeAnimation } : {}) }} />

                <CFormLabel>Archivos</CFormLabel>
                <CFormInput
                  type="file"
                  onChange={handleFileChange}
                  key={fileInputKey}
                  accept=".jpg,.jpeg,.png,.mp4,.pdf,.doc,.docx,.xls,.xlsx"
                  className="mb-3"
                  style={{ ...(errorFields.includes('media') ? { ...errorStyle, ...shakeAnimation } : {}) }}
                />
                
                {form.mediaUrl && (
                  <div className="mb-2 border rounded p-1">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small className="text-muted d-block mb-1">Vista previa del archivo:</small>
                      <CButton size="sm" color="danger" onClick={() => { setForm({ ...form, mediaUrl: '', mediaType: '' }); setFileInputKey(Date.now()) }} style={{ minWidth: 30, height: 28, padding: '0 6px' }}>✕</CButton>
                    </div>
                    <div className="text-center overflow-hidden" style={{ maxHeight: '250px' }}>
                      {renderMediaPreview()}
                    </div>
                  </div>
                )}
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>Contenido</CFormLabel>
                <CFormTextarea name="body" value={form.body} onChange={handleChange} rows={10} className="mb-3" style={{ height: '260px', resize: 'none', overflowY: 'auto', ...(errorFields.includes('body') ? { ...errorStyle, ...shakeAnimation } : {}) }} />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="ghost" onClick={closeModal}>Cancelar</CButton>
            <CButton type="submit" color={form.id === null ? 'primary' : 'success'}>{form.id === null ? 'Publicar Ahora' : 'Guardar Cambios'}</CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* MODAL DE ELIMINACIÓN ANIMADO */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center" backdrop="static">
        <CModalHeader className="border-0"><CModalTitle>Confirmar Acción</CModalTitle></CModalHeader>
        <CModalBody className="text-center py-4">
          <div className="mb-3 text-danger" style={{ fontSize: '40px' }}>⚠️</div>
          <h5 className="mb-2">¿Estás seguro de eliminar esta publicación?</h5>
          <p className="text-muted mb-0">Esta operación no se puede revertir.</p>
        </CModalBody>
        <CModalFooter className="border-0 justify-content-center pt-0">
          <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>No, Cancelar</CButton>
          <CButton color="danger" className="px-4" onClick={confirmDelete}>Sí, Eliminar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AdminPostCrud