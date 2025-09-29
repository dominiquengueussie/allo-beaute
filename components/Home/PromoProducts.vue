<script setup>
import { ref, onMounted } from 'vue';
import { ChevronRight, ShoppingCart } from 'lucide-vue-next';
import { useToast } from "vue-toastification";
const toast = useToast();
const auth = useAuthStore();

const promoProducts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);
const showProductModal = ref(false);

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch(
      "https://demo-allobeaute.tikaplace.com/api/products/featured"
    );
    promoProducts.value = response.data.products; // Correction ici pour accéder au tableau products
    //console.log("Produits en promotion chargés:", promoProducts.value);
  } catch (e) {
    error.value = "Erreur lors du chargement des produits en promotion";
    console.error("Erreur:", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});

const { addProduct } = useCart();

const addToCart = async (product) => {
    if (!auth.getToken()) {
        toast.info("Veuillez vous connecter pour commander.");
        navigateTo('/auth/login');
        return;
    }
  // Formater le produit pour le panier
  const formattedProduct = {
    ...product,
    image: product.medias[0]?.preview || '/img/product-placeholder.jpg'
  };
  //console.log("Produit ajouté:", formattedProduct);
  addProduct(formattedProduct, true);
};

const showProductDetails = (product) => {
  selectedProduct.value = product;
  showProductModal.value = true;
};

</script>

<template>
  <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gradient-bg">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Produits Populaire </h2>
        <p class="text-gray-600">Profitez de nos offres spéciales</p>
      </div>
      <NuxtLink to="/store" class="text-slate-900 hover:text-gold font-medium flex items-center">
        Voir tout <ChevronRight /></NuxtLink>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <div class="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="product in promoProducts" :key="product.id"
        class="bg-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 service-card relative group">
        <!-- Badge stock -->
        <div v-if="product.stock_level === 'En stock'"
          class="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          EN STOCK
        </div>

        <!-- Conteneur de l'image avec overlay -->
        <div class="relative group/image hover:cursor-pointer" @click="showProductDetails(product)">
          <!-- Image principale -->
          <img :src="product.medias[0]?.preview || '/img/product-placeholder.jpg'" :alt="product.name"
            class="w-full h-48 object-cover" />

          <!-- Info-bulle au survol de l'image -->
          <div
            class="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
            <div class="text-white text-center space-y-3">
              <!-- Catégorie -->
              <div>
                <p class="text-sm font-medium">{{ product.category.name }}</p>
              </div>

              <!-- Entreprise -->
              <div>
                <p class="text-sm font-medium">{{ product.partner.name }}</p>
              </div>

              <!-- État du stock -->
              <div>
                <p class="text-sm font-medium" :class="{
                  'text-green-400': product.stock_level === 'En stock',
                  'text-red-400': product.stock_level !== 'En stock'
                }">
                  {{ product.stock_level }}
                  <span v-if="product.stock_level === 'En stock'" class="text-xs">({{ product.stock }} unités)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-lg font-semibold text-white mb-1 hover:cursor-pointer" @click="showProductDetails(product)">
            {{ product.name }}
          </h3>
          <p class="text-white text-sm mb-2 hover:cursor-pointer">{{ product.description || 'Aucune description disponible' }}</p>
          
          <!-- Prix -->
          <div class="flex items-center mt-2">
            <span class="text-gold font-bold text-xl">{{ Number(product.price).toLocaleString() }} Fcfa</span>
          </div>
          
          <!-- Bouton d'ajout au panier -->
          <button @click="addToCart(product)" v-if="product.stock_level === 'En stock'"
            class="mt-4 w-full flex items-center justify-center gap-2 bg-gold hover:bg-yellow-golden text-slate-900 py-2 px-4 rounded-lg transition-colors duration-200">
            <ShoppingCart class="w-4 h-4" />
            <span>Ajouter au panier</span>
          </button>
          <span v-else class="mt-4 text-red-500 font-medium text-sm">
            Rupture de stock
        </span>
      </div>
    </div>
  </section>

  <!-- Modal de détails du produit -->
  <Transition enter-from-class="opacity-0" enter-active-class="transition ease-out duration-300"
    enter-to-class="opacity-100" leave-from-class="opacity-100" leave-active-class="transition ease-in duration-200"
    leave-to-class="opacity-0">
    <div v-if="showProductModal && selectedProduct"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="showProductModal = false">
      <Transition enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-active-class="transform transition ease-out duration-300" enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-from-class="opacity-100 translate-y-0 scale-100" leave-active-class="transform transition ease-in duration-200"
        leave-to-class="opacity-0 translate-y-4 scale-95">
        <div v-if="showProductModal" class="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop>
          <div class="relative">
            <button @click="showProductModal = false"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <!-- Image du produit -->
              <div class="aspect-square rounded-lg overflow-hidden">
                <img :src="selectedProduct.medias[0]?.preview || '/img/product-placeholder.jpg'"
                  :alt="selectedProduct.name" class="w-full h-full object-cover" />
              </div>

              <!-- Informations du produit -->
              <div class="flex flex-col">
                <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct.name }}</h2>
                <p class="text-sm text-gray-500 mt-2">Par {{ selectedProduct.partner.name }}</p>

                <div class="flex items-center mt-4">
                  <span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ selectedProduct.category.name }}
                  </span>
                  <span class="ml-2 text-sm text-emerald-600 font-medium">
                    {{ selectedProduct.stock_level }}
                  </span>
                </div>

                <div class="mt-6">
                  <h3 class="text-sm font-medium text-gray-900">Description</h3>
                  <p class="mt-2 text-gray-600">
                    {{ selectedProduct.description || 'Aucune description disponible' }}
                  </p>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <span class="text-2xl font-bold text-slate-900">
                    {{ Number(selectedProduct.price).toLocaleString() }} Fcfa
                  </span>
                  <button @click="addToCart(selectedProduct)"
                    class="bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    :disabled="selectedProduct.stock <= 0"
                    :class="{ 'opacity-50 cursor-not-allowed': selectedProduct.stock <= 0 }">
                    <ShoppingCart class="w-5 h-5" />
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>