<script setup>
const paymentMethods = ref([
  {
    id: "mobile",
    name: "momo",
    icon: "/img/mtn.png",
  },
  {
    id: "mobile_orange",
    name: "om",
    icon: "/img/orange.png",
  },
]);

// Payment information
const paymentInfo = ref({
  phoneNumber: "",
  /*cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    saveCard: false,*/
});

// Selected methods
//const selectedShippingMethod = ref("standard");
const selectedPaymentMethod = ref("mobile");

// Methods
/*const selectShippingMethod = (methodId) => {
    selectedShippingMethod.value = methodId;
};*/

const emit = defineEmits(["close", "showLoading", "sendPaymentInfo"]);
const sendPaymentInfo = () => {
  if (!paymentInfo.value.phoneNumber) return;

  const selectedMethod = paymentMethods.value.find(
    (method) => method.id === selectedPaymentMethod.value
  );

  const paymentData = {
    phoneNumber: paymentInfo.value.phoneNumber,
    paymentMethod: selectedMethod.name,
    paymentMethodId: selectedMethod.id,
  };
  emit("sendPaymentInfo", paymentData);
  emit("showLoading");
};

const selectPaymentMethod = (methodId) => {
  selectedPaymentMethod.value = methodId;
};

const props = defineProps({
  showLoading: Boolean,
});
</script>

<template>
  <!-- Payment Method -->
  <Transition name="fade" appear>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="bg-white w-full max-w-2xl mx-4 p-6 rounded-lg shadow-2xl">
        <button
          class="text-2xl font-semibold ml-auto block cursor-pointer focus:outline-none"
          @click="$emit('close')"
          aria-label="Fermer la fenêtre"
        >
          ×
        </button>

        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Méthode de paiement
        </h2>

        <div class="space-y-4">
          <!-- Méthodes de paiement -->
          <div
            v-for="(method, index) in paymentMethods"
            :key="index"
            :class="{
              'bg-purple-50 border-purple-300':
                selectedPaymentMethod === method.id,
              'border-gray-200': selectedPaymentMethod !== method.id,
            }"
            class="border rounded-lg p-4 cursor-pointer transition-colors duration-200"
            @click="selectPaymentMethod(method.id)"
            role="button"
            tabindex="0"
            @keyup.enter="selectPaymentMethod(method.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3"
                  :class="{
                    'border-purple-600': selectedPaymentMethod === method.id,
                    'border-gray-400': selectedPaymentMethod !== method.id,
                  }"
                >
                  <div
                    v-if="selectedPaymentMethod === method.id"
                    class="w-3 h-3 rounded-full bg-purple-600"
                  ></div>
                </div>
                <div class="flex items-center">
                  <img
                    :src="method.icon"
                    class="w-9 h-auto mr-3"
                    :alt="method.name"
                    loading="lazy"
                  />
                  <h3 class="font-medium text-gray-900">{{ method.name }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Numéro de téléphone -->
          <div class="mt-5">
            <label
              for="phoneNumber"
              class="text-sm text-gray-600 ml-1 mb-2 block"
            >
              Saisir votre numéro de téléphone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              v-model="paymentInfo.phoneNumber"
              pattern="[0-12]{12}"
              inputmode="numeric"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 237123456789"
              required
              aria-required="true"
            />
            <p class="text-xs text-gray-500 mt-1">
              Format: 12 chiffres sans espace
            </p>
          </div>

          <!-- Bouton Payer -->
          <div class="flex justify-center items-center mt-7">
            <button
              @click.prevent="sendPaymentInfo()"
              :disabled="!paymentInfo.phoneNumber"
              :class="[
                'py-3 flex items-center justify-center bg-slate-900 w-full text-white rounded-lg transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                !paymentInfo.phoneNumber
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-800',
              ]"
              aria-label="Payer maintenant"
            >
              <span v-if="!showLoading">Payer</span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Traitement...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Credit Card Form
                 <div v-if="selectedPaymentMethod === 'card'" class="mt-6 border-t border-gray-200 pt-6">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div class="md:col-span-2">
                             <label for="cardNumber" class="block text-[13px] font-medium text-gray-700 mb-1">Numéro de
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
                             <label for="cardName" class="block text- font-medium text-gray-700 mb-1">Nom sur la
                                 carte</label>
                             <input type="text" id="cardName" v-model="paymentInfo.cardName"
                                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                 placeholder="JEAN DUPONT" />
                         </div>
                         <div class="flex space-x-4">
                             <div class="w-1/2">
                                 <label for="cardExpiry" class="block text-[13px] font-medium text-gray-700 mb-1">Date
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
                     
                 </div> -->
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
