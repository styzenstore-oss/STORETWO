import './globals.css'
import Nav from './nav'
export const metadata = { title: 'Toko Premium', description: 'Akun & produk premium, dikirim otomatis' }
export default function L({ children }: any) { return <html lang="id"><body><Nav /><main>{children}</main></body></html> }
