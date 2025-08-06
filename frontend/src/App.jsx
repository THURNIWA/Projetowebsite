import React, { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      {/* Header/Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>João Silva</h1>
            <h2>Personal Trainer Profissional</h2>
            <p>Transforme seu corpo e sua vida com treinos personalizados e acompanhamento especializado</p>
            <a href="#contato" className="btn">Entre em Contato</a>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="section">
        <div className="container">
          <h2>Sobre Mim</h2>
          <div className="card sobre-mim-text">
            <p>
            Treinos, motivação, lifestyle CF LV1 trainer Cwb gymnastic LV1 Liberacao Miofascia.
            </p>
            <p>
            Allan Joseph X-mobillity - mobilidade
            </p>
            <p>
            Pós graduação: Alta Performance em Prescrição de Treinos e Exercícios: Hipertrofia, Saúde e Emagrecimento
            </p>
            <p>
            “Manter o corpo em boa saúde é um dever… caso contrário, não seremos capazes de manter nossa mente forte e clara”.  - Buda
            </p>
            <div className="stats">
              <div className="stat">
                <h3>100+</h3>
                <p>Clientes Atendidos</p>
              </div>
              <div className="stat">
                <h3>5+</h3>
                <p>Anos de Experiência</p>
              </div>
              <div className="stat">
                <h3>100%</h3>
                <p>Compromisso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="section">
        <div className="container">
          <h2>Meus Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Treino Presencial</h3>
              <p>Acompanhamento individualizado com treinos personalizados na academia ou ao ar livre.</p>
              <ul>
                <li>Avaliação física completa</li>
                <li>Treinos personalizados</li>
                <li>Acompanhamento nutricional básico</li>
                <li>Suporte via WhatsApp</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Treino Online</h3>
              <p>Treinos personalizados para você fazer em casa ou na academia com acompanhamento remoto.</p>
              <ul>
                <li>Treinos personalizados</li>
                <li>Vídeos explicativos</li>
                <li>Acompanhamento semanal</li>
                <li>Suporte 24/7</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Consultoria</h3>
              <p>Orientação especializada para otimizar seus treinos e resultados.</p>
              <ul>
                <li>Análise de treinos</li>
                <li>Dicas de nutrição</li>
                <li>Planejamento de metas</li>
                <li>Suporte por 30 dias</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="section">
        <div className="container">
          <h2>Entre em Contato</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Vamos conversar sobre seus objetivos?</h3>
              <p>Preencha o formulário ao lado e eu entrarei em contato em até 24 horas.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <strong>WhatsApp:</strong> (41) 98854-0467
                </div>
                <div className="contact-item">
                  <strong>Instagram:</strong> @tamyniwa_personal
                </div>
                <div className="contact-item">
                  <strong>Email:</strong> tamyniwa@gmail.com
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nome Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensagem *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Conte-me sobre seus objetivos e como posso te ajudar..."
                  />
                </div>
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
                {submitStatus === 'success' && (
                  <p className="success-message">Mensagem enviada com sucesso! Entrarei em contato em breve.</p>
                )}
                {submitStatus === 'error' && (
                  <p className="error-message">Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Tamy Niwa - Personal Trainer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App 