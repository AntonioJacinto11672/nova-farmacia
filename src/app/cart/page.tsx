'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/hooks/useCart'
import { Trash2, Plus, Minus, MapPin, ShoppingBag, ArrowLeft, X } from 'lucide-react'
import toast from 'react-hot-toast'
import OrderDetailService from '@/api/services/orderDetail.service'
import dynamic from 'next/dynamic'
const MapClient = dynamic(() => import('@/components/Mapa'), { ssr: false })
import OrderService from '@/api/services/order.service'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import OrderItemService from '@/api/services/orderItem.service'
import AddressService from '@/api/services/address.service'
import ApiAdressService from '@/api/common/apiAdress.service'
import { MunicipioApiType, ProvinceApiType } from '@/type/ProvinceApiType'
import especifAdressData, { especifAdressDataType } from '@/utils/especifAdressData'  

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
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [expressPhone, setExpressPhone] = useState('')
  const [expressPhoneError, setExpressPhoneError] = useState('')

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardError, setCardError] = useState('')

  // MBWay / Mobile Money
  const [mbwayPhone, setMbwayPhone] = useState('')
  const [mbwayError, setMbwayError] = useState('')

  // Cash on delivery confirmation (optional)
  const [codConfirm, setCodConfirm] = useState(false)

  const [existingAddress, setExistingAddress] = useState<any>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [province, setProvince] = useState<ProvinceApiType[]>([])
  const [selectedProvinceSlug, setSelectedProvinceSlug] = useState<string>('')
  const [municipality, setMunicipality] = useState<MunicipioApiType[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')
  const [especifAdress, setEspecifAdress] = useState<string>('')

  const apiAdress = new ApiAdressService()
  const fetchProvincias = async () => {
    try {
      const data = await apiAdress.getProvincias()
      //console.log('Provincias:', data)
      setProvince(data.data) // Exemplo: definir a primeira província
    } catch (error) {
      console.error('Erro ao buscar provincias:', error)
    }
  }

  const fetchMunicipios = async (slug: string) => {
    try {
      const data = await apiAdress.getProvinciaBySlug(slug)
      console.log('Municipios da provincia:', data.data.municipios)
      setMunicipality(data.data.municipios) // Exemplo: definir a primeira província
      return data.data.municipios
    } catch (error) {
      console.error('Erro ao buscar municipios:', error)
      return []
    }
  }

  useEffect(() => {
    fetchProvincias()

    //console.log("As provincias sao:", province)
    if (selectedProvinceSlug) {
      fetchMunicipios(selectedProvinceSlug)
    } else {
      setMunicipality([])
    }
  }, [showAddressForm, selectedProvinceSlug])

  // Quando a província mudar, limpar seleção de município e endereço específico
  useEffect(() => {
    setSelectedMunicipality('')
    setAddressData(prev => ({ ...prev, address: '' }))
  }, [selectedProvinceSlug])

  // Limpar campos específicos de pagamento quando o método selecionado mudar
  useEffect(() => {
    if (selectedPaymentMethod !== 'multicaixa-express') {
      setExpressPhone('')
      setExpressPhoneError('')
    }
    if (selectedPaymentMethod !== 'card') {
      setCardNumber('')
      setCardHolder('')
      setCardExpiry('')
      setCardCvv('')
      setCardError('')
    }
    if (selectedPaymentMethod !== 'mbway') {
      setMbwayPhone('')
      setMbwayError('')
    }
    if (selectedPaymentMethod !== 'cod') {
      setCodConfirm(false)
    }
  }, [selectedPaymentMethod])


  // Formulário de endereço
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    address: '',
    referencePoint: '',
    useCurrentLocation: false,
    latitude: 0,
    longitude: 0,
    addressFromMap: false
  })

  // Modal do mapa e seleção
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapSelection, setMapSelection] = useState<any>(null)

  const handleConfirmLocation = async () => {
    if (!mapSelection) return
    const { lat, lng, address } = mapSelection

    // Tentar encontrar província correspondente
    let matchedProvinceSlug: string | null = null
    if (address?.state) {
      const stateName = address.state.toLowerCase()
      const found = province.find(p => p.nome && p.nome.toLowerCase().includes(stateName) || p.slug && p.slug.toLowerCase().includes(stateName))
      if (found) matchedProvinceSlug = found.slug
    }

    let matchedMunicipalityName: string | null = null
    if (matchedProvinceSlug) {
      const munis = await fetchMunicipios(matchedProvinceSlug)
      const searchNames = [address?.municipality, address?.city, address?.village, address?.town].filter(Boolean).map((s:any) => s.toLowerCase())
      const foundMuni = (munis || []).find((m:any) => searchNames.some((n:any) => m.nome && m.nome.toLowerCase().includes(n)))
      if (foundMuni) matchedMunicipalityName = foundMuni.nome
    }

    if (matchedProvinceSlug) {
      // Preencher selects quando encontramos correspondência
      setSelectedProvinceSlug(matchedProvinceSlug)
      if (matchedMunicipalityName) setSelectedMunicipality(matchedMunicipalityName)

      setAddressData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address: address?.road ? `${address.road}${address.suburb ? ', ' + address.suburb : ''}` : (address?.display_name || ''),
        useCurrentLocation: true,
        addressFromMap: true
      }))
    } else {
      // Não encontramos província -> usar display_name e ocultar selects
      setSelectedProvinceSlug('')
      setSelectedMunicipality('')
      setAddressData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address: address?.display_name || '',
        useCurrentLocation: true,
        addressFromMap: true
      }))
    }

    // small delay to let any Leaflet handlers settle before unmounting the map
    setTimeout(() => {
      calculateDelivery()
      setShowMapModal(false)
    }, 120)
  }

  

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

  const handleContinueToDelivery = async () => {
    if (cartProducts && cartProducts.length > 0) {
      // Verificar se há usuário logado via API
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (!response.ok) {
          toast.error('Por favor, faça login para continuar')
          return
        }
        const data = await response.json()
        const userData = data.user

        setIsLoadingAddress(true)

        try {
          // Verificar se já existe endereço
          const addressService = new AddressService()
          const addressResponse = await addressService.getAddressByUserId(userData.id)

          if (addressResponse.data && addressResponse.data.data) {
            setExistingAddress(addressResponse.data.data)
          }
        } catch (error) {
          console.log('Erro ao carregar endereço:', error)
        } finally {
          setIsLoadingAddress(false)
        }

        setShowAddressForm(true)
        //await fetchProvincias()

      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        toast.error('Erro ao verificar autenticação')
      }
    }
  }

  const handleSubmitOrder = async () => {
    if (!addressData.fullName || !addressData.address || !addressData.phone) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!selectedPaymentMethod) {
      toast.error('Por favor, selecione um método de pagamento')
      return
    }

    // Se o método for Multicaixa Express, validar número e simular abertura do checkout
    if (selectedPaymentMethod === 'multicaixa-express') {
      if (!expressPhone || !/^\d{9}$/.test(expressPhone)) {
        toast.error('Por favor, informe um número de telefone válido de 9 dígitos para Multicaixa Express')
        setExpressPhoneError('Número inválido. Deve conter 9 dígitos.')
        return
      }
      // Mensagem simulada de abertura do serviço express
      toast.success(`Abrindo Multicaixa Express para finalizar a compra com o número ${expressPhone}`)
      // Simular redirecionamento externo (opcional). Não continuar com o fluxo de criação de pedido.
      // window.open(`https://multicaixa-express.example/checkout?phone=${expressPhone}`, '_blank')
      return
    }

    // Validações para outros métodos de pagamento
    if (selectedPaymentMethod === 'card') {
      // validações básicas de cartão
      const cleanCard = cardNumber.replace(/\s/g, '')
      if (!/^[0-9]{13,19}$/.test(cleanCard) || !cardHolder || !/^\d{2}\/\d{2}$/.test(cardExpiry) || !/^\d{3,4}$/.test(cardCvv)) {
        setCardError('Por favor, insira dados de cartão válidos (número, validade MM/AA e CVV)')
        toast.error('Dados do cartão inválidos')
        return
      }
    }

    if (selectedPaymentMethod === 'mbway') {
      if (!mbwayPhone || !/^\d{9}$/.test(mbwayPhone)) {
        setMbwayError('Por favor, informe um número MBWay válido de 9 dígitos')
        toast.error('Número MBWay inválido')
        return
      }
    }

    if (selectedPaymentMethod === 'cod') {
      if (!codConfirm) {
        toast.error('Por favor, confirme que pagará em dinheiro na entrega')
        return
      }
    }

    if (selectedPaymentMethod === 'multicaixa') {
      toast.error('Multicaixa ainda está em desenvolvimento. Selecione outro método ou Multicaixa Express.')
      return
    }

    setIsProcessing(true)

    try {
      // Obter usuário via API
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      if (!response.ok) {
        toast.error('Sessão expirada. Por favor, faça login novamente')
        return
      }
      const data = await response.json()
      const userData = data.user

      if (!userData?.id) {
        toast.error('Usuário não encontrado. Faça login novamente.')
        setIsProcessing(false)
        return
      }

      // Salvar/atualizar endereço
      try {
        const addressService = new AddressService()
        const addressParts = addressData.address.split(',')
        const street = addressParts[0]?.trim() || ''
        const number = addressParts[1]?.trim() || ''

        if (existingAddress) {
          // Atualizar endereço existente (implementar se necessário)
          console.log('Atualizando endereço existente')
        } else {
          // Criar novo endereço
          await addressService.createAddress(
            'Angola', // country
            'Luanda', // state
            'Luanda', // city
            'Centro', // neighborhood
            street,
            number,
            addressData.referencePoint, // complement
            addressData.latitude,
            addressData.longitude,
            userData.id
          )
        }
      } catch (addressError) {
        console.log('Erro ao salvar endereço:', addressError)
        // Continuar mesmo com erro no endereço
      }

      // 1. Criar o pedido (passando userId)
      const orderResponse = await new OrderService().createOrder(userData.id)

      //console.log('Order Response:', orderResponse)

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
            amountPaid: calculatedData.amountPaid, // Total pago (subtotal + taxa + entrega)
            deliveryAmount: calculatedData.deliveryAmount // Taxa de entrega
          }

          console.log('Order Detail Request:', orderDetailRequest)

          const orderDetailResponse = await new OrderDetailService().registerOrder(orderDetailRequest)

          console.log('Order Detail Response:', orderDetailResponse)
          console.log('Order Calculate:', calculatedData)

          if (orderDetailResponse.error) {
            toast.error('Erro ao registrar detalhes do pedido')
            console.error(orderDetailResponse.error)
          } else {

            // Registrar os itens do pedido

            if (Array.isArray(calculatedData.orderItems)) {
              await Promise.all(calculatedData.orderItems.map(async (e: any) => {
                const resultCreateOrderItem = await new OrderItemService().createOrderItem(e.quantity, e.medicineId, orderId);

                console.log("OS dados de resultCreateOrderItem", resultCreateOrderItem)
                if (resultCreateOrderItem.data) {
                  console.log(`Item do pedido ${e.medicineId} registrado com sucesso.`);
                }
                else {
                  console.log("Erro ao cadastrar Order item", resultCreateOrderItem.error)
                }
              }));
            }
            // Limpar carrinho
            handleClearCart()
            toast.success('Pedido criado com sucesso!')

            // Redirecionar para página de rastreamento
            //window.location.href = `/tracking/${orderId}`
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Adicione produtos ao carrinho para continuar</p>
            <Link href="/products">
              <Button className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-pharmacy-600 dark:hover:text-pharmacy-400">Início</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">Carrinho</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Meu Carrinho</h2>

                <div className="space-y-4">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>

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
                            <span className="font-bold text-gray-900 dark:text-gray-100">
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
                    <Button onClick={handleContinueToDelivery} className="flex-1 bg-pharmacy-600 hover:bg-pharmacy-700 text-white">
                      Continuar para entrega
                    </Button>
                  </div>
                )}
              </div>

              {/* Formulário de endereço */}
              {showAddressForm && (
                <Card className="mt-6 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Informações de Entrega</CardTitle>
                    {existingAddress && (
                      <div className="bg-pharmacy-50 dark:bg-pharmacy-900/20 p-3 rounded-lg">
                        <p className="text-sm text-pharmacy-700 dark:text-pharmacy-300">
                          ✓ Endereço carregado dos seus dados salvos
                        </p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        value={addressData.fullName}
                        onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={addressData.phone}
                        onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      />
                    </div>
                    {/* Endereço de entrega */}
                    {!addressData.addressFromMap ? (
                      <>
                        <div className='lg:flex  gap-4'>
                          <div>
                            <Label htmlFor="province-select">Província / Morada *</Label>
                            <select
                              id="province-select"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-600"
                              value={selectedProvinceSlug}
                              onChange={(e) => setSelectedProvinceSlug(e.target.value)}
                            >
                              <option value="" >Selecione uma Pronvicia</option>
                              {
                                province && province.map((prov) => (
                                  <option key={prov.slug} value={prov.slug}>{prov.nome}</option>
                                ))
                              }
                            </select>

                          </div>

                          <div>
                            <Label htmlFor="municipio-select">Município / Morada *</Label>
                            <select
                              id="municipio-select"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-600"
                              value={selectedMunicipality}
                              onChange={(e) => { setSelectedMunicipality(e.target.value); setAddressData(prev => ({ ...prev, address: '' })); }}
                            >
                              <option value="" >Selecione um Município</option>
                              {
                                municipality && municipality.map((muni) => (
                                  <option key={muni.slug} value={muni.nome}>{muni.nome}</option>
                                ))
                              }

                            </select>

                          </div>
                        </div>

                        <div>
                          <Label htmlFor="especific-address-select">Endereço especificado/ Morada *</Label>

                          <select
                            id="especific-address-select"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-600"
                            value={addressData.address}
                            onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                          >
                            <option value="">Selecione um endereço</option>
                            {
                              // Apenas mostrar endereços fictícios para a província de Luanda
                              selectedProvinceSlug.toLowerCase() === 'luanda'
                                ? (selectedMunicipality
                                    ? especifAdressData
                                        .filter((item) => item.municipality.trim().toLowerCase() === selectedMunicipality.trim().toLowerCase())
                                        .flatMap((item) => item.addresses)
                                        .map((address, idx) => (
                                          <option key={idx} value={address}>{address}</option>
                                        ))
                                    : <option value="" disabled>Selecione um município</option>
                                  )
                                : <option value="" disabled>Endereços fictícios disponíveis apenas para a província de Luanda</option>
                            }
                          </select>

                        </div>
                      </>
                    ) : (
                      <div className="bg-pharmacy-50 dark:bg-pharmacy-900/20 p-4 rounded-lg">
                        <p className="text-sm text-pharmacy-700 dark:text-pharmacy-300">
                          ✓ Localização obtida: {addressData.address}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="reference">Ponto de Referência</Label>
                      <Input
                        id="reference"
                        value={addressData.referencePoint}
                        onChange={(e) => setAddressData({ ...addressData, referencePoint: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setShowMapModal(true)}>
                        <MapPin className="w-4 h-4 mr-2" /> Usar minha localização
                      </Button>
                    </div>

                    {/* Modal do mapa */}
                    {showMapModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-3xl bg-white dark:bg-gray-800">
                          <div className="flex justify-between items-start p-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Escolher Localização</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Clique no mapa ou arraste o marcador para selecionar o local e depois clique em <strong>Feito</strong>.</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowMapModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="p-4">
                            <div className="max-h-[60vh] overflow-hidden">
                              <MapClient height={320} initialPosition={(addressData.latitude && addressData.longitude) ? { lat: addressData.latitude, lng: addressData.longitude } : undefined} onChange={(data) => setMapSelection(data)} />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setShowMapModal(false)}>Cancelar</Button>
                              <Button onClick={handleConfirmLocation} className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white" disabled={!mapSelection}>Feito</Button>
                            </div>
                          </div>

                        </Card>
                      </div>
                    )}

                    {addressData.addressFromMap ? (
                      <div className="bg-pharmacy-50 dark:bg-pharmacy-900/20 p-4 rounded-lg">
                        <p className="text-sm text-pharmacy-700 dark:text-pharmacy-300">
                          ✓ Localização obtida: {addressData.address}
                        </p>
                      </div>
                    ) : (addressData.useCurrentLocation && (addressData.latitude !== 0) && (
                      <div className="bg-pharmacy-50 dark:bg-pharmacy-900/20 p-4 rounded-lg">
                        <p className="text-sm text-pharmacy-700 dark:text-pharmacy-300">
                          ✓ Localização obtida: {addressData.latitude.toFixed(4)}, {addressData.longitude.toFixed(4)}
                        </p>
                      </div>
                    ))}

                    {/* Botão para continuar para pagamento */}
                    <div className="pt-4">
                      <Button
                        onClick={() => setShowPaymentForm(true)}
                        className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
                        disabled={!addressData.fullName || !addressData.address || !addressData.phone}
                      >
                        Continuar para Pagamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Formulário de Pagamento */}
              {showPaymentForm && (
                <Card className="mt-6 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Método de Pagamento</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      O pagamento será processado após a confirmação do pedido
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* Multicaixa Express (requires phone) */}
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'multicaixa-express'
                          ? 'border-pharmacy-600 bg-pharmacy-50 dark:bg-pharmacy-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pharmacy-300'
                          }`}
                        onClick={() => setSelectedPaymentMethod('multicaixa-express')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === 'multicaixa-express'
                            ? 'border-pharmacy-600 bg-pharmacy-600'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selectedPaymentMethod === 'multicaixa-express' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Multicaixa Express</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pagamento instantâneo via Multicaixa (requer número de telefone de 9 dígitos)</p>
                          </div>
                        </div>
                      </div>

                      {/* Multicaixa (normal) */}
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'multicaixa'
                          ? 'border-pharmacy-600 bg-pharmacy-50 dark:bg-pharmacy-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pharmacy-300'
                          }`}
                        onClick={() => setSelectedPaymentMethod('multicaixa')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === 'multicaixa'
                            ? 'border-pharmacy-600 bg-pharmacy-600'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selectedPaymentMethod === 'multicaixa' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Multicaixa</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pagamento via terminal Multicaixa</p>
                          </div>
                        </div>
                      </div>

                      {/* Cartão (simulado) */}
                    {/*   <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'card'
                          ? 'border-pharmacy-600 bg-pharmacy-50 dark:bg-pharmacy-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pharmacy-300'
                          }`}
                        onClick={() => setSelectedPaymentMethod('card')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === 'card'
                            ? 'border-pharmacy-600 bg-pharmacy-600'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selectedPaymentMethod === 'card' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Cartão</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pagamento com cartão (simulado)</p>
                          </div>
                        </div>
                      </div> */}

                      {/* MBWay / Mobile Money (simulado) */}
                    {/*   <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'mbway'
                          ? 'border-pharmacy-600 bg-pharmacy-50 dark:bg-pharmacy-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pharmacy-300'
                          }`}
                        onClick={() => setSelectedPaymentMethod('mbway')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === 'mbway'
                            ? 'border-pharmacy-600 bg-pharmacy-600'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selectedPaymentMethod === 'mbway' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">MBWay / Mobile Money</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pagamento por telemóvel (simulado)</p>
                          </div>
                        </div>
                      </div> */}

                      {/* Dinheiro na entrega */}
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'cod'
                          ? 'border-pharmacy-600 bg-pharmacy-50 dark:bg-pharmacy-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pharmacy-300'
                          }`}
                        onClick={() => setSelectedPaymentMethod('cod')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === 'cod'
                            ? 'border-pharmacy-600 bg-pharmacy-600'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selectedPaymentMethod === 'cod' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dinheiro na entrega</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pague ao receber a sua encomenda</p>
                          </div>
                        </div>
                      </div>

                      {/* Se Multicaixa Express estiver selecionado, mostrar input de telefone */}
                      {selectedPaymentMethod === 'multicaixa-express' && (
                        <div className="mt-3">
                          <Label htmlFor="express-phone">Número (9 dígitos) *</Label>
                          <Input
                            id="express-phone"
                            value={expressPhone}
                            onChange={(e) => { const onlyDigits = e.target.value.replace(/\D/g, ''); setExpressPhone(onlyDigits); if (expressPhoneError) setExpressPhoneError(''); }}
                            placeholder="Ex: 923123456"
                          />
                          {expressPhoneError && (
                            <p className="text-sm text-red-600 mt-1">{expressPhoneError}</p>
                          )}
                        </div>
                      )}

                      {/* Card payment form */}
                      {selectedPaymentMethod === 'card' && (
                        <div className="mt-3 grid grid-cols-1 gap-3">
                          <div>
                            <Label htmlFor="card-number">Número do Cartão *</Label>
                            <Input id="card-number" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value.replace(/\s/g, '')); if (cardError) setCardError(''); }} placeholder="Ex: 4111111111111111" />
                          </div>
                          <div>
                            <Label htmlFor="card-holder">Nome no Cartão *</Label>
                            <Input id="card-holder" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Nome como está no cartão" />
                          </div>
                          <div className="lg:flex gap-3">
                            <div className="flex-1">
                              <Label htmlFor="card-expiry">Validade (MM/AA) *</Label>
                              <Input id="card-expiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/AA" />
                            </div>
                            <div className="w-32">
                              <Label htmlFor="card-cvv">CVV *</Label>
                              <Input id="card-cvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))} placeholder="123" />
                            </div>
                          </div>
                          {cardError && (<p className="text-sm text-red-600 mt-1">{cardError}</p>)}
                        </div>
                      )}

                      {/* MBWay / Mobile Money form */}
                      {selectedPaymentMethod === 'mbway' && (
                        <div className="mt-3">
                          <Label htmlFor="mbway-phone">Número MBWay (9 dígitos) *</Label>
                          <Input id="mbway-phone" value={mbwayPhone} onChange={(e) => { const onlyDigits = e.target.value.replace(/\D/g, ''); setMbwayPhone(onlyDigits); if (mbwayError) setMbwayError(''); }} placeholder="Ex: 923123456" />
                          {mbwayError && (<p className="text-sm text-red-600 mt-1">{mbwayError}</p>)}
                        </div>
                      )}

                      {/* Cash on Delivery confirmation */}
                      {selectedPaymentMethod === 'cod' && (
                        <div className="mt-3">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={codConfirm} onChange={(e) => setCodConfirm(e.target.checked)} />
                            <span className="text-sm">Confirmo que pagarei em dinheiro na entrega</span>
                          </label>
                        </div>
                      )} 
                    </div> 

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Informações Importantes</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• O pagamento será processado após a confirmação do pedido</li>
                        <li>• Você receberá uma fatura por email</li>
                        <li>• Pode solicitar uma fatura adicional a qualquer momento</li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setShowPaymentForm(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        onClick={handleSubmitOrder}
                        disabled={!selectedPaymentMethod || isProcessing}
                        className="flex-1 bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
                      >
                        {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Resumo do Pedido</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartTotalQty} itens)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(cartTotalAmount)}</span>
                  </div>

                  {showAddressForm && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Taxa de entrega</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Gratuita</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tempo estimado</span>
                        <span className="font-medium text-green-600 dark:text-green-400">✓ Menos de 24 horas</span>
                      </div>
                    </>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-pharmacy-600 dark:text-pharmacy-400">
                      {formatPrice(cartTotalAmount)}
                    </span>
                  </div>
                </div>

                {showAddressForm ? (
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
                    size="lg"
                  >
                    {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleContinueToDelivery}
                    disabled={!cartProducts || cartProducts.length === 0}
                    className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
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