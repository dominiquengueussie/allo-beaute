<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import { ShoppingCart } from "lucide-vue-next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useToast } from "vue-toastification";
const toast = useToast();
const auth = useAuthStore();

// Récupération des produits depuis l'API
const { data: productsResponse } = await useFetch('https://demo-allobeaute.tikaplace.com/api/products');
const products = computed(() => productsResponse.value?.data.map(product => ({
    id: product.id,
    title: product.name,
    description: product.description || `${product.name} - ${product.category.name}`,
    overlayText: product.category.name,
    price: product.price,
    image: product.medias[0]?.preview || product.medias[0]?.link,
    stock: product.stock,
    stock_level: product.stock_level,
    partner: product.partner.name
})) || []);

// État pour le modal de détails
const selectedProduct = ref(null);
const showProductModal = ref(false);

// Fonction pour afficher les détails d'un produit
const showProductDetails = (product) => {
    selectedProduct.value = product;
    showProductModal.value = true;
};

const { addProduct } = useCart();
const addToCart = async (product) => {
     if (!auth.getToken()) {
        toast.info("Veuillez vous connecter pour commander.");
        navigateTo('/auth/login');
        return;
    }
    addProduct(product, true);
};
</script>

<template>
    <section
        class="bg-gray-50 py-12 max-w-[1400px] mx-auto mt-10 md:mt-10 sm:mt-20 lg:mt-10 rounded-xl shadow-sm border border-gray-100">
        <div class="max-w-[1300px] mx-auto px-2 sm:px-4 lg:px-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-1">
                Nos Produits Phares
            </h1>
            <p class="text-gray-600 mb-8 max-w-2xl">
                Découvrez notre sélection exclusive de produits de beauté pour sublimer
                votre routine
            </p>

            <Swiper :modules="[Navigation, Pagination]" :slides-per-view="1" :space-between="20" :breakpoints="{
                640: { slidesPerView: 1.3 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
            }" navigation pagination class="pb-12">
                <SwiperSlide v-for="product in products" :key="product.id"
                    class="bg-[#1f2937] hover:cursor-pointer rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl mb-10"
                   >
                    <div class="relative h-64"  @click="showProductDetails(product)">
                        <img :src="product.image" :alt="product.title" class="w-full h-full object-cover" />
                        <div
                            class="absolute inset-0 flex items-end p-4 product-overlay transition-opacity duration-300 opacity-0 hover:opacity-100 bg-gradient-to-t from-black/70 to-transparent">
                            <div class="w-full">
                                <p class="text-white text-sm font-medium">{{ product.overlayText }}</p>
                                <p class="text-white/80 text-xs mt-1">Par {{ product.partner }}</p>
                                <p class="text-emerald-400 text-xs mt-1 font-medium">{{ product.stock_level }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="mb-2"  @click="showProductDetails(product)">
                            <h3 class="font-semibold text-md text-[#fffff2]">
                                {{ product.title }}
                            </h3>
                            <p class="text-white text-sm mt-1"  @click="showProductDetails(product)">
                                {{ product.description ? (product.description.slice(0, 40) + '...') : 'Aucune description disponible' }}
                            </p>
                        </div>
                        <div class="flex items-center mt-2.5 mb-5">
                            <div class="flex items-center space-x-1 rtl:space-x-reverse">
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg class="w-4 h-4 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            </div>
                            <span
                                class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">5.0</span>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <span class="text-xl font-bold text-[#fffff2]">{{ product.price }} Fcfa</span>
                            <button @click="addToCart(product)"
                                class="bg-slate-950 hover:bg-gold text-white p-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                                :disabled="product.stock <= 0"
                                :class="{ 'opacity-50 cursor-not-allowed': product.stock <= 0 }">
                                <ShoppingCart class="w-4 h-4" />
                                <span>Ajouter</span>
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                <template #navigation>
                    <!--  <div class="swiper-button-prev custom-nav" />
                    <div class="swiper-button-next custom-nav" /> -->
                </template>
            </Swiper>
        </div>
    </section>

    <!-- Modal de détails du produit -->
    <Transition enter-from-class="opacity-0" 
                enter-active-class="transition ease-out duration-300"
                enter-to-class="opacity-100" 
                leave-from-class="opacity-100"
                leave-active-class="transition ease-in duration-200" 
                leave-to-class="opacity-0">
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
                                <img :src="selectedProduct.image" :alt="selectedProduct.title"
                                    class="w-full h-full object-cover" />
                            </div>

                            <!-- Informations du produit -->
                            <div class="flex flex-col">
                                <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct.title }}</h2>
                                <p class="text-sm text-gray-500 mt-2">Par {{ selectedProduct.partner }}</p>

                                <div class="flex items-center mt-4">
                                    <span
                                        class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {{ selectedProduct.overlayText }}
                                    </span>
                                    <span class="ml-2 text-sm text-emerald-600 font-medium">
                                        {{ selectedProduct.stock_level }}
                                    </span>
                                </div>

                                <div class="mt-6">
                                    <h3 class="text-sm font-medium text-gray-900">Description</h3>
                                    <p class="mt-2 text-gray-600">
                                        {{ selectedProduct.description }}
                                    </p>
                                </div>

                                <div class="mt-8 flex items-center justify-between">
                                    <span class="text-2xl font-bold text-slate-900">
                                        {{ selectedProduct.price }} Fcfa
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
.custom-nav {
    background-color: rgba(255, 255, 255, 0.8);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #6b46c1;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.custom-nav:hover {
    background-color: #6b46c1;
    color: white;
    transform: scale(1.1);
}

.swiper-pagination-bullet {
    background: #cbd5e0;
    opacity: 1;
}

.swiper-pagination-bullet-active {
    background: #6b46c1;
    transform: scale(1.2);
}
</style>
