'use client'
import { rp } from '@/lib/client'
import { useProfile } from '@/lib/ui'
export default function Dompet() {
  const p = useProfile()
  if (p === undefined) return <p className="mute">Memuat...</p>
  if (!p) return <><h2>Dompet</h2><div className="card"><p className="mute">Masuk untuk melihat saldo dompetmu.</p><a className="btn" href="/login">Masuk atau daftar</a></div></>
  return <><h2>Dompet</h2><div className="hero"><span>Saldo kamu</span><div className="price">{rp(p.balance)}</div></div>
    <div className="card" style={{ marginTop: 12 }}><p style={{ margin: 0 }}>Saldo bisa dipakai sebagai metode bayar saat checkout. Untuk menambah saldo, hubungi admin toko.</p></div></>
}
