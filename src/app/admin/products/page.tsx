"use client"
import React, { useEffect, useMemo, useState } from 'react'
import ProviderService from '@/api/services/provider.service'
import toast from 'react-hot-toast'
import { Edit3, Trash2, Lock, Unlock, Plus, Info } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import SearchableSelect from '@/components/ui/SearchableSelect'
import DataTable, { TableHeader } from '@/components/ui/DataTable'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import MedicineService from '@/api/services/medicine.service'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { truncateText } from '@/utils/TruncateText'
import { medicineFormSchema, MedicineFormValues } from '@/lib/validations/medicine'
import { FormatPrice } from '@/utils/FormatPrice'
import { Badge } from '@/components/ui/badge'
import { getStatusColorBoolean } from '@/components/ui/getStatusColor'
import MedicineDetalheModal from '@/components/admin/modalS/MedicineDetalheModal'
import { ProviderType } from 'next-auth/providers/index'
import { ProviderTypeData } from '../providers/page'
import { useRouter } from 'next/navigation'
import { CategoryType } from '../category/page'
import CategoryService from '@/api/services/category.service'

// Minimal medicine shape used in this page. Keep in sync with API schema.
export interface ProductsType {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  // optional field if API exposes activation state
  isActive: boolean
  provedorId: string
  categoryId: string
}
interface MedicineMedicineType {
  categoryId: string
  medicineId: string
}
interface categoryIdTypeResnponse {
  id: string
}

// We always render at least PAGE_SIZE rows in the table (empty fillers if needed).
const PAGE_SIZE = 10

/**
 * Medicine admin page
 * - Debounced live-search (client-side filtering after fetching full list)
 * - Server pagination when no search is active
 * - Icon-only action buttons
 * - Continuous numbering across pages
 */
