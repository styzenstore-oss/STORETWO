'use client'
import { useEffect, useState } from 'react'
import { sb, rp, cart } from '@/lib/client'
import { Icon, hue } from '@/lib/ui'
export default function Home() {
  const [ps, setPs] = useState<any[]>([]), [an, setAn] = useState<any[]>([]), [po, setPo] = useState<any[]>([]), [q, setQ] = useState(''), [msg, setMsg] = useState('')
  useEffect(() => { sb.from('product_stock').select('*').order('created_at').then(r => setPs(r.data || [])); sb.from('announcements').select('*').order('created_at', { ascending: false }).then(r => setAn(r.data || [])); sb.from('posters').select('*').order('created_at', { ascending: false }).then(r => setPo(r.data || [])) }, [])
  const add = (p: any) => { const c = cart.get(); c[p.id] = Math.min((c[p.id] || 0) + 1, p.stock); cart.set(c); setMsg(`${p.name} masuk keranjang`); setTimeout(() => setMsg(''), 2200) }
  const list = ps.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
  return <>
    {po.length > 0 && <div className="poster">{po.map(x => <img key={x.id} src={x.image_url} alt="Poster event" />)}</div>}
    {an.map(a => <div className="ann" key={a.id}>{a.text}</div>)}
    <div className="search"><Icon n="search" /><input placeholder="Cari produk premium" value={q} onChange={e => setQ(e.target.value)} /></div>
    <div className="grid">{list.map(p => { const fin = Math.round(p.price * (100 - p.discount) / 100), h = hue(p.name); return <div className="card pc" key={p.id}>
      <div className="tile" style={{ background: `linear-gradient(135deg,hsl(${h} 80% 56%),hsl(${(h + 55) % 360} 85% 46%))` }}>{p.name[0]}</div>
      {p.discount > 0 && <span className="pill r disc">-{p.discount}%</span>}
      <b>{p.name}</b><div>{p.discount > 0 && <span className="old">{rp(p.price)} </span>}<span className="price">{rp(fin)}</span></div>
      {p.stock > 0 ? <span className="pill g">Stok {p.stock}</span> : <span className="pill r">Habis, tidak bisa dipesan</span>}
      <button disabled={p.stock < 1} onClick={() => add(p)}>{p.stock < 1 ? 'Habis' : 'Tambah ke keranjang'}</button></div> })}</div>
    {list.length === 0 && <p className="mute">{ps.length ? 'Produk tidak ditemukan.' : 'Belum ada produk.'}</p>}
    {msg && <div className="toast">{msg}</div>}
  </>
}
