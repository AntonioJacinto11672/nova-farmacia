'use client'

import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, Trash2, Plus } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import DataTable, { TableHeader } from '@/components/ui/DataTable'
import OrderService from '@/api/services/order.service'
import OrderItemService from '@/api/services/orderItem.service'
import OrderStatusService from '@/api/services/orderStatus.service'
import { Badge } from '@/components/ui/badge'
import { FormatPrice } from '@/utils/FormatPrice'
import { truncateText } from '@/utils/TruncateText'

// Type definitions
interface OrderItemDetail {
  id: string
  medicine: {
    id: string
    name: string
    price: number
    description: string
  }
  quantity: number
  totalPrice: number
}

interface OrderWithDetails extends OrderResponse {
  items?: OrderItemDetail[]
}

const PAGE_SIZE = 10

/**
 * Orders Management Page
 * - List all orders with search and pagination
 * - View order details (items) in modal
 * - Change order status
 * - Delete orders (placeholder)
 */
export default function ManageOrdersPage() {
  const [ordersPageData, setOrdersPageData] = useState<OrderResponse[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[] | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItemDetail[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusResponse[]>([])

  // Search state (debounced)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Fetch orders page from server
  async function fetchOrdersServer(pageNumber = 1) {
    setLoading(true)
    try {
      const orderService = new OrderService()
      const resp = await orderService.getAllOrder(PAGE_SIZE, pageNumber)
      console.log("Orders fetched: ", resp);
      const data = (resp.data as any)?.data || resp.data || []

      setOrdersPageData(Array.isArray(data) ? data : [])
      setTotalPages((resp.data as any)?.totalPages || 1)
      setTotalElements((resp.data as any)?.total || 0)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
      toast.error('Erro ao carregar pedidos')
      setOrdersPageData([])
      setTotalPages(1)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all orders for search (best-effort)
  async function fetchAllForSearch(): Promise<OrderResponse[]> {
    setLoading(true)
    try {
      const orderService = new OrderService()
      const resp = await orderService.getAllOrder(10000, 1)
      return (resp.data as any)?.data || resp.data || []
    } catch (err) {
      console.error('Erro ao buscar todos para pesquisa:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch order statuses
  async function fetchOrderStatuses() {
    try {
      const statusService = new OrderStatusService()
      const resp = await statusService.getAllOrderStatus(100, 1)
      const data = (resp.data as any)?.data || resp.data || []
      setOrderStatuses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao buscar status:', err)
      setOrderStatuses([])
    }
  }

  // Fetch order items for details modal
  async function fetchOrderItemsForOrder(orderId: string) {
    try {
      const itemService = new OrderItemService()
      const resp = await itemService.getOrderItemByOrderId(orderId)
      const data = (resp.data as any) || resp.data || []
      setOrderItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao buscar itens do pedido:', err)
      setOrderItems([])
    }
  }

  // Initial load
  useEffect(() => {
    void fetchOrdersServer(1)
    void fetchOrderStatuses()
  }, [])

  // Debounced search effect
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredOrders(null)
        void fetchOrdersServer(page)
        return
      }

      let mounted = true
      ;(async () => {
        const all = await fetchAllForSearch()
        if (!mounted) return

        // Search by customer name, order ID, or email
        const filtered = all.filter((order: OrderResponse) => {
          const customerName = (order.user?.name || '').toLowerCase()
          const customerEmail = (order.user?.email || '').toLowerCase()
          const orderId = (order.id || '').toLowerCase()
          const term = searchTerm.toLowerCase()

          return customerName.includes(term) || customerEmail.includes(term) || orderId.includes(term)
        })

        setFilteredOrders(filtered)
        setPage(1)
        setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
        setTotalElements(filtered.length)
      })()

      return () => {
        mounted = false
      }
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  // When page changes and we are not in filtered mode, fetch server page
  useEffect(() => {
    if (filteredOrders === null) void fetchOrdersServer(page)
  }, [page, filteredOrders])

  const displayedOrders = useMemo(() => {
    if (filteredOrders !== null) {
      const start = (page - 1) * PAGE_SIZE
      return filteredOrders.slice(start, start + PAGE_SIZE)
    }
    return ordersPageData
  }, [filteredOrders, ordersPageData, page])

  const numberingBase = (page - 1) * PAGE_SIZE

  // Open details modal
  async function openDetails(order: OrderResponse) {
    setSelectedOrder(order as OrderWithDetails)
    await fetchOrderItemsForOrder(order.id)
    setShowDetailsModal(true)
  }

  // Update order status
 /*  async function handleStatusChange(orderId: string, newStatusId: string) {
    try {
      setLoading(true)
      const orderService = new OrderService()
      const resp = await orderService.updateOrderStatus(orderId, newStatusId)

      if (resp.data) {
        toast.success('Status do pedido atualizado com sucesso!')
        void fetchOrdersServer(page)
        if (selectedOrder) {
          setSelectedOrder({
            ...selectedOrder,
            status: orderStatuses.find(s => s.id === newStatusId) || selectedOrder.status,
          })
        }
      } else if (resp.error) {
        toast.error('Erro ao atualizar status do pedido')
        console.error('Erro:', resp.error)
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      toast.error('Erro ao atualizar status')
    } finally {
      setLoading(false)
    }
  }
 */
  // Delete order (placeholder)
  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja eliminar este pedido?')) return
    toast.success('Pedido removido (simulado)')
    void fetchOrdersServer(page)
  }

  // Table headers definition
  const tableHeaders: TableHeader[] = [
    { key: 'index', label: '#', className: '' },
    { key: 'id', label: 'ID do Pedido', className: '' },
    { key: 'customer', label: 'Cliente', className: '' },
    { key: 'email', label: 'Email', className: '' },
    { key: 'status', label: 'Estado', className: '' },
    { key: 'actions', label: 'Ações', className: '' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gerir Pedidos</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por cliente, email ou ID do pedido..."
        />
      </div>

      <DataTable
        headers={tableHeaders}
        rows={displayedOrders}
        renderRow={(order, idx) => (
          <tr key={order.id}>
            <td className="py-2 px-4 border-b">{numberingBase + idx + 1}</td>
            <td className="py-2 px-4 border-b">{truncateText(order.id)}</td>
            <td className="py-2 px-4 border-b">{order.user?.name || 'N/A'}</td>
            <td className="py-2 px-4 border-b">{order.user?.email || 'N/A'}</td>
            <td className="py-2 px-4 border-b">
              <select
                value={order.status?.id || ''}
                onChange={(e) => {}}              
                  disabled={loading}
                className="px-2 py-1 rounded border border-gray-300 text-sm"
              >
                {orderStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.type} - {status.description}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 py-2 border-b">
              <div className="flex gap-2">
                <button
                  onClick={() => void openDetails(order)}
                  title="Ver detalhes"
                  className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  title="Eliminar"
                  className="p-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
        pageSize={PAGE_SIZE}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        totalPages={totalPages}
        totalItems={totalElements}
        loading={loading}
        numberingBase={numberingBase}
      />

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow max-w-2xl w-full p-6 overflow-y-auto max-h-96">
            <h3 className="text-lg font-bold mb-4">Detalhes do Pedido</h3>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">ID do Pedido</p>
                <p className="font-semibold">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge className="mt-1">
                  {selectedOrder.status?.type} - {selectedOrder.status?.description}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-semibold">{selectedOrder.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-sm">{selectedOrder.user?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-bold mb-3">Artigos do Pedido</h4>
              {orderItems && orderItems.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Medicamento</th>
                      <th className="text-center py-2 px-2">Quantidade</th>
                      <th className="text-right py-2 px-2">Preço</th>
                      <th className="text-right py-2 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-2">{truncateText(item.medicine?.name || 'N/A')}</td>
                        <td className="text-center py-2 px-2">{item.quantity}</td>
                        <td className="text-right py-2 px-2">{FormatPrice(item.medicine?.price || 0)}</td>
                        <td className="text-right py-2 px-2 font-semibold">
                          {FormatPrice(item.totalPrice || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum artigo encontrado</p>
              )}
            </div>

            {/* Status Update */}
            <div className="mb-6 pb-4 border-t pt-4">
              <label className="block text-sm text-gray-600 mb-2">Atualizar Estado</label>
              <select
                value={selectedOrder.status?.id || ''}
                onChange={(e) => {}}
                disabled={loading}
                className="w-full px-3 py-2 rounded border border-gray-300"
              >
                {orderStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.type} - {status.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Close Button */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
