'use client'
import { useEffect, useState } from 'react'
import { sb, rp } from '@/lib/client'
export default function Nav() {
  const [p, setP] = useState<any>(null)
  useEffect(() => { const load = async () => { const { data: { user } } = await sb.auth.getUser(); if (!user) return setP(null); const { data } = await sb.from('profiles').select('*').eq('id', user.id).single(); setP(data) }; load(); const { data: s } = sb.auth.onAuthStateChange(load); return () => s.subscription.unsubscribe() }, [])
  return <nav><b><a href="/" style={{ textDecoration: 'none' }}>Toko Premium</a></b>
    <a href="/cart">Keranjang</a>
    {p ? <><a href="/riwayat">Riwayat</a>{p.role === 'admin' && <a href="/admin">Admin</a>}<span className="mute">{rp(p.balance)}</span><button className="ghost" onClick={() => sb.auth.signOut()}>Keluar</button></> : <a className="btn" href="/login">Masuk</a>}</nav>
}
