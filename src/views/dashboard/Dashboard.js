import React from 'react'
<<<<<<< HEAD
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
=======
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
>>>>>>> 90e20dc (actualizacion visual)
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
<<<<<<< HEAD
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">January - July 2023</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-body-secondary small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
=======
  CTableRow,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilUserFollow,
  cilUserUnfollow,
  cilSearch,
  cilPlus,
} from '@coreui/icons'

const Dashboard = () => {
  // Estilo común para el efecto hover en las tarjetas
  const cardHoverStyle = {
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
  }

  // Función para manejar el efecto visual con CSS (puedes mover esto a tu archivo .css)
  const hoverEffectClass = "hover-shadow-lg"

  return (
    <>
      <style>
        {`
          .custom-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(0,0,0,0.05);
          }
          .custom-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            border: 1px solid #321fdb; /* Resalta el borde al pasar el mouse */
          }
          .action-item:hover {
            background-color: #f8f9fa !important;
            padding-left: 10px !important;
            transition: all 0.2s ease;
          }
        `}
      </style>

      {/* Bienvenida */}
      <CCard className="mb-4 border-0 shadow-sm custom-card">
        <CCardBody className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-1 fw-bold">Panel Admistrativo</h3>
            <div className="text-medium-emphasis">Estadísticas de usuarios y registros actuales.</div>
          </div>
          <div className="d-none d-md-block text-success fw-semibold border border-success rounded-pill px-3 py-1">
            ● Sistema En Línea
          </div>
        </CCardBody>
      </CCard>

      {/* Bloques de Estadísticas con Resaltado */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card">
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Usuarios</div>
                <div className="fs-3 fw-bold">1</div>
              </div>
              <div className="bg-primary text-white p-3 rounded-circle shadow-sm">
                <CIcon icon={cilPeople} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card">
            <CCardBody className="d-flex align-items-center">
              <div style={{ width: '50px', marginRight: '15px' }}>
                <CChartDoughnut
                  data={{
                    datasets: [{
                      backgroundColor: ['#4ade80', '#ebebeb'],
                      data: [70, 30],
                      borderWidth: 0,
                    }],
                  }}
                  options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                />
              </div>
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Activos</div>
                <div className="fs-4 fw-bold text-success">10%</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card" style={{ borderLeft: '4px solid #2eb85c' }}>
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Nuevos Hoy</div>
                <div className="fs-3 fw-bold">1</div>
              </div>
              <div className="text-success p-3">
                <CIcon icon={cilUserFollow} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-4 border-0 shadow-sm h-100 custom-card" style={{ borderLeft: '4px solid #e55353' }}>
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-medium-emphasis small fw-bold text-uppercase">Inactivos</div>
                <div className="fs-3 fw-bold">0</div>
              </div>
              <div className="text-danger p-3">
                <CIcon icon={cilUserUnfollow} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Tabla de Actividad */}
        <CCol md={8}>
          <CCard className="mb-4 border-0 shadow-sm custom-card">
            <CCardHeader className="bg-white border-0 pt-4 px-4 fw-bold">
              Actividad Reciente
            </CCardHeader>
            <CCardBody className="px-4">
              <CTable align="middle" responsive borderless hover>
                <thead className="text-medium-emphasis small border-bottom">
                  <tr>
                    <th>ACCIÓN</th>
                    <th>USUARIO</th>
                    <th className="text-end">HACE</th>
                  </tr>
                </thead>
                <CTableBody>
                  <CTableRow className="align-middle">
                    <CTableDataCell>
                      <span className="badge bg-info bg-opacity-10 text-info p-2 px-3">REGISTRO</span>
                    </CTableDataCell>
                    <CTableDataCell className="fw-semibold">liander</CTableDataCell>
                    <CTableDataCell className="text-end text-medium-emphasis small">2 días</CTableDataCell>
                  </CTableRow>
>>>>>>> 90e20dc (actualizacion visual)
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
<<<<<<< HEAD
=======

        {/* Acciones Rápidas */}
        <CCol md={4}>
          <CCard className="mb-4 border-0 shadow-sm custom-card">
            <CCardHeader className="bg-white border-0 pt-4 px-4 fw-bold">
              Acciones Rápidas
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem component="button" className="action-item d-flex align-items-center border-0 py-3 bg-transparent">
                   <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                    <CIcon icon={cilPlus} />
                  </div>
                  Nuevo Registro
                </CListGroupItem>
                <CListGroupItem component="button" className="action-item d-flex align-items-center border-0 py-3 bg-transparent">
                  <div className="bg-info bg-opacity-10 p-2 rounded me-3 text-info">
                    <CIcon icon={cilSearch} />
                  </div>
                  Buscar Usuario
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
>>>>>>> 90e20dc (actualizacion visual)
      </CRow>
    </>
  )
}

<<<<<<< HEAD
export default Dashboard
=======
export default Dashboard
>>>>>>> 90e20dc (actualizacion visual)
