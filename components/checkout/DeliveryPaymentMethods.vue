<script setup>
const showInformationShipping = ref(true);
defineProps({
    shippingMethods: {
        type: Array,
        required: true,
    },
    paymentMethods: {
        type: Array,
        required: true,
    },
    selectedShippingMethod: {
        type: String,
        required: true,
    },
    selectedPaymentMethod: {
        type: String,
        required: true,
    },
    paymentInfo: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['select-shipping-method', 'select-payment-method']);

const selectShippingMethod = (methodId) => {
    emit('select-shipping-method', methodId);
    if (methodId === 'standard') {
        showInformationShipping.value = true;
    } else {
        showInformationShipping.value = false;
    }
    console.log("methode de livraison", methodId)
};

const selectPaymentMethod = (methodId) => {
    emit('select-payment-method', methodId);
};
</script>

<template>
    <div>
        <!-- Shipping Method -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Méthode de livraison
            </h2>
            <div class="space-y-4">
                <div v-for="(method, index) in shippingMethods" :key="index"
                    :class="{ 'bg-purple-50 border-purple-300': selectedShippingMethod === method.id, 'border-gray-200': selectedShippingMethod !== method.id }"
                    class="border rounded-lg p-4 cursor-pointer transition-colors duration-200"
                    @click="selectShippingMethod(method.id)">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3"
                                :class="{ 'border-purple-600': selectedShippingMethod === method.id, 'border-gray-400': selectedShippingMethod !== method.id }">
                                <div v-if="selectedShippingMethod === method.id"
                                    class="w-3 h-3 rounded-full bg-purple-600"></div>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-900">
                                    {{ method.name }}
                                </h3>
                                <p class="text-sm text-gray-500">
                                    {{ method.description }}
                                </p>
                            </div>
                        </div>
                        <span class="font-semibold text-gray-900">{{ method.price }}</span>
                    </div>
                </div>
            </div>
        </div>

         <!--Payment Method -->
         <!--<div class="bg-white rounded-xl shadow-md p-6 mb-6">
           <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Méthode de paiement
            </h2>
            <div class="space-y-4">
                <div v-for="(method, index) in paymentMethods" :key="index"
                    :class="{ 'bg-purple-50 border-purple-300': selectedPaymentMethod === method.id, 'border-gray-200': selectedPaymentMethod !== method.id }"
                    class="border rounded-lg p-4 cursor-pointer transition-colors duration-200"
                    @click="selectPaymentMethod(method.id)">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3"
                                :class="{ 'border-purple-600': selectedPaymentMethod === method.id, 'border-gray-400': selectedPaymentMethod !== method.id }">
                                <div v-if="selectedPaymentMethod === method.id"
                                    class="w-3 h-3 rounded-full bg-purple-600"></div>
                            </div>
                            <div class="flex items-center">
                                <i :class="method.icon" class="text-xl mr-3"></i>
                                <h3 class="font-medium text-gray-900">
                                    {{ method.name }}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>-->

            <!-- Credit Card Form 
            <div v-if="selectedPaymentMethod === 'card'" class="mt-6 border-t border-gray-200 pt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">Numéro de
                            carte</label>
                        <div class="relative">
                            <input type="text" id="cardNumber" v-model="paymentInfo.cardNumber"
                                class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="1234 5678 9012 3456" />
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <i class="fab fa-cc-visa text-blue-700"></i>
                                <i class="fab fa-cc-mastercard text-red-600"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="cardName" class="block text-sm font-medium text-gray-700 mb-1">Nom sur la
                            carte</label>
                        <input type="text" id="cardName" v-model="paymentInfo.cardName"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            placeholder="JEAN DUPONT" />
                    </div>
                    <div class="flex space-x-4">
                        <div class="w-1/2">
                            <label for="cardExpiry" class="block text-sm font-medium text-gray-700 mb-1">Date
                                d'expiration</label>
                            <input type="text" id="cardExpiry" v-model="paymentInfo.cardExpiry"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="MM/AA" />
                        </div>
                        <div class="w-1/2">
                            <label for="cardCvc" class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input type="text" id="cardCvc" v-model="paymentInfo.cardCvc"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="123" />
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <label class="flex items-center">
                        <input type="checkbox" v-model="paymentInfo.saveCard"
                            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                        <span class="ml-2 text-sm text-gray-600">Sauvegarder cette carte pour mes prochains
                            achats</span>
                    </label>
                </div>
            </div>
        </div>-->
    </div>
</template>
