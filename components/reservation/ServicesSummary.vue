<script setup>
import { useToast } from "vue-toastification";
const props = defineProps({
  serviceCart: Array,
  selectedTimes: Array,
  selectedDate: Date,
  serviceTotalPrice: String,
  contactInfo: Object,
});

const emit = defineEmits(["submit", "update:marketing"]);
const marketing = ref(props.contactInfo.marketing || false);
watch(marketing, (newValue) => {
  emit("update:marketing", newValue);
});

const promoCode = ref("");
const applyPromoCode = () => {
  if (promoCode.value.trim() === "") {
    console.log(`Applying promo code: ${promoCode.value}`);
    const toast = useToast();
    toast.error("Veuillez entrer un code promo valide.");
    return;
  } else if (promoCode.value.trim()) {
    // Logic to apply the promo code
    console.log(`Applying promo code: ${promoCode.value}`);
    // Reset the input field after applying
    promoCode.value = "";
  }
};
const formatSelectedDate = (date) => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Payment methods
/* const paymentMethods = ref([
    {
        id: "card",
        name: "Carte bancaire",
        icon: "fas fa-credit-card",
    },
    {
        id: "paypal",
        name: "PayPal",
        icon: "fab fa-paypal",
    },
    {
        id: "applepay",
        name: "Apple Pay",
        icon: "fab fa-apple-pay",
    },
]); */
</script>

<template>
  <div>
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div class="bg-slate-600 px-6 py-4">
        <h3 class="text-xl font-semibold text-white">
          Récapitulatif des Services
        </h3>
      </div>
      <div class="p-6">
        <ul class="divide-y divide-gray-200">
          <li v-for="(service, index) in serviceCart" :key="index" class="py-4">
            <div class="flex items-start">
              <img
                :src="service.medias?.link"
                :alt="service.name"
                class="w-16 h-16 rounded-md object-cover object-top"
              />
              <div class="ml-4 flex-1">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-gray-800">{{ service.name }}</h4>
                  <span class="font-semibold text-sm text-slate-600"
                    >{{ service.price }} Fcfa</span
                  >
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-sm text-gray-500">
                    <i class="far fa-clock mr-1"></i> {{ service.duration }} min
                    <p class="text-sm">Qté: {{ service.quantity }}</p>
                  </span>
                  <span
                    v-if="selectedTimes"
                    class="text-sm text-gray-800"
                  >
                    <i class="far fa-calendar-check mr-1"></i>
                    {{ formatSelectedDate(selectedDate) }}
                    <span v-if="selectedTimes && typeof selectedTimes === 'string' && selectedTimes.length > 0">à {{ selectedTimes }}</span>
                    <span v-else class="text-gray-500 italic"> (heure à choisir)</span>
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="flex justify-between font-medium text-gray-800">
            <span>Total</span>
            <span class="font-bold text-slate-600"
              >{{ serviceTotalPrice }} Fcfa</span
            >
          </div>
        </div>
      </div>
      <!-- Promo Code -->
      <div class="mb-4 mx-2 mt-6">
        <div class="flex">
          <input
            type="text"
            v-model="promoCode"
            placeholder="Code promo"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-slate-900 focus:outline-none focus:border-slate-500"
          />
          <button
            @click="applyPromoCode"
            class="bg-slate-900 hover:bg-slate-900 text-white px-4 py-2 rounded-r-button whitespace-nowrap cursor-pointer"
          >
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
          <span
            ><img src="/img/orange.png" alt="paiement orange" class="w-8"
          /></span>
          <span
            ><img
              src="/img/mtn.png"
              alt="paiement mtn mobile money"
              class="w-9"
          /></span>
        </div>
        <p class="text-xs text-gray-500">
          Paiement 100% sécurisé avec cryptage SSL
        </p>
      </div>
    </div>

    <!-- Vos Coordonnées-->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-slate-600 px-6 py-4">
        <h3 class="text-xl font-semibold text-white">Vos Coordonnées</h3>
      </div>
      <div class="p-6">
        <form>
          <!--   <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input type="text" id="firstName" v-model="contactInfo.firstName" placeholder="Votre prénom"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-slate-900 focus:border-slate-900"
                                required />
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input type="text" id="lastName" v-model="contactInfo.lastName" placeholder="Votre nom"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-slate-900 focus:border-slate-900"
                                required />
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" v-model="contactInfo.email" placeholder="votre@email.com"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-slate-900 focus:border-slate-900"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input type="tel" id="phone" v-model="contactInfo.phone" placeholder="+237 626 349 567"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-slate-900 focus:border-slate-900"
                            required/>
                    </div>
                    <div class="mb-4">
                        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes spéciales
                            (optionnel)</label>
                        <textarea id="notes" v-model="contactInfo.notes" rows="3" placeholder="Vos préférences, allergies, etc..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-slate-900 focus:border-slate-900"></textarea>
                    </div> -->
          <div class="mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="marketing"
                class="mt-1 h-5 w-5 text-slate-900 focus:ring-slate-900 border-gray-500 rounded hover:cursor-pointer"
              />
              <span class="ml-2 text-sm text-gray-600 font-semibold">
                Je souhaite recevoir à domicile !
              </span>
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
