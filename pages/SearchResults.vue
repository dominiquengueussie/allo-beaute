<script setup>
import { ShoppingCart, Star, BadgeCheck, Clock } from 'lucide-vue-next';
import { useSearchStore } from '~/stores/search';
import { useToast } from 'vue-toastification';
const toast = useToast();
const searchStore = useSearchStore();
const auth = useAuthStore();

// Utilisation des getters pour avoir des listes séparées
const services = computed(() => searchStore.services);
const products = computed(() => searchStore.products);

// --- Logique pour le modal et le panier ---
const { addProduct } = useCart();
const selectedProduct = ref(null);
const showProductModal = ref(false);

const handleAddToCart = (product) => {
    if (!auth.getToken()) {
        toast.info("Veuillez vous connecter pour commander.");
        navigateTo('/auth/login');
        return;
    }
    const formattedProduct = {
        ...product,
        title: product.name, // Créer la propriété 'title' à partir de 'name'
        image: product.medias?.[0]?.preview || '/img/product-placeholder.jpg'
    };
    addProduct(formattedProduct, true); // Appel du composable useCart
};

const showProductDetails = (product) => {
    // Affiche le modal avec les détails du produit sélectionné
    selectedProduct.value = product;
    showProductModal.value = true;
};

const handleBookService = (serviceId) => {
    navigateTo(`/prestataires/${serviceId}`);
};
</script>

<template>
    <div class="container mx-auto px-4 py-12">
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-serif">
                Résultats pour "<span class="text-gold">{{ searchStore.searchQuery }}</span>"
            </h2>
            <button @click="searchStore.clearSearch()" class="text-sm text-gray-600 hover:text-red-500">
                Effacer la recherche
            </button>
        </div>

        <div v-if="searchStore.loading" class="text-center py-10">
            <p>Recherche en cours...</p>
        </div>

        <div v-else-if="searchStore.error" class="text-center py-10 text-red-500">
            <p>{{ searchStore.error }}</p>
        </div>

        <div v-else-if="searchStore.results.length === 0" class="text-center py-10">
            <p>Aucun résultat trouvé.</p>
        </div>

        <div v-else class="space-y-12">
            <!-- Section des Services -->
            <div v-if="services.length > 0">
                <h3 class="text-2xl font-serif mb-4 border-b pb-2">Services</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="service in services" :key="service.id"
                        class="bg-slate-900 rounded-xl shadow-md overflow-hidden w-full max-w-sm">
                        <div class="relative h-48 bg-gray-200">
                            <img :src="service.medias[0]?.link || '/placeholder-image.jpg'" :alt="service.name"
                                class="w-full h-48 object-cover" />
                            <div class="absolute top-4 left-4">
                                <span v-if="service.enterprise?.is_verified"
                                    class="bg-white/90 text-blue-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <span
                                        class="text-white bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                        <BadgeCheck />
                                    </span>
                                    Vérifié
                                </span>
                            </div>

                            <div class="absolute top-4 right-4 flex items-center gap-2">
                                <span v-if="service.is_premium"
                                    class="bg-premium text-white bg-[#d79516] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                    <Star class="h-4 w-4" /> PREMIUM
                                </span>
                            </div>

                            <div
                                class="absolute bottom-4 right-4 bg-gray-500 opacity-80 px-3 py-1 rounded-full flex items-center gap-1">
                                <span class="text-[#d79516]">
                                    <Star class="h-4 w-4" />
                                </span>
                                <span class="font-bold text-white">4.9</span>
                                <span class="text-white">(150)</span>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="flex items-center justify-start text-[16px]">
                                <img :alt="service.enterprise.name" class="w-10 h-10 rounded-full object-cover mr-2"
                                    :src="service.medias[0]?.link || '/placeholder-image.jpg'" />
                                <h4 class="font-semibold text-white">{{ service.enterprise.name.slice(0, 10) + "..." }}
                                </h4>
                            </div>

                            <div class="flex items-center justify-between mt-3 text-[13px]">
                                <h4 class="font-semibold text-white text-[13px]">{{ service.name.slice(0, 25) + "..." }}
                                </h4>
                                <div class="flex items-center text-sm text-gold">
                                    <Clock class="h-4 w-4 mr-1" />
                                    {{ service.duration }} min
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-3">
                                <span class="text-sm px-2 py-1 rounded-full" :class="service.served_at_home
                                    ? 'bg-gray-700 text-gold'
                                    : 'bg-gray-700 text-gold'
                                    ">
                                    {{
                                        service.served_at_home ? "À domicile" : "En institut"
                                    }}
                                </span>
                                <span class="font-bold text-gold text-sm">{{ service.price }} Fcfa</span>
                            </div>

                            <button @click="handleBookService(service.id)"
                                class="w-full mt-6 bg-gold text-slate-900 py-3 rounded-lg font-medium hover:bg-premium/90 transition-colors">
                                Voir les détails
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section des Produits -->
            <div v-if="products.length > 0">
                <h3 class="text-2xl font-serif mb-4 border-b pb-2">Produits</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="product in products" :key="product.id"
                        class="bg-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:cursor-pointer transition duration-300 service-card relative group">
                        <!-- Badge stock -->
                        <div v-if="product.stock_level === 'En stock'"
                            class="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            EN STOCK
                        </div>

                        <!-- Conteneur de l'image avec overlay -->
                        <div class="relative group/image" @click="showProductDetails(product)">
                            <!-- Image principale -->
                            <img :src="product.medias?.[0]?.preview || '/img/product-placeholder.jpg'"
                                :alt="product.name" class="w-full h-48 object-cover" />

                            <!-- Info-bulle au survol de l'image -->
                            <div
                                class="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                                <div class="text-white text-center space-y-3">
                                    <!-- Catégorie -->
                                    <div v-if="product.category">
                                        <p class="text-sm font-medium">{{ product.category.name }}</p>
                                    </div>

                                    <!-- Entreprise -->
                                    <div v-if="product.partner">
                                        <p class="text-sm font-medium">{{ product.partner.name }}</p>
                                    </div>

                                    <!-- État du stock -->
                                    <div>
                                        <p class="text-sm font-medium" :class="{
                                            'text-green-400': product.stock_level === 'En stock',
                                            'text-red-400': product.stock_level !== 'En stock'
                                        }">
                                            {{ product.stock_level }}
                                            <span v-if="product.stock_level === 'En stock'" class="text-xs">({{
                                                product.stock }}
                                                unités)</span>
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
                                    <svg v-for="i in 4" :key="i" class="w-3 h-3 text-yellow-300" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
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
                                <span class="text-gold font-bold">{{ Number(product.price).toLocaleString() }}
                                    Fcfa</span>
                                <button @click="handleAddToCart(product)"
                                    class="text-slate-900 hover:text-white bg-gold hover:bg-yellow-golden transition-colors duration-200 p-2 rounded-full"
                                    aria-label="Ajouter au panier">
                                    <ShoppingCart class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
                                    <img :src="selectedProduct.medias?.[0]?.preview || '/img/product-placeholder.jpg'"
                                        :alt="selectedProduct.name" class="w-full h-full object-cover" />
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
                                        <button @click="handleAddToCart(selectedProduct)"
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
    </div>
</template>