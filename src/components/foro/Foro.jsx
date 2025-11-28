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
  // Se añade CBadge para hacer más interactivo el autor
  CBadge,
} from '@coreui/react'

// --- CONSTANTES ---
// Lista de palabras que serán censuradas
const BANNED_WORDS = ['tonto', 'idiota', 'estúpido', 'perro', 'puta', 'gay'] // Puedo añadir más palabras

// Lista de emojis
const emojis = ['😀', '😂', '😍', '🥳', '😢', '👍', '🙏']

// --- FUNCIONES DE UTILIDAD ---
const censorMessage = (content) => {
  let censored = content
  BANNED_WORDS.forEach((word) => {
    // Expresión regular global e insensible a mayúsculas/minúsculas
    const regex = new RegExp(word, 'gi')
    // Reemplaza la palabra por asteriscos, manteniendo la longitud
    const replacement = '*'.repeat(word.length)
    censored = censored.replace(regex, replacement)
  })
  return censored
}

const ForumCrud = () => {
  // Referencia al contenedor de mensajes para el autoscroll
  const messagesEndRef = useRef(null)

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      author: 'Admin',
      content: '¡Bienvenidos al foro! 🎉 No se permiten palabras obscenas.',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      author: 'You',
      content:
        'Este es un mensaje con una palabra obsceno. Quiero decir, este es un mensaje con una palabra *******.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  // Efecto para hacer scroll al final de la discusión cada vez que se actualiza
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [discussions])

  // Maneja inserción de emoji en la posición actual del cursor
  const addEmoji = (emoji) => {
    const el = textareaRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const newText = message.substring(0, start) + emoji + message.substring(end, message.length)
    setMessage(newText)
    setTimeout(() => {
      // Posiciona el cursor después del emoji insertado
      el.selectionStart = el.selectionEnd = start + emoji.length
      el.focus()
    }, 0)
  }

  const handleDeleteMessage = (id) => {
    // Solo elimina si el usuario confirma
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      setDiscussions(discussions.filter((msg) => msg.id !== id))
    }
  }

  // Se extrae la lógica de publicación para ser llamada por handleSubmit y handleKeyDown
  const postMessage = () => {
    const rawMessage = message.trim()
    if (!rawMessage) return

    // 1. Aplicar la censura
    const safeContent = censorMessage(rawMessage)

    const newMsg = {
      id: discussions.length > 0 ? discussions[discussions.length - 1].id + 1 : 1,
      author: 'You', // Autor fijo para diferenciar
      content: safeContent,
      timestamp: new Date().toLocaleTimeString(),
    }

    setDiscussions([...discussions, newMsg])
    setMessage('')
  }

  // Función principal llamada al enviar el formulario (por el botón)
  const handleSubmit = (e) => {
    e.preventDefault()
    postMessage()
  }

  // **NUEVA FUNCIÓN** para manejar la pulsación de teclas
  const handleKeyDown = (e) => {
    // Si se presiona Enter Y NO se está presionando Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Previene el salto de línea por defecto
      postMessage() // Llama a la función de publicación
    }
    // Si se presiona Shift + Enter, el comportamiento por defecto (salto de línea) se mantiene
  }

  return (
    <CCard>
      <CCardHeader>💬 Foro de Discusiones Interactivo</CCardHeader>
      <CCardBody>
        {/* Contenedor de Mensajes (manteniendo la corrección de word-break) */}
        <CListGroup
          className="mb-3 forum-messages-container"
          style={{ maxHeight: 350, overflowY: 'auto' }}
        >
          {discussions.map(({ id, author, content, timestamp }) => {
            const isMe = author === 'You' // Para diferenciar visualmente mis mensajes

            return (
              <CListGroupItem
                key={id}
                className={`d-flex flex-column ${isMe ? 'align-items-end bg-light' : 'align-items-start bg-white'}`}
                style={{ borderLeft: isMe ? '4px solid #321fdb' : '4px solid #f9b115' }}
              >
                <div className="w-100 d-flex justify-content-between">
                  {/* Autor y Timestamp */}
                  <div className="d-flex align-items-center">
                    <CBadge color={isMe ? 'primary' : 'warning'} className="me-2">
                      {author}
                    </CBadge>
                    <small className="text-muted">{timestamp}</small>
                  </div>

                  {/* Botón de Eliminar */}
                  {isMe && (
                    <CButton
                      size="sm"
                      color="danger"
                      variant="ghost"
                      onClick={() => handleDeleteMessage(id)}
                    >
                      <span role="img" aria-label="Eliminar">
                        🗑️
                      </span>
                    </CButton>
                  )}
                </div>

                {/* Contenido del Mensaje */}
                <div
                  className={`mt-1 p-2 rounded ${isMe ? 'text-start' : 'text-start'}`}
                  style={{
                    whiteSpace: 'pre-wrap',
                    maxWidth: '90%',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  {content}
                </div>
              </CListGroupItem>
            )
          })}
          {/* Elemento vacío para hacer scroll */}
          <div ref={messagesEndRef} />
        </CListGroup>

        {/* Formulario de Envío de Mensajes */}
        <CForm onSubmit={handleSubmit}>
          <CFormTextarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // **NUEVO** Manejador de teclas
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje... (Presiona Enter para enviar, Shift+Enter para salto de línea)"
            rows={3}
            required
            className="mb-2"
          />

          {/* Botones de Emojis */}
          <div className="mb-2">
            {emojis.map((emoji) => (
              <CButton
                key={emoji}
                color="secondary"
                size="sm"
                variant="outline"
                className="me-2 mb-1"
                onClick={() => addEmoji(emoji)}
                type="button"
              >
                {emoji}
              </CButton>
            ))}
          </div>

          {/* Botón Enviar */}
          <CButton type="submit" color="primary">
            <span role="img" aria-label="Enviar">
              ✉️
            </span>{' '}
            Enviar Mensaje
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ForumCrud
