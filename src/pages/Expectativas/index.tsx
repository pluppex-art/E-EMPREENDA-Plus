import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import Logo from '../../components/Logo'
import styles from './Expectativas.module.css'

interface SurveyData {
  nome: string
  negocio: string
  email: string
  telefone: string
  momento: string
  desafio: string
  objetivo6Meses: string
  motivacao: string
  aprender: string
  valeuAPena: string
  nivelGestao: number | null
  dedicacao: string
  duvidaEspecifica: string
}

const INITIAL_STATE: SurveyData = {
  nome: '',
  negocio: '',
  email: '',
  telefone: '',
  momento: '',
  desafio: '',
  objetivo6Meses: '',
  motivacao: '',
  aprender: '',
  valeuAPena: '',
  nivelGestao: null,
  dedicacao: '',
  duvidaEspecifica: '',
}

export default function Expectativas() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SurveyData>(INITIAL_STATE)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Total steps including intro (step 0) and final confirmation (step 10)
  const TOTAL_STEPS = 11

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -60
      const y = (e.clientY / window.innerHeight - 0.5) * -60
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const set = (field: keyof SurveyData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const applyPhoneMask = (val: string) => {
    const digits = val.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateStep = (s: number): boolean => {
    switch (s) {
      case 0: // Intro screen
        break
      case 1: // Identificação
        if (formData.nome.trim().length < 3) {
          setError('Insira seu nome completo.')
          return false
        }
        if (formData.negocio.trim().length < 2) {
          setError('Insira o nome do seu negócio ou projeto.')
          return false
        }
        if (!validateEmail(formData.email)) {
          setError('Insira um e-mail válido.')
          return false
        }
        if (formData.telefone.replace(/\D/g, '').length < 10) {
          setError('Insira um número de telefone com DDD.')
          return false
        }
        break
      case 2: // Momento do negócio
        if (!formData.momento) {
          setError('Selecione uma opção sobre o seu momento atual.')
          return false
        }
        break
      case 3: // Desafio principal
        if (!formData.desafio) {
          setError('Selecione o seu principal desafio.')
          return false
        }
        break
      case 4: // Resultados 6 meses
        if (formData.objetivo6Meses.trim().length < 10) {
          setError('Conte-nos um pouco mais sobre seu objetivo (mínimo 10 caracteres).')
          return false
        }
        break
      case 5: // Motivação
        if (formData.motivacao.trim().length < 10) {
          setError('Escreva brevemente o que motivou você a participar (mínimo 10 caracteres).')
          return false
        }
        break
      case 6: // O que espera aprender
        if (formData.aprender.trim().length < 10) {
          setError('Conte-nos o que você espera aprender (mínimo 10 caracteres).')
          return false
        }
        break
      case 7: // Valeu a pena
        if (formData.valeuAPena.trim().length < 10) {
          setError('Descreva qual resultado faria valer a pena participar (mínimo 10 caracteres).')
          return false
        }
        break
      case 8: // Nível gestão
        if (formData.nivelGestao === null) {
          setError('Selecione uma nota de 0 a 10.')
          return false
        }
        break
      case 9: // Tempo dedicação
        if (!formData.dedicacao) {
          setError('Selecione o tempo médio que deseja dedicar.')
          return false
        }
        break
      case 10: // Dúvida específica
        // Opcional, sem validação rígida
        break
    }
    setError('')
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < TOTAL_STEPS - 1) {
        setStep((prev) => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey === false && e.shiftKey === false) {
      // Don't auto-advance in textareas on Enter unless they want to submit
      const target = e.target as HTMLElement
      if (target.tagName === 'TEXTAREA') return
      e.preventDefault()
      nextStep()
    }
  }

  const selectCard = (field: keyof SurveyData, value: string) => {
    set(field, value)
    setTimeout(() => {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
    }, 350)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return
    setLoading(true)
    setError('')

    const momentoLabels: Record<string, string> = {
      ideia: 'Tenho apenas uma ideia',
      comecando: 'Estou começando meu negócio',
      funcionando: 'Já tenho um negócio funcionando',
      crescer: 'Meu negócio já vende, mas quero crescer',
      estruturado: 'Já tenho uma empresa estruturada',
    }

    const desafioLabels: Record<string, string> = {
      vendas: 'Vendas',
      marketing: 'Marketing',
      gestao: 'Gestão',
      financeiro: 'Financeiro',
      lideranca: 'Liderança/equipe',
      processos: 'Organização/processos',
      ideia: 'Tirar a ideia do papel',
      outro: 'Outro',
    }

    const dedicacaoLabels: Record<string, string> = {
      menos_1h: 'Menos de 1 hora',
      '1_2h': 'De 1 a 2 horas',
      '3_5h': 'De 3 a 5 horas',
      mais_5h: 'Mais de 5 horas',
    }

    const momentoLabel = momentoLabels[formData.momento] || formData.momento
    const desafioLabel = desafioLabels[formData.desafio] || formData.desafio
    const dedicacaoLabel = dedicacaoLabels[formData.dedicacao] || formData.dedicacao

    const iaSummary = `
Pesquisa de Expectativas E-Empreenda+
-----------------------------------
Negócio/Projeto: ${formData.negocio}
Momento: ${momentoLabel}
Desafio: ${desafioLabel}
Objetivo 6 meses: ${formData.objetivo6Meses}
Motivação: ${formData.motivacao}
O que espera aprender: ${formData.aprender}
Resultado "Valeu a pena": ${formData.valeuAPena}
Autoavaliação Gestão: ${formData.nivelGestao}/10
Dedicação Semanal: ${dedicacaoLabel}
Dúvida/Tópico específico: ${formData.duvidaEspecifica || 'Não preenchido'}
    `.trim()

    try {
      const resp = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          mobile_wa: formData.telefone,
          phone: formData.telefone,
          source: 'pesquisa_expectativas',
          lead_interesse_cliente: 'Pesquisa de Expectativas - E-Empreenda+',
          iaSummary,
          customFields: {
            nome_negocio: formData.negocio,
            momento_negocio: formData.momento,
            desafio_principal: formData.desafio,
            objetivo_6_meses: formData.objetivo6Meses,
            motivacao_participacao: formData.motivacao,
            expectativa_aprendizado: formData.aprender,
            resultado_valeu_pena: formData.valeuAPena,
            autoavaliacao_gestao: formData.nivelGestao,
            tempo_dedicacao_semanal: formData.dedicacao,
            duvida_especifica: formData.duvidaEspecifica,
          },
        }),
      })

      setLoading(false)
      if (!resp.ok) {
        setError('Erro ao enviar as respostas. Por favor, tente novamente.')
        console.error('[Survey error]', await resp.text())
      } else {
        navigate('/obrigado-pesquisa', { state: { nome: formData.nome, negocio: formData.negocio } })
      }
    } catch (err) {
      setLoading(false)
      setError('Erro de conexão ao enviar. Tente novamente mais tarde.')
      console.error(err)
    }
  }

  // Animation variants
  const slideVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: 'easeIn' as const } },
  }


  return (
    <div className={styles.pageContainer}>
      {/* Interactive Drift Background */}
      <div className={styles.interactiveBackground}>
        <div
          className={styles.bgStairs}
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        >
          <div className={`${styles.bgBar} ${styles.bgBar1}`} />
          <div className={`${styles.bgBar} ${styles.bgBar2}`} />
          <div className={`${styles.bgBar} ${styles.bgBar3}`} />
        </div>
      </div>

      <header className={styles.header}>
        <Logo size={42} />
        <div className={styles.headerMeta}>
          {step > 0 && (
            <>
              <span className={styles.headerStep}>
                Etapa {step} de {TOTAL_STEPS - 1}
              </span>
              <span className={styles.headerGuarantee}>Alinhamento de Expectativas</span>
            </>
          )}
        </div>
      </header>

      {/* Top progress bar */}
      {step > 0 && (
        <div className={styles.progressTopBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      )}

      <main className={styles.mainContent}>
        <div className={styles.formWrapper}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              nextStep()
            }}
            noValidate
            className={styles.form}
          >
            <AnimatePresence mode="wait">
              {/* STEP 0: INTRODUÇÃO */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>Boas-vindas Aluno E+</div>
                  <h1 className={styles.questionLabel}>
                    Queremos conhecer o seu momento para que a E-Empreenda+ seja o mais prática e
                    aplicável possível à sua realidade.
                  </h1>
                  <p className={styles.questionSub}>
                    Reserve cerca de 3 a 5 minutos para preencher esta pesquisa de alinhamento com
                    seus mentores.
                  </p>
                  <div className={styles.navRow}>
                    <button type="submit" className={styles.btnNext}>
                      Iniciar Pesquisa
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: IDENTIFICAÇÃO */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>1 → Identificação</div>
                  <h2 className={styles.questionLabel}>Como podemos identificar você e seu projeto?</h2>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder="Qual é seu nome completo?"
                      value={formData.nome}
                      onChange={(e) => set('nome', e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={styles.textInput}
                      autoFocus
                      autoComplete="name"
                    />
                    <input
                      type="text"
                      placeholder="Qual o nome do seu negócio ou projeto?"
                      value={formData.negocio}
                      onChange={(e) => set('negocio', e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={styles.textInput}
                      autoComplete="organization"
                    />
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail para contato"
                      value={formData.email}
                      onChange={(e) => set('email', e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={styles.textInput}
                      autoComplete="email"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp com DDD"
                      value={formData.telefone}
                      onChange={(e) => set('telefone', applyPhoneMask(e.target.value))}
                      onKeyDown={handleKeyDown}
                      className={styles.textInput}
                      autoComplete="tel"
                    />
                  </div>
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: MOMENTO DO NEGÓCIO */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>2 → Situação Atual</div>
                  <h2 className={styles.questionLabel}>Em qual momento você está hoje?</h2>
                  <div className={styles.optionsGrid}>
                    {[
                      {
                        value: 'ideia',
                        label: 'Tenho apenas uma ideia',
                        desc: 'Gostaria de estruturar para tirar do papel',
                        icon: '🌱',
                      },
                      {
                        value: 'comecando',
                        label: 'Estou começando meu negócio',
                        desc: 'Menos de 2 anos de operação ativa',
                        icon: '🚀',
                      },
                      {
                        value: 'funcionando',
                        label: 'Já tenho um negócio funcionando',
                        desc: 'Operação ativa e faturamento recorrente',
                        icon: '🏢',
                      },
                      {
                        value: 'crescer',
                        label: 'Meu negócio já vende, mas quero crescer',
                        desc: 'Buscando escalar processos e equipe',
                        icon: '📈',
                      },
                      {
                        value: 'estruturado',
                        label: 'Já tenho uma empresa estruturada',
                        desc: 'Equipe formada e processos estabelecidos',
                        icon: '💎',
                      },
                    ].map((item) => (
                      <div
                        key={item.value}
                        onClick={() => selectCard('momento', item.value)}
                        className={`${styles.cardOption} ${
                          formData.momento === item.value ? styles.cardSelected : ''
                        }`}
                      >
                        <div className={styles.cardIcon}>{item.icon}</div>
                        <div className={styles.cardText}>
                          <span className={styles.cardTitle}>{item.label}</span>
                          <span className={styles.cardDesc}>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DESAFIO */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>3 → Desafio Principal</div>
                  <h2 className={styles.questionLabel}>Qual é hoje o maior desafio do seu negócio?</h2>
                  <div className={styles.optionsGrid}>
                    {[
                      { value: 'vendas', label: 'Vendas', desc: 'Aumentar a conversão', icon: '💰' },
                      { value: 'marketing', label: 'Marketing', desc: 'Atração de leads', icon: '📢' },
                      { value: 'gestao', label: 'Gestão', desc: 'Visão de dono e controle', icon: '⚙️' },
                      { value: 'financeiro', label: 'Financeiro', desc: 'Caixa e precificação', icon: '📊' },
                      { value: 'lideranca', label: 'Liderança / Equipe', desc: 'Engajamento e contratação', icon: '👥' },
                      { value: 'processos', label: 'Organização / Processos', desc: 'Rotinas produtivas', icon: '🔄' },
                      { value: 'ideia', label: 'Tirar a ideia do papel', desc: 'Dar o primeiro passo', icon: '💡' },
                      { value: 'outro', label: 'Outro', desc: 'Situação específica', icon: '📝' },
                    ].map((item) => (
                      <div
                        key={item.value}
                        onClick={() => selectCard('desafio', item.value)}
                        className={`${styles.cardOption} ${
                          formData.desafio === item.value ? styles.cardSelected : ''
                        }`}
                      >
                        <div className={styles.cardIcon}>{item.icon}</div>
                        <div className={styles.cardText}>
                          <span className={styles.cardTitle}>{item.label}</span>
                          <span className={styles.cardDesc}>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: META 6 MESES */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>4 → Visão de Futuro</div>
                  <h2 className={styles.questionLabel}>
                    Qual resultado você mais gostaria de alcançar nos próximos 6 meses?
                  </h2>
                  <textarea
                    placeholder="Ex: Faturar R$ 50k recorrentes, contratar mais 2 colaboradores, validar a tese no mercado, etc."
                    value={formData.objetivo6Meses}
                    onChange={(e) => set('objetivo6Meses', e.target.value)}
                    className={styles.textareaInput}
                    autoFocus
                  />
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: MOTIVAÇÃO */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>5 → Propósito</div>
                  <h2 className={styles.questionLabel}>O que motivou você a participar da E-Empreenda+?</h2>
                  <textarea
                    placeholder="Conte-nos o que chamou sua atenção no programa ou seu principal motivador pessoal/profissional."
                    value={formData.motivacao}
                    onChange={(e) => set('motivacao', e.target.value)}
                    className={styles.textareaInput}
                    autoFocus
                  />
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: EXPECTATIVAS DE APRENDIZADO */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>6 → Conhecimento</div>
                  <h2 className={styles.questionLabel}>O que você espera aprender durante a E-Empreenda+?</h2>
                  <textarea
                    placeholder="Quais temas, técnicas, ferramentas ou habilidades você quer desenvolver com mais prioridade?"
                    value={formData.aprender}
                    onChange={(e) => set('aprender', e.target.value)}
                    className={styles.textareaInput}
                    autoFocus
                  />
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 7: VALEU A PENA */}
              {step === 7 && (
                <motion.div
                  key="step7"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>7 → Alinhamento Principal</div>
                  <h2 className={styles.questionLabel}>
                    Qual seria o principal resultado que faria você terminar o programa dizendo: "valeu a
                    pena participar"?
                  </h2>
                  <textarea
                    placeholder="Seja o mais específico possível. O que precisa acontecer de concreto na sua jornada?"
                    value={formData.valeuAPena}
                    onChange={(e) => set('valeuAPena', e.target.value)}
                    className={styles.textareaInput}
                    autoFocus
                  />
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 8: AUTOAVALIAÇÃO DE GESTÃO */}
              {step === 8 && (
                <motion.div
                  key="step8"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>8 → Autoavaliação</div>
                  <h2 className={styles.questionLabel}>
                    De 0 a 10, como você avalia hoje seu conhecimento sobre gestão e empreendedorismo?
                  </h2>
                  <div className={styles.scaleContainer}>
                    <div className={styles.scaleGrid}>
                      {Array.from({ length: 11 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => set('nivelGestao', i)}
                          className={`${styles.scaleButton} ${
                            formData.nivelGestao === i ? styles.scaleActive : ''
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                    <div className={styles.scaleLabels}>
                      <span>Pouquíssimo conhecimento</span>
                      <span>Extremamente seguro/dominante</span>
                    </div>
                  </div>
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 9: TEMPO DE DEDICAÇÃO */}
              {step === 9 && (
                <motion.div
                  key="step9"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>9 → Compromisso</div>
                  <h2 className={styles.questionLabel}>
                    Quanto tempo por semana você está disposto a dedicar para colocar em prática o que aprender?
                  </h2>
                  <div className={styles.optionsGrid}>
                    {[
                      { value: 'menos_1h', label: 'Menos de 1 hora', icon: '⏳' },
                      { value: '1_2h', label: 'De 1 a 2 horas', icon: '⏱️' },
                      { value: '3_5h', label: 'De 3 a 5 horas', icon: '📅' },
                      { value: 'mais_5h', label: 'Mais de 5 horas', icon: '⚡' },
                    ].map((item) => (
                      <div
                        key={item.value}
                        onClick={() => selectCard('dedicacao', item.value)}
                        className={`${styles.cardOption} ${
                          formData.dedicacao === item.value ? styles.cardSelected : ''
                        }`}
                      >
                        <div className={styles.cardIcon}>{item.icon}</div>
                        <div className={styles.cardText}>
                          <span className={styles.cardTitle}>{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext}>
                      Avançar
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 10: TÓPICO ESPECÍFICO */}
              {step === 10 && (
                <motion.div
                  key="step10"
                  className={styles.questionContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                >
                  <div className={styles.stepIndicator}>10 → Situação Específica (Opcional)</div>
                  <h2 className={styles.questionLabel}>
                    Existe alguma dificuldade, dúvida ou situação específica do seu negócio que você gostaria
                    que fosse abordada durante a E-Empreenda+?
                  </h2>
                  <textarea
                    placeholder="Descreva aqui se houver um problema muito pontual no qual você precise de mentoria urgente (opcional)."
                    value={formData.duvidaEspecifica}
                    onChange={(e) => set('duvidaEspecifica', e.target.value)}
                    className={styles.textareaInput}
                    autoFocus
                  />
                  <div className={styles.navRow}>
                    <button type="button" onClick={prevStep} className={styles.btnBack} disabled={loading}>
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button type="submit" className={styles.btnNext} disabled={loading}>
                      {loading ? (
                        <>
                          <div className={styles.spinner} />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Finalizar e Enviar
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </main>
    </div>
  )
}
