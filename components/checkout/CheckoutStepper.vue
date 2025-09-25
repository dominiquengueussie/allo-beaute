<script  setup>
import { ref, computed } from "vue";
import DeliveryInformation from "./DeliveryInformation.vue";
import DeliveryPaymentMethods from "./DeliveryPaymentMethods.vue";
import OrderSummary from "./OrderSummary.vue";
import { useToast } from "vue-toastification";
const toast = useToast();
const order_id = ref(null);
const auth = useAuthStore();
const isProcessingPayment = ref(false);
const paymentStatus = ref(null);
const paymentPollingInterval = ref(null);
const showPaymentModal = ref(false);
const {
    productCart,
    productTotal,
    removeProduct,
    incrementProduct,
    decrementProduct,
    formattedPrice,
} = useCart();

// Cart data
const cart = productCart;

// Shipping information
const shippingInfo = ref({
    //firstName: "",
    //lastName: "",
    //email: "",
    //phone: "",
    address: "",
    contact: "",
    notes: "",
    //city: "",
});

// Shipping methods
const shippingMethods = ref([
    {
        id: "standard",
        name: "Livraison A Domicile",
        description: "Livraison en 1-5 jours ouvrés",
        //price: "1000 Fcfa",
    },
    /*    {
          id: "express",
          name: "Livraison Express",
          description: "Livraison en 1-2 jours ouvrés",
          price: "2000 Fcfa",
      }, */
    {
        id: "relay",
        name: "Point de vente",
        description: "Récupération en point de vente sous 1-5 jours",
        //price: "3000 Fcfa",
    },
]);

// Payment methods
const paymentMethods = ref([
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
]);

// Payment information
const paymentInfo = ref({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    saveCard: false,
});

// Selected methods
const selectedShippingMethod = ref("standard");
const selectedPaymentMethod = ref("card");
const promoCode = ref("");

// Counts for header display
/* const serviceCount = ref(0);
const productCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
}); */

// Price calculations
/*  const subtotal = computed(() => {
    const productTotal = cart.value.reduce((sum, item) => {
        const price = parseInt(item.price.replace(" Fcfa", ""));
        return sum + price * item.quantity;
    }, 0);
    return `${total} Fcfa`;
});  */

/* const shippingCost = computed(() => {
    const method = shippingMethods.value.find(
        (m) => m.id === selectedShippingMethod.value,
    );
    return method ? method.price : "0 Fcfa";
}); */

/* const tax = computed(() => {
    const subtotalValue = parseInt(subtotal.value.replace(" €", ""));
    return `${Math.round(subtotalValue * 0.2)} €`;
}); */

/*  const total = computed(() => {
    const subtotalValue = parseInt(subtotal.value.replace(" €", ""));
    const shippingValue = parseInt(
        shippingCost.value.replace(" €", "").replace(",", "."),
    );
    const taxValue = parseInt(tax.value.replace(" €", ""));
    return `${subtotalValue + shippingValue + taxValue} €`;
});  */

// Methods
const selectShippingMethod = (methodId) => {
    selectedShippingMethod.value = methodId;
};

const selectPaymentMethod = (methodId) => {
    selectedPaymentMethod.value = methodId;
};

const handleConfirmOrder = async (payload) => {
    //console.log('Token', auth.getToken())
    try {
        // Préparer les données dans le format attendu par l'API
        const dataToSend = {
            delivery_option:
                payload.selectedShippingMethod === "standard" ? "delivery" : "pickup",
            delivery_address: payload.shippingInfo.address,
            delivery_contact_name: payload.shippingInfo.contact,
            notes: payload.shippingInfo.notes || "",
            items: payload.cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        };

        //console.log("Données envoyées à l'API :", dataToSend);
        // Appel à l'API
        const response = await fetch(
            "https://demo-allobeaute.tikaplace.com/api/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.getToken()}`,
                },
                body: JSON.stringify(dataToSend),
            }
        );

        if (!response.ok) {
            throw new Error(`Erreur lors de l'enregistrement : ${response.status}`);
        }

        const result = await response.json();
        order_id.value = result.order.id;
        showPaymentMethod.value = true;
    } catch (error) {
        console.error("Erreur lors de la confirmation de commande :", error);
        toast.error(
            "Une erreur est survenue lors de l'enregistrement de la commande. Veuillez réessayer."
        );
    }
};

