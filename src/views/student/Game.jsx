import React, { useState, useEffect } from 'react'
import api from '../../api'
import {
  CContainer, CCard, CCardBody, CCardHeader, CButton, CProgress, CRow, CCol, CSpinner, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilStar, cilClock, cilList, cilCheck, cilX, cilSmile, cilLockLocked } from '@coreui/icons'

const ModuloJuego = () => {

  const [masterQuestions, setMasterQuestions] = useState([]) 
  const [questions, setQuestions] = useState([])
  const [gameState, setGameState] = useState('LOADING') 
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isLocked, setIsLocked] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  
  const [highScore, setHighScore] = useState(0)
  const [userId, setUserId] = useState(null)
  const [userSemester, setUserSemester] = useState(null)

  // Estado de intentos
  const [attemptsUsed, setAttemptsUsed] = useState(0)
  const [maxAttempts, setMaxAttempts] = useState(2)

  useEffect(() => {
    const initData = async () => {
      try {
        let semester = null
        let uid = null
        
        try {
            const { data: userData } = await api.get('/users/profile')
            
            if (userData) {
                uid = userData.id
                setUserId(userData.id)
                setHighScore(userData.puntuacion || 0)
                
                if (userData.current_semester_id) {
                    semester = userData.current_semester_id
                    setUserSemester(userData.current_semester_id)
                }
            }
        } catch (err) { 
            console.error("Error cargando perfil usuario:", err) 
        }

        // Consultar intentos
        if (uid && semester) {
          try {
            const { data: attemptData } = await api.get(`/quiz-attempts/${uid}/${semester}`)
            setAttemptsUsed(attemptData.attempts_used)
            setMaxAttempts(attemptData.max_attempts)

            if (attemptData.attempts_used >= attemptData.max_attempts) {
              setGameState('BLOCKED')
              return
            }
          } catch (err) {
            console.error("Error consultando intentos:", err)
          }
        }

        let qResponse = { data: [] }
        if (semester) {
             try {
                qResponse = await api.get(`/questions/semester/${semester}`)
             } catch (e) {
                console.error("Error cargando preguntas:", e)
                qResponse = { data: [] }
             }
        }

        let filteredQuestions = qResponse.data.map(q => ({
             ...q, 
             answer: q.correct_answer, 
             question: q.question_text 
        }))
        
        if (filteredQuestions && filteredQuestions.length > 0) {
            setMasterQuestions(filteredQuestions)
            setGameState('START') 
        } else {
            setGameState('NO_QUESTIONS')
        }

      } catch (e) {
        console.error("Error inicializando:", e)
      }
    }
    initData()
  }, [])

  useEffect(() => {
    let timer
    if (gameState === 'PLAYING' && !isLocked && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000)
    } else if (timeLeft === 0 && !isLocked && gameState === 'PLAYING') {
      handleAnswer(null) 
    }
    return () => clearInterval(timer)
  }, [timeLeft, isLocked, gameState])

  const startGame = () => {
    if (masterQuestions.length === 0) return;
    if (attemptsUsed >= maxAttempts) return;

    const count = Math.min(masterQuestions.length, 10)
    
    const shuffled = [...masterQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, count) 
      .map(q => {
        return {
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5)
        }
      })

    setQuestions(shuffled)
    setGameState('PLAYING')
    setCurrentIdx(0)
    setScore(0)
    setTimeLeft(15) 
    setIsLocked(false)
    setSelectedOption(null)
  }

  const handleAnswer = (option) => {
    setIsLocked(true)
    setSelectedOption(option)
    
    if (!questions[currentIdx]) return;

    const correct = questions[currentIdx].answer
    const isCorrect = option === correct

    if (isCorrect) setScore(s => s + 1)

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1)
        setTimeLeft(15)
        setIsLocked(false)
        setSelectedOption(null)
      } else {
        finishGame(isCorrect ? score + 1 : score)
      }
    }, 2000)
  }

  const finishGame = async (finalScore) => {
    setGameState('RESULT')

    // Registrar intento
    if (userId && userSemester) {
      try {
        const { data } = await api.post('/quiz-attempts/register', { user_id: userId, semester_id: userSemester })
        setAttemptsUsed(data.attempts_used)
      } catch (e) { console.error("Error registrando intento", e) }
    }

    if (userId && finalScore > highScore) {
      try {
        await api.patch(`/users/${userId}`, { puntuacion: finalScore })
        setHighScore(finalScore)
      } catch (e) { console.error("Error guardando récord", e) }
    }
  }

  const currentQuestion = questions && questions[currentIdx] ? questions[currentIdx] : null
  const remainingAttempts = maxAttempts - attemptsUsed

  if (gameState === 'LOADING') return <div className="d-flex justify-content-center p-5"><CSpinner color="primary"/></div>

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 113px)', overflow: 'hidden', marginTop: '-1.5rem' }}>
      <style>{`
        @keyframes softBeamMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-bg-layer {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;
          background-color: #e2e8f0; 
          background-image: linear-gradient(-45deg, #e2e8f0, #f1f5f9, #dbeafe, #f1f5f9);
          background-size: 400% 400%; animation: softBeamMove 15s ease infinite;
        }
        [data-coreui-theme="dark"] .animated-bg-layer { background-color: #0f172a; background-image: linear-gradient(-45deg, #0f172a, #1e293b, #1e3a8a, #0f172a); }
        .solid-card { position: relative; z-index: 1; background: #ffffff !important; border: none; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        [data-coreui-theme="dark"] .solid-card { background: #1e293b !important; border: 1px solid #334155 !important; color: white; }
        .option-btn { transition: transform 0.2s; } .option-btn:hover:not(:disabled) { transform: scale(1.02); }
        .fade-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .floating-icon { animation: float 3s ease-in-out infinite; }

        .bg-message-adaptive { background-color: #f8f9fa; color: #6c757d; }
        [data-coreui-theme="dark"] .bg-message-adaptive { background-color: #374151; color: #d1d5db; }

        /* Botón congelado */
        @keyframes frozenPulse {
          0% { box-shadow: 0 0 0 0 rgba(147, 197, 253, 0.5); }
          50% { box-shadow: 0 0 20px 8px rgba(147, 197, 253, 0.3); }
          100% { box-shadow: 0 0 0 0 rgba(147, 197, 253, 0.5); }
        }
        @keyframes iceShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .frozen-btn {
          position: relative;
          background: linear-gradient(135deg, #93c5fd 0%, #bfdbfe 30%, #dbeafe 50%, #bfdbfe 70%, #93c5fd 100%) !important;
          background-size: 200% 100% !important;
          animation: frozenPulse 3s ease-in-out infinite, iceShimmer 4s linear infinite;
          border: 2px solid #60a5fa !important;
          color: #1e3a5f !important;
          cursor: not-allowed !important;
          pointer-events: none;
          opacity: 0.85;
          filter: saturate(0.7);
          font-weight: 700 !important;
        }
        .frozen-btn::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 200%;
          animation: iceShimmer 3s linear infinite;
          pointer-events: none;
        }
        [data-coreui-theme="dark"] .frozen-btn {
          background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 30%, #2563eb 50%, #1e40af 70%, #1e3a5f 100%) !important;
          border-color: #3b82f6 !important;
          color: #93c5fd !important;
        }

        /* Corazones de vida */
        @keyframes heartBeat { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .heart-alive { animation: heartBeat 1.5s ease-in-out infinite; display: inline-block; }
        .heart-dead { filter: grayscale(1); opacity: 0.3; display: inline-block; }
      `}</style>

      <div className="animated-bg-layer"></div>

      <CContainer className="py-5 mt-5">
        <CRow className="justify-content-center">
          <CCol md={8} lg={7}>
            <CCard className="solid-card rounded-4 overflow-hidden fade-in" style={{ minHeight: '500px' }}>
              
              {/* PANTALLA START */}
              {gameState === 'START' && (
                <CCardBody className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                  <div className="mb-4 p-4 rounded-circle bg-primary bg-opacity-10 shadow-sm"><CIcon icon={cilList} size="5xl" className="text-primary" /></div>
                  <h2 className="fw-bold mb-3">Quiz de Defensa Integral</h2>
                  <p className="text-muted mb-3 opacity-75">Responde preguntas aleatorias.<br/>¡15 segundos por turno!</p>
                  
                  {/* Vidas */}
                  <div className="mb-3 d-flex align-items-center gap-2">
                    <span className="text-muted fw-bold small">INTENTOS:</span>
                    {[...Array(maxAttempts)].map((_, i) => (
                      <span key={i} className={i < remainingAttempts ? 'heart-alive' : 'heart-dead'} style={{ fontSize: '1.5rem' }}>
                        ❤️
                      </span>
                    ))}
                  </div>

                  <div className="mb-5 px-4 py-2 rounded-pill bg-warning bg-opacity-10 border border-warning text-warning d-flex align-items-center">
                      <CIcon icon={cilStar} className="me-2" /><strong>Récord: {highScore} pts</strong>
                  </div>
                  <CButton color="primary" size="lg" className="rounded-pill px-5 fw-bold shadow-sm" onClick={startGame}>¡Comenzar Reto!</CButton>
                </CCardBody>
              )}

              {/* PANTALLA BLOCKED */}
              {gameState === 'BLOCKED' && (
                <CCardBody className="d-flex flex-column align-items-center justify-content-center text-center p-5 fade-in" style={{minHeight: '500px'}}>
                  <div className="mb-4">
                    <div style={{ fontSize: '4rem', lineHeight: 1 }}>🧊</div>
                  </div>
                  <h2 className="fw-bold mb-3" style={{ color: '#3b82f6' }}>Intentos Agotados</h2>
                  <p className="text-muted mb-4" style={{ maxWidth: '380px' }}>
                    Has utilizado tus <strong>{maxAttempts} intentos</strong> disponibles para este quiz.
                  </p>
                  
                  {/* Vidas agotadas */}
                  <div className="mb-4 d-flex gap-2">
                    {[...Array(maxAttempts)].map((_, i) => (
                      <span key={i} className="heart-dead" style={{ fontSize: '1.8rem' }}>❤️</span>
                    ))}
                  </div>

                  <CButton 
                    size="lg" 
                    className="frozen-btn rounded-pill px-5 py-3"
                    disabled
                  >
                    <CIcon icon={cilLockLocked} className="me-2" />
                    Quiz Bloqueado
                  </CButton>

                  <div className="mt-4 p-3 bg-message-adaptive rounded-3 small" style={{ maxWidth: '380px' }}>
                    <CIcon icon={cilStar} className="me-2 text-warning" />
                    Pide a tu docente que te otorgue otra oportunidad.
                  </div>
                </CCardBody>
              )}

              {/* PANTALLA PLAYING */}
              {gameState === 'PLAYING' && (
                <>
                   {currentQuestion ? (
                      <>
                          <CCardHeader className="bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                          <span className="text-muted fw-bold small">PREGUNTA {currentIdx + 1} / {questions.length}</span>
                          <CBadge color={timeLeft <= 5 ? 'danger' : 'info'} shape="rounded-pill" className="px-3 py-2 fs-6"><CIcon icon={cilClock} className="me-2"/> {timeLeft}s</CBadge>
                          </CCardHeader>
                          <CProgress color="primary" value={questions.length > 0 ? ((currentIdx) / questions.length) * 100 : 0} height={4} className="mx-4 mb-4 bg-opacity-25"/>
                          <CCardBody className="px-4 pb-5">
                          <h4 className="fw-bold mb-5 text-center">{currentQuestion.question}</h4>
                          <div className="d-grid gap-3">
                              {currentQuestion.options.map((option, idx) => {
                              let btnColor = 'light', btnClass = 'text-start py-3 px-4 fw-semibold border-0 option-btn shadow-sm'
                              if (isLocked) {
                                  if (option === currentQuestion.answer) { btnColor = 'success'; btnClass += ' text-white' }
                                  else if (option === selectedOption) { btnColor = 'danger'; btnClass += ' text-white' }
                                  else { btnClass += ' opacity-50' }
                              }
                              return (
                                  <CButton key={idx} color={btnColor} className={btnClass} onClick={() => handleAnswer(option)} disabled={isLocked}>
                                  {option}
                                  {isLocked && option === currentQuestion.answer && <CIcon icon={cilCheck} className="float-end"/>}
                                  {isLocked && option === selectedOption && option !== currentQuestion.answer && <CIcon icon={cilX} className="float-end"/>}
                                  </CButton>
                              )
                              })}
                          </div>
                          </CCardBody>
                      </>
                   ) : <CCardBody className="d-flex align-items-center justify-content-center"><CSpinner color="primary"/></CCardBody>}
                </>
              )}

              {/* PANTALLA RESULT */}
              {gameState === 'RESULT' && (
                <CCardBody className="d-flex flex-column align-items-center justify-content-center text-center p-5 fade-in">
                  {score >= (questions.length * 0.7) ? <div className="mb-4 text-success display-1">🏆</div> : <div className="mb-4 text-muted display-1">😅</div>}
                  <h2 className="fw-bold mb-2">{score >= (questions.length * 0.7) ? '¡Excelente!' : '¡Buen intento!'}</h2>
                  <p className="text-muted mb-4 opacity-75">Resultado Final</p>
                  <div className="bg-light bg-opacity-50 p-4 rounded-4 w-100 mb-4">
                      <div className="row text-center">
                          <div className="col border-end"><small className="text-uppercase text-muted fw-bold">Aciertos</small><h1 className="text-primary fw-bold m-0">{score}</h1></div>
                          <div className="col"><small className="text-uppercase text-muted fw-bold">Total</small><h1 className="text-secondary fw-bold m-0">{questions.length}</h1></div>
                      </div>
                  </div>

                  {/* Vidas restantes */}
                  <div className="mb-3 d-flex align-items-center gap-2">
                    <span className="text-muted small fw-bold">Intentos restantes:</span>
                    {[...Array(maxAttempts)].map((_, i) => (
                      <span key={i} className={i < (maxAttempts - attemptsUsed) ? 'heart-alive' : 'heart-dead'} style={{ fontSize: '1.3rem' }}>
                        ❤️
                      </span>
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                      <CButton color="secondary" variant="ghost" onClick={() => window.location.reload()}>Salir</CButton>
                      {attemptsUsed < maxAttempts ? (
                        <CButton color="primary" className="px-4 rounded-pill fw-bold" onClick={startGame}>Jugar de Nuevo</CButton>
                      ) : (
                        <CButton className="frozen-btn rounded-pill px-4" disabled>
                          <CIcon icon={cilLockLocked} className="me-2" />Sin intentos
                        </CButton>
                      )}
                  </div>
                </CCardBody>
              )}

              {/* PANTALLA NO_QUESTIONS */}
              {gameState === 'NO_QUESTIONS' && (
                  <CCardBody className="d-flex flex-column align-items-center justify-content-center text-center p-5 fade-in" style={{minHeight: '400px'}}>
                      <div className="floating-icon mb-4">
                          <CIcon icon={cilSmile} size="6xl" className="text-primary opacity-50"/>
                      </div>
                      <h2 className="fw-bold mb-3 text-secondary">¡Todo tranquilo por aquí!</h2>
                      <p className="lead text-muted mb-4" style={{maxWidth: '400px'}}>
                          El docente aún no ha cargado preguntas para responder en este momento.
                      </p>
                      <div className="p-3 bg-message-adaptive rounded-3 small">
                          <CIcon icon={cilClock} className="me-2"/>
                          Revisa más tarde para nuevos desafíos.
                      </div>
                  </CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ModuloJuego