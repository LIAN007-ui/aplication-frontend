import React, { useState, useEffect } from 'react'
import api from '../../api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CAlert,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPuzzle, cilCheckCircle, cilTrash, cilCheck } from '@coreui/icons'

const TeacherQuestions = () => {


  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '0',
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const init = async () => {
        try {
            const { data: user } = await api.get('/users/profile')
            setCurrentUser(user)
            if (user && user.assigned_semester_id) {
                fetchQuestions(user.assigned_semester_id)
            }
        } catch (e) {
            console.error(e)
        }
    }
    init()
  }, [])

  const fetchQuestions = async (semester) => {
    try {
      const res = await api.get(`/questions/semester/${semester}`)
      setQuestions(res.data.reverse())
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!newQuestion.question.trim() || !newQuestion.option1.trim() || !newQuestion.option2.trim()) {
      setMessage({ type: 'danger', text: 'Complete la pregunta y al menos 2 opciones' })
      return
    }

    setSubmitting(true)
    try {
      const options = [
        newQuestion.option1,
        newQuestion.option2,
        newQuestion.option3,
        newQuestion.option4,
      ].filter((o) => o.trim())

      const qData = {
        id: `q${Date.now()}`,
        question: newQuestion.question,
        options: options,
        answer: parseInt(newQuestion.answer),
        semester_id: currentUser.assigned_semester_id
      }

      await api.post(`/questions`, qData)
      setMessage({ type: 'success', text: '¡Pregunta creada exitosamente!' })
      setNewQuestion({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '0',
      })
      fetchQuestions(currentUser.assigned_semester_id)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error al crear la pregunta' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta pregunta?')) return
    
    try {
      await api.delete(`/questions/${id}`)
      setQuestions(questions.filter(q => q.id !== id))
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <style>{`
        .question-card {
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }
        .question-card:hover {
          border-left-color: #f59e0b;
          background-color: rgba(245, 158, 11, 0.02);
        }
        .correct-option {
          background-color: rgba(34, 197, 94, 0.1);
          border-color: #22c55e !important;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">
            <CIcon icon={cilPuzzle} className="me-2 text-warning" />
            Banco de Preguntas
          </h2>
          <span className="text-muted">
            Crea preguntas para el juego educativo • Semestre {currentUser?.assigned_semester_id}
          </span>
        </div>
        <CBadge color="warning" textColor="dark" className="px-3 py-2 fs-6">
          {questions.length} preguntas
        </CBadge>
      </div>

      <CRow>
        <CCol lg={5}>
          <CCard className="border-0 shadow-sm sticky-top" style={{ top: '1rem' }}>
            <CCardHeader className="bg-warning text-dark border-0">
              <strong>Nueva Pregunta</strong>
            </CCardHeader>
            <CCardBody>
              {message.text && (
                <CAlert 
                  color={message.type} 
                  dismissible 
                  onClose={() => setMessage({ type: '', text: '' })}
                >
                  {message.text}
                </CAlert>
              )}
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Pregunta</CFormLabel>
                  <CFormInput
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="Escribe la pregunta..."
                  />
                </div>
                
                <CFormLabel className="fw-semibold">Opciones de Respuesta</CFormLabel>
                <div className="mb-2">
                  <CFormInput
                    value={newQuestion.option1}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option1: e.target.value })}
                    placeholder="Opción 1 (requerida)"
                    className="mb-2"
                  />
                  <CFormInput
                    value={newQuestion.option2}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option2: e.target.value })}
                    placeholder="Opción 2 (requerida)"
                    className="mb-2"
                  />
                  <CFormInput
                    value={newQuestion.option3}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option3: e.target.value })}
                    placeholder="Opción 3 (opcional)"
                    className="mb-2"
                  />
                  <CFormInput
                    value={newQuestion.option4}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option4: e.target.value })}
                    placeholder="Opción 4 (opcional)"
                  />
                </div>
                
                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Respuesta Correcta</CFormLabel>
                  <CFormSelect
                    value={newQuestion.answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                  >
                    <option value="0">Opción 1</option>
                    <option value="1">Opción 2</option>
                    <option value="2">Opción 3</option>
                    <option value="3">Opción 4</option>
                  </CFormSelect>
                </div>

                <CButton 
                  type="submit" 
                  color="warning" 
                  className="w-100 fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <CSpinner size="sm" className="me-2" />
                  ) : (
                    <CIcon icon={cilCheckCircle} className="me-2" />
                  )}
                  Crear Pregunta
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={7}>
          <h5 className="fw-bold mb-3">Preguntas Creadas</h5>
          
          {questions.length === 0 ? (
            <CCard className="border-0 shadow-sm text-center py-5">
              <CCardBody>
                <CIcon icon={cilPuzzle} size="3xl" className="text-muted mb-3 opacity-25" />
                <p className="text-muted mb-0">No hay preguntas aún</p>
              </CCardBody>
            </CCard>
          ) : (
            questions.map((q, index) => (
              <CCard key={q.id} className="question-card border-0 shadow-sm mb-3">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <CBadge color="light" textColor="dark" className="me-3 fs-6">
                        #{questions.length - index}
                      </CBadge>
                      <h6 className="fw-bold mb-0">{q.question}</h6>
                    </div>
                    <CButton 
                      color="danger" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(q.id)}
                      title="Eliminar"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                  
                  <CListGroup flush>
                    {q.options.map((opt, i) => (
                      <CListGroupItem 
                        key={i} 
                        className={`border-start border-3 ${i === q.answer ? 'correct-option border-success' : 'border-light'}`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{opt}</span>
                          {i === q.answer && (
                            <CBadge color="success" className="rounded-pill">
                              <CIcon icon={cilCheck} size="sm" className="me-1" />
                              Correcta
                            </CBadge>
                          )}
                        </div>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCardBody>
              </CCard>
            ))
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default TeacherQuestions
