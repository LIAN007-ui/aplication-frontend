import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CAvatar,
  CButton,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilThumbUp, cilCommentBubble, cilShareAlt, cilBookmark } from '@coreui/icons'

const ModuloInicio = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts')
      setPosts(response.data)
    } catch (error) {
      // Datos de ejemplo para visualizar el diseño
      setPosts([
        {
          id: 1,
          autor: 'Administración',
          rol: 'Admin',
          texto: 'Bienvenidos al nuevo semestre 2024. ¡Mucho éxito a todos!',
          imgUrl: 'src/assets/images/publicacion1.jpg',
          fecha: 'Publicado hace 1 hora',
          likes: 24
        },
        {
          id: 2,
          autor: 'Bienestar Estudiantil',
          rol: 'Staff',
          texto: 'No olvides registrarte en las actividades deportivas de este viernes.',
          imgUrl: 'https://picsum.photos/800/501',
          fecha: 'Publicado ayer',
          likes: 12
        }
      ])
    }
  }

  return (
    <CContainer style={{ maxWidth: '600px', paddingBottom: '50px' }}>
      <h3 className="mb-4 text-center fw-bold text-secondary">Publicaciones Recientes</h3>
      
      {posts.map((post) => (
        <CCard key={post.id} className="mb-5 shadow border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
          {/* Cabecera: Autor y Fecha */}
          <CCardHeader className="bg-white border-0 d-flex align-items-center p-3">
            <CAvatar color="dark" textColor="white" className="me-3">A</CAvatar>
            <div className="flex-grow-1">
              <div className="fw-bold d-flex align-items-center">
                {post.autor} 
                <CBadge color="info" className="ms-2" shape="rounded-pill" style={{ fontSize: '0.7rem' }}>
                   {post.rol}
                </CBadge>
              </div>
              <small className="text-muted" style={{ fontSize: '0.8rem' }}>{post.fecha}</small>
            </div>
          </CCardHeader>

          {/* Cuerpo: Texto y la Imagen destacada */}
          <CCardBody className="p-0">
            <div className="px-3 pb-3">
              <p className="mb-0">{post.texto}</p>
            </div>
            <div 
              style={{ 
                backgroundColor: '#f8f9fa', 
                minHeight: '300px', 
                display: 'flex', 
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              <img 
                src={post.imgUrl} 
                alt="Contenido" 
                className="w-100 h-auto"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </CCardBody>

          {/* Pie: Reacciones y Botones */}
          <div className="bg-white p-2">
            <div className="d-flex justify-content-between px-3 py-2 border-bottom mb-2">
              <span className="text-muted small">
                <CIcon icon={cilThumbUp} className="text-primary me-1" size="sm" /> 
                {post.likes} personas les gusta esto
              </span>
              <span className="text-muted small">0 comentarios</span>
            </div>
            
            <div className="d-flex justify-content-around">
              <CButton color="light" className="flex-grow-1 border-0 bg-transparent text-secondary hover-primary">
                <CIcon icon={cilThumbUp} className="me-2" /> Me gusta
              </CButton>
              <CButton color="light" className="flex-grow-1 border-0 bg-transparent text-secondary">
                <CIcon icon={cilCommentBubble} className="me-2" /> Comentar
              </CButton>
              <CButton color="light" className="border-0 bg-transparent text-secondary">
                <CIcon icon={cilBookmark} />
              </CButton>
            </div>
          </div>
        </CCard>
      ))}
    </CContainer>
  )
}

export default ModuloInicio