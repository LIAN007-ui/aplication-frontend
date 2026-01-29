import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CSpinner,
  CAlert,
  CFormInput,
  CInputGroup,
  CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilCloudDownload, 
  cilFullscreen, 
  cilInfo, 
  cilChevronLeft, 
  cilChevronRight,
  cilSearch,
  cilCalendar,
  cilXCircle,
  cilFindInPage
} from '@coreui/icons'

const ITEMS_POR_PAGINA = 8; 

const ModuloUsuarios = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [zoom, setZoom] = useState(100) // porcentaje o 'page-width'
  const viewerRef = useRef(null)
  
  // Estados para Búsqueda y Paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState('')

  // --- CONEXIÓN DE DATOS ---
  const fetchPublicaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts')
      
      const dataFormateada = response.data.map(post => {
        let tipoSimple = 'otro'
        const url = post.mediaUrl || ''
        const mediaType = post.mediaType || ''

        // Detección robusta: preferimos mediaType si está presente,
        // pero también aceptamos data URIs y extensiones en la URL.
        if (mediaType) {
          if (mediaType.startsWith('image/')) tipoSimple = 'imagen'
          else if (mediaType.startsWith('video/')) tipoSimple = 'video'
          else if (mediaType === 'application/pdf') tipoSimple = 'pdf'
          else if (mediaType.includes('word') || mediaType.includes('doc')) tipoSimple = 'word'
        } else if (url) {
          const lower = url.toLowerCase()
          if (lower.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/.test(lower)) tipoSimple = 'imagen'
          else if (lower.startsWith('data:video') || /\.(mp4|webm|ogg)(\?|$)/.test(lower)) tipoSimple = 'video'
          else if (lower.startsWith('data:application/pdf') || /\.(pdf)(\?|$)/.test(lower)) tipoSimple = 'pdf'
          else if (lower.includes('word') || /\.(doc|docx)(\?|$)/.test(lower)) tipoSimple = 'word'
        }

        return {
            id: post.id,
            titulo: post.title,
            descripcion: post.body,
            url: post.mediaUrl,
            tipo: tipoSimple,
            fecha: post.date
        }
      })
      setPublicaciones(dataFormateada.reverse())
    } catch (error) {
      console.error('Error cargando publicaciones:', error)
      setPublicaciones([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicaciones()
  }, [])

  // --- LÓGICA DE FILTRADO ---
  const publicacionesFiltradas = useMemo(() => {
    return publicaciones.filter(item => {
      const textoCoincide = item.titulo.toLowerCase().includes(busqueda.toLowerCase())
      let fechaCoincide = true
      if (fechaFiltro) {
        try {
            const [yearF, monthF, dayF] = fechaFiltro.split('-')
            const fechaItemSolo = item.fecha.split(',')[0].trim()
            const [dayI, monthI, yearI] = fechaItemSolo.split('/')
            
            fechaCoincide = (
                parseInt(dayF) === parseInt(dayI) &&
                parseInt(monthF) === parseInt(monthI) &&
                parseInt(yearF) === parseInt(yearI)
            )
        } catch (e) { fechaCoincide = false }
      }
      return textoCoincide && fechaCoincide
    })
  }, [publicaciones, busqueda, fechaFiltro])

  // --- PAGINACIÓN ---
  const indiceUltimoItem = paginaActual * ITEMS_POR_PAGINA
  const indicePrimerItem = indiceUltimoItem - ITEMS_POR_PAGINA
  const resultadosVisibles = publicacionesFiltradas.slice(indicePrimerItem, indiceUltimoItem)
  const totalPaginas = Math.ceil(publicacionesFiltradas.length / ITEMS_POR_PAGINA)

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda, fechaFiltro])

  const cambiarPagina = (direccion) => {
    if (direccion === 'siguiente' && paginaActual < totalPaginas) {
      setPaginaActual(prev => prev + 1)
    } else if (direccion === 'anterior' && paginaActual > 1) {
      setPaginaActual(prev => prev - 1)
    }
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setFechaFiltro('')
  }

  // --- FUNCIONES VISUALES ---
  const manejarApertura = (publicacion) => {
    if (publicacion.tipo === 'word') {
      const link = document.createElement('a')
      link.href = publicacion.url
      link.download = publicacion.titulo || 'archivo'
      link.click()
    } else {
      setArchivoSeleccionado(publicacion)
      setModalVisible(true)
    }
  }

  const handleDownload = () => {
    if (!archivoSeleccionado || !archivoSeleccionado.url) return
    const link = document.createElement('a')
    link.href = archivoSeleccionado.url
    link.download = archivoSeleccionado.titulo || 'archivo'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setModalVisible(false)
  }

  const zoomIn = () => setZoom((z) => (z === 'page-width' ? 125 : Math.min(400, z + 25)))
  const zoomOut = () => setZoom((z) => (z === 'page-width' ? 75 : Math.max(25, z - 25)))
  const fitWidth = () => setZoom('page-width')
  const resetZoom = () => setZoom(100)

  const enterFullscreen = () => {
    const el = viewerRef.current
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.msRequestFullscreen) el.msRequestFullscreen()
  }

  const renderizarContenidoModal = () => {
    if (!archivoSeleccionado) return null
    const { tipo, url } = archivoSeleccionado

    switch (tipo) {
      case 'imagen':
        return <img src={url} alt="Recurso" className="img-fluid rounded shadow-sm w-100" />
      case 'video':
        return (
          <div className="ratio ratio-16x9">
            <video controls autoPlay className="rounded">
              <source src={url} type="video/mp4" />
            </video>
          </div>
        )
      case 'pdf':
        {
          const zoomParam = zoom === 'page-width' ? 'page-width' : zoom
          const iframeSrc = `${url}#toolbar=0&zoom=${zoomParam}`
          return (
            <div>
              <div className="d-flex justify-content-end mb-2 gap-2">
                <CButton size="sm" color="light" onClick={zoomOut}>−</CButton>
                <CButton size="sm" color="light" onClick={zoomIn}>+</CButton>
                <CButton size="sm" color="light" onClick={fitWidth}>Ancho</CButton>
                <CButton size="sm" color="light" onClick={resetZoom}>100%</CButton>
                <CButton size="sm" color="light" onClick={enterFullscreen}><CIcon icon={cilFullscreen} /></CButton>
              </div>
              <div ref={viewerRef} className="ratio ratio-4x3" style={{ minHeight: '70vh' }}>
                <iframe src={iframeSrc} title="Visor PDF" className="rounded border" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          )
        }
      default:
        return (
            <div className="text-center py-5">
                <CButton color="primary" onClick={handleDownload}>Descargar Archivo</CButton>
            </div>
        )
    }
  }

  const obtenerIcono = (tipo) => {
    switch(tipo) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'word': return '📝';
      case 'imagen': return '🖼️';
      default: return '📎';
    }
  }

  const obtenerColorBoton = (tipo) => {
    return tipo === 'word' ? 'dark' : 'primary';
  }

  return (
    <CContainer fluid className="p-4">
      {/* ESTILOS CSS CON CORRECCIONES DARK MODE */}
      <style>{`
        /* Animaciones Generales */
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animacion-entrada {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        /* Tarjetas Flotantes */
        .tarjeta-interactiva {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 2px solid transparent !important;
        }
        .tarjeta-interactiva:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(50, 31, 219, 0.15) !important;
          border-color: #321fdb !important;
          cursor: pointer;
        }

        /* Título con Degradado */
        .titulo-amigable {
          background: linear-gradient(90deg, #2563eb 0%, #0891b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* --- ESTILOS INPUTS BASE --- */
        .grupo-busqueda-moderno {
          border: 1px solid #e2e8f0;
          border-radius: 50px; 
          overflow: hidden;
          transition: all 0.3s ease;
          background-color: white;
        }
        
        .grupo-busqueda-moderno:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); 
          transform: translateY(-2px); 
        }

        .input-sin-borde {
          border: none !important;
          box-shadow: none !important; 
          background: transparent !important;
        }

        .icono-input {
          background: transparent !important;
          border: none !important;
          color: #94a3b8;
        }

        /* --- CORRECCIONES PARA MODO OSCURO --- */
        [data-coreui-theme="dark"] .grupo-busqueda-moderno {
          background-color: #1e293b !important; /* Gris oscuro azulado */
          border-color: #334155 !important;
        }
        
        [data-coreui-theme="dark"] .input-sin-borde {
          color: #f8fafc !important; /* Texto blanco */
          color-scheme: dark; /* Para que el calendario nativo sea oscuro */
        }
        
        [data-coreui-theme="dark"] .input-sin-borde::placeholder {
          color: #94a3b8 !important; /* Placeholder gris claro */
        }
        
        [data-coreui-theme="dark"] .icono-input {
          color: #cbd5e1 !important; /* Icono gris claro */
        }
        
        /* Ajuste de tarjetas en modo oscuro si es necesario */
        [data-coreui-theme="dark"] .tarjeta-interactiva {
           background-color: #1e293b !important;
           border-color: #334155;
        }

        /* Animación Botón Limpiar (X) */
        .boton-limpiar {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none !important;
          background: transparent !important;
        }
        .boton-limpiar:hover {
          transform: rotate(90deg) scale(1.1);
          color: #ef4444 !important;
        }
      `}</style>

      {/* CABECERA Y BUSCADOR MEJORADO */}
      <div className="mb-5">
        <CRow className="align-items-end justify-content-between g-3">
            <CCol md={5}>
                <h2 className="fw-bold mb-1 titulo-amigable" style={{ fontSize: '2.5rem' }}>
                    Biblioteca de Recursos
                </h2>
                <span className="fw-semibold" style={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Explora el material educativo disponible
                </span>
            </CCol>
            
            <CCol md={7}>
                <CRow className="g-3 justify-content-end">
                    {/* BUSCADOR DE TEXTO */}
                    <CCol xs={12} sm={6} lg={6}>
                        <CInputGroup className="grupo-busqueda-moderno shadow-sm">
                            <CInputGroupText className="icono-input ps-3">
                                <CIcon icon={cilSearch} size="lg"/>
                            </CInputGroupText>
                            <CFormInput 
                                placeholder="Buscar archivo..." 
                                className="input-sin-borde"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <CButton 
                                    className="boton-limpiar pe-3" 
                                    onClick={() => setBusqueda('')}
                                    title="Borrar búsqueda"
                                >
                                    <CIcon icon={cilXCircle} size="lg" />
                                </CButton>
                            )}
                        </CInputGroup>
                    </CCol>
                    
                    {/* FILTRO DE FECHA */}
                    <CCol xs={12} sm={5} lg={5}>
                        <CInputGroup className="grupo-busqueda-moderno shadow-sm">
                             <CInputGroupText className="icono-input ps-3">
                                <CIcon icon={cilCalendar} size="lg"/>
                            </CInputGroupText>
                            <CFormInput 
                                type="date" 
                                className="input-sin-borde pe-3"
                                style={{ color: '#475569' }} // Color por defecto (claro)
                                value={fechaFiltro}
                                onChange={(e) => setFechaFiltro(e.target.value)}
                            />
                        </CInputGroup>
                    </CCol>
                </CRow>
            </CCol>
        </CRow>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <p className="mt-2 text-muted">Cargando biblioteca...</p>
        </div>
      ) : publicacionesFiltradas.length === 0 ? (
        <div className="text-center py-5 animacion-entrada">
             {publicaciones.length === 0 ? (
                <CAlert color="light" className="d-inline-block border-0 shadow-sm px-5 py-4">
                    <CIcon icon={cilInfo} size="xxl" className="text-muted mb-3" />
                    <h4 className="fw-bold text-secondary">No hay publicaciones</h4>
                    <p className="text-muted mb-0">El administrador aún no ha subido contenido.</p>
                </CAlert>
             ) : (
                <div className="py-4">
                    <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                        <CIcon icon={cilFindInPage} size="4xl" className="text-secondary opacity-50" />
                    </div>
                    <h4 className="fw-bold">No se encontraron archivos</h4>
                    <p className="text-muted">
                        Intenta con otros términos o limpia los filtros.
                    </p>
                    <CButton color="primary" variant="outline" shape="rounded-pill" onClick={limpiarFiltros}>
                        <CIcon icon={cilXCircle} className="me-2"/>
                        Ver todo el contenido
                    </CButton>
                </div>
             )}
        </div>
      ) : (
        <>
            <div className="mb-4 d-flex justify-content-end">
                <CBadge color="light" shape="rounded-pill" className="text-dark border px-3 py-2 shadow-sm fs-6">
                    Página <span className="fw-bold text-primary">{paginaActual}</span> de {totalPaginas}
                </CBadge>
            </div>

            <div key={paginaActual} className="animacion-entrada">
                <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
                {resultadosVisibles.map((pub) => (
                    <CCol key={pub.id}>
                    <CCard 
                        className="h-100 shadow-sm text-center py-4 tarjeta-interactiva" 
                        style={{ borderRadius: '20px' }}
                        onClick={() => manejarApertura(pub)}
                    >
                        <CCardBody className="d-flex flex-column align-items-center justify-content-between">
                        <div className="mb-3 display-4">
                            {obtenerIcono(pub.tipo)}
                        </div>
                        <div className="mb-4 w-100 px-3">
                            <h5 className="fw-bold text-truncate" title={pub.titulo}>
                                {pub.titulo}
                            </h5>
                            <p className="text-muted small mb-0 text-truncate">
                                {pub.descripcion}
                            </p>
                            {pub.fecha && (
                                <CBadge color="light" textColor="secondary" className="mt-2 border">
                                    {pub.fecha.split(',')[0]}
                                </CBadge>
                            )}
                        </div>
                        
                        <CButton 
                            color={obtenerColorBoton(pub.tipo)} 
                            variant={pub.tipo === 'word' ? 'outline' : 'solid'}
                            className="fw-bold px-4 rounded-pill"
                            style={{pointerEvents: 'none'}}
                        >
                            {pub.tipo === 'word' ? (
                            <> <CIcon icon={cilCloudDownload} className="me-2"/> Descargar </>
                            ) : (
                            <> <CIcon icon={cilFullscreen} className="me-2"/> Ver Ahora </>
                            )}
                        </CButton>
                        </CCardBody>
                    </CCard>
                    </CCol>
                ))}
                </CRow>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
                    <CButton 
                        color="light" 
                        shape="rounded-pill"
                        className="shadow-sm px-4"
                        onClick={() => cambiarPagina('anterior')}
                        disabled={paginaActual === 1}
                    >
                        <CIcon icon={cilChevronLeft} /> Anterior
                    </CButton>
                    
                    <div className="d-flex gap-1">
                        {[...Array(totalPaginas)].map((_, i) => (
                            <div 
                                key={i}
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: (i + 1) === paginaActual ? '#2563eb' : '#e4e5e7',
                                    transition: 'background-color 0.3s'
                                }}
                            />
                        ))}
                    </div>

                    <CButton 
                        color="light" 
                        shape="rounded-pill"
                        className="shadow-sm px-4"
                        onClick={() => cambiarPagina('siguiente')}
                        disabled={paginaActual === totalPaginas}
                    >
                        Siguiente <CIcon icon={cilChevronRight} />
                    </CButton>
                </div>
            )}
        </>
      )}

      {/* MODAL */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        size="xl" 
        alignment="center"
        backdrop="static"
        keyboard={false}
      >
        <CModalHeader closeButton className="border-0 pb-0">
          <CModalTitle className="fw-bold">
            {archivoSeleccionado?.titulo}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 bg-light">
          {renderizarContenidoModal()}
        </CModalBody>
        <CModalFooter className="border-0 pt-0">
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleDownload}>
            <CIcon icon={cilCloudDownload} /> Descargar Copia
          </CButton>
        </CModalFooter>
      </CModal>

    </CContainer>
  )
}

export default ModuloUsuarios