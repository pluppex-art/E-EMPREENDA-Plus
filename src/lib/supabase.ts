import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const SUPABASE_CONFIGURED = !!url && !!key

if (!SUPABASE_CONFIGURED) {
  console.warn('[Supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos no .env — reinicie o servidor após editar o .env')
}

export const supabase = createClient(
  url  || 'https://placeholder.supabase.co',
  key  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder'
)

export const AXIS = {
  TENANT_ID:   '27ef95ee-84dd-499e-9f25-cd9baecb5fe4',
  PIPELINE_ID: 'edb44aee-8569-48e1-a52c-61e0a31317e2', // SDR (pré-venda)
  STAGE_ID:    '7542d9bc-5322-403c-9eab-89f0047ea631', // Novo Lead
  SELLER_ID:   '40a13d8c-1b21-444b-b987-88ad84b9effe', // ANNA CRISTINY
  // Campos camelCase usados pelo CRM para filtrar leads no kanban
  PIPELINE_SLUG: 'sdr',
  STAGE_SLUG:    'sdr-1',
}

