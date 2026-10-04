'use client'
import { useEffect, useState } from 'react'
import { sb, api, rp, cart } from '@/lib/client'
export default function Cart() {
  const [items, setItems] = useState<any[]>([]), [user, setUser] = useState<any>(null), [f, setF] = useState({ name: '', wa: '', voucher: '', method: 'qris' }), [e, setE] = useState(''), [busy, setBusy] = useState(false)
  const load = async () => { const c = cart.get(), ids = Object.keys(c); if (ids.length) { const { data } = await sb.from('product_stock').select('*').in('id', ids); setItems((data || []).map(p => ({ ...p, qty: p.stock < 1 ? 1 : Math.min(c[p.id], p.stock) }))) } else setItems([]) }
  useEffect(() => { load(); sb.auth.getUser().then(r => setUser(r.data.user)) }, [])
  const setQty = (id: string, q: number) => { const c = cart.get(); if (q < 1) delete c[id]; else c[id] = q; cart.set(c); load() }
  const total = items.reduce((s, p) => s + Math.round(p.price * (100 - p.discount) / 100) * p.qty, 0)
  const pay = async () => { setBusy(true); setE(''); try { const r = await api('/api/checkout', { ...f, items: items.map(p => ({ product_id: p.id, qty: p.qty })) }); cart.set({}); location.href = '/riwayat?o=' + r.id } catch (x: any) { setE(x.message); setBusy(false) } }
  if (!items.length) return <p className="mute">Keranjang kosong. <a href="/">Lihat produk</a></p>
  return <><h2>Keranjang</h2>
    {items.map(p => <div className="card" key={p.id} style={{ marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}><b style={{ flex: 1 }}>{p.name}{p.stock < 1 && <span className="err"> · Produk habis, hapus dari keranjang</span>}</b><span>{rp(Math.round(p.price * (100 - p.discount) / 100))}</span>
      <button className="ghost" onClick={() => setQty(p.id, p.stock < 1 ? 0 : p.qty - 1)}>{p.stock < 1 ? 'Hapus' : '-'}</button>{p.stock >= 1 && p.qty}{p.stock >= 1 && <button className="ghost" disabled={p.qty >= p.stock} onClick={() => setQty(p.id, p.qty + 1)}>+</button>}</div>)}
    <p className="price">Total {rp(total)}</p>
    {!user ? <div className="card">Untuk melanjutkan pembelian, kamu perlu akun. <a className="btn" href="/login">Masuk / Daftar</a></div> :
      <div className="card"><input placeholder="Nama" value={f.name} onChange={x => setF({ ...f, name: x.target.value })} />
        <input placeholder="Nomor WhatsApp (opsional)" value={f.wa} onChange={x => setF({ ...f, wa: x.target.value })} />
        <input placeholder="Kode voucher (opsional)" value={f.voucher} onChange={x => setF({ ...f, voucher: x.target.value })} />
        <select value={f.method} onChange={x => setF({ ...f, method: x.target.value })}><option value="qris">QRIS otomatis</option><option value="saldo">Saldo member</option></select>
        {e && <p className="err">{e}</p>}<button disabled={busy || !f.name.trim() || items.some(p => p.stock < 1)} onClick={pay}>Bayar sekarang</button></div>}</>
}
