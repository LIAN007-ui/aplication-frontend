import React, { useState, useRef, useEffect, useMemo } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CAvatar,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPaperPlane, 
  cilSearch, 
  cilXCircle, 
  cilMoodGood, 
  cilThumbUp,
  cilUser,
  cilTrash,
  cilWarning
} from '@coreui/icons'

// --- CONFIGURACIÓN ---
const BANNED_WORDS = ['tonto', 'idiota', 'estúpido', 'perro', 'puto', 'gay', 'liander']
const emojis = ['😀', '😂', '😍', '🥳', '😎', '💡', '🔥', '🚀']

// --- HELPERS ---
const censorMessage = (content) => {
  if (!content) return ''
  let censored = String(content)
  BANNED_WORDS.forEach((word) => {
    const regex = new RegExp(word, 'gi')
    const replacement = '*'.repeat(word.length)
    censored = censored.replace(regex, replacement)
  })
  return censored
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  if (seconds < 60) return "Hace un momento"
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " años"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " meses"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " días"
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " h"
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " min"
  return "Hace un momento"
}

const ForumCrud = () => {
  const API_URL_MESSAGES = 'http://localhost:3001/messages'
  const API_URL_USERS = 'http://localhost:3001/users'
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const [discussions, setDiscussions] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [message, setMessage] = useState('')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Estados Modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [msgToDelete, setMsgToDelete] = useState(null)
  const [deleteContext, setDeleteContext] = useState('own')

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMessages, resUsers] = await Promise.all([
          axios.get(API_URL_MESSAGES),
          axios.get(API_URL_USERS)
        ])
        setDiscussions(Array.isArray(resMessages.data) ? resMessages.data : [])
        
        const userMap = {}
        if (Array.isArray(resUsers.data)) {
          resUsers.data.forEach(user => {
            if (user.username) userMap[user.username] = user.foto || null 
          })
        }
        setUsersMap(userMap)
      } catch (e) { 
        console.error('Error cargando datos:', e)
        setDiscussions([]) 
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [discussions])

  const filteredDiscussions = useMemo(() => {
    if (!searchText) return discussions
    return discussions.filter(d => {
      const content = d.content ? d.content.toLowerCase() : ''
      const author = d.author ? d.author.toLowerCase() : ''
      const search = searchText.toLowerCase()
      return content.includes(search) || author.includes(search)
    })
  }, [discussions, searchText])

  // --- ACCIONES ---
  const handleLike = async (id) => {
    const msg = discussions.find((m) => m.id === id)
    if (!msg) return
    const updatedMsg = { ...msg, likes: (msg.likes || 0) + 1 }
    setDiscussions(discussions.map((d) => (d.id === id ? updatedMsg : d))) 
    try { await axios.put(`${API_URL_MESSAGES}/${id}`, updatedMsg) } catch (e) { console.error(e) }
  }

  const openDeleteModal = (id) => {
    const currentMsg = discussions.find(d => d.id === id)
    if (!currentMsg) return

    let currentUser = null
    let myRole = ''
    try {
        const stored = localStorage.getItem('currentUser')
        if (stored) currentUser = JSON.parse(stored)
        myRole = localStorage.getItem('userRole')
    } catch (e) {}

    const myUsername = currentUser ? currentUser.username : ''
    const isMyMessage = currentMsg.author === myUsername

    if (isMyMessage) {
        setDeleteContext('own')
    } else if (myRole === 'admin') {
        setDeleteContext('admin')
    } else {
        return
    }
    setMsgToDelete(id)
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    if (!msgToDelete) return
    try {
        if (deleteContext === 'admin') {
            const currentMsg = discussions.find(d => d.id === msgToDelete)
            const tombstoneMsg = {
                ...currentMsg,
                content: "🚫 Mensaje eliminado por la administración",
                deletedByAdmin: true
            }
            await axios.put(`${API_URL_MESSAGES}/${msgToDelete}`, tombstoneMsg)
            setDiscussions(discussions.map(d => d.id === msgToDelete ? tombstoneMsg : d))
        } else {
            await axios.delete(`${API_URL_MESSAGES}/${msgToDelete}`)
            setDiscussions(discussions.filter((msg) => msg.id !== msgToDelete))
        }
    } catch (e) { console.error(e) } 
    finally {
        setDeleteModalVisible(false)
        setMsgToDelete(null)
    }
  }

  const postMessage = async (e) => {
    e.preventDefault()
    const rawMessage = message.trim()
    if (!rawMessage) return

    const safeContent = censorMessage(rawMessage)
    
    let currentUser = null
    let userRole = null
    try {
        const stored = localStorage.getItem('currentUser')
        if (stored) currentUser = JSON.parse(stored)
        userRole = localStorage.getItem('userRole')
    } catch (e) {}
    
    let authorName = 'Anónimo'
    if (userRole === 'admin') authorName = 'Admin'
    else if (currentUser && currentUser.username) authorName = currentUser.username

    const newMsg = {
      author: authorName,
      content: safeContent,
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    try {
      const res = await axios.post(API_URL_MESSAGES, newMsg)
      setDiscussions([...discussions, res.data])
      setMessage('')
      setShowEmojiPicker(false)
    } catch (e) { console.error(e) }
  }

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji)
    inputRef.current?.focus()
  }

  const getAvatarForUser = (authorName) => {
    if (!authorName) return { src: null, color: 'secondary', letter: '?', isPhoto: false }
    if (authorName === 'Admin' || authorName === 'Administración UNEFA') {
      return { src: null, color: 'danger', letter: 'A', isPhoto: false }
    }
    const userPhoto = usersMap[authorName]
    if (userPhoto) return { src: userPhoto, color: 'transparent', letter: '', isPhoto: true }
    
    const initial = authorName.charAt(0) ? authorName.charAt(0).toUpperCase() : '?'
    return { src: null, color: 'info', letter: initial, isPhoto: false }
  }

  return (
    <CCard className="shadow-lg border-0 h-100" style={{ borderRadius: '20px', overflow: 'hidden' }}>
      
      {/* --- ESTILOS CSS CON CORRECCIÓN MODO OSCURO --- */}
      <style>{`
        /* Animación Partículas */
        @keyframes floatRandom {
          0% { background-position: 10% 10%, 90% 90%, 50% 10%; }
          50% { background-position: 50% 90%, 50% 10%, 90% 50%; }
          100% { background-position: 10% 10%, 90% 90%, 50% 10%; }
        }

        .animated-chat-bg {
          background-color: #f8fafc; 
          background-image: 
            linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent),
            linear-gradient(0deg, transparent, rgba(59, 130, 246, 0.2), transparent),
            radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
          background-size: 40% 3px, 3px 40%, 400px 400px;
          background-repeat: no-repeat;
          animation: floatRandom 25s infinite ease-in-out;
        }

        /* --- CORRECCIONES MODO OSCURO --- */
        [data-coreui-theme="dark"] .animated-chat-bg {
          background-color: #0f172a !important;
          background-image: 
            linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), transparent),
            linear-gradient(0deg, transparent, rgba(56, 189, 248, 0.4), transparent),
            radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 60%) !important;
        }
        
        /* Corregir Cabecera y Fondo en Dark Mode */
        [data-coreui-theme="dark"] .card-header-dark {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
          color: #fff !important;
        }
        
        /* Corregir Inputs (Buscador y Chat) en Dark Mode */
        [data-coreui-theme="dark"] .input-dark-mode {
          background-color: #334155 !important;
          color: #f8fafc !important;
          border: 1px solid #475569 !important;
        }
        [data-coreui-theme="dark"] .input-dark-mode::placeholder {
          color: #94a3b8 !important;
        }
        
        /* Corregir Selector de Emojis en Dark Mode */
        [data-coreui-theme="dark"] .emoji-picker-dark {
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
        }
        
        /* Corregir Iconos en Dark Mode */
        [data-coreui-theme="dark"] .text-muted-dark {
            color: #cbd5e1 !important;
        }

        /* Footer de Input en Dark Mode */
        [data-coreui-theme="dark"] .footer-input-dark {
             background-color: #1e293b !important;
             border-top: 1px solid #334155 !important;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.4); border-radius: 20px; }
        .fade-in-up { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.05); }
      `}</style>

      {/* CABECERA (Con clase para Dark Mode) */}
      <CCardHeader className="card-header-dark bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top z-index-10">
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width: 45, height: 45}}>
            <CIcon icon={cilPaperPlane} size="lg"/>
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Foro Estudiantil</h5>
            <small className="text-muted text-muted-dark">
              {loading ? 'Conectando...' : `${discussions.length} mensajes • En línea`}
            </small>
          </div>
        </div>

        <div style={{ maxWidth: '250px' }} className="d-none d-md-block">
          <CInputGroup size="sm">
            {/* Input Buscador Corregido */}
            <CInputGroupText className="input-dark-mode bg-light border-0"><CIcon icon={cilSearch}/></CInputGroupText>
            <CFormInput 
              className="input-dark-mode bg-light border-0" 
              placeholder="Buscar..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{borderRadius: '0 50px 50px 0'}}
            />
            {searchText && (
               <CButton color="light" size="sm" onClick={() => setSearchText('')} className="input-dark-mode"><CIcon icon={cilXCircle}/></CButton>
            )}
          </CInputGroup>
        </div>
      </CCardHeader>
      
      {/* CUERPO DEL CHAT */}
      <CCardBody className="p-0 d-flex flex-column" style={{ height: '70vh' }}>
        
        <div className="flex-grow-1 p-4 overflow-auto custom-scrollbar animated-chat-bg">
          {loading ? (
             <div className="text-center mt-5"><CSpinner color="primary"/></div>
          ) : (
            filteredDiscussions.map((msg) => {
              let currentUser = null
              let myRole = ''
              try {
                  const stored = localStorage.getItem('currentUser')
                  if (stored) currentUser = JSON.parse(stored)
                  myRole = localStorage.getItem('userRole')
              } catch (e) {}

              const myUsername = currentUser ? currentUser.username : ''
              const msgAuthor = msg.author || 'Anónimo'
              
              const isMe = msgAuthor === myUsername || (msgAuthor === 'Admin' && myRole === 'admin')
              const canDelete = isMe || myRole === 'admin'
              const avatarData = getAvatarForUser(msgAuthor)
              const isDeletedMsg = msg.content && msg.content.includes("🚫 Mensaje eliminado")

              return (
                <div key={msg.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'} fade-in-up`}>
                  
                  {/* Avatar Izquierda */}
                  {!isMe && (
                    <CAvatar 
                      src={avatarData.isPhoto ? avatarData.src : undefined} 
                      color={avatarData.color}
                      textColor="white"
                      size="md" 
                      className="me-2 shadow-sm border border-white align-self-end mb-2"
                    >
                      {!avatarData.isPhoto && (avatarData.letter || <CIcon icon={cilUser}/>)}
                    </CAvatar>
                  )}

                  <div 
                    className="shadow-sm position-relative"
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      borderTopLeftRadius: !isMe ? '2px' : '18px',
                      borderTopRightRadius: isMe ? '2px' : '18px',
                      backgroundColor: isDeletedMsg ? '#f1f5f9' : (isMe ? '#3b82f6' : '#ffffff'),
                      color: isDeletedMsg ? '#94a3b8' : (isMe ? '#ffffff' : '#1e293b'),
                      border: isDeletedMsg ? '1px dashed #cbd5e1' : 'none'
                    }}
                  >
                    {!isDeletedMsg && (
                        <div className={`fw-bold small mb-1 ${isMe ? 'text-end text-white-50' : ''}`} style={{ color: !isMe && msgAuthor === 'Admin' ? '#ef4444' : (!isMe ? '#64748b' : '') }}>
                            {isMe ? 'Tú' : msgAuthor}
                        </div>
                    )}

                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', fontStyle: isDeletedMsg ? 'italic' : 'normal' }}>
                      {msg.content || <i>(Mensaje vacío)</i>}
                    </div>

                    {!isDeletedMsg && (
                        <div className={`d-flex align-items-center justify-content-end mt-1 gap-2 ${isMe ? 'text-white-50' : 'text-muted'}`}>
                        <small style={{ fontSize: '0.7rem' }}>{timeAgo(msg.timestamp)}</small>
                        <div 
                            className="d-flex align-items-center" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleLike(msg.id)}
                        >
                            <CIcon icon={cilThumbUp} size="sm" style={{width: 12}} />
                            {msg.likes > 0 && <span className="ms-1 small fw-bold">{msg.likes}</span>}
                        </div>
                        </div>
                    )}
                    
                    {canDelete && !isDeletedMsg && (
                      <div 
                        className="position-absolute top-0 start-0 translate-middle"
                        style={{ cursor: 'pointer', opacity: 0.9, zIndex: 5 }}
                        onClick={() => openDeleteModal(msg.id)}
                      >
                         <div className="bg-danger text-white rounded-circle p-1 shadow-sm" style={{width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <CIcon icon={cilTrash} size="sm" style={{width: 12}} />
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar Derecha */}
                  {isMe && (
                    <CAvatar 
                      src={avatarData.isPhoto ? avatarData.src : undefined} 
                      color={avatarData.color}
                      textColor="white"
                      size="md" 
                      className="ms-2 shadow-sm border border-white align-self-end mb-2"
                    >
                      {!avatarData.isPhoto && (avatarData.letter || <CIcon icon={cilUser}/>)}
                    </CAvatar>
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT (Footer) CON CORRECCIÓN MODO OSCURO */}
        <div className="footer-input-dark p-3 bg-white border-top">
           {showEmojiPicker && (
              // Selector Emojis Corregido
              <div className="emoji-picker-dark mb-2 p-2 bg-light rounded d-flex gap-2 overflow-auto shadow-sm animate__animated animate__fadeInUp">
                {emojis.map(e => (
                  <button key={e} onClick={() => addEmoji(e)} className="btn btn-sm btn-ghost-dark fs-5 p-1 border-0">{e}</button>
                ))}
              </div>
           )}
           <CForm onSubmit={postMessage} className="d-flex align-items-center gap-2">
              <CButton color="light" variant="ghost" className="text-muted text-muted-dark rounded-circle p-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)} type="button">
                <CIcon icon={cilMoodGood} size="xl"/>
              </CButton>
              
              {/* Input Chat Corregido */}
              <CFormInput 
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="input-dark-mode border-0 bg-light rounded-pill py-2 px-4 shadow-inner"
                autoComplete="off"
              />
              <CButton type="submit" color="primary" className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm hover-scale" disabled={!message.trim()} style={{width: 50, height: 50}}>
                <CIcon icon={cilPaperPlane} className="text-white ms-1"/>
              </CButton>
           </CForm>
        </div>
      </CCardBody>

      {/* MODAL (El modal suele adaptarse solo en CoreUI v5, pero por si acaso) */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center" transition={true}>
        <CModalHeader className="border-0 pb-0">
             <CModalTitle className={deleteContext === 'admin' ? "text-danger fw-bold" : "fw-bold"}>
                 {deleteContext === 'admin' ? 'Advertencia de Administrador' : 'Eliminar Mensaje'}
             </CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
            <div className={`mb-3 ${deleteContext === 'admin' ? 'text-danger' : 'text-warning'}`}>
                <CIcon icon={deleteContext === 'admin' ? cilWarning : cilTrash} size="4xl" />
            </div>
            {deleteContext === 'admin' ? (
                <>
                    <h5 className="fw-bold">¿Eliminar mensaje de otro usuario?</h5>
                    <p className="text-muted mb-0">
                        Esta acción ocultará el mensaje original y mostrará: <br/>
                        <em>"Eliminado por la administración"</em>. <br/>
                        <strong>Esto afectará a todos los usuarios.</strong>
                    </p>
                </>
            ) : (
                <>
                    <h5>¿Seguro que quieres eliminar este mensaje?</h5>
                    <p className="text-muted mb-0">Esta acción no se puede deshacer.</p>
                </>
            )}
        </CModalBody>
        <CModalFooter className="border-0 justify-content-center pt-0 gap-3">
            <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>
                Cancelar
            </CButton>
            <CButton 
                color={deleteContext === 'admin' ? 'danger' : 'primary'} 
                className="px-4 text-white" 
                onClick={confirmDelete}
            >
                {deleteContext === 'admin' ? 'Confirmar Censura' : 'Aceptar'}
            </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default ForumCrud