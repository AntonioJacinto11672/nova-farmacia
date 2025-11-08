import React from 'react'

export type TableHeader = {
  key?: string
  label: React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  headers: TableHeader[]
  rows: T[]
  renderRow: (row: T, index: number) => React.ReactNode
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  totalPages?: number
  totalItems?: number
  loading?: boolean
  numberingBase?: number
}

/**
 * Generic DataTable component
 * - Accepts headers definition and a renderRow callback so it can be reused in many places.
 * - Renders pagination controls (prev/next) when onPageChange is provided.
 * - Keeps a stable number of visible rows by rendering empty filler rows up to pageSize.
 */
export default function DataTable<T>({
  headers,
  rows,
  renderRow,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  totalPages = 0,
  totalItems = 0,
  loading = false,
  numberingBase = 0,
}: DataTableProps<T>) {
  const showPagination = typeof onPageChange === 'function'

  const handlePrev = () => {
    if (!onPageChange) return
    onPageChange(Math.max(1, currentPage - 1))
  }
  const handleNext = () => {
    if (!onPageChange) return
    onPageChange(currentPage + 1)
  }

  const emptyRows = Math.max(0, pageSize - rows.length)

  return (
    <div className="bg-white rounded shadow overflow-auto">
      <div className="p-6">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              {headers.map((h, idx) => (
                <th key={h.key ?? idx} className={`py-2 px-4 border-b text-left ${h.className ?? ''}`}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={headers.length} className="py-4 text-center text-gray-500">Carregando...</td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="py-4 text-center text-gray-500">Nenhum registro encontrado.</td>
              </tr>
            )}

            {rows.map((row, idx) => (
              <React.Fragment key={(row as any).id ?? idx}>
                {renderRow(row, idx)}
              </React.Fragment>
            ))}

            {/* Empty filler rows to keep layout stable */}
            {!loading && Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-12">
                {headers.map((_, hi) => (
                  <td key={hi} className="py-2 px-4 border-b text-gray-400">&nbsp;</td>
                ))}
              </tr>
            ))}

          </tbody>
        </table>

        {showPagination && (
          <div className="flex justify-between items-center mt-4">
            <button onClick={handlePrev} disabled={currentPage === 1 || loading} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
            <span>Página {currentPage} de {totalPages} • Exibindo {rows.length} de {totalItems}</span>
            <div>
              <button onClick={handleNext} disabled={currentPage >= totalPages || loading} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Seguinte</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
