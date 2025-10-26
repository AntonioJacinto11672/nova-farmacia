'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, ShoppingCart, Upload, Star, ArrowLeft, Plus, Minus, Camera, FileImage, SquareCheckBig } from 'lucide-react'
import MedicineService from '@/api/services/medicine.service'
import { useCart } from '@/hooks/useCart'
import logoImg from '@/assets/logo/NEtFarma.png'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import ProductCard from '@/components/ui/ProductCard'
import toast from 'react-hot-toast'
import farmaco from '@/assets/farmaco.jpg';
import ModalenviarReceita from '@/components/ui/ModalenviarReceita'
import { useRouter } from 'next/router'

const useMedicine = new MedicineService();

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

 

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
 
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [allProduct, setAllProduct] = useState<MedicineResponse[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  const [pageSize, setPageSize] = useState<number>(10)



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

    } catch (error) {
      console.log("Error: ", error)

    }
  }

  /* Product in cart */

  const [isProductInCart, setIsProductInCart] = useState(false)


  const { handleAddProductToCart, cartProducts } = useCart()
  const medicineService = new MedicineService()


  useEffect(() => {
    fetchMedicine()

  }, [id])

  const fetchMedicine = async () => {
    try {
      setLoading(true)
      const response = await medicineService.getMediciineById(id)

      if (response.data) {
        setMedicine(response.data.data)
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



  useEffect(() => {
    setIsProductInCart(false)
    if (cartProducts) {
      const exintingIndex = cartProducts.findIndex((item) => item.id === id)
      if (exintingIndex > -1) {
        setIsProductInCart(true)
      }
    }


  }, [cartProducts])

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
      <Header />

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
                {
                  isProductInCart ? (
                    <Button
                      disabled
                      className="flex-1"
                    >
                      Adicionado ao carrinho
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? 'Adicionando...' : 'Adicionar ao carrinho'}
                    </Button>
                  )
                }
              </div>

              {
                isProductInCart && <Alert>
                  <SquareCheckBig className="h-4 w-4" color='green' />
                  <AlertDescription className='text-green-500'>
                    Este medicamento Já está no carrinho.
                    <Link href="/cart" className="underline ml-1 text-blue-700">ver carrinho</Link>

                  </AlertDescription>

                </Alert>
              }
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
                    <span className="font-medium">{medicine.isActive ? <span className='text-green-500'>Disponível</span> : <span className='text-red-800'>Indisponível</span>}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {allProduct && allProduct.map((product, index) => {

              if (medicine.medicineCategories === product.medicineCategories && index < 3 && product.id !== medicine.id) {

                console.log(index, product.name, " - Categoria: ", product.medicineCategories);
                return (
                  <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} image={farmaco} description={product.description} isActive={product.isActive} medicineCategories={product.medicineCategories} />
                )
              }
            })}
          </div>
        </div>
      </main>

      {/* Modal de Upload de Receita */}
      {showPrescriptionModal && (
        <ModalenviarReceita
          setShowPrescriptionModal={setShowPrescriptionModal}
          prescriptionFile={prescriptionFile}
          handlePrescriptionUpload={handlePrescriptionUpload}
          handlePrescriptionSubmit={handlePrescriptionSubmit}
        />
      )
      }

      <Footer />
    </div>
  )
}