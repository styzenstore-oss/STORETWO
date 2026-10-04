'use client'
import { useEffect, useState } from 'react'
import { sb, api, rp } from '@/lib/client'
const F = ({ title, children }: any) => <div className="card" style={{ marginBottom: 12 }}><b>{title}</b><div style={{ marginTop: 8 }}>{children}</div></div>
export default function Admin() {
  const [ok, setOk] = useState(false), [ps, setPs] = useState<any[]>([]), [vs, setVs] = useState<any[]>([]), [an, setAn] = useState<any[]>([]), [po, setPo] = useState<any[]>([]), [f, setF] = useState<any>({}), [m, setM] = useState(''), [why, setWhy] = useState('')
  const load = async () => { sb.from('product_stock').select('*').then(r => setPs(r.data || [])); sb.from('announcements').select('*').then(r => setAn(r.data || [])); sb.from('posters').select('*').then(r => setPo(r.data || [])); api('/api/admin', { action: 'listVouchers' }).then(setVs) }
  useEffect(() => { api('/api/admin', { action: 'listVouchers' }).then(() => { setOk(true); load() }).catch((x) => { setOk(false); setWhy(x.message) }) }, [])
  const run = async (b: any) => { try { const r = await api('/api/admin', b); setM(r.added ? `${r.added} stok ditambahkan` : 'Berhasil'); load() } catch (x: any) { setM(x.message) } }
  const s = (k: string) => ({ value: f[k] || '', onChange: (x: any) => setF({ ...f, [k]: x.target.value }) })
  if (!ok) return <p className="err">Halaman ini khusus admin. ({why || 'memeriksa...'})</p>
  return <><h2>Admin panel</h2>{m && <p className="mute">{m}</p>}
    <F title="Produk"><input placeholder="Nama produk" {...s('pn')} /><input placeholder="Harga (angka)" {...s('pp')} /><input placeholder="Diskon % (opsional)" {...s('pd')} />
      <button onClick={() => run({ action: 'addProduct', name: f.pn, price: f.pp, discount: f.pd })}>Tambah produk</button>
      {ps.map(p => <p key={p.id}>{p.name} · {rp(p.price)} · stok {p.stock} <button className="ghost" onClick={() => confirm('Hapus produk dan stoknya?') && run({ action: 'deleteProduct', id: p.id })}>Hapus</button></p>)}</F>
    <F title="Tambah stok (satu baris = satu stok)"><select {...s('sp')}><option value="">Pilih produk</option>{ps.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <textarea rows={5} placeholder={'email1@mail.com : password : catatan\nemail2@mail.com : password : catatan'} {...s('sd')} /><button onClick={() => run({ action: 'addStock', product_id: f.sp, data: f.sd })}>Tambah stok</button></F>
    <F title="Voucher potongan (rupiah)"><input placeholder="Kode" {...s('vc')} /><input placeholder="Potongan (angka)" {...s('va')} /><button onClick={() => run({ action: 'addVoucher', code: f.vc, amount: f.va })}>Tambah voucher</button>
      {vs.map(v => <p key={v.code}>{v.code} · {rp(v.amount)} <button className="ghost" onClick={() => run({ action: 'deleteVoucher', code: v.code })}>Hapus</button></p>)}</F>
    <F title="Pengumuman"><textarea rows={2} {...s('at')} /><button onClick={() => run({ action: 'addAnnouncement', text: f.at })}>Tambah pengumuman</button>
      {an.map(a => <p key={a.id}>{a.text} <button className="ghost" onClick={() => run({ action: 'deleteAnnouncement', id: a.id })}>Hapus</button></p>)}</F>
    <F title="Poster beranda (gambar lanskap, URL)"><input placeholder="https://.../poster.jpg" {...s('pu')} /><button onClick={() => run({ action: 'addPoster', url: f.pu })}>Tambah poster</button>
      {po.map(p => <p key={p.id}><img src={p.image_url} height={50} alt="" /> <button className="ghost" onClick={() => run({ action: 'deletePoster', id: p.id })}>Hapus</button></p>)}</F>
    <F title="Saldo member"><input placeholder="Email member" {...s('be')} /><input placeholder="Jumlah (angka)" {...s('ba')} />
      <button onClick={() => run({ action: 'changeBalance', email: f.be, amount: Math.abs(+f.ba) })}>Tambah saldo</button> <button className="ghost" onClick={() => run({ action: 'changeBalance', email: f.be, amount: -Math.abs(+f.ba) })}>Kurangi saldo</button></F></>
}
