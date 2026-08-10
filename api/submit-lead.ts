interface ApiRequest {
  method?: string
  body: Record<string, unknown>
}

interface ApiResponse {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://snwkzvgompfgqoqbpihe.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const ALLOWED_SOURCES = new Set(['pesquisa_expectativas', 'landing_empreenda'])

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY ausente' })
    return
  }

  const body = req.body || {}

  if (!ALLOWED_SOURCES.has(body.source as string)) {
    res.status(400).json({ error: 'source inválido' })
    return
  }
  if (!body.name || !body.email) {
    res.status(400).json({ error: 'name e email são obrigatórios' })
    return
  }

  const payload = {
    tenant_id: '27ef95ee-84dd-499e-9f25-cd9baecb5fe4',
    pipeline_id: 'edb44aee-8569-48e1-a52c-61e0a31317e2',
    stage_id: '7542d9bc-5322-403c-9eab-89f0047ea631',
    seller_id: '40a13d8c-1b21-444b-b987-88ad84b9effe',
    pipelineId: 'sdr',
    stageId: 'sdr-1',
    name: body.name,
    email: body.email,
    mobile_wa: body.mobile_wa || '',
    phone: body.phone || body.mobile_wa || '',
    source: body.source,
    value: 0.0,
    status: 'Open',
    temperature: 'Warm',
    priority: 'Medium',
    lead_interesse_cliente: body.lead_interesse_cliente || '',
    iaSummary: body.iaSummary || '',
    customFields: body.customFields || {},
  }

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  const data = await resp.json()

  if (!resp.ok) {
    res.status(502).json({ error: 'Falha ao gravar lead', details: data })
    return
  }

  res.status(201).json({ ok: true, id: Array.isArray(data) ? data[0]?.id : undefined })
}
