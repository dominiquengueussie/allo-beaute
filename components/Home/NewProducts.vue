<script setup>
import { ref, onMounted } from "vue";
import { ChevronRight, ShoppingCart } from "lucide-vue-next";
import { useToast } from "vue-toastification";
const toast = useToast();
const auth = useAuthStore();

const newProducts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);
const showProductModal = ref(false);

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch(
      "https://demo-allobeaute.tikaplace.com/api/products"
    );
    newProducts.value = response.data;
    //console.log("Produits chargés:", newProducts.value);
  } catch (e) {
    error.value = "Erreur lors du chargement des produits";
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
    image: product.medias[0]?.preview || '/img/product-placeholder.jpg' // S'assurer que l'image est au bon format
  };
  addProduct(formattedProduct, true);
};

const showProductDetails = (product) => {
    selectedProduct.value = product;
    showProductModal.value = true;
};

</script>

<template>
  <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Nouveaux Produits</h2>
        <p class="text-gray-600">Découvrez nos dernières arrivées</p>
      </div>
      <NuxtLink to="/store" class="text-slate-900 hover:text-gold font-medium flex items-center">
        Voir tout
        <ChevronRight />
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <div class="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="product in newProducts" :key="product.id"
        class="bg-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:cursor-pointer transition duration-300 service-card relative group">
        <!-- Badge stock -->
        <div v-if="product.stock_level === 'En stock'"
          class="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          EN STOCK
        </div>

        <!-- Conteneur de l'image avec overlay -->
        <div class="relative group/image" @click="showProductDetails(product)">
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

        <!-- Informations du produit -->
        <div class="p-4">
          <h3 class="text-md font-semibold text-white mb-1" @click="showProductDetails(product)">
            {{ product.name }}
          </h3>
          <p class="text-white text-sm mb-2">{{ product.description ? product.description : 'Aucune description disponible' }}</p>
          <div class="flex items-center mt-2.5 mb-5 text-[10px]">
            <div class="flex items-center space-x-1 rtl:space-x-reverse">
              <svg class="w-3 h-3 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 22 20">
                <path
                  d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg class="w-3 h-3 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 22 20">
                <path
                  d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg class="w-3 h-3 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 22 20">
                <path
                  d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg class="w-3 h-3 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 22 20">
                <path
                  d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg class="w-3 h-3 text-gray-200 dark:text-gray-600" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path
                  d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            </div>
            <span
              class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">5.0</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gold font-bold">{{ Number(product.price).toLocaleString() }} Fcfa</span>
            <button @click="addToCart(product)"
              class="text-slate-900 hover:text-white bg-gold hover:bg-yellow-golden transition-colors duration-200 p-2 rounded-full"
              aria-label="Ajouter au panier">
              <ShoppingCart class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>


   <!-- Modal de détails du produit -->
        <Transition enter-from-class="opacity-0" enter-active-class="transition ease-out duration-300"
            enter-to-class="opacity-100" leave-from-class="opacity-100"
            leave-active-class="transition ease-in duration-200" leave-to-class="opacity-0">
            <div v-if="showProductModal && selectedProduct"
                class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                @click="showProductModal = false">
                <Transition enter-from-class="opacity-0 translate-y-4 scale-95"
                    enter-active-class="transform transition ease-out duration-300"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-active-class="transform transition ease-in duration-200"
                    leave-to-class="opacity-0 translate-y-4 scale-95">
                    <div v-if="showProductModal"
                        class="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        @click.stop>
                        <div class="relative">
                            <button @click="showProductModal = false"
                                class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                                <!-- Image du produit -->
                                <div class="aspect-square rounded-lg overflow-hidden">
                                    <img :src="selectedProduct.medias[0]?.preview || '/img/product-placeholder.jpg'" 
                                         :alt="selectedProduct.name"
                                        class="w-full h-full object-cover" />
                                </div>

                                <!-- Informations du produit -->
                                <div class="flex flex-col">
                                    <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct.name }}</h2>
                                    <p class="text-sm text-gray-500 mt-2">Par {{ selectedProduct.partner.name }}</p>

                                    <div class="flex items-center mt-4">
                                        <span
                                            class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
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
