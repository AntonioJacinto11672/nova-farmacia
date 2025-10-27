'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package, Truck, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'
import OrderService from '@/api/services/order.service'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import toast from 'react-hot-toast'

interface Order {
  id: string
  status: {
    id: string
    type: string
    description: string
  }
  user: any
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      window.location.href = '/auth/login'
      return
    }

    fetchUserOrders()
  }, [])

  const fetchUserOrders = async () => {
    try {
      setLoading(true)
      const userData = localStorage.getItem('user')
      const user = JSON.parse(userData || '{}')
      const orderService = new OrderService()
      
      const response = await orderService.getOrderByUserId(user.id, 20, 1)
      
      if (response.data?.data) {
        setOrders(response.data.data)
      } else {
        console.error('Erro ao buscar pedidos:', response.error)
        toast.error('Erro ao carregar pedidos')
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (statusType: string) => {
    const status = statusType.toLowerCase()
    if (status.includes('pendente') || status.includes('pending')) return <Clock className="w-5 h-5" />
    if (status.includes('processando') || status.includes('processing')) return <Package className="w-5 h-5" />
    if (status.includes('enviado') || status.includes('shipped')) return <Truck className="w-5 h-5" />
    if (status.includes('entregue') || status.includes('delivered')) return <CheckCircle className="w-5 h-5" />
    if (status.includes('cancelado') || status.includes('cancelled')) return <XCircle className="w-5 h-5" />
    return <Clock className="w-5 h-5" />
  }

  const getStatusColor = (statusType: string) => {
    const status = statusType.toLowerCase()
    if (status.includes('pendente') || status.includes('pending')) return 'bg-yellow-100 text-yellow-800'
    if (status.includes('processando') || status.includes('processing')) return 'bg-blue-100 text-blue-800'
    if (status.includes('enviado') || status.includes('shipped')) return 'bg-purple-100 text-purple-800'
    if (status.includes('entregue') || status.includes('delivered')) return 'bg-green-100 text-green-800'
    if (status.includes('cancelado') || status.includes('cancelled')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando pedidos...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
            <p className="text-gray-600">Acompanhe o status dos seus pedidos de medicamentos</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido</p>
                  <Link href="/products">
                    <Button>Ver Produtos</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Pedido #{order.id.substring(0, 8).toUpperCase()}
                          </h3>
{/*                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status.type)}`}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status.type)}
                              <span>{order.status.description}</span>
                            </div>
                          </span> */}
                        </div>
                      </div>
                      
                      <Link href={`/tracking/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

