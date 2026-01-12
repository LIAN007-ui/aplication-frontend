import React, { useState, useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormTextarea,
  CButton,
  CListGroup,
  CListGroupItem,
  CBadge,
} from '@coreui/react'

// palabras censuradas
const BANNED_WORDS = ['tonto', 'idiota', 'estúpido', 'perro', 'puto', 'gay', 'liander']

// Lista de emojis
const emojis = ['😀', '😂', '😍', '🥳', '👍', '💡', '🔥']

// --- FUNCIONES DE UTILIDAD ---
const censorMessage = (content) => {
  let censored = content
  BANNED_WORDS.forEach((word) => {
    const regex = new RegExp(word, 'gi')
    const replacement = '*'.repeat(word.length)
    censored = censored.replace(regex, replacement)
  })
  return censored
}

const ForumCrud = () => {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      author: 'Admin',
      content: '¡Bienvenidos al foro! 🎉 Participa con respeto.',
      timestamp: new Date().toLocaleTimeString(),
      likes: 0, // Nueva propiedad para interactividad
    },
  ])
  const [message, setMessage] = useState('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [discussions])

  // --- NUEVA LÓGICA: MANEJO DE REACCIONES ---
  const handleLike = (id) => {
    setDiscussions(discussions.map(msg => 
      msg.id === id ? { ...msg, likes: (msg.likes || 0) + 1 } : msg
    ))
  }

  const addEmoji = (emoji) => {
    const el = textareaRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const newText = message.substring(0, start) + emoji + message.substring(end, message.length)
    setMessage(newText)
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length
      el.focus()
    }, 0)
  }

  const handleDeleteMessage = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      setDiscussions(discussions.filter((msg) => msg.id !== id))
    }
  }

  const postMessage = () => {
    const rawMessage = message.trim()
    if (!rawMessage || rawMessage.length > 255) return

    const safeContent = censorMessage(rawMessage)

    const newMsg = {
      id: Date.now(), // ID más confiable
      author: 'You',
      content: safeContent,
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
    }

    setDiscussions([...discussions, newMsg])
    setMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    postMessage()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      postMessage()
    }
  }

  return (
    <CCard className="shadow-lg border-0">
      <CCardHeader className="bg-primary text-white d-flex align-items-center">
        <span style={{ fontSize: '1.2rem' }}>💬</span> 
        <strong className="ms-2">Foro de Discusión Didáctico</strong>
      </CCardHeader>
      
      <CCardBody className="bg-light">
        {/* Contenedor de Mensajes */}
        <CListGroup
          className="mb-3 p-2"
          style={{ maxHeight: 400, overflowY: 'auto', borderRadius: '8px' }}
        >
          {discussions.map(({ id, author, content, timestamp, likes }) => {
            const isMe = author === 'You'

            return (
              <CListGroupItem
                key={id}
                className={`mb-3 border-0 shadow-sm rounded-3 d-flex flex-column ${
                  isMe ? 'align-items-end ms-auto' : 'align-items-start me-auto'
                }`}
                style={{ 
                  maxWidth: '85%', 
                  backgroundColor: isMe ? '#e7f3ff' : '#ffffff',
                  borderLeft: isMe ? 'none' : '4px solid #f9b115',
                  borderRight: isMe ? '4px solid #321fdb' : 'none'
                }}
              >
                <div className="w-100 d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <CBadge color={isMe ? 'primary' : 'warning'} shape="rounded-pill" className="me-2">
                      {author}
                    </CBadge>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{timestamp}</small>
                  </div>
                  
                  {isMe && (
                    <CButton size="sm" color="danger" variant="ghost" onClick={() => handleDeleteMessage(id)} className="p-0 text-danger">
                      🗑️
                    </CButton>
                  )}
                </div>

                {/* Contenido */}
                <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word', width: '100%' }}>
                  {content}
                </div>

                {/* Área de Reacción */}
                <div className="mt-2 pt-1 border-top w-100 d-flex justify-content-end">
                   <CButton 
                    size="sm" 
                    variant="ghost" 
                    color="secondary" 
                    onClick={() => handleLike(id)}
                    className="py-0 px-2"
                  >
                    <span role="img" aria-label="like">👍</span> 
                    <small className="ms-1">{likes > 0 ? likes : ''}</small>
                  </CButton>
                </div>
              </CListGroupItem>
            )
          })}
          <div ref={messagesEndRef} />
        </CListGroup>

        {/* Formulario */}
        <CForm onSubmit={handleSubmit} className="bg-white p-3 rounded shadow-sm">
          <div className="position-relative">
            <CFormTextarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un aporte constructivo..."
              rows={3}
              required
              className="mb-2 border-0 bg-light"
              style={{ resize: 'none' }}
            />
            {/* Indicador de longitud */}
            <div 
              className={`position-absolute bottom-0 end-0 m-2 ${message.length > 255 ? 'text-danger' : 'text-muted'}`}
              style={{ fontSize: '0.7rem' }}
            >
              {message.length}/255
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {emojis.map((emoji) => (
              <CButton
                key={emoji}
                color="light"
                size="sm"
                className="border"
                onClick={() => addEmoji(emoji)}
                type="button"
              >
                {emoji}
              </CButton>
            ))}
          </div>

          <CButton type="submit" color="primary" className="w-100 d-flex align-items-center justify-content-center py-2" disabled={!message.trim() || message.length > 255}>
            <span role="img" aria-label="Enviar" className="me-2">🚀</span> 
            Publicar en el Foro
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ForumCrud