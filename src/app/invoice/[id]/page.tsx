'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Printer, ArrowLeft, Download } from 'lucide-react'
import OrderService from '@/api/services/order.service'
import OrderDetailService from '@/api/services/orderDetail.service'
import OrderItemService from '@/api/services/orderItem.service'
import AddressService from '@/api/services/address.service'
import toast from 'react-hot-toast'
import type { Order, OrderItem } from '@/app/orders/page'

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [address, setAddress] = useState<any>(null)
  const [orderItens, setOrderItens] = useState<any>()
  useEffect(() => {
    loadOrderData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const loadOrderData = async () => {
    try {
      console.log("In trycatch")
      // Obter dados do usuário via API
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const data = await response.json()
      const userData = data.user
      setUserData(userData)

      const orderService = new OrderService()
      const orderDetailService = new OrderDetailService()
      const orderItemService = new OrderItemService()
      /*  const addressService = new AddressService() */

      // Buscar pedido por ID
      const orderResponse = await orderService.getOrderById(orderId)

      console.log("Pedido por id", orderResponse)

      if (orderResponse.data && orderResponse.data.data) {
        const foundOrder = orderResponse.data.data

        // Buscar detalhes e itens
        /*  const detailsResponse = await orderDetailService.getOrderDetailsByOrderId(orderId)
         const itemsResponse = await orderItemService.getOrderItemsByOrderId(orderId)
          */
        const orderDataNew = orderResponse.data.data



        setOrder(orderDataNew as any)

        // Buscar endereço do usuário
        /*  if (userData?.id) {
           const addressResponse = await addressService.getAddressByUserId(userData.id)
           if (addressResponse.data?.data) {
             setAddress(addressResponse.data.data)
           }
         } */
      }

      const orderItemResponse = await orderItemService.getOrderItemByOrderId(orderId)
      console.log("Pedido OrderItens id", orderItemResponse)

      if (orderItemResponse.data) {
        setOrderItens(orderItemResponse.data.data)
      }
    } catch (error) {
      console.log('Erro ao carregar dados da fatura:', error)
      toast.error('Erro ao carregar dados da fatura')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const calculateSubtotal = () => {
    if (!order?.orderItems) return 0
    return order.orderItems.reduce((total: number, item: any) => {
      return total + ((item.medicine?.price || 0) * item.quantity)
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharmacy-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando fatura...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Fatura não encontrada
          </h2>
          <Button onClick={() => router.push('/orders')}>
            Voltar para Pedidos
          </Button>
        </div>
      </div>
    )
  }


  const subtotal = calculateSubtotal()
  const taxAmount = (order as any)?.orderDetail?.taxAmount || 0
  const deliveryAmount = (order as any)?.orderDetail?.deliveryAmount || 0
  const total = (order as any)?.orderDetail?.amountPaid || 0

  return (
    <>
      {/* Botões de ação - escondidos na impressão */}
      <div className="no-print bg-gray-50 dark:bg-gray-900 p-4 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            onClick={() => router.push('/orders')}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button
              onClick={() => {
                window.print()
                toast.success('Fatura pronta para impressão!')
              }}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Fatura - conteúdo principal */}
      <div className="min-h-screen bg-white p-8 print:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho da Fatura */}
          <div className="mb-8 border-b-2 border-pharmacy-600 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-pharmacy-600 mb-2">NETFARMA</h1>
                <p className="text-gray-600">Sua saúde, nossa prioridade</p>
                <p className="text-gray-600 mt-2">
                  Email: suporte@netfarma.com
                </p>
                <p className="text-gray-600">
                  Telefone: +244 923 456 789
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">FATURA / RECIBO</h2>
                <p className="text-gray-600">
                  Nº: <span className="font-semibold">#{order.id}</span>
                </p>
                <p className="text-gray-600">
                  Data: {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">
                DADOS DO CLIENTE
              </h3>
              <p className="text-gray-800">
                <strong>Nome:</strong> {userData?.userName || userData?.email || 'N/A'}
              </p>
              <p className="text-gray-800">
                <strong>Email:</strong> {userData?.email || 'N/A'}
              </p>
              <p className="text-gray-800">
                <strong>Telefone:</strong> {userData?.phoneNumber || 'N/A'}
              </p>
              {address && (
                <>
                  <p className="text-gray-800 mt-2">
                    <strong>Endereço:</strong>
                  </p>
                  <p className="text-gray-800">
                    {address.street}, {address.number}
                  </p>
                  <p className="text-gray-800">
                    {address.neighborhood}, {address.city}
                  </p>
                  <p className="text-gray-800">
                    {address.state}, {address.country}
                  </p>
                </>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">
                INFORMAÇÕES DO PEDIDO
              </h3>
              <p className="text-gray-800">
                <strong>Status:</strong> {(order as any)?.Status?.type || order?.statusId || 'N/A'}
              </p>
              <p className="text-gray-800">
                <strong>Data do Pedido:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-AO') : 'N/A'}
              </p>
              <p className="text-gray-800">
                <strong>Método de Pagamento:</strong> Multicaixa Express
              </p>
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">
              ITENS DO PEDIDO
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-pharmacy-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Produto</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Quantidade</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Preço Unitário</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItems?.map((item: any, index: number) => (
                  <tr key={item.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-4 py-3">
                      <strong className="text-gray-900">{item.medicine?.name || 'Produto'}</strong>
                      {item.medicine?.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.medicine.description}</p>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {formatPrice(item.medicine?.price || 0)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                      {formatPrice((item.medicine?.price || 0) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumo Financeiro */}
          <div className="mb-8 flex justify-end">
            <div className="w-80">
              <div className="border border-gray-300 bg-gray-50 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Taxa de Entrega:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(deliveryAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Impostos:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t-2 border-pharmacy-600 pt-3">
                  <span className="text-gray-900">TOTAL:</span>
                  <span className="text-pharmacy-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Obrigado pela sua compra!</strong>
            </p>
            <p>
              Este é um documento fiscal válido. Em caso de dúvidas, entre em contacto connosco.
            </p>
            <p className="mt-2">
              NETFARMA - Sistema de Delivery de Medicamentos
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para impressão */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white !important;
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
          
          * {
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
          }
        }
        
        @media screen {
          body {
            background: #f3f4f6;
          }
        }
      `}</style>
    </>
  )
}
