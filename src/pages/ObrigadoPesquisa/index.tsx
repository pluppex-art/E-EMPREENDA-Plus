import { useLocation, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import styles from './ObrigadoPesquisa.module.css'

export default function ObrigadoPesquisa() {
  const { state } = useLocation() as {
    state: { nome?: string; negocio?: string } | null
  }

  const nome = state?.nome?.split(' ')[0] ?? 'Aluno'
  const negocio = state?.negocio ?? 'seu negócio'

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.bg} aria-hidden="true" />

        <div className={styles.card}>
          {/* Ícone de confirmação */}
          <div className={styles.iconWrap} aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF5C00"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <div className={styles.tag}>Pesquisa Recebida</div>

          <h1>
            Obrigado, <span className={styles.orange}>{nome}!</span>
          </h1>

          <p className={styles.lead}>
            Suas expectativas sobre <strong>{negocio}</strong> foram registradas com sucesso. Os
            mentores da E-Empreenda+ vão usar essas informações para tornar a sua jornada{' '}
            <strong>o mais prática e aplicável possível</strong> à sua realidade.
          </p>

          {/* O que acontece agora */}
          <div className={styles.nextSteps}>
            <h3>O que acontece agora</h3>
            <ol className={styles.steps}>
              <li>
                <span className={styles.stepNumber}>01</span>
                <div>
                  <strong>Respostas analisadas pelos mentores</strong>
                  <p>
                    Sua equipe de mentoria vai revisar suas expectativas antes do primeiro encontro
                    para personalizar o conteúdo à sua realidade.
                  </p>
                </div>
              </li>
              <li>
                <span className={styles.stepNumber}>02</span>
                <div>
                  <strong>Prepare-se para o primeiro módulo</strong>
                  <p>
                    Em breve você receberá os materiais de pré-trabalho para chegar ao primeiro
                    encontro pronto para executar.
                  </p>
                </div>
              </li>
              <li>
                <span className={styles.stepNumber}>03</span>
                <div>
                  <strong>A sua jornada começa!</strong>
                  <p>
                    12 semanas de imersão focadas em transformar o que você nos contou hoje em
                    resultados reais no seu negócio.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className={styles.actions}>
            <Link to="/" className={styles.btnOutline}>
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
