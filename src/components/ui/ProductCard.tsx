"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { CartProductType, useCart } from '@/hooks/useCart'
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
type Props = {
    id: string
    name: string
    description: string
    price: number,
    isActive: boolean,
    medicineCategories: any
    image: any
}

export default function ProductCard({ id, name, price, image, isActive, description, medicineCategories }: Props) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false)
    const { handleAddProductToCart, cartProducts } = useCart()
    /* Product in cart */

    const [isProductInCart, setIsProductInCart] = useState(false)

    const [cartProduct, setCartProduct] =
        useState<CartProductType>({
            id: id,
            name: name,
            description: description,
            quantity: 1,
            price: price,
            isActive: isActive,
            medicineCategories: medicineCategories,
            medicineFIles: null
        })

    React.useEffect(() => {
        setIsProductInCart(false)
        if (cartProducts) {
            const exintingIndex = cartProducts.findIndex((item) => item.id === id)
            if (exintingIndex > -1) {
                setIsProductInCart(true)
            }
        }


    }, [cartProducts])

    const handteste = () => {
        console.log("teste")
    }
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
                    <p className="text-sm text-gray-600 line-clamp-2"> {description && "Descrição breve do produto em destaque com detalhes importantes."} </p>
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
                        {!isProductInCart ? (<button
                            onClick={() => handleAddProductToCart(cartProduct)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Adicionar
                        </button>) :
                            (<button
                                disabled
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-white font-medium opacity-70 cursor-not-allowed transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Adicionado
                            </button>
                            )}

                    </div>
                </div>
            </div>
        </div>
    )
}



const DialogFn = () => {
    return (

        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-violet11 outline-none outline-offset-1 hover:bg-mauve3 focus-visible:outline-2 focus-visible:outline-violet6 select-none">
                    Edit profile
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                        Edit profile
                    </Dialog.Title>
                    <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
                        Make changes to your profile here. Click save when you're done.
                    </Dialog.Description>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="w-[90px] text-right text-[15px] text-violet11"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                            id="name"
                            defaultValue="Pedro Duarte"
                        />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="w-[90px] text-right text-[15px] text-violet11"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                            id="username"
                            defaultValue="@peduarte"
                        />
                    </fieldset>
                    <div className="mt-[25px] flex justify-end">
                        <Dialog.Close asChild>
                            <button className="inline-flex h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green11 outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none">
                                Save changes
                            </button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

