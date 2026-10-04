import { createClient } from '@supabase/supabase-js'
export const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export async function api(path: string, body?: any) {
  const { data } = await sb.auth.getSession()
  const r = await fetch(path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (data.session?.access_token || '') }, body: body ? JSON.stringify(body) : undefined })
  const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Gagal'); return j
}
export const rp = (n: number) => 'Rp' + Number(n).toLocaleString('id-ID')
export const cart = { get: (): Record<string, number> => JSON.parse(localStorage.getItem('cart') || '{}'), set: (c: any) => localStorage.setItem('cart', JSON.stringify(c)) }
