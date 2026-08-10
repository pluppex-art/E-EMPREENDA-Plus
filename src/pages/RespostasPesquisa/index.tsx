import { useEffect, useMemo, useState } from 'react'
import Logo from '../../components/Logo'
import styles from './RespostasPesquisa.module.css'

interface LeadRow {
  id: string
  name: string
  email: string
  mobile_wa: string
  created_at: string
  customFields: Record<string, unknown> | null
}

const SESSION_KEY = 'respostas_pesquisa_auth'

const MOMENTO_LABELS: Record<string, string> = {
  ideia: 'Tenho apenas uma ideia',
  comecando: 'Estou começando meu negócio',
  funcionando: 'Já tenho um negócio funcionando',
  crescer: 'Meu negócio já vende, mas quero crescer',
  estruturado: 'Já tenho uma empresa estruturada',
}

const DESAFIO_LABELS: Record<string, string> = {
  vendas: 'Vendas',
  marketing: 'Marketing',
  gestao: 'Gestão',
  financeiro: 'Financeiro',
  lideranca: 'Liderança/equipe',
  processos: 'Organização/processos',
  ideia: 'Tirar a ideia do papel',
  outro: 'Outro',
}

const DEDICACAO_LABELS: Record<string, string> = {
  menos_1h: 'Menos de 1 hora',
  '1_2h': 'De 1 a 2 horas',
  '3_5h': 'De 3 a 5 horas',
  mais_5h: 'Mais de 5 horas',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function PasswordGate({
  onUnlock,
  error: externalError,
}: {
  onUnlock: (password: string) => void
  error?: string
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value) {
      setError('Informe a senha.')
      return
    }
    sessionStorage.setItem(SESSION_KEY, value)
    onUnlock(value)
  }

  const shownError = error || externalError

  return (
    <div className={styles.gateWrap}>
      <form className={styles.gateCard} onSubmit={submit}>
        <Logo size={40} />
        <h1 className={styles.gateTitle}>Respostas da Pesquisa</h1>
        <p className={styles.gateSub}>Área restrita à equipe E-Empreenda+</p>
        <input
          type="password"
          className={styles.gateInput}
          placeholder="Senha de acesso"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError('')
          }}
          autoFocus
        />
        <button type="submit" className={styles.gateBtn}>
          Entrar
        </button>
        {shownError && <div className={styles.gateError}>{shownError}</div>}
      </form>
    </div>
  )
}

export default function RespostasPesquisa() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [authError, setAuthError] = useState('')
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchLeads = async (pw: string) => {
    setLoading(true)
    setError('')
    try {
      const resp = await fetch('/api/list-leads', {
        headers: { 'x-respostas-password': pw },
      })
      setLoading(false)
      if (resp.status === 401) {
        sessionStorage.removeItem(SESSION_KEY)
        setPassword('')
        setAuthError('Senha incorreta.')
        return
      }
      if (!resp.ok) {
        setError('Erro ao carregar respostas: ' + (await resp.text()))
        return
      }
      const data = (await resp.json()) as LeadRow[]
      setLeads(data || [])
      if (data && data.length > 0) {
        setSelectedId((prev) => prev ?? data[0].id)
      }
    } catch (err) {
      setLoading(false)
      setError('Erro de conexão ao carregar respostas.')
      console.error(err)
    }
  }

  useEffect(() => {
    if (password) fetchLeads(password)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password])

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) || null,
    [leads, selectedId]
  )

  if (!password) {
    return (
      <PasswordGate
        onUnlock={(pw) => {
          setAuthError('')
          setPassword(pw)
        }}
        error={authError}
      />
    )
  }

  const cf = (selected?.customFields || {}) as Record<string, unknown>

  const answerFields: { label: string; value: string }[] = selected
    ? [
        { label: 'Negócio/Projeto', value: String(cf.nome_negocio ?? '—') },
        {
          label: 'Momento do negócio',
          value: MOMENTO_LABELS[String(cf.momento_negocio)] || String(cf.momento_negocio ?? '—'),
        },
        {
          label: 'Principal desafio',
          value: DESAFIO_LABELS[String(cf.desafio_principal)] || String(cf.desafio_principal ?? '—'),
        },
        { label: 'Objetivo em 6 meses', value: String(cf.objetivo_6_meses ?? '—') },
        { label: 'Motivação para participar', value: String(cf.motivacao_participacao ?? '—') },
        { label: 'O que espera aprender', value: String(cf.expectativa_aprendizado ?? '—') },
        { label: 'Resultado que "valeria a pena"', value: String(cf.resultado_valeu_pena ?? '—') },
        { label: 'Autoavaliação em gestão (0-10)', value: String(cf.autoavaliacao_gestao ?? '—') },
        {
          label: 'Dedicação semanal',
          value: DEDICACAO_LABELS[String(cf.tempo_dedicacao_semanal)] || String(cf.tempo_dedicacao_semanal ?? '—'),
        },
        { label: 'Dúvida/tópico específico', value: String(cf.duvida_especifica || 'Não preenchido') },
      ]
    : []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>Respostas — Pesquisa de Expectativas</div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={() => fetchLeads(password)} disabled={loading}>
            {loading ? 'Atualizando…' : 'Atualizar'}
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY)
              setPassword('')
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {error && <div className={styles.errorBox}>{error}</div>}

      {!error && (
        <div className={styles.body}>
          <div className={styles.list}>
            <div className={styles.listMeta}>
              {loading ? 'Carregando…' : `${leads.length} resposta(s)`}
            </div>
            {leads.map((lead) => (
              <button
                key={lead.id}
                className={`${styles.listItem} ${
                  lead.id === selectedId ? styles.listItemActive : ''
                }`}
                onClick={() => setSelectedId(lead.id)}
              >
                <div className={styles.listName}>{lead.name || 'Sem nome'}</div>
                <div className={styles.listSub}>
                  {lead.email} · {fmtDate(lead.created_at)}
                </div>
                <div className={styles.listId}>{lead.id}</div>
              </button>
            ))}
            {!loading && leads.length === 0 && (
              <div className={styles.listMeta}>Nenhuma resposta encontrada.</div>
            )}
          </div>

          <div className={styles.detail}>
            {!selected ? (
              <div className={styles.emptyState}>Selecione uma resposta na lista ao lado.</div>
            ) : (
              <>
                <div className={styles.detailHeader}>
                  <h1 className={styles.detailName}>{selected.name}</h1>
                  <div className={styles.detailMetaRow}>
                    <span>{selected.email}</span>
                    <span>{selected.mobile_wa}</span>
                    <span>{fmtDate(selected.created_at)}</span>
                  </div>
                  <div className={styles.detailId}>ID: {selected.id}</div>
                </div>
                <div className={styles.answerGrid}>
                  {answerFields.map((f) => (
                    <div key={f.label} className={styles.answerCard}>
                      <div className={styles.answerLabel}>{f.label}</div>
                      <div className={styles.answerValue}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
