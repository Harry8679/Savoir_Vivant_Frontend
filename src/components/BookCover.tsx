import { useState } from 'react'
import type { Book } from '../types/book.types'

interface BookCoverProps {
  book: Book
  showOverlay?: boolean   // affiche le bouton "Lire" au hover (wrap dans un .group)
}

export default function BookCover({ book, showOverlay = false }: BookCoverProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const color = book.collectionId?.color ?? '#6366f1'

  const tryImage = Boolean(book.coverUrl) && !imgError
  const showGradient = !tryImage || !imgLoaded

  return (
    <div className="aspect-2/3 rounded-xl overflow-hidden shadow-md relative bg-gray-100">
      {/* ─── Fallback gradient : TOUJOURS rendu en fond ───────────────── */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-3
                   transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}ee, ${color}88)`,
          opacity: showGradient ? 1 : 0,
        }}
      >
        <div className="flex justify-between items-start">
          <div className="w-5 h-5 rounded-full bg-white/15" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>

        <div>
          {book.collectionId?.name && (
            <p className="text-[8px] font-bold uppercase tracking-widest
                          text-white/60 mb-1.5">
              {book.collectionId.name}
            </p>
          )}
          <p className="text-xs font-extrabold text-white leading-tight line-clamp-4">
            {book.title}
          </p>
          {book.author && (
            <p className="text-[9px] text-white/50 mt-1.5 line-clamp-1">
              {book.author}
            </p>
          )}
        </div>
      </div>

      {/* ─── Image réelle superposée si elle charge ──────────────────── */}
      {tryImage && (
        <img
          src={book.coverUrl}
          alt={book.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover
                     transition-opacity duration-300"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
      )}

      {/* ─── Overlay "Lire" au hover (optionnel) ─────────────────────── */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20
                        to-transparent opacity-0 group-hover:opacity-100
                        transition-opacity duration-200
                        flex items-end justify-center pb-4">
          <span className="bg-white text-gray-900 text-xs font-bold px-4 py-2
                           rounded-full shadow-lg flex items-center gap-1.5">
            <span>📖</span> Lire maintenant
          </span>
        </div>
      )}
    </div>
  )
}