/**
 * Seed script — popula/atualiza a tabela landing_configs no Supabase
 * com os valores padrão definidos no código.
 *
 * Uso: npm run seed
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Lê .env manualmente (sem depender de dotenv)
function loadEnv() {
  try {
    const raw = readFileSync(new URL('../.env', import.meta.url), 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      process.env[key.trim()] = rest.join('=').trim()
    }
  } catch {
    console.error('❌  .env não encontrado. Crie o arquivo com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
    process.exit(1)
  }
}

loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const TENANT_ID = '27ef95ee-84dd-499e-9f25-cd9baecb5fe4'
const SITE_KEY  = 'eempreenda'

// ─────────────────────────────────────────────
// EDITE AQUI os conteúdos padrão da landing page
// e rode `npm run seed` para sincronizar com o banco.
// ─────────────────────────────────────────────

const SECTIONS = {
  hero: {
    h1: 'Seu negócio não existe porque ninguém te ensinou o caminho.',
    subtitle: 'A maioria das pessoas sonha em empreender, mas poucas têm coragem de começar. A Turma 3 da E-Empreenda+ é a sua oportunidade para construir um negócio lucrativo com propósito e visão estratégica.',
    quote: 'Empreender transforma vidas.',
    ctaText: 'Garantir Minha Vaga',
  },

  pillars: [
    { num: '01', title: 'Identidade & Propósito',  desc: 'Clareza total sobre quem você é e a marca que deseja deixar no mundo.' },
    { num: '02', title: 'Mentalidade de Legado',   desc: 'Foco emocional e psicológico para empreender com resiliência e visão de longo prazo.' },
    { num: '03', title: 'Execução Prática',         desc: 'Método e ferramentas para transformar ideias em negócios sustentáveis.' },
  ],

  testimonials: [
    { text: 'Escalar um negócio digital exige muito mais que apenas técnica; exige uma base sólida de princípios. Na E-Empreenda+ encontrei o equilíbrio perfeito entre métricas agressivas e propósito inegociável.', name: 'Gustavo Oliveira', role: 'Estrategista Digital', sector: 'Marketing' },
    { text: 'O crochê era meu refúgio, mas no movimento E+ virou meu negócio real. Aprendi a sair do amadorismo, valorizar meu trabalho e estruturar processos que me permitem crescer sem perder a essência do que eu faço com as mãos.', name: 'Renata Luz', role: 'Recriar Crochê', sector: 'Artesanato' },
    { text: 'Como servidor, eu buscava segurança, mas sentia um chamado latente para frutificar fora do sistema. A E-Empreenda+ me deu a coragem e, principalmente, o método para empreender com responsabilidade e clareza de direção.', name: 'Marcus Vinícius', role: 'Servidor Público', sector: 'Serviço Público' },
    { text: 'Eu já tinha a garra de vendas, mas me faltava a visão de dono. A mentoria me ensinou a transformar esforço individual em um modelo de negócio replicável. Hoje não apenas vendo, eu construo um ativo com base em valores.', name: 'Kevin Oliveira', role: 'Vendedor', sector: 'Vendas' },
    { text: 'Minha clínica mudou de patamar quando entendi que ser uma excelente profissional técnica é diferente de ser uma dona de clínica de sucesso. O E-EMPREENDA+ foi o divisor de águas na minha gestão.', name: 'Eduarda Porto', role: 'Farmacêutica Esteta', sector: 'Saúde & Estética' },
    { text: 'Viver de arte é um desafio constante. A E-Empreenda+ me ensinou a gerir minha carreira como uma empresa, trazendo previsibilidade financeira e uma autoridade que eu não conseguia construir sozinho no mercado de ensino.', name: 'Gustavo Silva', role: 'Instrutor de Canto', sector: 'Educação' },
  ],

  benefits: [
    { step: '01', title: 'Conteúdos de Preparação',   desc: 'Receba materiais exclusivos que vão preparar sua mente e seu negócio para a Turma 3.' },
    { step: '02', title: 'Bastidores da E-Empreenda+', desc: 'Entenda a estrutura por trás dos negócios que unem propósito e identidade que te leva ao lucro.' },
    { step: '03', title: 'Acesso Antecipado',          desc: 'Garanta sua inscrição antes de todo mundo e tenha prioridade máxima na Turma 3.' },
    { step: '04', title: 'Networking Curado',          desc: 'Conecte-se com empreendedores que buscam os mesmos valores e ambições que você.' },
  ],

  faq: [
    { q: 'Para quem é o E-EMPREENDA + IMERSÃO?',                      a: 'Para quem quer começar ou crescer com estratégia, apoio e visão prática. Não importa se você ainda está no CLT ou se já possui um negócio estruturado. O que importa é a sua disposição para a transformação real.' },
    { q: 'Como funcionam os 12 encontros?',                           a: 'São 12 encontros presenciais intensivos com foco em execução. Cada encontro tem uma entrega específica: você sai com algo implementado no seu negócio, não só aprendido.' },
    { q: 'Qual é a diferença entre IMERSÃO, MASTERMIND e IA LAB?',    a: 'IMERSÃO é para quem quer implementar sistemas de vendas e crescimento com método. MASTERMIND é para decisores de alta escala focados em networking e M&A. IA LAB é para quem quer automatizar processos corporativos com inteligência artificial.' },
    { q: 'Qual é a garantia?',                                        a: 'Garantia total de resultados. Se você participar ativamente e não conseguir implementar ao menos um sistema novo no seu negócio, devolvemos 100% do investimento. Sem perguntas.' },
    { q: 'Quando começa a próxima turma?',                            a: 'A próxima turma começa em 5 de agosto de 2026. As vagas são limitadas — apenas 50 — e preenchidas por ordem de aplicação após a entrevista de qualificação com nossa equipe.' },
    { q: 'Tem suporte entre os encontros?',                           a: 'Sim. Todos os participantes têm acesso à comunidade de alumni e suporte direto dos mentores entre os encontros para garantir a implementação do que foi trabalhado.' },
  ],

  form_steps: {
    step0: { indicator: '1 → IDENTIFICAÇÃO', label: 'Qual é o seu nome?' },
    step1: { indicator: '2 → CONTATO',       label: 'Como podemos te encontrar?' },
    step2: {
      indicator: '3 → SEU PERFIL', label: 'Qual melhor descreve você hoje?',
      options: [
        { value: 'aspirante', label: 'Quero Empreender', sub: 'Tenho uma ideia ou vontade de abrir um negócio', icon: '🌱' },
        { value: 'iniciante', label: 'Estou Começando',  sub: 'Tenho um negócio recente (menos de 2 anos)',      icon: '🚀' },
        { value: 'pequeno',   label: 'Já Empreendo',     sub: 'Tenho empresa, mas quero crescer e estruturar',   icon: '📈' },
        { value: 'retomada',  label: 'Quero Recomeçar',  sub: 'Já empreendi antes e quero retomar',              icon: '🔄' },
      ],
    },
    step3: {
      indicator: '4 → SEU DESAFIO', label: 'Qual é seu maior desafio agora?',
      options: [
        { value: 'validar',  label: 'Validar minha ideia',               icon: '💡' },
        { value: 'clientes', label: 'Conseguir meus primeiros clientes',  icon: '🤝' },
        { value: 'gestao',   label: 'Organizar e estruturar o negócio',   icon: '⚙️' },
        { value: 'escalar',  label: 'Escalar e crescer com consistência', icon: '⚡' },
      ],
    },
    step4: {
      indicator: '5 → FINALIZAR', label: 'Confirme sua inscrição.',
      description: 'Você está solicitando uma vaga na Turma 3 da E-EMPREENDA+. Nossa equipe entrará em contato em até 48h para confirmar sua participação.',
    },
  },
}

// ─────────────────────────────────────────────

async function seed() {
  console.log('🌱  Sincronizando landing_configs com o Supabase...\n')

  const rows = Object.entries(SECTIONS).map(([section, content]) => ({
    tenant_id:  TENANT_ID,
    site_key:   SITE_KEY,
    section,
    content,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('landing_configs')
    .upsert(rows, { onConflict: 'tenant_id,site_key,section' })

  if (error) {
    console.error('❌  Erro ao fazer upsert:', error.message)
    process.exit(1)
  }

  console.log(`✅  ${rows.length} seções sincronizadas:\n`)
  rows.forEach(r => console.log(`   • ${r.section}`))
  console.log('\nPronto! O banco de dados está atualizado.')
}

seed()
