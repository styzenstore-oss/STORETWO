'use client'
import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { api, rp } from '@/lib/client'
export default function Riwayat() {
  const [os, setOs] = useState<any[] | null>(null), [e, setE] = useState('')
  useEffect(() => { const t = () => api('/api/orders').then(setOs).catch(x => setE(x.message)); t(); const i = setInterval(t, 5000); return () => clearInterval(i) }, [])
  if (e) return <p className="err">{e}. <a href="/login">Masuk</a></p>; if (!os) return <p className="mute">Memuat...</p>
  return <><h2>Riwayat pesanan</h2>{os.length === 0 && <p className="mute">Belum ada pesanan.</p>}
    {os.map(o => <div className="card" key={o.id} style={{ marginBottom: 10 }}>
      <b>{rp(o.total)}</b> <span className="mute">{new Date(o.created_at).toLocaleString('id-ID')} · {o.status === 'pending' ? 'Menunggu pembayaran' : o.status === 'paid' ? 'Lunas' : o.status === 'late' ? 'Waktu bayar habis' : 'Kedaluwarsa'}</span>
      <div className="mute">{o.items.map((i: any) => `${i.name} x${i.qty}`).join(', ')}</div>
      {o.qris && <div style={{ background: '#fff', padding: 10, display: 'inline-block', marginTop: 8 }}>{/^(https?:|data:)/.test(o.qris) ? <img src={o.qris} width={220} alt="QRIS" /> : <QRCodeSVG value={o.qris} size={220} />}</div>}
      {o.delivered?.map((d: any, i: number) => <div key={i}><span className="mute">{d.product}</span><pre>{d.data}</pre></div>)}
      {o.delivered && <p className="mute">Detail tersedia sampai {new Date(o.expires_at).toLocaleString('id-ID')}. Simpan datanya sebelum waktu habis.</p>}
      {o.status === 'expired' && <p className="mute">Masa aktif 24 jam telah berakhir, detail produk tidak lagi ditampilkan.</p>}</div>)}</>
}
