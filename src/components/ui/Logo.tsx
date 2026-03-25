interface LogoProps {
  size?: number
}

export default function Logo({ size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fond arrondi */}
      <rect width="40" height="40" rx="10" fill="#6366f1" />

      {/* Spine du livre (ligne centrale verticale) */}
      <line x1="20" y1="9" x2="20" y2="31" stroke="white" strokeWidth="1.2" strokeLinecap="round" />

      {/* Page gauche */}
      <path
        d="M20 11 C17 10 12 10.5 9.5 12 L9.5 29.5 C12 28 17 27.5 20 28.5"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Page droite */}
      <path
        d="M20 11 C23 10 28 10.5 30.5 12 L30.5 29.5 C28 28 23 27.5 20 28.5"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Lettre S — page gauche */}
      <path
        d="M13.5 17.5 C13.5 16.5 14.3 16 15.2 16 C16.1 16 16.8 16.4 16.8 17.1 C16.8 17.8 16.1 18.1 15.2 18.3 C14.3 18.5 13.4 18.9 13.4 19.8 C13.4 20.6 14.2 21 15.2 21 C16.1 21 16.9 20.6 16.9 19.8"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Lettre V — page droite */}
      <path
        d="M22.5 16 L24.5 21 L26.5 16"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Petit reflet en bas du livre */}
      <path
        d="M12 30 Q20 32 28 30"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}