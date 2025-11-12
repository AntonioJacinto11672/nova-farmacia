import React, { useMemo, useState } from 'react'

export interface Option {
  value: string
  label: string
}

interface Props {
  id?: string
  options: Option[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  isMulti?: boolean
}

// A very small searchable select without external deps.
// - isMulti: returns string[] when multiple
// - value: string or string[] as controlled value
export default function SearchableSelect({ id, options, value, onChange, placeholder, isMulti }: Props) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')

  const selectedValues = useMemo(() => {
    if (isMulti) return Array.isArray(value) ? value : []
    return value ? [String(value)] : []
  }, [value, isMulti])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
  }, [options, filter])

  function toggleOption(opt: Option) {
    if (isMulti) {
      const arr = new Set(selectedValues)
      if (arr.has(opt.value)) arr.delete(opt.value)
      else arr.add(opt.value)
      onChange(Array.from(arr))
    } else {
      onChange(opt.value)
      setOpen(false)
    }
  }

  function removeOne(val: string) {
    if (!isMulti) return
    const arr = (Array.isArray(value) ? [...value] : []).filter((v) => v !== val)
    onChange(arr)
  }

  return (
    <div className="relative">
      <div className="border rounded px-2 py-1 bg-white">
        <div className="flex items-center gap-2" onClick={() => setOpen((s) => !s)}>
          <div className="flex-1 min-w-0">
            {isMulti ? (
              <div className="flex flex-wrap gap-1">
                {selectedValues.length === 0 && <div className="text-gray-400">{placeholder}</div>}
                {selectedValues.map((v) => {
                  const opt = options.find((o) => o.value === v)
                  return (
                    <span key={v} className="text-xs px-2 py-0.5 bg-gray-100 rounded flex items-center gap-2">
                      <span>{opt ? opt.label : v}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeOne(v) }} className="text-xs">×</button>
                    </span>
                  )
                })}
              </div>
            ) : (
              <div className="truncate">{selectedValues[0] ? (options.find((o) => o.value === selectedValues[0])?.label ?? selectedValues[0]) : <span className="text-gray-400">{placeholder}</span>}</div>
            )}
          </div>
          <div className="text-gray-400">▾</div>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
          <div className="p-2">
            <input autoFocus value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="Pesquisar..." />
          </div>
          <div>
            {filtered.map((opt) => {
              const active = selectedValues.includes(opt.value)
              return (
                <div key={opt.value} onClick={() => toggleOption(opt)} className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between ${active ? 'bg-gray-100' : ''}`}>
                  <div className="truncate">{opt.label}</div>
                  {active && <div className="text-sm text-green-600">✓</div>}
                </div>
              )
            })}
            {filtered.length === 0 && <div className="p-3 text-sm text-gray-500">Sem resultados</div>}
          </div>
        </div>
      )}
    </div>
  )
}