const handlePaymentInfo = async (paymentInfo) => {
    if (paymentInfo.phoneNumber.replace(/\s/g, '').length !== 9) {
        toast.error("Veuillez saisir un numéro de téléphone valide.");
        return;
    }
    isProcessingPayment.value = true;
   try {
    const { data, error } = await useFetch("https://demo-allobeaute.tikaplace.com/api/orders/payment/initiate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.getToken()}`,
        "Content-Type": "application/json",
      },
      body: {
        order_id: order_id.value,
        number: '237' + paymentInfo.phoneNumber,
        //payment_method: paymentInfo.paymentMethod,
      },
    }
    );
   console.log("Payment initiation response:", data.value);
    if (error.value) {
      throw error.value;
    }
    // vérification de la réponse
    if (data.value?.status === "success") {
      showPaymentModal.value = true;

      // Lancement du polling pour vérifier le statut
      const paymentId = data.value.data.payment.id;
      startPaymentStatusPolling(paymentId);
    } else {
      //throw new Error(data.value?.message || "Erreur lors de l'initiation du paiement");
    }
  } catch (err) {
    console.error("Payment error:", err);
    toast.error(err.message || "Erreur lors du traitement du paiement");
    isProcessingPayment.value = false;
  }
};

const startPaymentStatusPolling = (paymentId) => {
  // Arrêt d'un éventuel polling précédent
  if (paymentPollingInterval.value) {
    clearInterval(paymentPollingInterval.value);
  }
  paymentPollingInterval.value = setInterval(async () => {
    try {
      const { data } = await useFetch(
        `https://demo-allobeaute.tikaplace.com/api/payments/${paymentId}`,{
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.getToken()}`,
          },
        }
      );
      if (data.value?.data?.status === "success") {
        clearInterval(paymentPollingInterval.value);
        paymentStatus.value = "success";
        isProcessingPayment.value = false;
        toast.success("Paiement confirmé !");
        // Redirection ou autre action après succès
        navigateTo("/paiement/success");

      } else if (data.value?.data?.status === "failed") {
        clearInterval(paymentPollingInterval.value);
        paymentStatus.value = "failed";
        isProcessingPayment.value = false;
        showPaymentModal.value = false;
        toast.error("Paiement échoué - Veuillez réessayer");
      }
      // Sinon, le statut reste "initiated" et on continue le polling
    } catch (err) {
      console.error("Polling error:", err);
      clearInterval(paymentPollingInterval.value);
      isProcessingPayment.value = false;
    }
  }, 5000); // Vérification toutes les 5 secondes
};

onUnmounted(() => {
  if (paymentPollingInterval.value) {
    clearInterval(paymentPollingInterval.value);
  }
});
const showLoading = ref(false);
const showPaymentMethod = ref(false);
//const showConfirmationModal = ref(false);
const handlerLoading = () => {
    showLoading.value = true;
    setTimeout(() => {
        showPaymentMethod.value = false;
        showLoading.value = false;
    }, 3000);
};
</script>

<template>
    < class="min-h-screen bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-md fixed w-full top-0 z-50">
            <div class="container mx-auto px-6 py-3 flex justify-between items-center">
                <div class="flex items-center">
                    <a href="#" data-readdy="true" class="text-2xl font-bold text-slate-900 cursor-pointer">Allo Beauté
                        Panier</a>
                </div>
                <div class="flex items-center space-x-6">
                    <div class="relative cursor-pointer">
                        <i class="fas fa-user-circle text-xl text-gray-600"></i>
                    </div>
                </div>
            </div>
        </nav>
        <!-- Main Content -->
        <main class="container mx-auto px-6 pt-24 pb-12">
            <!-- Checkout Progress -->
            <div class="mb-10">
                <div class="flex justify-between items-center mb-2">
                    <h1 class="text-md md:text-2xl xl:text-3xl font-bold text-gray-800">
                        Finalisation de votre commande
                    </h1>
                    <NuxtLink to="/store" data-readdy="true"
                        class="text-slate-600 hover:text-slate-900 flex items-center cursor-pointer text-md lg:text-md xl:text-lg">
                        <i class="fas fa-arrow-left mr-2"></i> Retour au panier
                    </NuxtLink>
                </div>
                <div class="relative">
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div
                            class="progress-bar-animation w-3/4 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-900">
                        </div>
                    </div>
                    <div class="flex justify-between text-sm font-medium text-gray-500">
                        <div class="flex flex-col items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white mb-1">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <span>Panier</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white mb-1">
                                <i class="fas fa-truck"></i>
                            </div>
                            <span class="text-gray-500">Livraison</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white mb-1">
                                <i class="fas fa-credit-card"></i>
                            </div>
                            <span>Paiement</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white mb-1">
                                <i class="fas fa-check"></i>
                            </div>
                            <span>Confirmation</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Left Column - Forms -->
                <div class="w-full lg:w-2/3">
                    <DeliveryPaymentMethods :shipping-methods="shippingMethods" :payment-methods="paymentMethods"
                        :selected-shipping-method="selectedShippingMethod"
                        :selected-payment-method="selectedPaymentMethod" :payment-info="paymentInfo"
                        @select-shipping-method="selectShippingMethod" @select-payment-method="selectPaymentMethod" />

                    <!-- Affiche le formulaire d'adresse si la livraison à domicile est sélectionnée -->
                    <Transition name="fade" mode="out-in">
                        <DeliveryInformation v-if="selectedShippingMethod === 'standard'"
                            v-model:shipping-info="shippingInfo" />
                    </Transition>

                    <!-- Affiche la sélection du point de vente si cette option est sélectionnée 
                    <div v-else-if="selectedShippingMethod === 'relay'" class="mt-8 bg-white p-6 rounded-lg shadow-md">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Choisissez un point de vente</h2>
                        <p class="text-gray-600">Ici, vous pourriez implémenter une liste de points de vente ou une carte interactive pour que l'utilisateur puisse faire son choix.</p>
                         Exemple de liste de points de vente (à remplacer par des données réelles) 
                        <div class="space-y-4 mt-4">
                            <div v-for="i in 3" :key="i" class="border p-4 rounded-md hover:bg-gray-100 cursor-pointer">
                                <p class="font-bold">Point de Vente {{ i }}</p>
                                <p class="text-sm text-gray-500">Adresse du point de vente {{ i }}</p>
                            </div>
                        </div>
                    </div>-->
                </div>

                <!-- Right Column - Order Summary -->
                <div class="w-full lg:w-1/3">
                    <OrderSummary :cart="cart" :subtotal="productTotal"
                        :selected-shipping-method="selectedShippingMethod" v-model:promo-code="promoCode"
                        @confirm-order="handleConfirmOrder" :shipping-info="shippingInfo" />
                </div>
            </div>
        </main>
        <Trasition class="fade-in" appear>
            <PaymentMethodModal v-if="showPaymentMethod" @close="showPaymentMethod = false"
                @showLoading="handlerLoading" :showLoading="showLoading" @sendPaymentInfo="handlePaymentInfo" />
        </Trasition>
        <Trasition class="fade-in" appear>
            <PaymentModalUssd :isOpen="showPaymentModal" @close="showPaymentModal = false" />
        </Trasition>
        <!-- Footer -->
        <Footer />
</template>

<style scoped>
.progress-bar-animation {
    animation: progress 2s ease-in-out;
}

@keyframes progress {
    0% {
        width: 0%;
    }

    100% {
        width: 50%;
    }
}
</style>
