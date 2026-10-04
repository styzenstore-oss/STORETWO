'use client'
import { useEffect, useState } from 'react'
import { sb, rp, cart } from '@/lib/client'
export default function Home() {
  const [ps, setPs] = useState<any[]>([]), [an, setAn] = useState<any[]>([]), [po, setPo] = useState<any[]>([]), [msg, setMsg] = useState('')
  useEffect(() => { sb.from('product_stock').select('*').order('created_at').then(r => setPs(r.data || [])); sb.from('announcements').select('*').order('created_at', { ascending: false }).then(r => setAn(r.data || [])); sb.from('posters').select('*').order('created_at', { ascending: false }).then(r => setPo(r.data || [])) }, [])
  const add = (p: any) => { const c = cart.get(); c[p.id] = Math.min((c[p.id] || 0) + 1, p.stock); cart.set(c); setMsg(`${p.name} masuk keranjang`) }
  return <>
    {po.length > 0 && <div className="poster">{po.map(x => <img key={x.id} src={x.image_url} alt="Poster event" />)}</div>}
    {an.map(a => <div className="ann" key={a.id}>{a.text}</div>)}
    {msg && <p className="mute">{msg}. <a href="/cart">Buka keranjang</a></p>}
    <div className="grid">{ps.map(p => { const fin = Math.round(p.price * (100 - p.discount) / 100); return <div className="card" key={p.id}>
      <b>{p.name}</b><div>{p.discount > 0 && <span className="old">{rp(p.price)} </span>}<span className="price">{rp(fin)}</span></div>
      <p className="mute">{p.stock > 0 ? `Stok ${p.stock}` : <b className="err">Produk habis, tidak bisa dipesan</b>}</p>
      <button disabled={p.stock < 1} onClick={() => add(p)}>{p.stock < 1 ? 'Habis' : 'Masukkan keranjang'}</button></div> })}</div>
    {ps.length === 0 && <p className="mute">Belum ada produk.</p>}
  </>
}
