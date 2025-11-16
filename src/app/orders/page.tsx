'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, FileText, Download, Printer } from 'lucide-react'
import Link from 'next/link'
import OrderService from '@/api/services/order.service'
import OrderDetailService from '@/api/services/orderDetail.service'
import OrderItemService from '@/api/services/orderItem.service'
import toast from 'react-hot-toast'
import OrderDetalheModal from '@/components/admin/modalS/OrderDetalheModal'

export interface RootOrder {
  data: DataOrder
}

export interface DataOrder {
  pageSize: number
  pageNumber: number
  total: number
  totalPages: number
  data: OrderType[]
}

export interface OrderType {
  id: string
  createdAt: string
  statusId: string
  userId: string
  Status: Status
  files: any[]
  orderItems: OrderItem[]
  orderDetail: OrderDetail
}

export interface Status {
  id: string
  type: string
  description: string
  orders: any
}

export interface OrderItem {
  id: string
  quantity: number
  medicineId: string
  orderId: string
  isActive: boolean
  medicine: Medicine
}

export interface Medicine {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  providerId: string
  isActive: boolean
  medicineCategories: any
  medicineFiles: any
}

export interface OrderDetail {
  id: string
  amountPaid: number
  taxAmount: number
  deliveryAmount: number
  imposedId: string
  expenseId: string
  orderId: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (!response.ok) {
          router.push('/auth/login')
          return
        }

        loadOrders()
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const authData = await response.json()
      const userData = authData.user
      const orderService = new OrderService()
      const orderDetailService = new OrderDetailService()
      const orderItemService = new OrderItemService()

      // Buscar pedidos do usuário
      const ordersResponse = await orderService.getOrderByUserId(userData.id)
      console.log(" No orderDetailhes ", ordersResponse)
      if (ordersResponse.data) {
        const orderDataNew = ordersResponse.data.data

        setOrders(ordersResponse.data.data as any)
      }
    } catch (error) {
      console.log('Erro ao carregar pedidos:', error)
      toast.error('Erro ao carregar pedidos')
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharmacy-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando pedidos...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Meus Pedidos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Acompanhe o status dos seus pedidos e gere faturas
            </p>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Você ainda não fez nenhum pedido. Que tal começar a comprar?
                </p>
                <Button
                  onClick={() => router.push('/products')}
                  className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
                >
                  Ver Produtos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Pedido #{order.id}
                          </h3>
                          <Badge className={getStatusColor(order.Status.type)}>
                            {order.Status.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Data:</span>
                            <p className="text-gray-900 dark:text-gray-100">
                              {new Date(order.createdAt).toLocaleDateString('pt-AO')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Total:</span>
                            <p className="font-semibold text-pharmacy-600 dark:text-pharmacy-400">
                              {formatPrice(order.orderDetail?.amountPaid || 0)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Itens:</span>
                            <p className="text-gray-900 dark:text-gray-100">
                              {order.orderItems?.length || 0} medicamento(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowDetailsModal(true)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Link href={`/invoice/${order.id}`}>
                          <Button
                            size="sm"
                            className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Gerar Fatura
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      <OrderDetalheModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />
    </>
  )
}