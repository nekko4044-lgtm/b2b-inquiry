import InquiryForm from '@/components/InquiryForm'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f4f4f5' }}>
      {/* Brand header */}
      <header style={{ backgroundColor: '#0f2d5c' }} className="py-5 px-6">
        <div className="max-w-[680px] mx-auto flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: '#38bdf8', color: '#0f2d5c' }}
          >
            LV
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Lesewelt Verlag</span>
          <span
            className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}
          >
            B2B
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-[680px] mx-auto mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2" style={{ color: '#0f2d5c' }}>
            Titelanfrage
          </h1>
          <p className="text-gray-500 text-base">
            Für Bibliotheken und Kindertagesstätten — schnell, direkt, unkompliziert.
          </p>
        </div>
        <InquiryForm />
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Lesewelt Verlag · Alle Rechte vorbehalten
        </p>
      </footer>
    </div>
  )
}
