import { ProductsType } from '@/app/admin/products/page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import getStatusColor, { getStatusColorBoolean } from '@/components/ui/getStatusColor';
import { FormatPrice } from '@/utils/FormatPrice';
import { FileText, Printer } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface MedicineDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  medicine: ProductsType | null
}

export default function MedicineDetalheModal({ isOpen, onClose, medicine }: MedicineDetailsModalProps) {
  if (!isOpen || !medicine) return null




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-gray-100">Detalhes do  {medicine.name} </CardTitle>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">#{medicine.id}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Status</h4>
              <Badge className={getStatusColorBoolean(medicine.isActive)}>
                {medicine.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Provedor</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {medicine.provedorId ? medicine.provedorId : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Categria</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {medicine.provedorId ? medicine.provedorId : 'N/A'}
              </p>
            </div>
          </div>



          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Medicamentos</h4>
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center p-3 ">

                <div className=''>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">{medicine.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade: {medicine.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {FormatPrice(medicine.price * medicine.quantity)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preço Unitário: {FormatPrice(medicine.price)}
                  </p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                {medicine.description}
              </div>
            </div>
          </div>

          {/* Resumo financeiro */}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Resumo Financeiro</h4>
            <div className="space-y-2">


              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-900 dark:text-gray-100">Total:</span>
                <span className="text-pharmacy-600 dark:text-pharmacy-400">
                  {FormatPrice(medicine.quantity * medicine.price || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Link href={`/admin/manege-product-category/${medicine.id}`} className="flex-1">
              <Button
                className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Vincular Categoria
              </Button>
            </Link>
            {/* <Link href={`/medicineCategory/${medicine.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(`/medicineCategory/${medicine.id}`, '_blank')
                }}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Fatura
              </Button>
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )

}
