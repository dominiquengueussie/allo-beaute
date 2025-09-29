<script setup>
import { useToast } from 'vue-toastification';
const toast = useToast();
const auth = useAuthStore();
import { ref } from 'vue'
import { Flame, Menu, Cookie, Droplet, Search, User, Brush, Sparkles, Heart, Sun, Droplets, ShoppingCart } from 'lucide-vue-next'
import { NuxtLink } from '#components';
const isSidebarOpen = ref(false)
const cartBounce = ref(false)
const { productCount } = useCart()
const toggleCategories = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

function handleCartClick() {
    cartBounce.value = true
    setTimeout(() => {
        cartBounce.value = false
    }, 1000)
}

function handleMenuClick() {
    alert('Menu mobile ouvert!')
}

const searchQuery = ref('');
const isSearching = ref(false);
const searchResults = ref([]);
const searchActive = ref(false); // Nouvel état pour suivre si une recherche est active

// Computed property pour vérifier si le bouton de recherche doit être désactivé
const isSearchDisabled = computed(() => {
    return isSearching.value || !searchQuery.value.trim();
});

async function resetSearch() {
    searchQuery.value = '';
    searchActive.value = false; // Réinitialiser l'état de la recherche
    products.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    await loadMoreProducts();
}

async function handleSearchClick() {
    if (!searchQuery.value.trim()) {
        toast.warning('Veuillez saisir un terme de recherche');
        return;
    }

    searchActive.value = true; // Activer l'état de recherche
    isSearching.value = true;
    products.value = []; // Vider les produits actuels

    try {
        const { data: response } = await useFetch(`https://demo-allobeaute.tikaplace.com/api/products/search?q=${encodeURIComponent(searchQuery.value)}`);

        if (response.value?.data) {
            const searchProducts = response.value.data.map(formatProduct);
            products.value = searchProducts;
            hasMore.value = false; // Désactiver le bouton "Afficher plus" pendant la recherche
        }
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        toast.error('Erreur lors de la recherche des produits.');
    } finally {
        isSearching.value = false;
    }
}

const { openProductCart } = useUIState();

const toggleProductCart = () => {
    openProductCart();
};

// État pour la pagination et les produits
const currentPage = ref(1);
const productsPerPage = 10;
const products = ref([]);
const isLoading = ref(false);
const hasMore = ref(true);
const { addProduct } = useCart();

// État pour le modal de détails
const selectedProduct = ref(null);
const showProductModal = ref(false);

// Fonction pour afficher les détails d'un produit
const showProductDetails = (product) => {
    selectedProduct.value = product;
    showProductModal.value = true;
};

// Fonction pour formater les données des produits
const formatProduct = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description || `${product.name} - ${product.category.name}`,
    category: product.category.name,
    price: product.price,
    image: product.medias[0]?.preview || product.medias[0]?.link,
    stock: product.stock,
    stock_level: product.stock_level,
    partner: product.partner.name
});

// Fonction pour charger plus de produits
const loadMoreProducts = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
        const { data: response } = await useFetch(`https://demo-allobeaute.tikaplace.com/api/products?page=${currentPage.value}&per_page=${productsPerPage}`);

        if (response.value) {
            const newProducts = response.value.data.map(formatProduct);
            products.value = [...products.value, ...newProducts];

            // Vérifier s'il y a plus de produits à charger
            hasMore.value = response.value.meta.current_page < response.value.meta.last_page;
            currentPage.value++;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        toast.error('Erreur lors du chargement des produits.');
    } finally {
        isLoading.value = false;
    }
};

// Fonction pour ajouter au panier
const addToCart = (product) => {
      if (!auth.getToken()) {
        toast.info("Veuillez vous connecter pour commander.");
        navigateTo('/auth/login');
        return;
    }
    addProduct(product, true);
};

// Charger les premiers produits au montage
onMounted(() => {
    loadMoreProducts();
});
</script>

