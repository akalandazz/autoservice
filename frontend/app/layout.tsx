import type { Metadata } from 'next'
import { Rajdhani, Orbitron, JetBrains_Mono, Noto_Sans_Georgian } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const notoSansGeorgian = Noto_Sans_Georgian({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['georgian'],
  variable: '--font-noto-georgian',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Redline // Garage — მოგვიყვანე შენი ჯართი.',
  description:
    'სრული მომსახურების ტიუნერ ხელოსანი საბურთალოზე. დიაგნოსტიკა, ძარა, შეღებვა, ძრავის ახლად აწყობა, სუსპენზია — ხელით გადანაწილებული.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ka"
      className={`${rajdhani.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${notoSansGeorgian.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
