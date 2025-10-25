import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductDetailsProps {
    product: any
}
export type CartProductType = {
    id: string,
    name: string,
    description: string,
    quantity: number,
    price: number,
    isActive: boolean,
    medicineCategories?: string | null,
    medicineFIles?: File | null,
};



type CartContextType = {
    cartTotalQty: number;
    cartTotalAmount: number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQtyIncrease: (product: CartProductType) => void;
    handleCartQtyDecrease: (product: CartProductType) => void;
    handleClearCart: () => void,
    paymentIntent: string | null,
    handleSetPaymentIntent: (val: string | null) => void

}


export const CartContext =
    createContext<CartContextType | null>(null)

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {

    const [cartTotalQty, setCartTotalQty] = useState(0)
    const [cartTotalAmount, setCartTotalAmount] = useState(0)
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null)
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null)



    useEffect(() => {
        const cartItems: any = localStorage.getItem("netFarmaCartItems")
        const cProducts: CartProductType[] | null = JSON.parse(cartItems)
        const netFarmaPaymentIntent: any = localStorage.getItem("netFarmaPaymentIntent")
        const paymentIntent: string | any = JSON.parse(netFarmaPaymentIntent)


        setCartProducts(cProducts)
        setPaymentIntent(paymentIntent)
    }, [])

    useEffect(() => {
        const getTotal = () => {
            if (cartProducts) {

                const { total, qty } = cartProducts?.reduce((acc, item) => {
                    const itemTotal = item.price * item.quantity

                    acc.total += itemTotal
                    acc.qty += item.quantity

                    return acc
                }, { total: 0, qty: 0 })
                setCartTotalQty(qty)
                setCartTotalAmount(total)
            }
        }

        getTotal()
    }
        , [cartProducts])

    const handleAddProductToCart = useCallback((product: CartProductType) => {
        console.log("Produto para adicionar ", product)
        /* setCartProducts((prev) => {
            let updatedCart;
            
            if (prev) {
                updatedCart = [...prev, product]
            } else {
                updatedCart = [product]
            }
            console.log("Produtos adicionados ", updatedCart)
            console.log('Produto adicionado ao carrinho')
            toast.success('Produto adicionado ao carrinho')
            localStorage.setItem("netFarmaCartItems", JSON.stringify(updatedCart))
            localStorage.setItem("netFarmaCartItemsOrder", JSON.stringify(updatedCart))
            return updatedCart
        }) */

        setCartProducts((prev) => {
            let updatedCart;
            if (prev) {
                const existingIndex = prev.findIndex((item) => item.id === product.id)
                if (existingIndex > -1) {
                    updatedCart = [...prev]
                    updatedCart[existingIndex].quantity += product.quantity
                } else {
                    updatedCart = [...prev, product]
                }
            } else {
                updatedCart = [product]
            }
            console.log("Produtos adicionados ", updatedCart)

            localStorage.setItem("netFarmaCartItems", JSON.stringify(updatedCart))
            localStorage.setItem("netFarmaCartItemsOrder", JSON.stringify(updatedCart))

            return updatedCart
        }
        )
        toast.success('Produto adicionado ao carrinho')
    }, [])

    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
        if (cartProducts) {
            const filteredProducts = cartProducts.filter((item) => {
                return item.id !== product.id
            })
            toast.success('Produto removido')
            localStorage.setItem("netFarmaCartItems", JSON.stringify(filteredProducts))
            setCartProducts(filteredProducts)
        }
    }, [cartProducts])


    const handleCartQtyIncrease = useCallback((product: CartProductType) => {
        let updatedCart;


        if (product.quantity === 99) {
            return toast.error("Ops! Máximo alcançado")
        }

        if (cartProducts) {
            updatedCart = [...cartProducts]

            const exintingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if (exintingIndex > -1) {
                updatedCart[exintingIndex].quantity = ++updatedCart[exintingIndex].quantity
            }

            setCartProducts(updatedCart)
            localStorage.setItem("netFarmaCartItems", JSON.stringify(updatedCart))
        }
    }, [cartProducts])

    const handleCartQtyDecrease = useCallback((product: CartProductType) => {
        let updatedCart;
        console.log("Antigiu o Limit")

        if (product.quantity === 1) {
            return toast.error("Ops! Mínimo alcançado")
        }

        if (cartProducts) {
            updatedCart = [...cartProducts]

            const exintingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if (exintingIndex > -1) {
                updatedCart[exintingIndex].quantity = --updatedCart[exintingIndex].quantity
            }

            setCartProducts(updatedCart)
            localStorage.setItem("netFarmaCartItems", JSON.stringify(updatedCart))
        }
    }, [cartProducts])

    const handleClearCart = useCallback(() => {
        setCartProducts(null)
        setCartTotalQty(0)
        localStorage.setItem("netFarmaCartItems", JSON.stringify(null))


    }, [cartProducts])

    const handleSetPaymentIntent = useCallback((val: string | null) => {
        setPaymentIntent(val)
        localStorage.setItem("netFarmaPaymentIntent", JSON.stringify(val))
    }, [paymentIntent])
    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        paymentIntent,
        handleSetPaymentIntent
    }
    return <CartContext.Provider value={value}  {...props} />
}

export const useCart = () => {
    const context = useContext(CartContext)

    if (context === null) {
        throw new Error("useCart deve ser usado dentro de um CartContextProvider")
    }

    return context
}