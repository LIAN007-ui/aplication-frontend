import React, { useState, useEffect, useMemo, useRef } from 'react'
import api from '../../api'
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
  const [zoom, setZoom] = useState(100) 
  const viewerRef = useRef(null)
  
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState('')

  const fetchPublicaciones = async () => {
    try {
      let userSemester = null
      try {
        const profileRes = await api.get('/users/profile')
        if (profileRes.data && profileRes.data.current_semester_id) {
            userSemester = profileRes.data.current_semester_id
        }
      } catch (err) {
        console.error("Error obteniendo perfil:", err)
      }

      let response;
      if (userSemester) {
          response = await api.get(`/publications/semester/${userSemester}`)
      } else {
          setPublicaciones([])
          return
      }
      
      const dataFormateada = response.data.map(post => {
        const fileUrl = post.file_attachment_url || post.mediaUrl; 
        let tipo = 'texto';

        if (fileUrl) {
            if (fileUrl.startsWith('data:')) {
                // Base64 data URI — detect type from MIME
                const mimeMatch = fileUrl.match(/^data:([^;]+);/);
                const mime = mimeMatch ? mimeMatch[1].toLowerCase() : '';
                if (mime.startsWith('image/')) {
                    tipo = 'imagen';
                } else if (mime === 'application/pdf') {
                    tipo = 'pdf';
                } else if (mime.includes('word') || mime.includes('document')) {
                    tipo = 'word';
                } else {
                    tipo = 'pdf';
                }
            } else {
                // Regular URL — detect type from extension
                const lowerUrl = fileUrl.toLowerCase();
                if (lowerUrl.match(/\.(jpeg|jpg|png|gif|webp)$/)) {
                    tipo = 'imagen';
                } else if (lowerUrl.includes('.pdf')) {
                    tipo = 'pdf';
                } else if (lowerUrl.match(/\.(doc|docx)$/)) {
                    tipo = 'word';
                } else {
                    tipo = 'pdf'; 
                }
            }
        }

        return {
            id: post.id,
            titulo: post.title,
            descripcion: post.content,
            url: fileUrl,
            tipo: tipo,
            fecha: post.created_at ? new Date(post.created_at).toLocaleDateString('es-VE') : '',
            autor: post.teacher_name || post.author_name || 'Docente'
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

  const manejarApertura = (publicacion) => {
      setArchivoSeleccionado(publicacion)
      setModalVisible(true)
  }

  const handleDownload = () => {
    if (!archivoSeleccionado || !archivoSeleccionado.url) return
    const url = archivoSeleccionado.url
    const link = document.createElement('a')
    link.href = url

    // Determine file extension from Base64 MIME or URL
    let filename = archivoSeleccionado.titulo || 'archivo'
    if (url.startsWith('data:')) {
      const mimeMatch = url.match(/^data:([^;]+);/)
      const mime = mimeMatch ? mimeMatch[1] : ''
      if (mime.includes('pdf')) filename += '.pdf'
      else if (mime.includes('png')) filename += '.png'
      else if (mime.includes('jpeg') || mime.includes('jpg')) filename += '.jpg'
      else if (mime.includes('gif')) filename += '.gif'
      else if (mime.includes('webp')) filename += '.webp'
      else if (mime.includes('word') || mime.includes('document')) filename += '.docx'
    }

    link.download = filename
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
          if (url && url.startsWith('data:')) {
            // Base64 PDF — use embed tag
            return (
              <div>
                <div className="d-flex justify-content-end mb-2 gap-2">
                  <CButton size="sm" color="light" onClick={enterFullscreen}><CIcon icon={cilFullscreen} /></CButton>
                </div>
                <div ref={viewerRef} className="bg-white rounded border" style={{ minHeight: '70vh' }}>
                  <embed src={url} type="application/pdf" width="100%" style={{ height: '70vh' }} />
                </div>
              </div>
            )
          }
          // Regular URL PDF
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
              <div ref={viewerRef} className="ratio ratio-4x3 bg-white rounded border" style={{ minHeight: '70vh' }}>
                <iframe src={iframeSrc} title="Visor PDF" className="w-100 h-100" />
              </div>
            </div>
          )
        }
      case 'word':
        return (
            <div className="text-center py-5">
                <div className="mb-4">
                    <span style={{fontSize: '4rem'}}>📝</span>
                </div>
                <h4 className="fw-bold">Documento de Word</h4>
                <p className="text-muted mb-4">Este archivo requiere Microsoft Word para visualizarse.</p>
                <CButton color="primary" size="lg" shape="rounded-pill" onClick={handleDownload} className="px-5 shadow-sm">
                    <CIcon icon={cilCloudDownload} className="me-2"/> Descargar
                </CButton>
            </div>
        )
      case 'texto':
        return (
          <div className="p-4">
            <div className="bg-adaptive rounded-4 p-4 shadow-sm">
              <p className="fs-5 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {archivoSeleccionado.descripcion}
              </p>
              {archivoSeleccionado.autor && (
                <p className="text-muted mt-3 mb-0">
                  <strong>Publicado por:</strong> {archivoSeleccionado.autor}
                </p>
              )}
            </div>
          </div>
        )
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
      case 'texto': return '📰';
      default: return '📎';
    }
  }

  const obtenerColorBoton = (tipo) => {
    return tipo === 'word' ? 'dark' : 'primary';
  }

  return (
    <CContainer fluid className="p-4">
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animacion-entrada {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
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

        .titulo-amigable {
          background: linear-gradient(90deg, #2563eb 0%, #0891b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

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

        [data-coreui-theme="dark"] .titulo-amigable {
           background: linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%);
           -webkit-background-clip: text;
           background-clip: text;
        }

        [data-coreui-theme="dark"] .grupo-busqueda-moderno {
          background-color: #1e293b !important; 
          border-color: #334155 !important;
        }
        
        [data-coreui-theme="dark"] .input-sin-borde {
          color: #f8fafc !important; 
          color-scheme: dark; 
        }
        
        [data-coreui-theme="dark"] .input-sin-borde::placeholder {
          color: #94a3b8 !important; 
        }
        
        [data-coreui-theme="dark"] .icono-input {
          color: #cbd5e1 !important; 
        }
        
        [data-coreui-theme="dark"] .tarjeta-interactiva {
           background-color: #1e293b !important;
           border-color: #334155;
        }

        .bg-adaptive { 
            background-color: #ffffff; 
            color: #212529; 
            border: 1px solid #f1f5f9;
        }
        
        [data-coreui-theme="dark"] .bg-adaptive { 
            background-color: #2a303d !important; 
            border-color: #4b5563 !important; 
            color: #e5e7eb !important; 
        }

        [data-coreui-theme="dark"] .modal-content {
            background-color: #1e293b !important;
            border: 1px solid #334155;
        }
        [data-coreui-theme="dark"] .modal-header, 
        [data-coreui-theme="dark"] .modal-footer {
            border-color: #334155 !important;
        }
        [data-coreui-theme="dark"] .modal-title {
            color: #f8fafc !important;
        }
        [data-coreui-theme="dark"] .btn-close {
            filter: invert(1) grayscale(100%) brightness(200%);
        }
        [data-coreui-theme="dark"] .text-dark { 
            color: #fff !important; 
        }

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
                    
                    <CCol xs={12} sm={5} lg={5}>
                        <CInputGroup className="grupo-busqueda-moderno shadow-sm">
                             <CInputGroupText className="icono-input ps-3">
                                <CIcon icon={cilCalendar} size="lg"/>
                            </CInputGroupText>
                            <CFormInput 
                                type="date" 
                                className="input-sin-borde pe-3"
                                style={{ color: '#475569' }} 
                                value={fechaFiltro}
                                onChange={(e) => setFechaFiltro(e.target.value)}
                            />
                        </CInputGroup>
                    </CCol>
                </CRow>
            </CCol>
        </CRow>
      </div>

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
        <CModalBody className="p-4">
          {renderizarContenidoModal()}
        </CModalBody>
        <CModalFooter className="border-0 pt-0">
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleDownload} className="fw-bold text-white">
            <CIcon icon={cilCloudDownload} /> Descargar Copia
          </CButton>
        </CModalFooter>
      </CModal>

    </CContainer>
  )
}

export default ModuloUsuarios