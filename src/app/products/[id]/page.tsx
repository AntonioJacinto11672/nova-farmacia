'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, ShoppingCart, Upload, Star, ArrowLeft, Plus, Minus, Camera, FileImage } from 'lucide-react'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import farmaco from '@/assets/farmaco.jpg'
import ProductCard from '@/components/ui/ProductCard'

// Dados mockados do produto
const productData = {
  id: '1',
  name: 'Paracetamol 500mg',
  price: 45.90,
  originalPrice: 52.90,
  discount: 13,
  rating: 4.5,
  reviews: 128,
  description: 'Paracetamol 500mg é um analgésico e antitérmico indicado para o alívio de dores leves a moderadas e redução da febre. Ideal para dores de cabeça, dores musculares, dores de dente e sintomas de gripe e resfriado.',
  category: 'Analgésicos',
  brand: 'Bayer',
  requiresPrescription: true,
  stock: 15,
  images: [
    farmaco,
    farmaco,
    farmaco
  ],
  specifications: {
    'Princípio Ativo': 'Paracetamol 500mg',
    'Forma Farmacêutica': 'Comprimido',
    'Quantidade': '20 comprimidos',
    'Validade': '24 meses',
    'Registro': 'ANVISA 1.1234.0001',
    'Fabricante': 'Bayer S.A.'
  },
  instructions: [
    'Tomar 1-2 comprimidos a cada 4-6 horas',
    'Não exceder 8 comprimidos em 24 horas',
    'Tomar com água',
    'Não usar por mais de 3 dias sem orientação médica'
  ]
}

const relatedProducts = [
  {
    id: '2',
    name: 'Ibuprofeno 400mg',
    price: 38.50,
    image: farmaco,
    rating: 4.3
  },
  {
    id: '3',
    name: 'Aspirina 500mg',
    price: 29.90,
    image: farmaco,
    rating: 4.1
  },
  {
    id: '4',
    name: 'Dipirona 500mg',
    price: 25.80,
    image: farmaco,
    rating: 4.4
  }
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    // Simular adição ao carrinho
    setTimeout(() => {
      setIsAddingToCart(false)
      alert(`${quantity} unidade(s) de ${productData.name} adicionada(s) ao carrinho!`)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Início</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Produtos</Link>
          <span>/</span>
          <Link href={`/category/${productData.category.toLowerCase()}`} className="hover:text-blue-600">{productData.category}</Link>
          <span>/</span>
          <span className="text-gray-900">{productData.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Imagens do Produto */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <Image
                src={productData.images[selectedImage]}
                alt={productData.name}
                width={500}
                height={500}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productData.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">{productData.brand}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{productData.category}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{productData.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(productData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {productData.rating} ({productData.reviews} avaliações)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(productData.price)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(productData.originalPrice)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  -{productData.discount}%
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">{productData.description}</p>
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
                    disabled={quantity >= productData.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {productData.stock} disponíveis
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

              {productData.requiresPrescription && (
                <Alert>
                  <FileImage className="h-4 w-4" />
                  <AlertDescription>
                    Este medicamento requer receita médica. 
                    <Button
                      variant="link"
                      onClick={() => setShowPrescriptionModal(true)}
                      className="p-0 h-auto ml-1"
                    >
                      Enviar receita
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Especificações */}
            <Card>
              <CardHeader>
                <CardTitle>Especificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instruções de Uso */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instruções de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {productData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} id={Number(product.id)} name={product.name} price={product.price} image={product.image} onAdd={(id) => alert(`Adicionado produto ${id} ao carrinho (simulado)`)} />
            ))}
          </div>
        </div>
      </main>

      <Footer />

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