export default function MedicinePage() {
  const [productsPageData, setMedicinePageData] = useState<ProductsType[]>([])
  const [filteredMedicine, setFilteredMedicine] = useState<ProductsType[] | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  //Medicine Selcted
  const [selectedMedicine, setSelectedMedicine] = useState<ProductsType | null>(null)
  const [providerMedicine, setProviderMedicine] = useState<ProviderTypeData[]>([])
  const [categoryMedicine, setCategoryMedicine] = useState<CategoryType[]>([])

  // Modal / form state
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editing, setEditing] = useState<ProductsType | null>(null)

  const router = useRouter()
  // react-hook-form + zod for the modal form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitting },
    reset,
    setValue,
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    mode: 'onTouched',
    defaultValues: { name: '', description: '', quantity: 1, price: 0, isActive: true, categoryId: [], providerId: '' },
  })



  // Search state (debounced)
  const [searchTerm, setSearchTerm] = useState<string>('')


  // fetch a page from server
  async function fetchMedicineServer(pageNumber = 1) {
    setLoading(true)
    try {
      const responseMedicine = new MedicineService()
      const resp = await responseMedicine.getAllMediciine(PAGE_SIZE, pageNumber)
      const data = (resp.data as any)?.data || []

      setMedicinePageData(data)
      setTotalPages((resp.data as any)?.totalPages || 0)
      setTotalElements((resp.data as any)?.total || 0)
    } catch (err) {
      console.error('Erro ao buscar produtoes:', err)
      toast.error('Erro ao carregar produtoes')
      setMedicinePageData([])
      setTotalPages(0)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  // fetch all items for search (best-effort)
  async function fetchAllForSearch(): Promise<ProductsType[]> {
    setLoading(true)
    try {
      const responseMedicine = new MedicineService()
      const resp = await responseMedicine.getAllMediciine(10000, 1)
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
    void fetchMedicineServer(1)
  }, [])

  // Debounced search effect: wait 300ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredMedicine(null)
        // reload current page from server
        void fetchMedicineServer(page)
        return
      }

      let mounted = true
        ; (async () => {
          const all = await fetchAllForSearch()
          if (!mounted) return
          const filtered = all.filter((medicineValue: ProductsType) => medicineValue.name.toLowerCase().includes(searchTerm.toLowerCase()))
          setFilteredMedicine(filtered)
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
    if (filteredMedicine === null) void fetchMedicineServer(page)
  }, [page, filteredMedicine])

  const displayedMedicine = useMemo(() => {
    if (filteredMedicine !== null) {
      const start = (page - 1) * PAGE_SIZE
      return filteredMedicine.slice(start, start + PAGE_SIZE)
    }
    return productsPageData
  }, [filteredMedicine, productsPageData, page])

  const numberingBase = (page - 1) * PAGE_SIZE

  function openCreate() {
    setEditing(null)
    setShowModal(true)
  }

  function openEdit(p: ProductsType) {
    setEditing(p)

    setShowModal(true)
  }

  async function submitCreateOrEdit(data: MedicineFormValues) {

    setLoading(true)
    try {
      if (data.quantity < 5) { return toast.error("Qauntidade Inferior ao solitado 5") }

      if (data.price <= 0) { return toast.error("Preço Inferior aao solitado 1 kz") }

    
      if (!data.providerId) {
        return toast.error("Escolha um fornecedor")

      }

      const responseMedicine = new MedicineService()
      /* await responseMedicine.createMedicine(data.name, data.quantity, data.price, data.description || '', data.providerId || '')
       */




      // category IDs are mapped later to a string[] before calling the API




      const result = await responseMedicine.createMedicine(data.name, data.quantity, data.price, data.description, data.providerId)

    


      if (result.data) {
        const categoryIdValue: string[] = Array.isArray(data.categoryId)
          ? data.categoryId.map((v: any) => String(v))
          : []

        

        const resdataCategory = await responseMedicine.createMedicineCategory(result.data?.data.id, categoryIdValue)
        
        if (resdataCategory.data) {
          toast.success("Producto cadastrado com sucesso!")
          // clear the form after a successful create
          reset()
          router.refresh()
          router.back()
        }

        if (resdataCategory.error) {
          toast.remove("Producto cadastrado com sucesso, não acrescentou categoria")

          console.log("Erro:", resdataCategory.error)
        }

      }

      if (result.error) {
        console.log("Erro ao cadstrr produtos ", result)
        toast.error("Produto não Registado 2")
      }

    } catch (err) {
      console.error('Erro ao salvar produto', err)
      toast.error('Erro ao salvar produto')
    } finally {

      setLoading(false)
      setShowModal(false)
      // reload server page
      void fetchMedicineServer(page)
    }
  }

  // Placeholder delete/toggle: replace with real API calls when available
  async function handleDelete(id: string) {
    if (!confirm('Eliminar produto?')) return
    // TODO: ProviderService.deleteProvider(id) when implemented
    toast.success('Produto removido (simulado)')
    void fetchMedicineServer(page)
  }

  async function toggleActive(id: string) {
    // TODO: ProviderService.toggleActive(id) when implemented
    toast.success('Estado alterado (simulado)')
    void fetchMedicineServer(page)
  }

  // Table headers definition passed to the reusable DataTable component
  const tableHeaders: TableHeader[] = [
    { key: 'index', label: '#', className: '' },
    { key: 'name', label: 'Nome', className: '' },
    { key: 'quantity', label: 'Quantidade', className: '' },
    { key: 'Price', label: 'Preço', className: '' },
    { key: 'status', label: 'Estado', className: '' },
    { key: 'description', label: 'Descrição', className: '' },
    { key: 'actions', label: 'Ações', className: '' },
  ]

  // Fetch provider data
  async function fetchProviderMedicine() {
    setLoading(true)
    try {
      const providerResponse = new ProviderService()
      const resp = await providerResponse.getAllProvider()
      const data = (resp.data as any)?.data || []
      setProviderMedicine(data)
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err)
      toast.error('Erro ao carregar fornecedores')
      setProviderMedicine([])
    } finally {
      setLoading(false)
    }
  }


  // Fetch provider data
  async function fetchCategoryMedicine() {
    setLoading(true)
    try {
      const providerResponse = new CategoryService()
      const resp = await providerResponse.getAllCategory()
      const data = (resp.data as any)?.data || []
      setCategoryMedicine(data)
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err)
      toast.error('Erro ao carregar fornecedores')
      setCategoryMedicine([])
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    void fetchProviderMedicine()
    void fetchCategoryMedicine()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gerir Produtos</h2>
        <div className="flex items-center gap-3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Pesquisar por nome..." />
          <button onClick={openCreate} title="Adicionar novo" className="px-3 py-2 bg-green-600 text-white rounded flex items-center">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DataTable
        headers={tableHeaders}
        rows={displayedMedicine}
        renderRow={(medicine, idx) => (
          <tr key={medicine.id}>
            <td className="py-2 px-4 border-b">{numberingBase + idx + 1}</td>
            <td className="py-2 px-4 border-b">{medicine.name}</td>
            <td className="py-2 px-4 border-b">{medicine.quantity}</td>
            <td className="py-2 px-4 border-b">  {FormatPrice(medicine.price)} </td>
            <td className="py-2 px-4 border-b">
              <Badge className={getStatusColorBoolean(medicine.isActive)}>
                {medicine.isActive ? 'Ativo' : 'Inativo'}
              </Badge></td>
            <td className="py-2 px-4 border-b">{truncateText(medicine.description)}</td>
            <td className="px-4 py-2 border-b">
              <div className="flex gap-2">
                <button onClick={() => {
                  setSelectedMedicine(medicine)
                  setShowDetailsModal(true)
                }} title="Informação" className="p-2 rounded bg-gray-400 text-white">
                  <Info className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(medicine)} title="Editar" className="p-2 rounded bg-blue-600 text-white">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(medicine.id)} title={medicine.isActive ? 'Bloquear' : 'Desbloquear'} className="p-2 rounded bg-yellow-500 text-white">
                  {medicine.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(medicine.id)} title="Eliminar" className="p-2 rounded bg-red-600 text-white">
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
          <div className="bg-white rounded shadow max-w-md w-full p-6 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Editar Produto' : 'Novo Produto'}</h3>
            <form onSubmit={handleSubmit(submitCreateOrEdit)} className="space-y-4">
              {/* Name input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">Nome do Produto</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={`${errors.name ? 'border-red-500' : touchedFields.name ? 'border-green-500' : ''}`}
                  placeholder="Nome do produto"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className='flex gap-4'>
                {/* Quantity input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-900">Quantidade do Produto</Label>
                  <Input
                    id="quantity"
                    {...register('quantity', { valueAsNumber: true })}
                    type='number'
                    className={`${errors.quantity ? 'border-red-500' : touchedFields.quantity ? 'border-green-500' : ''}`}
                    placeholder="Nome do produto"
                  />
                  {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                </div>


                {/* Price input */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-900">Preço do Produto</Label>
                  <Input
                    id="price"
                    type='number'
                    {...register('price', { valueAsNumber: true })}
                    className={`${errors.price ? 'border-red-500' : touchedFields.price ? 'border-green-500' : ''}`}
                    placeholder="Nome do produto"
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>
              </div>

              {/* Select for providerId */}
              <div className="space-y-2">
                <Label htmlFor="providerId" className="text-gray-900">Fornecedor do Produco</Label>
                <Controller
                  control={control}
                  name="providerId"
                  render={({ field }) => (
                    <SearchableSelect
                      options={providerMedicine.map((p) => ({ value: p.id, label: p.name }))}
                      value={field.value}
                      onChange={(v) => field.onChange(v as string)}
                      placeholder="Pesquisar fornecedor..."
                      isMulti={false}
                    />
                  )}
                />
                {errors.providerId && <p className="text-sm text-red-500">{errors.providerId.message}</p>}
              </div>
              {/* Select for categoryId */}
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-gray-900">Categoria do Produco</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <SearchableSelect
                      options={categoryMedicine.map((c) => ({ value: c.id, label: c.name }))}
                      value={field.value}
                      onChange={(v) => field.onChange(v as string[])}
                      placeholder="Pesquisar / selecionar categorias..."
                      isMulti={true}
                    />
                  )}
                />
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>
              {/* Description textarea */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900">Descrição</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  className={`w-full rounded border px-3 py-2 ${errors.description ? 'border-red-500' : touchedFields.description ? 'border-green-500' : 'border-gray-300'}`}
                  placeholder="Descrição curta do produto"
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); reset() }} className="px-4 py-2 rounded border">Cancelar</button>
                <button type="submit" disabled={isSubmitting || loading} className="px-4 py-2 rounded bg-blue-600 text-white">{isSubmitting || loading ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <MedicineDetalheModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        medicine={selectedMedicine}
      />
    </div>
  )
}
