import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../hooks/useApi";
import { useCartStore } from "../store";
import type { Book, CollectionId, LevelId } from "../types";

// ─── Constantes ────────────────────────────────────────────────────────────────

const COLLECTIONS = [
  { id: "all" as const, label: "Toutes les collections" },
  { id: "info" as CollectionId, label: "Informatique Vivante", color: "#6366f1" },
  { id: "langues" as CollectionId, label: "Langues Vivantes", color: "#f59e0b" },
  { id: "maths" as CollectionId, label: "Mathématiques Vivantes", color: "#3b82f6" },
  { id: "phys" as CollectionId, label: "Physique & Chimie Vivants", color: "#10b981" },
];

const LEVELS = [
  { id: "all" as const, label: "Tous les niveaux" },
  { id: "college" as LevelId, label: "Collège" },
  { id: "lycee" as LevelId, label: "Lycée / Terminale" },
  { id: "prepa" as LevelId, label: "Prépa (MPSI/MP)" },
  { id: "sup" as LevelId, label: "Supérieur / Université" },
];

// ─── Composant BookCard ────────────────────────────────────────────────────────

function BookCard({ book }: { book: Book }) {
  const { addToCart, hasBook } = useCartStore();
  const [addedFormat, setAddedFormat] = useState<"digital" | "paper" | null>(null);
  const alreadyInCart = hasBook(book._id);

  const handleQuickAdd = (e: React.MouseEvent, format: "digital" | "paper") => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, format);
    setAddedFormat(format);
    setTimeout(() => setAddedFormat(null), 1500);
  };

  return (
    <Link
      to={`/catalogue/${book.slug}`}
      className="group flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Couverture */}
      <div
        className="w-24 min-w-24 h-32 rounded-xl flex flex-col justify-end p-2.5 shadow-md flex-shrink-0 overflow-hidden relative"
        style={{ background: book.coverGradient }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <p className="text-[6px] font-bold uppercase tracking-wider text-white/60 mb-1 leading-tight">
            {book.collectionLabel}
          </p>
          <p className="text-[10px] font-bold text-white leading-tight">
            {book.title}
          </p>
        </div>
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Collection + abonnement */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[9px] font-black uppercase tracking-wider"
            style={{ color: book.coverColor }}
          >
            {book.collectionLabel}
          </span>
          {book.includedInSubscription && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-semibold border border-indigo-100">
              ∞ Abonnement
            </span>
          )}
          {alreadyInCart && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold border border-green-100">
              ✓ Dans le panier
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {book.title}
        </h3>

        {/* Niveaux + pages */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">
            {book.levelsLabel}
          </span>
          <span className="text-[10px] text-gray-400">{book.pages} pages</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {book.description}
        </p>

        {/* Prix + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            <span className="text-base font-extrabold text-gray-900">
              {book.priceDigital.toFixed(2).replace(".", ",")}€
            </span>
            <span className="text-[10px] text-gray-400 ml-1.5">
              ou {book.pricePaper.toFixed(2).replace(".", ",")}€ papier
            </span>
          </div>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleQuickAdd(e, "digital")}
              className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              {addedFormat === "digital" ? "✓ Ajouté" : "+ Numérique"}
            </button>
            <button
              onClick={(e) => handleQuickAdd(e, "paper")}
              className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {addedFormat === "paper" ? "✓ Ajouté" : "+ Papier"}
            </button>
          </div>
          <span className="text-xs font-semibold text-gray-600 group-hover:hidden">
            Voir le livre →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Composant Skeleton ────────────────────────────────────────────────────────

function BookCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 animate-pulse">
      <div className="w-24 min-w-24 h-32 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="h-2.5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded" />
          <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const activeCol = searchParams.get("collection") ?? "all";
  const activeLevel = searchParams.get("level") ?? "all";
  const search = searchParams.get("q") ?? "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeCol !== "all") params.collection = activeCol;
      if (activeLevel !== "all") params.level = activeLevel;
      if (search) params.q = search;

      const data = await api.books.list(params);
      setBooks(data.books);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCol, activeLevel, search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-52 min-w-52 flex-shrink-0 hidden md:block">
        {/* Search */}
        <div className="relative mb-7">
          <input
            type="text"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setParam("q", (e.target as HTMLInputElement).value);
            }}
            onChange={(e) => !e.target.value && setParam("q", "")}
            placeholder="Rechercher un livre..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
        </div>

        {/* Collections */}
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Collections
          </p>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam("collection", c.id)}
              className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium mb-0.5 transition-colors ${
                activeCol === c.id
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {c.color && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: c.color }}
                />
              )}
              {c.label}
            </button>
          ))}
        </div>

        {/* Niveaux */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Niveau
          </p>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setParam("level", l.id)}
              className={`block w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium mb-0.5 transition-colors ${
                activeLevel === l.id
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-3 mb-5">
          <h1 className="text-xl font-extrabold text-gray-900">
            {activeCol === "all"
              ? "Tous les livres"
              : COLLECTIONS.find((c) => c.id === activeCol)?.label}
          </h1>
          {!loading && (
            <span className="text-sm text-gray-400">
              {total} livre{total > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Banner abonnement */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-indigo-700">
              ∞ Accès illimité à toute la bibliothèque
            </p>
            <p className="text-xs text-indigo-500 mt-0.5">
              Tous les livres numériques inclus — 9€/mois ou 79€/an
            </p>
          </div>
          <Link
            to="/offres"
            className="text-xs font-semibold bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors whitespace-nowrap flex-shrink-0"
          >
            S'abonner →
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))
            : books.length === 0
            ? (
              <div className="col-span-2 text-center py-20">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-gray-500">Aucun livre trouvé pour ces filtres.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-4 text-sm text-indigo-500 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )
            : books.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
      </main>
    </div>
  );
}