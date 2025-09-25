<script setup lang="ts">
import { ref } from "vue";
import { ChevronRight, ShoppingCart } from "lucide-vue-next";
interface Services {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew: boolean;
  discount?: number; // Optionnel pour les produits non soldés
}

const newServices = ref<Services[]>([
  {
    id: 1,
    name: "Soin du visage",
    brand: "La Roche-Posay",
    price: 29.9,
    image:
      "https://img.freepik.com/free-photo/beautiful-women-doing-self-care-treatment-home_23-2149007153.jpg?uid=R77743068&ga=GA1.1.2132251005.1744087486&semt=ais_country_boost&w=740",
    isNew: true,
    discount: 10,
  },
]);

const reserveService = (productId: number): void => {
  console.log("Réservation pour le produit avec ID:", productId);
  // Logique de réservation
};
</script>

<template>
  <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Nouveaux Services</h2>
        <p class="text-gray-600">Découvrez les derniers services offerts</p>
      </div>
      <a
        href="#"
        class="text-slate-900 hover:text-gold font-medium flex items-center"
      >
        Voir tout <ChevronRight />
      </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="product in newServices"
        :key="product.id"
        class="bg-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 service-card relative"
      >
        <!-- Badge "NOUVEAU" -->
        <div
          v-if="product.isNew"
          class="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
        >
          NOUVEAU
        </div>

        <!-- Badge de réduction -->
        <div
          v-if="product.discount"
          class="absolute top-4 left-4 bg-slate-900 text-gold text-xs font-bold px-2 py-1 rounded-full"
        >
          {{ product.discount }}% OFF
        </div>

        <!-- Image du produit -->
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-48 object-cover"
        />

        <!-- Détails du produit -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-white mb-1">
            {{ product.name }}
          </h3>
          <p class="text-white text-sm mb-2 flex items-center justify-start">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-10 w-10 object-cover rounded-full mr-2"
            />
            {{ product.brand }}
          </p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-gold font-bold">{{ product.price }} Fcfa</span>
            <span v-if="product.discount" class="line-through text-gray-500">
              {{ (product.price * (1 - product.discount / 100)).toFixed(2) }} Fcfa
            </span>
          </div>

          <!-- Bouton de réservation -->
          <button
            class="w-full py-2 bg-gold text-slate-900 rounded-md hover:bg-yellow-golden transition duration-300"
            @click="reserveService(product.id)"
          >
            Réserver ce service
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>
