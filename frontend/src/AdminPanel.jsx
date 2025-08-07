import React, { useState, useEffect } from 'react'
import './AdminPanel.css'

function AdminPanel({ onLogout }) {
  const [content, setContent] = useState({
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
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    // Carregar conteúdo atual do localStorage ou API
    const savedContent = localStorage.getItem('siteContent')
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    }
  }, [])

  const handleContentChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [field]: value }
        : value
    }))
  }

  const handleAboutChange = (index, value) => {
    const newAbout = [...content.about]
    newAbout[index] = value
    setContent(prev => ({ ...prev, about: newAbout }))
  }

  const handleServiceChange = (index, field, value) => {
    const newServices = [...content.services]
    if (field === 'features') {
      newServices[index] = { ...newServices[index], features: value.split('\n').filter(f => f.trim()) }
    } else {
      newServices[index] = { ...newServices[index], [field]: value }
    }
    setContent(prev => ({ ...prev, services: newServices }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(content)
      })

      if (response.ok) {
        localStorage.setItem('siteContent', JSON.stringify(content))
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(''), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="container">
          <h1>Painel Administrativo</h1>
          <button onClick={onLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="container">
          <div className="admin-sections">
            {/* Informações Básicas */}
            <section className="admin-section">
              <h2>Informações Básicas</h2>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={content.name}
                  onChange={(e) => handleContentChange('name', '', e.target.value)}
                  placeholder="Nome do personal trainer"
                />
              </div>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => handleContentChange('title', '', e.target.value)}
                  placeholder="Título profissional"
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={content.description}
                  onChange={(e) => handleContentChange('description', '', e.target.value)}
                  placeholder="Descrição principal"
                  rows="3"
                />
              </div>
            </section>

            {/* Sobre Mim */}
            <section className="admin-section">
              <h2>Sobre Mim</h2>
              {content.about.map((text, index) => (
                <div key={index} className="form-group">
                  <label>Parágrafo {index + 1}</label>
                  <textarea
                    value={text}
                    onChange={(e) => handleAboutChange(index, e.target.value)}
                    placeholder={`Parágrafo ${index + 1}`}
                    rows="2"
                  />
                </div>
              ))}
            </section>

            {/* Estatísticas */}
            <section className="admin-section">
              <h2>Estatísticas</h2>
              <div className="stats-grid">
                <div className="form-group">
                  <label>Clientes Atendidos</label>
                  <input
                    type="text"
                    value={content.stats.clients}
                    onChange={(e) => handleContentChange('stats', 'clients', e.target.value)}
                    placeholder="100+"
                  />
                </div>
                <div className="form-group">
                  <label>Anos de Experiência</label>
                  <input
                    type="text"
                    value={content.stats.experience}
                    onChange={(e) => handleContentChange('stats', 'experience', e.target.value)}
                    placeholder="5+"
                  />
                </div>
                <div className="form-group">
                  <label>Compromisso</label>
                  <input
                    type="text"
                    value={content.stats.commitment}
                    onChange={(e) => handleContentChange('stats', 'commitment', e.target.value)}
                    placeholder="100%"
                  />
                </div>
              </div>
            </section>

            {/* Serviços */}
            <section className="admin-section">
              <h2>Serviços</h2>
              {content.services.map((service, index) => (
                <div key={index} className="service-edit">
                  <h3>Serviço {index + 1}</h3>
                  <div className="form-group">
                    <label>Título</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                      placeholder="Título do serviço"
                    />
                  </div>
                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      placeholder="Descrição do serviço"
                      rows="2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Características (uma por linha)</label>
                    <textarea
                      value={service.features.join('\n')}
                      onChange={(e) => handleServiceChange(index, 'features', e.target.value)}
                      placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                      rows="4"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Contato */}
            <section className="admin-section">
              <h2>Informações de Contato</h2>
              <div className="form-group">
                <label>WhatsApp</label>
                <input
                  type="text"
                  value={content.contact.whatsapp}
                  onChange={(e) => handleContentChange('contact', 'whatsapp', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  value={content.contact.instagram}
                  onChange={(e) => handleContentChange('contact', 'instagram', e.target.value)}
                  placeholder="@usuario_instagram"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => handleContentChange('contact', 'email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </section>
          </div>

          {/* Botão Salvar */}
          <div className="save-section">
            <button onClick={handleSave} className="save-btn" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            {saveStatus === 'success' && (
              <p className="success-message">Alterações salvas com sucesso!</p>
            )}
            {saveStatus === 'error' && (
              <p className="error-message">Erro ao salvar. Tente novamente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 