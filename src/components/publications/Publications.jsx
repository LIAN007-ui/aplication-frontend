import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel, // Se agrega CFormLabel para el campo de archivo
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const AdminPostCrud = () => {
  const [posts, setPosts] = useState([])
  // Se agrega 'mediaUrl' al estado del formulario para el enlace o ruta del archivo
  const [form, setForm] = useState({ id: null, title: '', body: '', mediaUrl: '' })
  const [fileInputKey, setFileInputKey] = useState(Date.now()) // Clave para resetear el input de archivo

  useEffect(() => {
    // Datos iniciales de ejemplo
    setPosts([
      {
        id: 1,
        title: 'Primera publicación',
        body: 'Contenido de la primera publicación.',
        mediaUrl: '',
      },
      {
        id: 2,
        title: 'Segunda publicación',
        body: 'Contenido de la segunda publicación.',
        mediaUrl: 'https://via.placeholder.com/150/0000FF/808080?text=VideoEjemplo',
      },
    ])
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Nueva función para manejar el cambio en el input de tipo file
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Almacena una URL temporal del archivo para simular la subida/ruta
      setForm({ ...form, mediaUrl: URL.createObjectURL(file) })
    } else {
      setForm({ ...form, mediaUrl: '' })
    }
  }

  const resetForm = () => {
    setForm({ id: null, title: '', body: '', mediaUrl: '' })
    setFileInputKey(Date.now()) // Resetea el input de archivo
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // **Validación para asegurar que todos los campos estén llenos**
    if (!form.title.trim() || !form.body.trim()) {
      alert('Por favor, complete el Título y el Contenido antes de publicar.')
      return
    }

    if (form.id === null) {
      // Validar si hay un archivo seleccionado solo al crear
      if (!form.mediaUrl) {
        alert('Por favor, agregue una Imagen o Video para la nueva publicación.')
        return
      }

      // Crear nueva publicación
      const newPost = {
        id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
        title: form.title,
        body: form.body,
        mediaUrl: form.mediaUrl, // Se agrega el archivo
      }
      setPosts([...posts, newPost])
    } else {
      // Actualizar publicación existente
      setPosts(
        posts.map((post) =>
          // Solo actualizamos title, body y mediaUrl
          post.id === form.id
            ? { ...post, title: form.title, body: form.body, mediaUrl: form.mediaUrl }
            : post,
        ),
      )
    }

    // Limpiar el formulario y el input de archivo
    resetForm()
  }

  const handleEdit = (post) => {
    // Cuando se edita, se carga la URL del medio si existe
    setForm(post)
    setFileInputKey(Date.now()) // Resetea el input para que no muestre el archivo anterior al editar
  }

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  return (
    <CCard>
      <CCardHeader>Publicaciones</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit} className="mb-3">
          <CFormInput
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required // Validación HTML5: campo requerido
            className="mb-2"
          />
          <CFormTextarea
            name="body"
            placeholder="Contenido"
            value={form.body}
            onChange={handleChange}
            required // Validación HTML5: campo requerido
            rows={4}
            className="mb-2"
          />

          {/* Nuevo campo para agregar Imagen o Video */}
          <CFormLabel htmlFor="mediaFile">Agregar Imagen o Video (Requerido al Crear)</CFormLabel>
          <CFormInput
            type="file"
            name="mediaFile"
            id="mediaFile"
            onChange={handleFileChange}
            key={fileInputKey} // Se usa la key para resetear el input
            accept="image/*,video/*" // Acepta archivos de imagen o video
            className="mb-2"
          />
          {form.mediaUrl && (
            <div className="mb-2">
              <small className="text-muted">
                Archivo seleccionado. URL: {form.mediaUrl.substring(0, 50)}...
              </small>
            </div>
          )}

          <div className="mt-2">
            <CButton type="submit" color="primary">
              {form.id === null ? 'Agregar Publicación' : 'Actualizar Publicación'}
            </CButton>
            {form.id !== null && (
              <CButton color="secondary" className="ms-2" onClick={resetForm}>
                Cancelar
              </CButton>
            )}
          </div>
        </CForm>

        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Título</CTableHeaderCell>
              <CTableHeaderCell>Contenido</CTableHeaderCell>
              <CTableHeaderCell>Archivo</CTableHeaderCell> {/* Nueva columna */}
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {posts.length === 0 && (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center">
                  {' '}
                  {/* ColSpan actualizado a 5 */}
                  No hay publicaciones
                </CTableDataCell>
              </CTableRow>
            )}
            {posts.map((post) => (
              <CTableRow key={post.id}>
                <CTableDataCell>{post.id}</CTableDataCell>
                <CTableDataCell>{post.title}</CTableDataCell>
                <CTableDataCell>{post.body}</CTableDataCell>
                {/* Mostrar el archivo/mediaUrl */}
                <CTableDataCell>
                  {post.mediaUrl ? <span title={post.mediaUrl}>Sí</span> : <span>No</span>}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="warning" onClick={() => handleEdit(post)}>
                    Editar
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    className="ms-2"
                    onClick={() => handleDelete(post.id)}
                  >
                    Eliminar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default AdminPostCrud
