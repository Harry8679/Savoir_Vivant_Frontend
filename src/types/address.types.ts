export interface Address {
  _id:        string
  fullName:   string
  phone:      string
  street:     string
  city:       string
  postalCode: string
  country:    string
  isDefault:  boolean
}

export interface Carrier {
  _id:          string
  name:         string
  countries:    string[]
  estimatedDays: { min: number; max: number }
  priceRules:   { country: string; price: number }[]
  isActive:     boolean
}

export const COUNTRIES: { code: string; label: string }[] = [
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique' },
  { code: 'CH', label: 'Suisse' },
  { code: 'DE', label: 'Allemagne' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
  { code: 'GB', label: 'Royaume-Uni' },
  { code: 'CM', label: 'Cameroun' },
  { code: 'SN', label: 'Sénégal' },
  { code: 'CI', label: "Côte d'Ivoire" },
  { code: 'MA', label: 'Maroc' },
  { code: 'TN', label: 'Tunisie' },
]