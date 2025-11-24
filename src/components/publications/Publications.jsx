import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const AdminPostCrud = () => {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ id: null, title: '', body: '' })

  useEffect(() => {
    // Datos iniciales de ejemplo
    setPosts([
      { id: 1, title: 'Primera publicación', body: 'Contenido de la primera publicación.' },
      { id: 2, title: 'Segunda publicación', body: 'Contenido de la segunda publicación.' },
    ])
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.id === null) {
      // Crear nueva publicación
      const newPost = {
        id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
        title: form.title,
        body: form.body,
      }
      setPosts([...posts, newPost])
    } else {
      // Actualizar publicación existente
      setPosts(
        posts.map((post) =>
          post.id === form.id ? { ...post, title: form.title, body: form.body } : post,
        ),
      )
    }
    setForm({ id: null, title: '', body: '' })
  }

  const handleEdit = (post) => {
    setForm(post)
  }

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  return (
    <CCard>
      <CCardHeader>CRUD de Publicaciones</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit} className="mb-3">
          <CFormInput
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            className="mb-2"
          />
          <CFormTextarea
            name="body"
            placeholder="Contenido"
            value={form.body}
            onChange={handleChange}
            required
            rows={4}
          />
          <div className="mt-2">
            <CButton type="submit" color="primary">
              {form.id === null ? 'Agregar Publicación' : 'Actualizar Publicación'}
            </CButton>
            {form.id !== null && (
              <CButton
                color="secondary"
                className="ms-2"
                onClick={() => setForm({ id: null, title: '', body: '' })}
              >
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
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {posts.length === 0 && (
              <CTableRow>
                <CTableDataCell colSpan={4} className="text-center">
                  No hay publicaciones
                </CTableDataCell>
              </CTableRow>
            )}
            {posts.map((post) => (
              <CTableRow key={post.id}>
                <CTableDataCell>{post.id}</CTableDataCell>
                <CTableDataCell>{post.title}</CTableDataCell>
                <CTableDataCell>{post.body}</CTableDataCell>
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