<template>
    <header class="w-full shadow-lg">
        <!-- Bandeau promo -->
        <div
            class="flex justify-between items-center mx-auto max-w-7xl bg-white px-4 py-2 text-sm font-semibold border-b border-gray-200">
            <span class="text-gold text-2xl pulse-animation">Commandez maintenant !</span>
            <div
                class="bg-gold text-slate-900 px-3 py-1 rounded hover:bg-gray-800 transition duration-300 cursor-pointer">
                Commandez par appel au <span class="font-bold text-xl">233 50 73 00</span>
            </div>
        </div>
        <!-- Zone principale du header -->
        <div
            class="bg-[#0a1f44] text-white flex flex-wrap items-center justify-between px-5 py-3 sm:px-6 md:px-8 lg:px-28 gap-3">
            <!-- Menu burger + logo -->
            <div class="flex items-center gap-2 sm:gap-4 order-1">
                <button @click="toggleCategories" class="hover:text-yellow-400 transition duration-200 lg:hidden">
                    <Menu class="w-6 h-6" />
                </button>
                <div
                    class="text-[#fbd964] font-bold flex items-center gap-1 cursor-pointer hover:text-yellow-300 transition duration-200">
                    <Menu class="w-6 h-6 hidden md:block" @click="toggleCategories" />
                    <NuxtLink to="/">
                        <img class="h-8 w-auto sm:h-9 md:h-10" src="/img/logo.png" alt="Logo">
                    </NuxtLink>
                </div>
            </div>

            <!-- Barre de recherche - prend toute la largeur sur mobile -->
            <div class="w-full order-3 md:order-2 md:flex-1 md:mx-4 mt-2 md:mt-0">
                <div class="relative">
                    <input type="text" v-model="searchQuery" placeholder="Que cherchez-vous ?"
                        @keyup.enter="handleSearchClick"
                        class="w-full rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:bg-gold transition duration-200 text-sm sm:text-base" />
                    <button @click="handleSearchClick" :disabled="isSearchDisabled"
                        class="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                        <span v-if="isSearching" class="flex items-center justify-center">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </span>
                        <Search v-else class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Actions utilisateur -->
            <div class="flex items-center gap-2 sm:gap-4 order-2 md:order-3">
                <button @click="handleSearchClick" :disabled="isSearchDisabled"
                    class="bg-gold text-slate-900 px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-yellow-500 transition duration-200 md:flex hidden text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed items-center">
                    <span v-if="isSearching" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Recherche...
                    </span>
                    <span v-else>Rechercher</span>
                </button>

               <!--  <select
                    class="bg-[#0a1f44] border border-white rounded-md px-2 py-1 hover:bg-[#efb533] transition duration-200 cursor-pointer text-xs sm:text-sm">
                    <option>FR</option>
                    <option>EN</option>
                </select> -->

                <NuxtLink to="/dashboard/settings" class="flex items-center gap-1 cursor-pointer hover:text-yellow-300 transition duration-200">
                    <User class="w-4 h-4 sm:w-5 sm:h-5" />
                    <span class="hidden sm:inline text-xs sm:text-sm">Mon Compte</span>
                </NuxtLink>

                <div @click="toggleProductCart"
                    class="relative cursor-pointer hover:text-yellow-300 transition duration-200">
                    <ShoppingCart :class="['text-lg sm:text-xl', cartBounce ? 'animate-bounce' : '']" />
                    <span
                        class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{
                        productCount }}</span>
                </div>
            </div>
        </div>


        <!-- Barre de navigation -->
        <nav
            class="bg-[#0a1f44] text-white text-sm px-4 py-2 flex justify-center gap-6 overflow-x-auto whitespace-nowrap scroll-smooth custom-scroll">
            <a href="#" class="hover:text-yellow-300 font-semibold transition duration-200 flex items-center gap-1">
                <Flame class="w-4 h-4 text-[#efb533]" /> PROMO Beauté
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Droplet class="w-4 h-4 text-[#efb533]" /> Soins de la peau
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Brush class="w-4 h-4 text-[#efb533]" /> Maquillage
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Sparkles class="w-4 h-4 text-[#efb533]" /> Parfums
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Heart class="w-4 h-4 text-[#efb533]" /> Soins du corps
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Sun class="w-4 h-4 text-[#efb533]" /> Protection solaire
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Droplets class="w-4 h-4 text-[#efb533]" /> Soins capillaires
            </a>
            <a href="#" class="flex items-center gap-1 hover:text-yellow-300 transition duration-200">
                <Cookie class="w-4 h-4 text-[#efb533]" /> Accessoires Beauté
            </a>
        </nav>
    </header>
    <ProductCart />
    <BannerSlider />
    <ProductsCarousel v-if="!searchActive" />
    <Pub1 v-if="!searchActive" />
    <!-- Section Produits -->
    <section
        class="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-white mt-10 md:mt-10 sm:mt-20 lg:mt-10 rounded-xl shadow-sm border border-gray-100">
        <div class="mb-8">
            <h3 class="text-2xl font-bold text-gray-800">
                {{ searchQuery ? `Résultats pour "${searchQuery}"` : 'Cosmétiques' }}
            </h3>
            <p class="text-gray-600 mt-2" v-if="!searchQuery">
                Découvrez toute une variété de produits disponibles chez nous.
            </p>
            <p class="text-gray-600 mt-2" v-else>
                {{ products.length }} produit(s) trouvé(s)
                <button @click="resetSearch" class="ml-2 text-purple-600 hover:text-purple-800 underline text-sm">
                    Réinitialiser la recherche
                </button>
            </p>
        </div>

        <!-- Grille de produits -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="product in products" :key="product.id"
                class="bg-white hover:cursor-pointer rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div class="relative aspect-square" @click="showProductDetails(product)">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                    <div
                        class="absolute inset-0 flex items-end p-4 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-gradient-to-t from-black/70 to-transparent">
                        <div class="w-full">
                            <p class="text-white text-sm font-medium">{{ product.category }}</p>
                            <p class="text-white/80 text-xs mt-1">Par {{ product.partner }}</p>
                            <p :class="product.stock_level === 'En stock' ? 'text-green-400' : 'text-red-400'">{{ product.stock_level }}</p>
                        </div>
                    </div>
                </div>

                <div class="p-4">
                    <h4 class="font-semibold text-lg text-gray-900 line-clamp-1" @click="showProductDetails(product)">{{ product.name }}</h4>
                    <p class="text-gray-600 text-sm mt-1 line-clamp-2">
                        {{ product.description }}
                    </p>
                    <div class="flex items-center mt-2.5 mb-5">
                        <div class="flex items-center space-x-1 rtl:space-x-reverse">
                            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 22 20">
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
                        <span class="text-xl font-bold text-slate-900">{{ product.price }} Fcfa</span>
                        <button @click="addToCart(product)" v-if="product.stock_level === 'En stock'"
                            class="bg-slate-900 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                            :disabled="product.stock <= 0"
                            :class="{ 'opacity-50 cursor-not-allowed': product.stock <= 0 }">
                            <ShoppingCart class="w-4 h-4" />
                            <span>Ajouter</span>
                        </button>
                        <div v-else class="text-red-400 font-medium">Rupture de stock</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bouton Afficher plus -->
        <div v-if="hasMore" class="mt-8 flex justify-center">
            <button @click="loadMoreProducts"
                class="bg-slate-600 text-gold font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 flex items-center gap-2"
                :disabled="isLoading">
                <span v-if="isLoading">Chargement...</span>
                <span v-else>Afficher plus</span>
            </button>
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
                                    <img :src="selectedProduct.image" :alt="selectedProduct.name"
                                        class="w-full h-full object-cover" />
                                </div>

                                <!-- Informations du produit -->
                                <div class="flex flex-col">
                                    <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct.name }}</h2>
                                    <p class="text-sm text-gray-500 mt-2">Par {{ selectedProduct.partner }}</p>

                                    <div class="flex items-center mt-4">
                                        <span
                                            class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {{ selectedProduct.category }}
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
    </section>
</template>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>