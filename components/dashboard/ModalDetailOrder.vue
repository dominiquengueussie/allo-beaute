<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { X, Loader2, Phone, Calendar, Truck, User, ShoppingBag, Hash, AlertTriangle, CreditCard, Tag, FileText } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
const toast = useToast();

// --- Props et Emits ---
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(['close', 'retry-payment', 'cancel-order', 'generate-invoice']);

// --- State ---
const phoneNumber = ref('');
const isRetryingPayment = ref(false);
const isCancelling = ref(false);

// --- Watchers ---
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    // Pré-remplir le numéro si disponible dans les données de la commande
    phoneNumber.value = newOrder.delivery_contact_phone || '';
  }
});

// --- Computed ---
const orderItems = computed(() => props.order?.order_items || []);

// --- Méthodes ---
const closeModal = () => {
  if (!isRetryingPayment.value && !isCancelling.value) {
    emit('close');
  }
};

const filterNumericInput = (event: Event) => {
  // Remplace tout ce qui n'est pas un chiffre par une chaîne vide
  phoneNumber.value = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
};

const handleRetryPayment = () => {
  // On vérifie que le numéro a exactement 9 chiffres (basé sur l'exemple)
  if (phoneNumber.value.trim().length !== 9) {
    toast.info('Veuillez saisir un numéro de téléphone valide à 9 chiffres.');
    return;
  }
  isRetryingPayment.value = true;
  emit('retry-payment', { orderId: props.order.id, phone: phoneNumber.value });
};

const handleCancelOrder = () => {
  isCancelling.value = true;
  emit('cancel-order', props.order.id);
};

const handleGenerateInvoice = () => {
  emit('generate-invoice', props.order.id);
};

// --- Fonctions utilitaires ---
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatPrice = (price: number | string) => {
  return `${Number(price).toLocaleString('fr-FR')} Fcfa`;
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { text: 'Confirmée', class: 'bg-green-100 text-green-800' };
    case 'pending':
      return { text: 'En attente', class: 'bg-yellow-100 text-yellow-800' };
    case 'cancelled':
      return { text: 'Annulée', class: 'bg-red-100 text-red-800' };
    case 'delivered':
      return { text: 'Livrée', class: 'bg-blue-100 text-blue-800' };
    default:
      return { text: status, class: 'bg-gray-100 text-gray-800' };
  }
};
</script>

<template>
  <Transition name="fade-scale">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="fixed inset-0 bg-black/60 transition-opacity" aria-hidden="true"></div>

      <div v-if="isLoading" class="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-64 flex items-center justify-center">
        <Loader2 class="w-12 h-12 text-gold animate-spin" />
      </div>

      <div v-else-if="order"
        class="bg-white rounded-xl shadow-2xl transform transition-all w-full max-w-2xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center p-5 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="bg-gray-100 p-2 rounded-lg">
              <Hash class="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Détails de la commande</h3>
              <p class="text-xs text-gray-500">ID: {{ order.id.substring(0, 8) }}...</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <!-- <div class="relative group">
              <button @click="handleGenerateInvoice" class="text-gray-500 hover:text-pink-600 p-2 rounded-full transition-colors">
                <FileText class="w-5 h-5" />
              </button>
              <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                Générer la facture
              </span>
            </div> -->
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Contenu -->
        <div class="p-6 space-y-6 overflow-y-auto">
          <!-- Infos générales -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="flex items-start gap-3"><User class="w-4 h-4 mt-0.5 text-gray-500" /><span>{{ order.delivery_contact_name || 'Client non spécifié' }}</span></div>
            <div class="flex items-start gap-3"><Calendar class="w-4 h-4 mt-0.5 text-gray-500" /><span>{{ formatDate(order.ordered_at) }}</span></div>
            <div class="flex items-start gap-3"><Truck class="w-4 h-4 mt-0.5 text-gray-500" /><span>{{ order.is_delivery ? 'Livraison' : 'Au point de vente' }}</span></div>
            <div v-if="order.payments && order.payments.length > 0" class="flex items-start gap-3">
              <CreditCard class="w-4 h-4 mt-0.5 text-gray-500" />
              <span>Paiement {{ getStatusInfo(order.status).text }} via {{ order.payments[0].operator }}</span>
            </div>
            <div class="flex items-start gap-3">
              <span :class="getStatusInfo(order.status).class" class="px-2 py-0.5 text-xs font-medium rounded-full">{{ getStatusInfo(order.status).text }}</span>
            </div>
          </div>

          <!-- Liste des produits -->
          <div>
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2"><ShoppingBag class="w-5 h-5 text-gray-500" />Produits commandés</h4>
            <ul class="space-y-4 border-t border-gray-200 pt-4">
              <li v-for="item in orderItems" :key="item.id" class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <img :src="item.product.media[0]?.preview || '/img/product-placeholder.jpg'" :alt="item.product.name" class="w-14 h-14 rounded-md object-cover">
                  <div>
                    <p class="font-medium text-gray-800">{{ item.product.name }}</p>
                    <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span class="flex items-center gap-1"><Tag class="w-3 h-3" />{{ item.product.category.name }}</span>
                      <span>|</span>
                      <span>Qté: {{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
                <p class="font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
              </li>
            </ul>
            <div class="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Sous-total:</span>
                <span class="font-medium">{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Taxes:</span>
                <span class="font-medium">{{ formatPrice(order.tax_amount) }}</span>
              </div>
              <div class="flex justify-between font-bold text-base mt-2">
                <span class="text-gray-800">Total:</span>
                <span class="text-gray-900">{{ formatPrice(order.total_amount) }}</span>
              </div>
            </div>
          </div>

          <!-- Section conditionnelle pour le statut "pending" -->
          <div v-if="order.status === 'pending' || order.status === 'cancelled'" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 class="font-semibold text-yellow-800 mb-3 flex items-center gap-2"><AlertTriangle class="w-5 h-5" />Action requise</h4>
            <div class="space-y-4">
              <div>
                <label for="phone-retry" class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone pour le paiement</label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" id="phone-retry" v-model="phoneNumber" @input="filterNumericInput" placeholder="Ex: 690123456" class="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold text-sm">
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <button @click="handleRetryPayment" :disabled="isRetryingPayment || isCancelling" class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50">
                  <Loader2 v-if="isRetryingPayment" class="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Relancer le paiement
                </button>
                <button v-if="order.status !== 'cancelled'" @click="handleCancelOrder" :disabled="isRetryingPayment || isCancelling" class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
                  <Loader2 v-if="isCancelling" class="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Annuler la commande
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease;
}
.fade-scale-enter-active .transform,
.fade-scale-leave-active .transform {
  transition: transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
}
.fade-scale-enter-from .transform,
.fade-scale-leave-to .transform {
  transform: scale(0.95) translateY(10px);
}
</style>