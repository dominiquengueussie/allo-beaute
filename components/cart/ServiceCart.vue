<script setup>
const { serviceCart, serviceTotal, removeService, serviceIncrementQuantity, serviceDecrementQuantity } = useCart();

const { isServiceCartOpen, closeAllCarts } = useUIState();

const proceedToCheckout = () => {
    //console.log("Réservation confirmée:", serviceCart.value);
    closeAllCarts();
    navigateTo('/reservation');
};
</script>

<template>
    <Transition name="slide-fade" appear>
        <div v-if="isServiceCartOpen" class="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end"
            @click="closeAllCarts">
            <div class="bg-white w-full max-w-md h-full overflow-y-auto" @click.stop>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="text-xl font-bold text-gray-900">Vos Réservations</h4>
                        <button @click="closeAllCarts" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div v-if="serviceCart.length === 0" class="text-center py-12">
                        <i class="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">Aucun service réservé</p>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="service in serviceCart" :key="service.cartId" class="border-b pb-4">
                            <div class="flex gap-4">
                                <img :src="service.medias?.link || '/placeholder-image.jpg'" :alt="service.name"
                                    class="w-20 h-20 object-cover rounded" />
                                <div class="flex-1">
                                    <div class="flex justify-between items-center text-sm">
                                        <h3 class="font-bold">{{ service.name }}</h3>
                                        <h3 class="font-bold">{{ (Number(service.price.replace(/[^\d.]/g, '')) *
                                            service.quantity).toFixed(2) }} Fcfa</h3>
                                    </div>
                                    <p class="text-sm text-gray-600">
                                        {{ service.duration }} min × {{ service.quantity }} min
                                    </p>
                                    <div class="mt-2 flex items-center justify-between">
                                        <div class="flex items-center border rounded">
                                            <button @click.stop="serviceDecrementQuantity(service.cartId)"
                                                class="px-2 py-1 text-gray-600 bg-gray-100 hover:bg-gray-100">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <span class="px-3">{{ service.quantity }}</span>
                                            <button @click.stop="serviceIncrementQuantity(service.cartId)"
                                                class="px-2 py-1 text-gray-600 bg-gray-100 hover:bg-gray-100">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <button @click.stop="removeService(service.cartId)"
                                            class="text-red-500 hover:text-red-700">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="border-t pt-4">
                            <div class="flex justify-between font-bold text-md">
                                <span>Total:</span>
                                <span>{{ serviceTotal }} Fcfa</span>
                            </div>
                            <button @click.prevent="proceedToCheckout"
                                class="mt-4 w-full bg-slate-900 hover:bg-gold hover:text-white  text-gold py-3 rounded-md font-bold">
                                Confirmer la réservation
                            </button>
                        </div>
                        <p class="text-center mt-5">ou <span
                                class="text-indigo-600 hover:text-indigo-800 cursor-pointer text-center font-bold"
                                @click.prevent="closeAllCarts">Continuer les réservations</span></p>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
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
