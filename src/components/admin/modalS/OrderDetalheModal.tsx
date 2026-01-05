import { OrderType } from '@/app/orders/page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormatPrice } from '@/utils/FormatPrice';
import { FileText, Printer } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderType | null
}

export default function OrderDetalheModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Em processamento':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'Concluido':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-gray-100">Detalhes do Pedido</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações do pedido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Número do Pedido</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">#{order.id}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Status</h4>
              <Badge className={getStatusColor(order.Status.type)}>
                {order.Status.type}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('pt-AO')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Total</h4>
              <p className="text-sm font-bold text-pharmacy-600 dark:text-pharmacy-400">
                {FormatPrice(order.orderDetail.amountPaid || 0)}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Entregador</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                N/A
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Tempo para Entrega</h4>
              <p className="text-sm font-bold text-pharmacy-600 dark:text-pharmacy-400">
                Menos de 24hrs 
              </p>
            </div>
          </div> 

          {/* Itens do pedido */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Medicamentos</h4>
            <div className="space-y-3">
              {order && order.orderItems?.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{item.medicine.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice(item.medicine.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPrice(item.medicine.price)} cada
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo financeiro */}
          {order.orderDetail && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Resumo Financeiro</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatPrice((order.orderDetail.amountPaid || 0) - (order.orderDetail.deliveryAmount || 0) - (order.orderDetail.taxAmount || 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Taxa de entrega:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatPrice(order.orderDetail.deliveryAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Impostos:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatPrice(order.orderDetail.taxAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-900 dark:text-gray-100">Total:</span>
                  <span className="text-pharmacy-600 dark:text-pharmacy-400">
                    {formatPrice(order.orderDetail.amountPaid || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Link href={`/invoice/${order.id}`} className="flex-1">
              <Button
                className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Fatura
              </Button>
            </Link>
            <Link href={`/invoice/${order.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(`/invoice/${order.id}`, '_blank')
                }}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Fatura
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )

}
