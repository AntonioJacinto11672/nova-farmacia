'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, ShoppingCart, Upload, Star, ArrowLeft, Plus, Minus, Camera, FileImage } from 'lucide-react'
import MedicineService from '@/api/services/medicine.service'
import { useCart } from '@/hooks/useCart'
import logoImg from '@/assets/logo/NEtFarma.png'

interface Medicine {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  providerId: string
  isActive: boolean
  medicineCategories?: any
  medicineFiles?: any
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const { handleAddProductToCart } = useCart()
  const medicineService = new MedicineService()

  useEffect(() => {
    fetchMedicine()
  }, [params.id])

  const fetchMedicine = async () => {
    try {
      setLoading(true)
      const response = await medicineService.getMediciineById(params.id)
      
      if (response.data) {
        setMedicine(response.data)
      } else {
        console.error('Erro ao buscar medicamento:', response.error)
      }
    } catch (error) {
      console.error('Erro ao buscar medicamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!medicine) return
    
    setIsAddingToCart(true)
    
    const cartProduct = {
      id: medicine.id,
      name: medicine.name,
      description: medicine.description,
      quantity: quantity,
      price: medicine.price,
      isActive: medicine.isActive,
      medicineCategories: medicine.medicineCategories,
      medicineFiles: medicine.medicineFiles
    }
    
    handleAddProductToCart(cartProduct)
    
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPrescriptionFile(file)
    }
  }

  const handlePrescriptionSubmit = () => {
    if (prescriptionFile) {
      // Simular upload da receita
      alert('Receita médica enviada com sucesso! Seu pedido será processado após análise.')
      setShowPrescriptionModal(false)
      setPrescriptionFile(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            Voltar aos produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">NETFARMA</h1>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-gray-700">
              <Link href="/" className="hover:text-blue-600">Início</Link>
              <Link href="/products" className="hover:text-blue-600">Produtos</Link>
              <Link href="/support" className="hover:text-blue-600">Suporte</Link>
              <Link href="/auth/login" className="hover:text-blue-600">Entrar</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Início</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Produtos</Link>
          <span>/</span>
          <span className="text-gray-900">{medicine.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Imagens do Produto */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{medicine.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.5 (128 avaliações)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(medicine.price)}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">{medicine.description}</p>
            </div>

            {/* Quantidade e Botões */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="quantity">Quantidade:</Label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= medicine.quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {medicine.quantity} disponíveis
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isAddingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              <Alert>
                <FileImage className="h-4 w-4" />
                <AlertDescription>
                  Este medicamento pode requerer receita médica. 
                  <Button
                    variant="link"
                    onClick={() => setShowPrescriptionModal(true)}
                    className="p-0 h-auto ml-1"
                  >
                    Enviar receita
                  </Button>
                </AlertDescription>
              </Alert>
            </div>

            {/* Especificações */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">{medicine.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">{formatPrice(medicine.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estoque:</span>
                    <span className="font-medium">{medicine.quantity} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{medicine.isActive ? 'Disponível' : 'Indisponível'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de Upload de Receita */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enviar Receita Médica</CardTitle>
              <CardDescription>
                Faça upload da sua receita médica para este medicamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="prescription" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Clique para selecionar ou arraste aqui
                  </span>
                </Label>
                <Input
                  id="prescription"
                  type="file"
                  accept="image/*"
                  onChange={handlePrescriptionUpload}
                  className="hidden"
                />
                {prescriptionFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Arquivo selecionado: {prescriptionFile.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrescriptionSubmit}
                  disabled={!prescriptionFile}
                  className="flex-1"
                >
                  Enviar Receita
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}