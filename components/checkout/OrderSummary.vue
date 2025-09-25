<script setup>
const props = defineProps({
  cart: {
    type: Array,
    required: true,
  },
  subtotal: {
    type: String,
    required: true,
  },
  tax: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  promoCode: {
    type: String,
    required: true,
  },
  formattedPrice: {
    type: Number,
    required: true,
  },
  selectedShippingMethod: {
    type: String,
    required: true,
  },
  shippingInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["confirm-order", "update:promoCode"]);
//console.log("Shipping info dans order summary", shippingInfo);
const confirmOrder = () => {
    emit("confirm-order", {
        shippingInfo: props.shippingInfo,
        selectedShippingMethod: props.selectedShippingMethod,
        cart: props.cart,
    });
};
</script>

<template>
    <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Récapitulatif de la commande
        </h2>

        <!-- Products List -->
        <div class="max-h-80 overflow-y-auto mb-6 pr-2 custom-scrollbar">
            <div v-for="(item, index) in cart" :key="index" class="flex py-4 border-b border-gray-100 last:border-b-0">
                <div class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img :src="item.image" :alt="item.title" class="w-full h-full object-cover object-top" />
                </div>
                <div class="ml-4 flex-1">
                    <h3 class="text-sm font-medium text-gray-800">
                        {{ item.title }}
                    </h3>
                    <div class="flex justify-between mt-1">
                        <span class="text-sm text-gray-500">Qté: {{ item.quantity }}</span>
                        <span class="text-sm font-medium text-gray-800">{{ item.price * item.quantity }} Fcfa</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Price Summary -->
        <div class="space-y-2 text-sm mb-6">
            <div class="flex justify-between">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium text-gray-800">{{ subtotal }}</span>
            </div>
            <!--   <div class="flex justify-between">
                <span class="text-gray-600">Frais de livraison</span>
                <span class="font-medium text-gray-800">{{ shippingCost }}</span>
            </div> -->
            <!--  <div class="flex justify-between">
                <span class="text-gray-600">TVA (20%)</span>
                <span class="font-medium text-gray-800">{{ tax }}</span>
            </div> -->
            <div class="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <span class="text-base font-semibold text-gray-800">Total</span>
                <span class="text-base font-bold text-slate-600">{{
                    Number(subtotal.replace(/[^0-9.-]+/g, ""))
                    }}
                    Fcfa</span>
            </div>
        </div>

        <!-- Promo Code -->
        <div class="mb-6">
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input type="text" :value="promoCode" placeholder="Code promo"
                    @input="$emit('update:promoCode', $event.target.value)"
                    class="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-slate-500 focus:border-slate-500" />
                <button
                    class="w-full sm:w-auto bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg sm:rounded-l-none sm:rounded-r-lg whitespace-nowrap transition-colors duration-200">
                    Appliquer
                </button>
            </div>
        </div>

        <!-- Security Info -->
        <div class="mb-6 text-center">
            <div class="flex justify-center space-x-3 mb-2">
                <i class="fas fa-lock text-gray-500"></i>
                <i class="fab fa-cc-visa text-blue-700"></i>
                <i class="fab fa-cc-mastercard text-red-600"></i>
                <i class="fab fa-cc-paypal text-blue-800"></i>
            </div>
            <p class="text-xs text-gray-500">
                Paiement 100% sécurisé avec cryptage SSL
                {{ selectedShippingMethod }}
            </p>
        </div>

        <!-- Confirm Button -->
        <button @click="confirmOrder"
            :disabled=" selectedShippingMethod === 'standard' && (!shippingInfo.address || !shippingInfo.contact)"
            :class="['w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-button font-medium text-base whitespace-nowrap transition-colors duration-200',
               selectedShippingMethod === 'standard' && (!shippingInfo.address || !shippingInfo.contact) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']">
            Confirmer et payer <span class="ml-2 text-gold font-semibold">
                {{ Number(subtotal.replace(/[^0-9.-]+/g, "")) }} Fcfa
            </span>
        </button>

        <!-- Terms -->
        <p class="text-xs text-gray-500 text-center mt-4">
            En confirmant votre commande, vous acceptez nos
            <a href="#" class="text-purple-600 hover:underline cursor-pointer">Conditions Générales de Vente</a>
            et notre
            <a href="#" class="text-purple-600 hover:underline cursor-pointer">Politique de Confidentialité</a>.
        </p>
    </div>
</template>

<style scoped>
.rounded-button {
    border-radius: 0.5rem;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a5b4fc;
}
</style>
