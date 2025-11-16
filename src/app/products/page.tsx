"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import farmaco from '@/assets/farmaco.jpg'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import ProductCard from '@/components/ui/ProductCard'

import ProviderService from '@/api/services/provider.service';
import MedicineService from '@/api/services/medicine.service';
import toast from 'react-hot-toast'

const useMedicine = new MedicineService();
const useProvider = new ProviderService();
const CATEGORIES = [
    { name: 'Todas', slug: 'all' },
    { name: 'Pele e Estética', slug: 'pele-e-estetica' },
    { name: 'Nutrição e Saúde', slug: 'nutricao-e-saude' },
    { name: 'Gravidez', slug: 'gravidez' },
    { name: 'Bebês', slug: 'bebes' },
    { name: 'Suplementação', slug: 'suplementacao' },
    { name: 'Sexualidade', slug: 'sexualidade' },
    { name: 'Eletrónicos', slug: 'eletronicos' },
]

type Product = {
    id: string
    name: string
    price: number
    image: StaticImageData | string
    category: string
}

const SAMPLE_PRODUCTS: Product[] = [
    { id: "1", name: 'Paracetamol 500mg', price: 1200, image: farmaco, category: 'pele-e-estetica' },
    { id: "2", name: 'Ibuprofeno 400mg', price: 1800, image: farmaco, category: 'nutricao-e-saude' },
    { id: "3", name: 'Vitamina C 1g', price: 900, image: farmaco, category: 'gravidez' },
    { id: "4", name: 'Xarope para Tosse', price: 2500, image: farmaco, category: 'bebes' },
    { id: "5", name: 'Pomada Antisséptica', price: 1500, image: farmaco, category: 'suplementacao' },
    { id: "6", name: 'Álcool Gel 70%', price: 800, image: farmaco, category: 'sexualidade' },
    { id: "7", name: 'Termômetro Digital', price: 3500, image: farmaco, category: 'eletronicos' },
    { id: "8", name: 'Máscara Cirúrgica (cx 50)', price: 2000, image: farmaco, category: 'pele-e-estetica' },
    { id: "9", name: 'Sabonete Antisséptico', price: 1100, image: farmaco, category: 'nutricao-e-saude' },
    { id: "10", name: 'Spray Nasal', price: 1700, image: farmaco, category: 'gravidez' },
    { id: "11", name: 'Protetor Solar', price: 3200, image: farmaco, category: 'pele-e-estetica' },
    { id: "12", name: 'Gaze Estéril', price: 600, image: farmaco, category: 'bebes' },
]

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const categoryParam = searchParams.get('category') || 'all'

    const [cartCount, setCartCount] = React.useState<number>(0)
    const [selectedCategory, setSelectedCategory] = React.useState<string>(categoryParam)
    const [search, setSearch] = React.useState<string>('')
    const [minPrice, setMinPrice] = React.useState<number | ''>('')
    const [maxPrice, setMaxPrice] = React.useState<number | ''>('')
    const [allProduct, setAllProduct] = useState<MedicineResponse[]>([]);
    const [allProviders, setAllProviders] = useState<ProviderResponse[]>([])
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageSizeProvider, setPageSizeProvider] = useState<number>(10)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'newest'>('relevance')
    // pagination / load-more
    const PAGE_SIZE = 9 // show at least 9 products initially
    const [visibleCount, setVisibleCount] = React.useState<number>(PAGE_SIZE)


    const filtered = allProduct.filter((p) => {
        // Ajustar conforme a estrutura real do MedicineResponse
        if (selectedCategory && selectedCategory !== 'all') {
            // Você precisará ajustar isso baseado na estrutura real dos dados
            // const productCategory = p.medicineCategories?.name
            // if (productCategory !== selectedCategory) return false
        }
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
        if (minPrice !== '' && p.price < Number(minPrice)) return false
        if (maxPrice !== '' && p.price > Number(maxPrice)) return false
        if (!p.isActive) return false // Filtrar apenas produtos ativos
        return true
    })

    // Sort products
    const sortedProducts = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price
            case 'price-desc':
                return b.price - a.price
            case 'newest':
                // Sort by ID descending as fallback (assuming newer items have higher IDs)
                return b.id.localeCompare(a.id)
            case 'relevance':
            default:
                return 0
        }
    })

    // reset visible count when filters change
    React.useEffect(() => {
        setVisibleCount(Math.min(PAGE_SIZE, sortedProducts.length))
    }, [search, selectedCategory, minPrice, maxPrice, sortBy, sortedProducts.length])

    const handleLoadMore = () => {
        setVisibleCount((v) => Math.min(filtered.length, v + 1)) // show one more per click
    }


    //Pegar os dados od Produtos na bd
  React.useEffect(() => {
    loadProducts()
    //console.log("Aqui não está mudar", pageSize)
  }, [pageSize]);


  /* Const pegar todos os Produtos */

  const loadProducts = () => {
    try {
      let toastId = toast.loading("Carregar os produtos...")

      useMedicine.getAllMediciine(pageSize).then(e => {

        if (e.error) {
          setError(e.error);
          setLoading(false);
          console.log("Deu erro", e.error);
          toast.error("Erro ao carregar os  Productos")

        } else {
          if (e.data) {
            setAllProduct(e.data.data);

            //console.log("Peguei os dados >>>>>", e.data);
            toast.success("Productos carregados com sucesso!")
          }
          setLoading(false);
        }

      }).catch(err => {
        setError(err);
        setLoading(false);
      }).finally(() => {
        toast.dismiss(toastId)
        setLoading(false)
      });

      useProvider.getAllProvider(pageSizeProvider).then(provider => {
        if (provider.data) {
          setAllProviders(provider.data.data)

        }
      })
    } catch (error) {
      console.log("Error: ", error)

    }
  }

  /*   const handleMorePage = () => {
      setPageSize(5 + pageSize)
    } */

  /* acresentar paginas  aos produtos*/

  const handleMorePage = () => {
    setPageSize(prev => prev + 5)
    //console.log("Hello Page", pageSize)

  }


  /* Desminuir paginas  aos produtos*/

  const handleLessPage = () => {
    setPageSize(prev => prev - 5)
    //console.log("Hello Page", pageSize)

  }

  const handleMorePageProvider = () => {
    setPageSizeProvider(5 + pageSize)
  }
    return (
        <div className="min-h-screen bg-gray-50">

            <Header />

            {/* Main centered content */}
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <aside className="md:col-span-1">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-3">Filtros</h2>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Pesquisar</label>
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nome do produto"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Categoria</label>
                                    <div className="flex flex-col gap-2 max-h-56 overflow-auto">
                                        {CATEGORIES.map((c) => (
                                            <button
                                                key={c.slug}
                                                onClick={() => setSelectedCategory(c.slug)}
                                                className={`text-left px-3 py-2 rounded ${selectedCategory === c.slug ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Preço (Kz)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={minPrice as any}
                                            onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="Mín"
                                            className="w-1/2 border rounded px-2 py-2 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={maxPrice as any}
                                            onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="Máx"
                                            className="w-1/2 border rounded px-2 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Ordenar por</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800"
                                    >
                                        <option value="relevance">Relevância</option>
                                        <option value="price-asc">Preço (menor)</option>
                                        <option value="price-desc">Preço (maior)</option>
                                        <option value="newest">Mais novo</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Products */}
                        <section className="md:col-span-3">
                            {loading && (
                                <div className="col-span-full bg-white p-6 rounded shadow text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    Carregando produtos...
                                </div>
                            )}
                            
                            {!loading && filtered.length === 0 && (
                                <div className="col-span-full bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Nenhum produto encontrado.</p>
                                </div>
                            )}

                            {!loading && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sortedProducts.slice(0, visibleCount).map((product) => (
                                        <ProductCard 
                                            key={product.id} 
                                            id={product.id} 
                                            name={product.name} 
                                            price={product.price} 
                                            image={farmaco} 
                                            description={product.description || product.name} 
                                            isActive={product.isActive} 
                                            medicineCategories={product.medicineCategories} 
                                        />
                                    ))}
                                </div>
                            )}
                            {/* Load more button */}
                            <div className="mt-6 flex items-center justify-center md:col-span-3">
                                {visibleCount < sortedProducts.length ? (
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-6 py-2 rounded bg-pharmacy-600 hover:bg-pharmacy-700 text-white transition-colors"
                                    >
                                        Ver mais produtos
                                    </button>
                                ) : (
                                    sortedProducts.length > 0 && <div className="text-sm text-gray-500">Todos os produtos foram carregados.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />

        </div>
    )
}