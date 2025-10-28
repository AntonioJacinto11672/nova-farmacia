'use client'
import { CartContextProvider, useCart } from "@/hooks/useCart";
import AddToCartModal from '@/components/ui/AddToCartModal'
import { useRouter } from 'next/navigation'

interface CartProviderProps {
    children: React.ReactNode
}

function CartProviderContent({ children }: { children: React.ReactNode }) {
    const { 
        showAddToCartModal, 
        setShowAddToCartModal, 
        modalProduct, 
        confirmAddToCart 
    } = useCart()
    const router = useRouter()

    const handleAddToCart = () => {
        confirmAddToCart()
    }

    const handleFinalizePurchase = () => {
        confirmAddToCart()
        router.push('/cart')
    }

    return (
        <>
            {children}
            {modalProduct && (
                <AddToCartModal
                    isOpen={showAddToCartModal}
                    onClose={() => setShowAddToCartModal(false)}
                    onAddToCart={handleAddToCart}
                    onFinalizePurchase={handleFinalizePurchase}
                    productName={modalProduct.name}
                    productPrice={modalProduct.price}
                    quantity={modalProduct.quantity}
                />
            )}
        </>
    )
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    return (
        <CartContextProvider>
            <CartProviderContent>
                {children}
            </CartProviderContent>
        </CartContextProvider>
    )
}

export default CartProvider;