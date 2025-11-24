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
} from '@coreui/react'

// Lista de emojis
const emojis = ['😀', '😂', '😍', '🥳', '😢']

const ForumCrud = () => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      author: 'Admin',
      content: '¡Bienvenidos al foro! 🎉',
      timestamp: new Date().toLocaleString(),
    },
  ])
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  // Maneja inserción de emoji en la posición actual del cursor
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    const newMsg = {
      id: discussions.length + 1,
      author: 'You',
      content: message,
      timestamp: new Date().toLocaleString(),
    }
    setDiscussions([...discussions, newMsg])
    setMessage('')
  }

  return (
    <CCard>
      <CCardHeader>Foro de Discusiones</CCardHeader>
      <CCardBody>
        <CListGroup className="mb-3" style={{ maxHeight: 300, overflowY: 'auto' }}>
          {discussions.map(({ id, author, content, timestamp }) => (
            <CListGroupItem key={id}>
              <strong>{author}</strong> <small className="text-muted">{timestamp}</small>
              <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
            </CListGroupItem>
          ))}
        </CListGroup>

        <CForm onSubmit={handleSubmit}>
          <CFormTextarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            rows={3}
            required
          />
          <div className="my-2">
            {emojis.map((emoji) => (
              <CButton
                key={emoji}
                color="light"
                size="sm"
                className="me-2"
                onClick={() => addEmoji(emoji)}
                type="button"
              >
                {emoji}
              </CButton>
            ))}
          </div>
          <CButton type="submit" color="primary">
            Enviar
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ForumCrud
