export const useUIState = () => {
  const isServiceCartOpen = useState('isServiceCartOpen', () => false)
  const isProductCartOpen = useState('isProductCartOpen', () => false)

  const openServiceCart = () => {
    isServiceCartOpen.value = true
    isProductCartOpen.value = false
  }

  const openProductCart = () => {
    isProductCartOpen.value = true
    isServiceCartOpen.value = false
  }

  const closeAllCarts = () => {
    isServiceCartOpen.value = false
    isProductCartOpen.value = false
    //navigateTo('/services')
  }

  return {
    isServiceCartOpen,
    isProductCartOpen,
    openServiceCart,
    openProductCart,
    closeAllCarts
  }
}