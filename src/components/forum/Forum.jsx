import React, { useState, useRef, useEffect, useMemo } from 'react'
// CAMBIO: Usamos 'api' para conectar al puerto 5000
import api from '../../api' 
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

const BANNED_WORDS = ['tonto', 'idiota', 'estúpido', 'perro', 'puto', 'gay', 'mierda']
const emojis = ['😀', '😂', '😍', '🥳', '😎', '💡', '🔥', '🚀']

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
  if (isNaN(date.getTime())) return 'Reciente'
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
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const [discussions, setDiscussions] = useState([])
  const [message, setMessage] = useState('')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const [currentUserProfile, setCurrentUserProfile] = useState(null)
  const [currentSemesterId, setCurrentSemesterId] = useState(null)

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [msgToDelete, setMsgToDelete] = useState(null)
  const [deleteContext, setDeleteContext] = useState('own')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const profileRes = await api.get('/users/profile')
        const profile = profileRes.data
        setCurrentUserProfile(profile)

        let semId = null
        if (profile.role === 'student') {
            semId = profile.current_semester_id || 1 
        } else if (profile.role === 'teacher') {
            semId = profile.assigned_semester_id
        } else {
             semId = 1
        }
        
        setCurrentSemesterId(semId)

        if (semId) {
            const msgRes = await api.get(`/forum/semester/${semId}`)
            
            const formattedMessages = msgRes.data.map(m => ({
                id: m.id,
                content: m.content,
                timestamp: m.created_at,
                author: m.author_name || 'Usuario',
                authorId: m.user_id, 
                isTeacher: m.role === 'teacher',
                photo: m.author_photo,
                likes: 0 
            }))
            
            setDiscussions(formattedMessages)
        }

      } catch (e) { 
        console.error('Error cargando foro:', e)
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

  const handleLike = (id) => {
    const msg = discussions.find((m) => m.id === id)
    if (!msg) return
    const updatedMsg = { ...msg, likes: (msg.likes || 0) + 1 }
    setDiscussions(discussions.map((d) => (d.id === id ? updatedMsg : d))) 
  }

  const openDeleteModal = (id) => {
    const currentMsg = discussions.find(d => d.id === id)
    if (!currentMsg) return

    const myId = currentUserProfile?.id
    const myRole = currentUserProfile?.role

    const isMyMessage = currentMsg.authorId === myId

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
        await api.delete(`/forum/${msgToDelete}`)
        setDiscussions(discussions.filter((msg) => msg.id !== msgToDelete))
    } catch (e) { 
        console.error(e) 
        alert("No se pudo eliminar el mensaje")
    } 
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
    
    if (!currentSemesterId) {
        alert("No tienes un semestre asignado para comentar.")
        return
    }

    try {
      const res = await api.post('/forum', {
          content: safeContent,
          semester_id: currentSemesterId
      })
      
      const newMsgDisplay = {
          id: res.data.id,
          content: safeContent,
          timestamp: new Date().toISOString(),
          author: currentUserProfile.first_name || currentUserProfile.full_name || currentUserProfile.username,
          authorId: currentUserProfile.id,
          isTeacher: currentUserProfile.role === 'teacher',
          photo: currentUserProfile.photo_url,
          likes: 0
      }

      setDiscussions([...discussions, newMsgDisplay])
      setMessage('')
      setShowEmojiPicker(false)
    } catch (e) { console.error(e) }
  }

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji)
    inputRef.current?.focus()
  }

  const getAvatarData = (msg) => {
    if (msg.photo) return { src: msg.photo, color: 'transparent', letter: '', isPhoto: true }
    
    if (msg.author === 'Admin' || msg.author === 'Administrador') {
      return { src: null, color: 'danger', letter: 'A', isPhoto: false }
    }
    
    if (msg.isTeacher) {
      return { src: null, color: 'success', letter: 'D', isPhoto: false }
    }
    
    const initial = msg.author ? msg.author.charAt(0).toUpperCase() : '?'
    return { src: null, color: 'info', letter: initial, isPhoto: false }
  }

  return (
    <CCard className="shadow-lg border-0 h-100" style={{ borderRadius: '20px', overflow: 'hidden' }}>
      
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

        /* CORRECCIONES MODO OSCURO */
        [data-coreui-theme="dark"] .animated-chat-bg {
          background-color: #0f172a !important;
          background-image: 
            linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), transparent),
            linear-gradient(0deg, transparent, rgba(56, 189, 248, 0.4), transparent),
            radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 60%) !important;
        }
        
        [data-coreui-theme="dark"] .card-header-dark {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
          color: #fff !important;
        }
        
        [data-coreui-theme="dark"] .input-dark-mode {
          background-color: #334155 !important;
          color: #f8fafc !important;
          border: 1px solid #475569 !important;
        }
        [data-coreui-theme="dark"] .input-dark-mode::placeholder {
          color: #94a3b8 !important;
        }
        
        [data-coreui-theme="dark"] .emoji-picker-dark {
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
        }
        
        [data-coreui-theme="dark"] .text-muted-dark { color: #cbd5e1 !important; }

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

      <CCardHeader className="card-header-dark bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top z-index-10">
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width: 45, height: 45}}>
            <CIcon icon={cilPaperPlane} size="lg"/>
          </div>
          <div>
            <h5 className="mb-0 fw-bold">
              Foro Estudiantil {currentSemesterId ? `- Semestre ${currentSemesterId}` : ''}
            </h5>
            <small className="text-muted text-muted-dark">
              {loading ? 'Conectando...' : `${discussions.length} mensajes • En línea`}
            </small>
          </div>
        </div>

        <div style={{ maxWidth: '250px' }} className="d-none d-md-block">
          <CInputGroup size="sm">
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
      
      <CCardBody className="p-0 d-flex flex-column" style={{ height: '70vh' }}>
        
        <div className="flex-grow-1 p-4 overflow-auto custom-scrollbar animated-chat-bg">
          {loading ? (
             <div className="text-center mt-5"><CSpinner color="primary"/></div>
          ) : (
            filteredDiscussions.map((msg) => {
              const isMe = msg.authorId === currentUserProfile?.id
              const iAmAdmin = currentUserProfile?.role === 'admin'
              const canDelete = isMe || iAmAdmin
              
              const avatarData = getAvatarData(msg)

              return (
                <div key={msg.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'} fade-in-up`}>
                  
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
                      backgroundColor: isMe ? '#3b82f6' : (msg.isTeacher ? '#ecfdf5' : '#ffffff'),
                      color: isMe ? '#ffffff' : '#1e293b',
                      border: msg.isTeacher && !isMe ? '1px solid #10b981' : 'none'
                    }}
                  >
                    <div className={`fw-bold small mb-1 ${isMe ? 'text-end text-white-50' : ''}`} style={{ color: isMe ? '' : (msg.isTeacher ? '#10b981' : '#64748b') }}>
                        {isMe ? 'Tú' : (msg.isTeacher ? `${msg.author} (Docente)` : msg.author)}
                    </div>

                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                      {msg.content}
                    </div>

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
                    
                    {canDelete && (
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

        <div className="footer-input-dark p-3 bg-white border-top">
           {showEmojiPicker && (
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

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
        <CModalHeader className="border-0 pb-0">
             <CModalTitle className="fw-bold">Eliminar Mensaje</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
            <div className="mb-3 text-danger">
                <CIcon icon={cilTrash} size="4xl" />
            </div>
            <h5>¿Seguro que quieres eliminar este mensaje?</h5>
            <p className="text-muted mb-0">Esta acción no se puede deshacer.</p>
        </CModalBody>
        <CModalFooter className="border-0 justify-content-center pt-0 gap-3">
            <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>
                Cancelar
            </CButton>
            <CButton color="danger" className="px-4 text-white" onClick={confirmDelete}>
                Eliminar
            </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default ForumCrud