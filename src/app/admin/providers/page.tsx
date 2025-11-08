"use client"
import React, { useEffect, useMemo, useState } from 'react'
import ProviderService from '@/api/services/provider.service'
import toast from 'react-hot-toast'
import { Edit3, Trash2, Lock, Unlock, Plus } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import DataTable, { TableHeader } from '@/components/ui/DataTable'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

// Minimal provider shape used in this page. Keep in sync with API schema.
interface Provider {
  id: string
  name: string
  // optional field if API exposes activation state
  isActive?: boolean
}

// We always render at least PAGE_SIZE rows in the table (empty fillers if needed).
const PAGE_SIZE = 10

/**
 * Providers admin page
 * - Debounced live-search (client-side filtering after fetching full list)
 * - Server pagination when no search is active
 * - Icon-only action buttons
 * - Continuous numbering across pages
 */
export default function ProvidersPage() {
  const [providersPageData, setProvidersPageData] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[] | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  // Modal / form state
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Provider | null>(null)
  const [nameInput, setNameInput] = useState('')

  // Search state (debounced)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // fetch a page from server
  async function fetchProvidersServer(pageNumber = 1) {
    setLoading(true)
    try {
      const svc = new ProviderService()
      const resp = await svc.getAllProvider(PAGE_SIZE, pageNumber)
      const data = (resp.data as any)?.data || []
      setProvidersPageData(data)
      setTotalPages((resp.data as any)?.totalPages || 0)
      setTotalElements((resp.data as any)?.total || 0)
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err)
      toast.error('Erro ao carregar fornecedores')
      setProvidersPageData([])
      setTotalPages(0)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  // fetch all items for search (best-effort)
  async function fetchAllForSearch(): Promise<Provider[]> {
    setLoading(true)
    try {
      const svc = new ProviderService()
      const resp = await svc.getAllProvider(10000, 1)
      return (resp.data as any)?.data || []
    } catch (err) {
      console.error('Erro ao buscar todos para pesquisa:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // initial load
  useEffect(() => {
    void fetchProvidersServer(1)
  }, [])

  // Debounced search effect: wait 300ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredProviders(null)
        // reload current page from server
        void fetchProvidersServer(page)
        return
      }

      let mounted = true
      ;(async () => {
        const all = await fetchAllForSearch()
        if (!mounted) return
        const filtered = all.filter((p: Provider) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setFilteredProviders(filtered)
        setPage(1)
        setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
        setTotalElements(filtered.length)
      })()

      return () => {
        mounted = false
      }
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  // When page changes and we are not in filtered mode, fetch server page
  useEffect(() => {
    if (filteredProviders === null) void fetchProvidersServer(page)
  }, [page, filteredProviders])

  const displayedProviders = useMemo(() => {
    if (filteredProviders !== null) {
      const start = (page - 1) * PAGE_SIZE
      return filteredProviders.slice(start, start + PAGE_SIZE)
    }
    return providersPageData
  }, [filteredProviders, providersPageData, page])

  const numberingBase = (page - 1) * PAGE_SIZE

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1))
  }
  function handleNext() {
    setPage((p) => p + 1)
  }

  function openCreate() {
    setEditing(null)
    setNameInput('')
    setShowModal(true)
  }

  function openEdit(p: Provider) {
    setEditing(p)
    setNameInput(p.name)
    setShowModal(true)
  }

  async function submitCreateOrEdit() {
    if (!nameInput.trim()) {
      toast.error('Nome é obrigatório')
      return
    }
    setLoading(true)
    try {
      const svc = new ProviderService()
      await svc.createProvider(nameInput.trim())
      toast.success('Fornecedor salvo')
      setShowModal(false)
      // reload server page
      void fetchProvidersServer(page)
    } catch (err) {
      console.error('Erro ao salvar fornecedor', err)
      toast.error('Erro ao salvar fornecedor')
    } finally {
      setLoading(false)
    }
  }

  // Placeholder delete/toggle: replace with real API calls when available
  async function handleDelete(id: string) {
    if (!confirm('Eliminar fornecedor?')) return
    // TODO: ProviderService.deleteProvider(id) when implemented
    toast.success('Fornecedor removido (simulado)')
    void fetchProvidersServer(page)
  }

  async function toggleActive(id: string) {
    // TODO: ProviderService.toggleActive(id) when implemented
    toast.success('Estado alterado (simulado)')
    void fetchProvidersServer(page)
  }

  // Table headers definition passed to the reusable DataTable component
  const tableHeaders: TableHeader[] = [
    { key: 'index', label: '#', className: '' },
    { key: 'name', label: 'Nome', className: '' },
    { key: 'actions', label: 'Ações', className: '' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gerir Fornecedores</h2>
        <div className="flex items-center gap-3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Pesquisar por nome..." />
          <button onClick={openCreate} title="Adicionar novo" className="px-3 py-2 bg-green-600 text-white rounded flex items-center">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DataTable
        headers={tableHeaders}
        rows={displayedProviders}
        renderRow={(provider, idx) => (
          <tr key={provider.id}>
            <td className="py-2 px-4 border-b">{numberingBase + idx + 1}</td>
            <td className="py-2 px-4 border-b">{provider.name}</td>
            <td className="px-4 py-2 border-b">
              <div className="flex gap-2">
                <button onClick={() => openEdit(provider)} title="Editar" className="p-2 rounded bg-blue-600 text-white">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(provider.id)} title={provider.isActive ? 'Bloquear' : 'Desbloquear'} className="p-2 rounded bg-yellow-500 text-white">
                  {provider.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(provider.id)} title="Eliminar" className="p-2 rounded bg-red-600 text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
        pageSize={PAGE_SIZE}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        totalPages={totalPages}
        totalItems={totalElements}
        loading={loading}
        numberingBase={numberingBase}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="providerName" className="text-gray-900">Nome do Fornecedor</Label>
                <Input id="providerName" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Nome do fornecedor" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancelar</button>
              <button onClick={submitCreateOrEdit} className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
