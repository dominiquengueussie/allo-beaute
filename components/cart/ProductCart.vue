<script setup>
import { NuxtLink } from '#components';
import { useToast } from 'vue-toastification';
const { isProductCartOpen, closeAllCarts } = useUIState()

const {
    productCart,
    productTotal,
    removeProduct,
    incrementProduct,
    decrementProduct, 
    formattedPrice
} = useCart()
console.log("Test Fermereture")
// Computed pour déterminer si le panier doit être affiché
const show = computed(() => isProductCartOpen.value)
const closeCart = () => {
    closeAllCarts()
    navigateTo('/store')
}

const deleteProduct = (product) => {
    const toast = useToast()
    toast.info("Produit retiré du panier")
    removeProduct(product)
}
</script>

<template>
    <Transition name="slide-fade" appear>
        <div v-if="show" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog"
            aria-modal="true" @click="closeAllCarts">
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div class="relative w-screen max-w-md">
                        <div class="h-full flex flex-col bg-white shadow-xl overflow-y-auto" >
                            <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                <div class="flex items-start justify-between">
                                    <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                                        Mon Panier
                                    </h2>
                                    <div class="ml-3 h-7 flex items-center">
                                        <button type="button" class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                            @click="closeAllCarts()">
                                            <span class="sr-only">Fermer</span>
                                            <i class="fas fa-times text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-8">
                                    <div v-if="productCart.length === 0" class="text-center py-12">
                                        <i class="fas fa-shopping-basket text-4xl text-gray-300 mb-4"></i>
                                        <p class="text-gray-500">Votre panier est vide</p>
                                    </div>
                                    <div v-else class="flow-root">
                                        <ul role="list" class="-my-6 divide-y divide-gray-200">
                                            <li v-for="item in productCart" :key="item.id" class="py-6 flex">
                                                <div class="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                                                    <img :src="item.image" :alt="item.name"
                                                        class="w-full h-full object-cover object-top" />
                                                </div>
                                                <div class="ml-4 flex-1 flex flex-col">
                                                    <div>
                                                        <div
                                                            class="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>{{ item.name }}</h3>
                                                            <h3 class="font-bold"> {{ formattedPrice(item.price, item.quantity) }} Fcfa</h3>
                                                        </div>
                                                    </div>
                                                    <p class="mt-1 text-sm text-gray-500">{{ item.description ? item.description.slice(0,20) + '...' : 'Aucune description' }}</p>
                                                    <div class="flex-1 flex items-end justify-between text-sm">
                                                        <div class="flex items-center border rounded-md">
                                                            <button @click.stop="decrementProduct(item)"
                                                                class="px-2 py-1 text-blue-600 hover:bg-blue-50 cursor-pointer">
                                                                <i class="fas fa-minus"></i>
                                                            </button>
                                                            <span class="px-3 py-1 border-x">{{ item.quantity }}</span>
                                                            <button @click.stop="incrementProduct(item)"
                                                                class="px-2 py-1 text-blue-600 hover:bg-blue-50 cursor-pointer">
                                                                <i class="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="flex">
                                                            <button @click.stop="deleteProduct(item.id)"
                                                                class="text-red-500 hover:text-red-700">
                                                                <i class="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-if="productCart.length > 0" class="border-t border-gray-200 py-6 px-4 sm:px-6">
                                <div class="flex justify-between text-base font-medium text-gray-900 mb-4">
                                    <p>Total</p>
                                    <p>{{ productTotal }} Fcfa</p>
                                </div>
                                <NuxtLink to="/checkout" data-readdy="true">
                                    <button
                                        class="w-full bg-slate-900 border border-transparent rounded-button px-6 py-3 text-base font-medium text-gold shadow-sm hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-700 whitespace-nowrap cursor-pointer">
                                        Passer à la caisse
                                    </button>
                                </NuxtLink>
                                <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
                                    <p>
                                        ou
                                        <NuxtLink to="/store" class="text-blue-600 font-medium hover:text-blue-500"
                                            @click="closeCart">
                                            Continuer vos achats
                                        </NuxtLink>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.rounded-button {
    border-radius: 0.5rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.slide-fade-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-fade-enter-to {
    transform: translateX(0%);
    opacity: 1;
}

.slide-fade-leave-from {
    transform: translateX(0%);
    opacity: 1;
}

.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>