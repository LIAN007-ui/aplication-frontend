import React, { useState, useEffect, useCallback } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormCheck,
  CAlert,
  CProgress,
  CRow,
  CCol
} from '@coreui/react'

const ModuloJuego = () => {
  // --- Banco Maestro de Preguntas (Todas las disponibles) ---
  const masterQuestions = [
    {
      question: "¿Qué significa ZODI en el contexto de la Defensa Integral de Venezuela?",
      options: ["Zona Operativa de Defensa Integral", "Zona de Defensa Integral", "Zona Operacional de Defensa Integral", "Zona Organizada de Defensa Integral"],
      answer: "Zona Operacional de Defensa Integral",
    },
    {
      question: "¿Cuántas ZODIs existen en Venezuela?",
      options: ["6", "8", "9", "12"],
      answer: "9",
    },
    {
      question: "¿Qué organismo coordina las ZODIs a nivel nacional?",
      options: ["Ministerio de la Defensa", "CEOFANB", "REDI Nacional", "Comando Estratégico Operacional"],
      answer: "CEOFANB",
    },
    {
      question: "¿Qué significa REDI?",
      options: ["Red de Defensa Integral", "Región Especial de Defensa Integral", "Región Estratégica de Defensa Integral", "Red Estratégica de Defensa Integral"],
      answer: "Región Estratégica de Defensa Integral",
    },
    {
      question: "¿En qué año se creó el concepto de Defensa Integral en Venezuela?",
      options: ["1999", "2005", "2009", "2012"],
      answer: "2009",
    },
    {
      question: "¿Cuál de estos NO es un componente de la Defensa Integral en Venezuela?",
      options: ["Militar", "Político", "Económico", "Religioso"],
      answer: "Religioso",
    },
    {
      question: "¿Qué artículo de la Constitución establece el principio de corresponsabilidad?",
      options: ["Artículo 322", "Artículo 130", "Artículo 326", "Artículo 15"],
      answer: "Artículo 326",
    },
    {
      question: "¿Cuál es el objetivo principal de la Defensa Integral?",
      options: ["Guerras internacionales", "Garantizar independencia y soberanía", "Controlar población civil", "Expandir territorio"],
      answer: "Garantizar independencia y soberanía",
    },
    {
      question: "¿Qué ley regula principalmente la Defensa Integral en Venezuela?",
      options: ["Ley de Seguridad", "Ley Orgánica de la FANB", "Ley de Alistamiento", "Ley de Seguridad y Defensa"],
      answer: "Ley Orgánica de la FANB",
    },
    {
      question: "¿Qué porcentaje aproximado del territorio está bajo protección especial?",
      options: ["10%", "25%", "40%", "60%"],
      answer: "40%",
    }
  ]

  // --- Estados ---
  const [questions, setQuestions] = useState([])
  const [gameState, setGameState] = useState('START') // 'START', 'PLAYING', 'RESULT'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [feedback, setFeedback] = useState('')
  const [isLocked, setIsLocked] = useState(false)

  // --- Lógica del Temporizador ---
  useEffect(() => {
    let timer
    if (gameState === 'PLAYING' && !isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'PLAYING' && !isLocked) {
      handleTimeUp()
    }
    return () => clearInterval(timer)
  }, [gameState, timeLeft, isLocked])

  // --- Manejadores de Acción ---
  const startGame = () => {
    // Mezclamos el banco de preguntas y seleccionamos las que queramos (ej: todas o un top 10)
    const shuffled = [...masterQuestions]
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5) // Mezclamos opciones también
      }))

    setQuestions(shuffled)
    setGameState('PLAYING')
    setCurrentIdx(0)
    setScore(0)
    setTimeLeft(30)
    setSelectedAnswer(null)
    setFeedback('')
    setIsLocked(false)
  }

  const handleTimeUp = () => {
    setIsLocked(true)
    setFeedback(`¡Se acabó el tiempo! La respuesta era: ${questions[currentIdx].answer}`)
    setTimeout(() => {
      goToNextQuestion()
    }, 2500)
  }

  const handleAnswerSelect = (option) => {
    if (!isLocked) setSelectedAnswer(option)
  }

  const handleSubmit = () => {
    setIsLocked(true)
    const isCorrect = selectedAnswer === questions[currentIdx].answer

    if (isCorrect) {
      setScore(score + 1)
      setFeedback('¡Correcto!')
    } else {
      setFeedback(`Incorrecto. La respuesta era: ${questions[currentIdx].answer}`)
    }

    setTimeout(() => {
      goToNextQuestion()
    }, 2500)
  }

  const goToNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelectedAnswer(null)
      setFeedback('')
      setTimeLeft(30)
      setIsLocked(false)
    } else {
      setGameState('RESULT')
    }
  }

  // --- Renderizado de Pantallas ---
  return (
    <CContainer className="py-4">
      <CCard className="shadow-lg border-top-primary border-top-3">
        
        {/* PANTALLA DE INICIO */}
        {gameState === 'START' && (
          <CCardBody className="text-center py-5">
            <h2 className="text-primary mb-4">Quiz: Defensa Integral de la Nación</h2>
            <p className="lead mb-4">Pon a prueba tus conocimientos. Las preguntas y opciones cambian en cada intento.</p>
            <div className="bg-light p-4 rounded mb-4 text-start d-inline-block">
              <h5>Reglas del juego:</h5>
              <ul>
                <li><strong>30 segundos</strong> por cada pregunta.</li>
                <li>Preguntas seleccionadas aleatoriamente.</li>
                <li>Si el tiempo llega a 0, se contará como incorrecta.</li>
              </ul>
            </div>
            <br />
            <CButton color="primary" size="lg" onClick={startGame}>
              Iniciar Desafío
            </CButton>
          </CCardBody>
        )}

        {/* PANTALLA DE JUEGO */}
        {gameState === 'PLAYING' && questions.length > 0 && (
          <>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Pregunta {currentIdx + 1} de {questions.length}</strong>
              <div className={`fw-bold ${timeLeft < 10 ? 'text-danger' : 'text-dark'}`}>
                ⏱️ Tiempo: {timeLeft}s
              </div>
            </CCardHeader>
            <CCardBody>
              <CProgress 
                value={(timeLeft / 30) * 100} 
                color={timeLeft < 10 ? 'danger' : 'info'} 
                className="mb-4" 
                style={{ height: '8px' }}
              />

              <h4 className="mb-4">{questions[currentIdx].question}</h4>

              <CRow>
                {questions[currentIdx].options.map((option, index) => (
                  <CCol xs={12} md={6} key={index} className="mb-2">
                    <CButton
                      variant="outline"
                      color={selectedAnswer === option ? 'primary' : 'dark'}
                      className={`w-100 text-start p-3 ${selectedAnswer === option ? 'bg-light fw-bold' : ''}`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isLocked}
                    >
                      <CFormCheck
                        type="radio"
                        label={option}
                        checked={selectedAnswer === option}
                        onChange={() => {}} // Manejado por el botón
                      />
                    </CButton>
                  </CCol>
                ))}
              </CRow>

              <div className="mt-4 d-flex flex-column align-items-center">
                <CButton
                  color="primary"
                  size="lg"
                  className="px-5"
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null || isLocked}
                >
                  {isLocked ? 'verificando...' : 'Enviar Respuesta'}
                </CButton>

                {feedback && (
                  <CAlert 
                    color={feedback === '¡Correcto!' ? 'success' : 'danger'} 
                    className="mt-3 w-100 text-center fw-bold shadow-sm"
                  >
                    {feedback}
                  </CAlert>
                )}
              </div>
            </CCardBody>
          </>
        )}

        {/* PANTALLA DE RESULTADOS */}
        {gameState === 'RESULT' && (
          <CCardBody className="text-center py-5">
            <h2 className="mb-3 text-success">¡Desafío Completado!</h2>
            <div className="mb-4">
              <p className="fs-4">Tu puntuación:</p>
              <h1 className="display-2 fw-bold">{score} / {questions.length}</h1>
            </div>
            <CAlert color={score > (questions.length / 2) ? 'success' : 'warning'}>
              {score === questions.length 
                ? "¡Excelente! Nivel: Experto en Defensa Integral." 
                : "Buen intento. Puedes volver a jugar para obtener nuevas preguntas."}
            </CAlert>
            <CButton color="primary" size="lg" onClick={startGame}>
              Reiniciar con Preguntas Nuevas
            </CButton>
          </CCardBody>
        )}

      </CCard>
    </CContainer>
  )
}

export default ModuloJuego