import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * Lightweight SearchBar component
 * - Controlled component
 * - Keeps markup/label consistent across places where a search input is needed
 */
export default function SearchBar({ id = 'search', value, onChange, placeholder = 'Pesquisar...', className = '' }: SearchBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Label htmlFor={id} className="text-sm">Pesquisar</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-64" />
    </div>
  )
}
