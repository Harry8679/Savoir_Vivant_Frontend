import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { bookService } from '../../services/book.service'

// ─── Config pdf.js worker ─────────────────────────────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

// ─── Page Reader ──────────────────────────────────────────────────────────────

export default function ReaderPage() {
  const { bookId }  = useParams<{ bookId: string }>()
  const navigate    = useNavigate()

  const [pdfUrl,       setPdfUrl]       = useState<string | null>(null)
  const [numPages,     setNumPages]     = useState(0)
  const [currentPage,  setCurrentPage]  = useState(1)
  const [scale,        setScale]        = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [pageInput,    setPageInput]    = useState('1')

  const containerRef   = useRef<HTMLDivElement>(null)
  const pageRefs       = useRef<Record<number, HTMLDivElement | null>>({})
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // ── Fetch signed URL (rafraîchie toutes les 100s) ─────────────────────────

  const fetchUrl = useCallback(async () => {
    if (!bookId) return
    try {
      const { url } = await bookService.getReadUrl(bookId)
      setPdfUrl(url)
      refreshTimer.current = setTimeout(fetchUrl, 100_000)
    } catch (err: unknown) {
        const status = (err as { status?: number; response?: { status?: number } })
        if (status?.status === 403 || status?.response?.status === 403) {
            setError("Vous n'avez pas accès à ce livre.")
        } else {
            setError('Impossible de charger le livre. Veuillez réessayer.')
        }
    }
  }, [bookId])

  useEffect(() => {
    setLoading(true)
    fetchUrl().finally(() => setLoading(false))
    return () => { if (refreshTimer.current) clearTimeout(refreshTimer.current) }
  }, [fetchUrl])

  // ── Raccourcis clavier ────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        setCurrentPage(p => Math.min(p + 1, numPages))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        setCurrentPage(p => Math.max(p - 1, 1))
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.1, 2.5))
      if (e.key === '-')                   setScale(s => Math.max(s - 0.1, 0.5))
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [numPages])

  // ── Plein écran ───────────────────────────────────────────────────────────

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // ── Navigation ────────────────────────────────────────────────────────────

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, numPages))
    setCurrentPage(clamped)
    setPageInput(String(clamped))
    pageRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Observer scroll → page courante ──────────────────────────────────────

  useEffect(() => {
    if (numPages === 0) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const p = parseInt(visible.target.getAttribute('data-page') ?? '1', 10)
          setCurrentPage(p)
          setPageInput(String(p))
        }
      },
      { threshold: 0.5 }
    )
    Object.values(pageRefs.current).forEach(ref => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [numPages])

  // ─── Rendu ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 gap-4">
      <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent
                      rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Chargement du livre...</p>
    </div>
  )

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900
                    gap-4 text-center px-4">
      <div className="text-5xl mb-2">🔒</div>
      <h2 className="text-white font-bold text-xl">{error}</h2>
      <button onClick={() => navigate('/catalogue')}
        className="mt-4 px-6 py-2.5 bg-indigo-500 text-white rounded-xl
                   text-sm font-semibold hover:bg-indigo-600">
        Retour au catalogue
      </button>
    </div>
  )

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-gray-900 text-white">

      {/* ── Barre du haut ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 h-12 bg-gray-800
                         border-b border-gray-700 shrink-0">
        {/* Gauche */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Retour
          </button>
          <button onClick={() => setSidebarOpen(s => !s)}
            className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center
                       justify-center text-xs transition-colors"
            title="Sommaire">
            ☰
          </button>
        </div>

        {/* Centre : navigation pages */}
        <div className="flex items-center gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}
            className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30
                       flex items-center justify-center text-xs transition-colors">
            ‹
          </button>
          <form onSubmit={e => { e.preventDefault(); goToPage(parseInt(pageInput, 10)) }}
            className="flex items-center gap-1.5">
            <input type="number" value={pageInput}
              onChange={e => setPageInput(e.target.value)}
              className="w-12 text-center text-xs bg-gray-700 border border-gray-600
                         rounded-lg py-1 text-white focus:outline-none focus:border-indigo-400"
              min={1} max={numPages} />
            <span className="text-xs text-gray-400">/ {numPages}</span>
          </form>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= numPages}
            className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30
                       flex items-center justify-center text-xs transition-colors">
            ›
          </button>
        </div>

        {/* Droite : zoom + plein écran */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg px-1">
            <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
              className="w-6 h-7 flex items-center justify-center text-gray-400
                         hover:text-white text-sm">−</button>
            <span className="text-xs text-gray-300 w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button onClick={() => setScale(s => Math.min(s + 0.1, 2.5))}
              className="w-6 h-7 flex items-center justify-center text-gray-400
                         hover:text-white text-sm">+</button>
          </div>
          <select value={scale} onChange={e => setScale(parseFloat(e.target.value))}
            className="text-xs bg-gray-700 border border-gray-600 rounded-lg py-1 px-2
                       text-gray-300 focus:outline-none">
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(z => (
              <option key={z} value={z}>{Math.round(z * 100)}%</option>
            ))}
          </select>
          <button onClick={toggleFullscreen}
            className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center
                       justify-center text-xs transition-colors"
            title="Plein écran (F)">
            {isFullscreen ? '⊡' : '⛶'}
          </button>
        </div>
      </header>

      {/* ── Corps ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar sommaire */}
        {isSidebarOpen && (
          <aside className="w-56 shrink-0 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                Pages
              </p>
              <div className="space-y-0.5">
                {Array.from({ length: Math.min(numPages, 30) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => goToPage(p)}
                    className={`block w-full text-left text-xs px-2 py-1.5 rounded-lg
                                transition-colors ${
                      currentPage === p
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}>
                    Page {p}
                  </button>
                ))}
                {numPages > 30 && (
                  <p className="text-[10px] text-gray-600 px-2 py-1">
                    ... {numPages} pages au total
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Zone PDF */}
        <main className="flex-1 overflow-y-auto bg-gray-900 flex flex-col items-center py-6 gap-4">
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages: np }) => {
                setNumPages(np)
                setCurrentPage(1)
              }}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent
                                  rounded-full animate-spin" />
                </div>
              }
              error={
                <div className="text-red-400 text-sm py-8">
                  Erreur de chargement du PDF.
                </div>
              }
            >
              {Array.from({ length: numPages }, (_, i) => i + 1).map(page => (
                <div key={page}
                  ref={el => { pageRefs.current[page] = el }}
                  data-page={page}
                  className="mb-4 shadow-2xl">
                  <Page
                    pageNumber={page}
                    scale={scale}
                    renderTextLayer
                    renderAnnotationLayer
                    className="bg-white"
                  />
                </div>
              ))}
            </Document>
          )}
        </main>
      </div>

      {/* ── Barre de progression ───────────────────────────────────────── */}
      <div className="h-1 bg-gray-700 shrink-0">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${numPages ? (currentPage / numPages) * 100 : 0}%` }}
        />
      </div>
    </div>
  )
}