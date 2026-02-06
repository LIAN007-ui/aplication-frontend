import React, { useState, useEffect } from 'react'
import api from '../../api'
import {
  CContainer, CCard, CCardBody, CCardHeader, CButton, CProgress, CRow, CCol, CSpinner, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilStar, cilClock, cilList, cilCheck, cilX, cilSmile, cilSad } from '@coreui/icons'

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

  useEffect(() => {
    const initData = async () => {
      try {
        let userSemester = null
        
        try {
            const { data: userData } = await api.get('/users/profile')
            
            if (userData) {
                setUserId(userData.id)
                setHighScore(userData.puntuacion || 0)
                
                if (userData.current_semester_id) {
                    userSemester = userData.current_semester_id
                }
            }
        } catch (err) { 
            console.error("Error cargando perfil usuario:", err) 
        }

        let qResponse = { data: [] }
        if (userSemester) {
             try {
                qResponse = await api.get(`/questions/semester/${userSemester}`)
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
    if (userId && finalScore > highScore) {
      try {
        await api.patch(`/users/${userId}`, { puntuacion: finalScore })
        setHighScore(finalScore)
      } catch (e) { console.error("Error guardando récord", e) }
    }
  }

  const currentQuestion = questions && questions[currentIdx] ? questions[currentIdx] : null

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
      `}</style>

      <div className="animated-bg-layer"></div>

      <CContainer className="py-5 mt-5">
        <CRow className="justify-content-center">
          <CCol md={8} lg={7}>
            <CCard className="solid-card rounded-4 overflow-hidden fade-in" style={{ minHeight: '500px' }}>
              
              {gameState === 'START' && (
                <CCardBody className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                  <div className="mb-4 p-4 rounded-circle bg-primary bg-opacity-10 shadow-sm"><CIcon icon={cilList} size="5xl" className="text-primary" /></div>
                  <h2 className="fw-bold mb-3">Quiz de Defensa Integral</h2>
                  <p className="text-muted mb-4 opacity-75">Responde preguntas aleatorias.<br/>¡15 segundos por turno!</p>
                  <div className="mb-5 px-4 py-2 rounded-pill bg-warning bg-opacity-10 border border-warning text-warning d-flex align-items-center">
                      <CIcon icon={cilStar} className="me-2" /><strong>Récord: {highScore} pts</strong>
                  </div>
                  <CButton color="primary" size="lg" className="rounded-pill px-5 fw-bold shadow-sm" onClick={startGame}>¡Comenzar Reto!</CButton>
                </CCardBody>
              )}

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
                  <div className="d-flex gap-2">
                      <CButton color="secondary" variant="ghost" onClick={() => window.location.reload()}>Salir</CButton>
                      <CButton color="primary" className="px-4 rounded-pill fw-bold" onClick={startGame}>Jugar de Nuevo</CButton>
                  </div>
                </CCardBody>
              )}

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