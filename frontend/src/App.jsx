import React, { useState, useEffect } from 'react'
import Login from './Login'
import AdminPanel from './AdminPanel'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [siteContent, setSiteContent] = useState({
    name: 'Tamy Niwa',
    title: 'Personal Trainer Profissional',
    description: 'Transforme seu corpo e sua vida com treinos personalizados e acompanhamento especializado',
    about: [
      'Treinos, motivação, lifestyle CF LV1 trainer Cwb gymnastic LV1 Liberacao Miofascia.',
      'Allan Joseph X-mobillity - mobilidade',
      'Pós graduação: Alta Performance em Prescrição de Treinos e Exercícios: Hipertrofia, Saúde e Emagrecimento',
      '"Manter o corpo em boa saúde é um dever… caso contrário, não seremos capazes de manter nossa mente forte e clara".  - Buda'
    ],
    services: [
      {
        title: 'Treino Presencial',
        description: 'Acompanhamento individualizado com treinos personalizados na academia ou ao ar livre.',
        features: ['Avaliação física completa', 'Treinos personalizados', 'Acompanhamento nutricional básico', 'Suporte via WhatsApp']
      },
      {
        title: 'Treino Online',
        description: 'Treinos personalizados para você fazer em casa ou na academia com acompanhamento remoto.',
        features: ['Treinos personalizados', 'Vídeos explicativos', 'Acompanhamento semanal', 'Suporte 24/7']
      },
      {
        title: 'Consultoria',
        description: 'Orientação especializada para otimizar seus treinos e resultados.',
        features: ['Análise de treinos', 'Dicas de nutrição', 'Planejamento de metas', 'Suporte por 30 dias']
      }
    ],
    contact: {
      whatsapp: '(11) 99999-9999',
      instagram: '@tamyniwa_personal',
      email: 'tamyniwa@gmail.com'
    },
    stats: {
      clients: '100+',
      experience: '5+',
      commitment: '100%'
    }
  })
  const [activeTab, setActiveTab] = useState('sobre')

  // Verificar se já está logado e carregar dados
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')

    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }

    // Carregar dados do servidor
    loadSiteData()
  }, [])

  const loadSiteData = async () => {
    try {
      // Carregar foto atual
      const photoResponse = await fetch('/api/admin/current-photo')
      if (photoResponse.ok) {
        const photoData = await photoResponse.json()
        setCurrentPhoto(photoData.imageUrl)
      }

      // Carregar conteúdo do site
      const contentResponse = await fetch('/api/admin/content')
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setSiteContent(contentData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsAuthenticated(false)
    setUser(null)
  }

  // Se estiver autenticado, mostrar painel administrativo
  if (isAuthenticated) {
    return <AdminPanel onLogout={handleLogout} />
  }

  // Se mostrar login, exibir página de login
  if (showLogin) {
    return <Login onLogin={handleLogin} />
  }

  // Página principal do site
  return (
    <div className="app">
      {/* Header Navigation */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="nav-brand">
              <span className="brand-text">{siteContent.name}</span>
            </div>
            <div className="nav-menu">
              <button
                className={`nav-btn ${activeTab === 'sobre' ? 'active' : ''}`}
                onClick={() => setActiveTab('sobre')}
              >
                Sobre Mim
              </button>
              <button
                className={`nav-btn ${activeTab === 'servicos' ? 'active' : ''}`}
                onClick={() => setActiveTab('servicos')}
              >
                Meus Serviços
              </button>
              <button
                className={`nav-btn ${activeTab === 'contato' ? 'active' : ''}`}
                onClick={() => setActiveTab('contato')}
              >
                Contato
              </button>
              <button
                className="nav-btn admin-btn"
                onClick={() => setShowLogin(true)}
                title="Área Administrativa"
              >
                ⚙️
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Conteúdo dinâmico baseado na aba ativa */}
      {activeTab === 'sobre' && (
        <>
          {/* Hero Section apenas para a página inicial */}
          <section className="hero">
            <div className="container">
              <div className="hero-content">
                <div className="hero-photo">
                  {currentPhoto ? (
                    <img src={currentPhoto} alt={`${siteContent.name} - Personal Trainer`} className="profile-photo" />
                  ) : (
                    <div className="photo-placeholder">
                      <span>📸</span>
                      <p>Foto do Personal Trainer</p>
                      <small>Adicione sua foto aqui</small>
                    </div>
                  )}
                </div>
                <div className="hero-text">
                  <h1>{siteContent.name}</h1>
                  <h2>{siteContent.title}</h2>
                  <p>{siteContent.description}</p>
                  <button onClick={() => setActiveTab('contato')} className="btn">Entre em Contato</button>
                </div>
              </div>
            </div>
          </section>

          {/* Sobre Mim */}
          <section className="tabs-section">
            <div className="container">
              <div className="tabs-content">
                <div className="tab-content">
                  <h2>Sobre Mim</h2>
                  <div className="card sobre-mim-text">
                    {siteContent.about.map((text, index) => (
                      <p key={index}>{text}</p>
                    ))}
                    <div className="stats">
                      <div className="stat">
                        <h3>{siteContent.stats.clients}</h3>
                        <p>Clientes Atendidos</p>
                      </div>
                      <div className="stat">
                        <h3>{siteContent.stats.experience}</h3>
                        <p>Anos de Experiência</p>
                      </div>
                      <div className="stat">
                        <h3>{siteContent.stats.commitment}</h3>
                        <p>Compromisso</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'servicos' && (
        <section className="tabs-section">
          <div className="container">
            <div className="tabs-content">
              <div className="tab-content">
                <h2>Meus Serviços</h2>
                <div className="services-grid">
                  {siteContent.services.map((service, index) => (
                    <div key={index} className="service-card">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <ul>
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'contato' && (
        <section className="tabs-section">
          <div className="container">
            <div className="tabs-content">
              <div className="tab-content">
                <h2>Entre em Contato</h2>
                <div className="contact-content">
                  <div className="contact-info">
                    <h3>Vamos conversar sobre seus objetivos?</h3>
                    <p>Preencha o formulário ao lado e eu entrarei em contato em até 24 horas.</p>
                    <div className="contact-details">
                      <div className="contact-item">
                        <strong>WhatsApp:</strong> {siteContent.contact.whatsapp}
                      </div>
                      <div className="contact-item">
                        <strong>Instagram:</strong> {siteContent.contact.instagram}
                      </div>
                      <div className="contact-item">
                        <strong>Email:</strong> {siteContent.contact.email}
                      </div>
                    </div>
                  </div>
                  <div className="contact-form">
                    <form>
                      <div className="form-group">
                        <label htmlFor="name">Nome</label>
                        <input type="text" id="name" name="name" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Telefone</label>
                        <input type="tel" id="phone" name="phone" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Mensagem</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                      </div>
                      <button type="submit" className="btn">Enviar Mensagem</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 {siteContent.name} - Personal Trainer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App 