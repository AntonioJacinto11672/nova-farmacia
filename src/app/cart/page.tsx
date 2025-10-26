'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/hooks/useCart'
import { Trash2, Plus, Minus, MapPin, ShoppingBag, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import OrderDetailService from '@/api/services/orderDetail.service'
import OrderService from '@/api/services/order.service'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'

export default function Cart() {
  const { 
    cartProducts, 
    cartTotalQty, 
    cartTotalAmount,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart
  } = useCart()

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Formulário de endereço
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    address: '',
    referencePoint: '',
    useCurrentLocation: false,
    latitude: 0,
    longitude: 0
  })

  useEffect(() => {
    if (addressData.useCurrentLocation) {
      getCurrentLocation()
    }
  }, [addressData.useCurrentLocation])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddressData({
            ...addressData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          calculateDelivery()
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          toast.error('Não foi possível obter sua localização')
        }
      )
    }
  }

  const calculateDelivery = () => {
    // Simulação de cálculo de entrega
    // Em produção, você usaria a API do Google Maps
    if (addressData.latitude && addressData.longitude) {
      // Valores simulados
      const distanceKm = 8.5 // Simulado
      const fee = distanceKm * 150
      const timeMinutes = distanceKm * 4
      
      setDeliveryFee(fee)
      setEstimatedTime(timeMinutes)
    }
  }

  const handleQuantityChange = (product: any, action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      handleCartQtyIncrease(product)
    } else {
      handleCartQtyDecrease(product)
    }
  }

  const handleContinueToDelivery = () => {
    if (cartProducts && cartProducts.length > 0) {
      // Verificar se há usuário logado
      const user = localStorage.getItem('user')
      if (!user) {
        toast.error('Por favor, faça login para continuar')
        return
      }
      setShowAddressForm(true)
    }
  }

  const handleSubmitOrder = async () => {
    if (!addressData.fullName || !addressData.address || !addressData.phone) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsProcessing(true)

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!userData.id) {
        toast.error('Usuário não encontrado. Faça login novamente.')
        setIsProcessing(false)
        return
      }

      // 1. Criar o pedido (passando userId)
      const orderResponse = await new OrderService().createOrder(userData.id)
      
      console.log('Order Response:', orderResponse)
      
      if (orderResponse.error || !orderResponse.data) {
        toast.error(orderResponse.error?.message || 'Erro ao criar pedido')
        setIsProcessing(false)
        return
      }

      const orderId = orderResponse.data.data.id

      // 2. Calcular valores usando o serviço de cálculo
      if (cartProducts && cartProducts.length > 0) {
        const calculateRequest = cartProducts.map(product => ({
          medicineId: product.id,
          quantity: product.quantity,
          price: product.price
        }))

        const calculateResponse = await new OrderDetailService().culculate(calculateRequest)
        
        console.log('Calculate Response:', calculateResponse)

          if (!calculateResponse.error && calculateResponse.data) {
          const calculatedData = calculateResponse.data.data
          
          // 3. Registrar detalhes do pedido
          const orderDetailRequest = {
            orderId: orderId,
            taxAmount: calculatedData.taxAmount, // Taxa de imposto
            imposedId: calculatedData.imposedId, // ID do imposto
            expenseId: calculatedData.expenseId, // ID da taxa
            amountPaid: calculatedData.amountPaid + deliveryFee, // Total pago (subtotal + taxa + entrega)
            deliveryAmount: deliveryFee // Taxa de entrega
          }

          console.log('Order Detail Request:', orderDetailRequest)

          const orderDetailResponse = await new OrderDetailService().registerOrder(orderDetailRequest)
          
          console.log('Order Detail Response:', orderDetailResponse)

          if (orderDetailResponse.error) {
            toast.error('Erro ao registrar detalhes do pedido')
            console.error(orderDetailResponse.error)
          } else {
            // Limpar carrinho
            handleClearCart()
            toast.success('Pedido criado com sucesso!')
            
            // Redirecionar para página de rastreamento
            window.location.href = `/tracking/${orderId}`
          }
        } else {
          toast.error('Erro ao calcular valores do pedido')
          console.error(calculateResponse.error)
        }
      }

    } catch (error) {
      console.error('Erro ao processar pedido:', error)
      toast.error('Erro ao processar pedido')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos ao carrinho para continuar</p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para produtos
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span>/</span>
            <span className="text-gray-900">Carrinho</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meu Carrinho</h2>
                
                <div className="space-y-4">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(product, 'decrease')}
                              disabled={product.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center">{product.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(product, 'increase')}
                              disabled={product.quantity >= 99}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">
                              {formatPrice(product.price * product.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProductFromCart(product)}
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!showAddressForm && (
                  <div className="mt-6 flex gap-4">
                    <Link href="/products" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Adicionar mais produtos
                      </Button>
                    </Link>
                    <Button onClick={handleContinueToDelivery} className="flex-1">
                      Continuar para entrega
                    </Button>
                  </div>
                )}
              </div>

              {/* Formulário de endereço */}
              {showAddressForm && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Informações de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        value={addressData.fullName}
                        onChange={(e) => setAddressData({...addressData, fullName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={addressData.phone}
                        onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Endereço / Morada *</Label>
                      <Input
                        id="address"
                        value={addressData.address}
                        onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reference">Ponto de Referência</Label>
                      <Input
                        id="reference"
                        value={addressData.referencePoint}
                        onChange={(e) => setAddressData({...addressData, referencePoint: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="useLocation"
                        checked={addressData.useCurrentLocation}
                        onChange={(e) => setAddressData({...addressData, useCurrentLocation: e.target.checked})}
                      />
                      <Label htmlFor="useLocation">Usar localização atual</Label>
                    </div>

                    {addressData.useCurrentLocation && (addressData.latitude !== 0) && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ✓ Localização obtida: {addressData.latitude.toFixed(4)}, {addressData.longitude.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartTotalQty} itens)</span>
                    <span className="font-medium">{formatPrice(cartTotalAmount)}</span>
                  </div>
                  
                  {showAddressForm && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taxa de entrega</span>
                        <span className="font-medium">{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Calculando...'}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tempo estimado</span>
                        <span className="font-medium">{estimatedTime > 0 ? `${estimatedTime} min` : 'Calculando...'}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">
                      {formatPrice(cartTotalAmount + deliveryFee)}
                    </span>
                  </div>
                </div>

                {showAddressForm ? (
                  <Button 
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleContinueToDelivery}
                    disabled={!cartProducts || cartProducts.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    Continuar para entrega
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}