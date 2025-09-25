<script setup lang="ts">
import { ref } from "vue";
import { WandSparkles, Hand, Scissors, HandHeart, User, Brush, MoreHorizontal } from 'lucide-vue-next';
 // ou 'solid' selon le style voulu

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}
const categories = ref([
  { id: 1, name: "Soins du visage", icon: WandSparkles, count: 42 },
  { id: 2, name: "Massages", icon: Hand, count: 28 },
  { id: 3, name: "Épilation", icon: Scissors, count: 35 },
  { id: 4, name: "Onglerie", icon: HandHeart, count: 56 },
  { id: 5, name: "Coiffure", icon: User, count: 48 },
  { id: 6, name: "Maquillage", icon: Brush, count: 32 },
  { id: 7, name: "Barbier", icon: Scissors, count: 24 },
  { id: 8, name: "Autres", icon: MoreHorizontal, count: 18 },
]);

</script>

<template>
  <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        Nos Catégories de Services
      </h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Choisissez parmi nos différentes catégories de services de beauté
        proposés par des professionnels qualifiés.
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
      >
        <div class="p-6 text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gold text-white mb-4"
          >
          <component :is="category.icon" />
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            {{ category.name }}
          </h3>
          <p class="text-gold">{{ category.count }} prestataires</p>
        </div>
      </div>
    </div>
  </section>
</template>
