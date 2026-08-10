interface ApiRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
}

interface ApiResponse {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://snwkzvgompfgqoqbpihe.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESPOSTAS_PASSWORD = process.env.RESPOSTAS_PASSWORD || 'eempreenda2026'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const password = req.headers['x-respostas-password']
  if (password !== RESPOSTAS_PASSWORD) {
    res.status(401).json({ error: 'Não autorizado' })
    return
  }

  if (!SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY ausente' })
    return
  }

  const query =
    `${SUPABASE_URL}/rest/v1/leads` +
    `?select=id,name,email,mobile_wa,created_at,customFields` +
    `&source=eq.pesquisa_expectativas` +
    `&order=created_at.desc`

  const resp = await fetch(query, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })

  const data = await resp.json()

  if (!resp.ok) {
    res.status(502).json({ error: 'Falha ao buscar leads', details: data })
    return
  }

  res.status(200).json(data)
}
