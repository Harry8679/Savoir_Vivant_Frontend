import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b border-(--color-border) bg-surface">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          Savoir<span className="text-primary">Vivant</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/catalogue" className="text-sm text-text-muted hover:text-white transition-colors">
            Catalogue
          </Link>
          <Link to="/login" className="text-sm text-text-muted hover:text-white transition-colors">
            Connexion
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
            S'inscrire
          </Link>
        </div>
      </div>
    </nav>
  )
}