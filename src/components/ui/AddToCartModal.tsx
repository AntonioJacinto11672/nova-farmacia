'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: () => void
  onFinalizePurchase: () => void
  productName: string
  productPrice: number
  quantity: number
}

export default function AddToCartModal({
  isOpen,
  onClose,
  onAddToCart,
  onFinalizePurchase,
  productName,
  productPrice,
  quantity
}: AddToCartModalProps) {
  if (!isOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                Adicionar ao Carrinho
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Confirme a adição do produto ao carrinho
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Produto adicionado */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pharmacy-100 dark:bg-pharmacy-900 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-pharmacy-600 dark:text-pharmacy-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {productName}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Quantidade: {quantity}
                </p>
                <p className="text-sm font-bold text-pharmacy-600 dark:text-pharmacy-400">
                  {formatPrice(productPrice * quantity)}
                </p>
              </div>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-3">
            <Button
              onClick={onAddToCart}
              variant="outline"
              className="w-full border-pharmacy-600 text-pharmacy-600 hover:bg-pharmacy-50 dark:border-pharmacy-400 dark:text-pharmacy-400 dark:hover:bg-pharmacy-900/20"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
            
            <Button
              onClick={onFinalizePurchase}
              className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Finalizar Compra
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
