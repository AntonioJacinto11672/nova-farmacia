"use client"
import React from 'react'
import Image from 'next/image'

type Props = {
    id: number
    name: string
    price: number
    image: any
    onAdd: (id: number) => void
}

export default function ProductCard({ id, name, price, image, onAdd }: Props) {
    return (
        <div className="group rounded-xl bg-white flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48 w-full rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <Image
                    src={image}
                    alt={`Produto ${name}`}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 z-20">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">-12%</span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors text-center">{name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">Descrição breve do produto em destaque com detalhes importantes.</p>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 line-through">{price.toFixed(2)} Kz</span>
                        <span className="text-xl font-bold text-green-600">{price.toFixed(2)} Kz</span>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white border-2 border-blue-600 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 transition-colors group">
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                        </button>
                        <button
                            onClick={() => onAdd(id)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
