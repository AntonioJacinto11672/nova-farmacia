"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import farmaco from '@/assets/farmaco.jpg'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import ProductCard from '@/components/ui/ProductCard'
import MedicineService from '@/api/services/medicine.service'
import toast from 'react-hot-toast'

const useMedicine = new MedicineService()

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

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const categoryParam = searchParams.get('category') || 'all'

    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)
    const [search, setSearch] = useState<string>(query)
    const [minPrice, setMinPrice] = useState<number | ''>('')
    const [maxPrice, setMaxPrice] = useState<number | ''>('')
    const [allProducts, setAllProducts] = useState<MedicineResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState<number>(50)
    const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'newest'>('relevance')

    // Pagination
    const PAGE_SIZE = 9
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE)

    useEffect(() => {
        loadProducts()
    }, [pageSize])

    const loadProducts = () => {
        try {
            let toastId = toast.loading("Carregando resultados...")

            useMedicine.getAllMediciine(pageSize).then(e => {
                if (e.error) {
                    console.error("Erro ao carregar produtos:", e.error)
                    toast.error("Erro ao carregar produtos")
                } else if (e.data) {
                    setAllProducts(e.data.data)
                }
                setLoading(false)
            }).catch(err => {
                console.error("Error:", err)
                setLoading(false)
            }).finally(() => {
                toast.dismiss(toastId)
            })
        } catch (error) {
            console.error("Error:", error)
            setLoading(false)
        }
    }

    const filtered = allProducts.filter((p) => {
        // Filter by search query
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false

        // Filter by category
        if (selectedCategory && selectedCategory !== 'all') {
            // Adjust based on actual data structure
            // const productCategory = p.medicineCategories?.slug
            // if (productCategory !== selectedCategory) return false
        }

        // Filter by price
        if (minPrice !== '' && p.price < Number(minPrice)) return false
        if (maxPrice !== '' && p.price > Number(maxPrice)) return false

        // Filter by active status
        if (!p.isActive) return false

        return true
    })

    // Sort results
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
                // Simple relevance: exact match scores higher
                const aMatchPos = a.name.toLowerCase().indexOf(search.toLowerCase())
                const bMatchPos = b.name.toLowerCase().indexOf(search.toLowerCase())
                return aMatchPos - bMatchPos
        }
    })

    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [search, selectedCategory, minPrice, maxPrice, sortBy, filtered.length])

    const handleLoadMore = () => {
        setVisibleCount((v) => Math.min(sortedProducts.length, v + PAGE_SIZE))
    }

    const handleClearFilters = () => {
        setSearch('')
        setSelectedCategory('all')
        setMinPrice('')
        setMaxPrice('')
        setSortBy('relevance')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header />

            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Resultados de Busca
                        </h1>
                        {search && (
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Pesquisando por: <span className="font-semibold text-pharmacy-600 dark:text-pharmacy-400">"{search}"</span>
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar Filters */}
                        <aside className="md:col-span-1">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sticky top-20">
                                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Filtros</h2>

                                {/* Search Input */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Pesquisar</label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nome do produto"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-500"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoria</label>
                                    <div className="flex flex-col gap-2 max-h-56 overflow-auto">
                                        {CATEGORIES.map((c) => (
                                            <button
                                                key={c.slug}
                                                onClick={() => setSelectedCategory(c.slug)}
                                                className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                                                    selectedCategory === c.slug
                                                        ? 'bg-pharmacy-100 dark:bg-pharmacy-900 text-pharmacy-700 dark:text-pharmacy-300 font-medium'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Preço (Kz)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={minPrice as any}
                                            onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="Mín"
                                            className="w-1/2 border border-gray-300 dark:border-gray-600 rounded px-2 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-500"
                                        />
                                        <input
                                            type="number"
                                            value={maxPrice as any}
                                            onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="Máx"
                                            className="w-1/2 border border-gray-300 dark:border-gray-600 rounded px-2 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-500"
                                        />
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ordenar por</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-500"
                                    >
                                        <option value="relevance">Relevância</option>
                                        <option value="price-asc">Preço (menor)</option>
                                        <option value="price-desc">Preço (maior)</option>
                                        <option value="newest">Mais novo</option>
                                    </select>
                                </div>

                                {/* Clear and Apply Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Products Section */}
                        <section className="md:col-span-3">
                            {/* Results count */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {loading ? 'Carregando...' : `${sortedProducts.length} resultado(s) encontrado(s)`}
                                </p>
                            </div>

                            {loading && (
                                <div className="bg-white dark:bg-gray-800 p-12 rounded shadow text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharmacy-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Carregando produtos...</p>
                                </div>
                            )}

                            {!loading && sortedProducts.length === 0 && (
                                <div className="bg-white dark:bg-gray-800 p-12 rounded shadow text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Nenhum produto encontrado.</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Tente ajustar seus filtros ou buscar um termo diferente.</p>
                                </div>
                            )}

                            {!loading && sortedProducts.length > 0 && (
                                <>
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

                                    {/* Load More Button */}
                                    {visibleCount < sortedProducts.length && (
                                        <div className="mt-8 flex items-center justify-center">
                                            <button
                                                onClick={handleLoadMore}
                                                className="px-8 py-3 rounded-lg bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-medium transition-colors shadow-lg hover:shadow-xl"
                                            >
                                                Ver mais produtos
                                            </button>
                                        </div>
                                    )}

                                    {visibleCount >= sortedProducts.length && sortedProducts.length > 0 && (
                                        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Todos os produtos foram carregados.
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
