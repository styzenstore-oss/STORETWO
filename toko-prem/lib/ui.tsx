'use client'
import { useEffect, useState } from 'react'
import { sb } from './client'
const P: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  cart: 'M3 4h2l2.4 11h10.2l2-8H6.2M9 20h.01M17 20h.01',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  wallet: 'M3 7a2 2 0 012-2h13v4M3 7v10a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14h2',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
}
export const Icon = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={P[n]} /></svg>
export const hue = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h }
export function useProfile() {
  const [p, setP] = useState<any>(undefined)
  useEffect(() => {
    const l = async () => { const { data: { user } } = await sb.auth.getUser(); if (!user) return setP(null); const { data } = await sb.from('profiles').select('*').eq('id', user.id).single(); setP(data) }
    l(); const { data: s } = sb.auth.onAuthStateChange(l); return () => s.subscription.unsubscribe()
  }, [])
  return p
}
