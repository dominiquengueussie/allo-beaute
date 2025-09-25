<script setup lang="ts">
import { ref } from "vue";
import { ChevronRight, ShoppingCart } from "lucide-vue-next";
interface Product {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    isNew: boolean;
}

const newProducts = ref<Product[]>([
    {
        id: 1,
        title: "Sérum Éclat",
        description: "La Roche-Posay",
        price: "29.9",
        image:"https://img.freepik.com/photos-gratuite/portrait-femme-appliquant-maquillage-pinceau-maquillage_23-2149206649.jpg?ga=GA1.1.1906610707.1745044508&semt=ais_hybrid&w=740",
        isNew: true,
    },
    {
        id: 2,
        title: "Masque Hydratant",
        description: "Caudalie",
        price: "24.5",
        image:
"https://img.freepik.com/photos-gratuite/close-up-collection-produits-maquillage-beaute_23-2148620012.jpg?ga=GA1.1.1906610707.1745044508&semt=ais_hybrid&w=740",        isNew: true,
    },
    {
        id: 3,
        title: "Gel Douche Relaxant",
        description: "L'Occitane",
        price: "18.9",
        image:
"https://img.freepik.com/photos-gratuite/belle-femme-africaine-se-sentant-reconnaissante_181624-46352.jpg?ga=GA1.1.1906610707.1745044508&semt=ais_hybrid&w=740",        isNew: false,
    },
    {
        id: 4,
        title: "Crème Mains",
        description: "Nuxe",
        price: "12.9",
        image:
"https://img.freepik.com/photos-premium/femme-s-applique-du-maquillage-pinceau_1126821-5098.jpg?ga=GA1.1.1906610707.1745044508&semt=ais_hybrid&w=740",        isNew: true,
    },
]);

const { addProduct } = useCart();

const addToCart = async (product: Product) => {
  console.log("Produit ajouté:", product);
  addProduct(product, true);
};
</script>

<template>
    <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-3xl font-bold text-gray-800">Maquillage</h2>
                <p class="text-gray-600">Découvrez nos produits de maquillage</p>
            </div>
           <!--  <a href="#" class="text-slate-900 hover:text-slate-900 font-medium flex items-center">
                Voir tout
                <ChevronRight />
            </a> -->
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="product in newProducts" :key="product.id"
                class="bg-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 service-card relative">
                <div v-if="product.isNew"
                    class="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    NOUVEAU
                </div>
                <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover" />
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-white mb-1">
                        {{ product.title }}
                    </h3>
                    <p class="text-white text-sm mb-2">{{ product.description }}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-gold font-bold">{{ product.price }} Fcfa</span>
                        <button @click="addToCart(product)"
                            class="text-gold  hover:text-yellow-golden transition-colors duration-200 p-2 rounded-full hover:bg-pink-50"
                            aria-label="Ajouter au panier">
                            <ShoppingCart class="w-5 h-5" />
                        </button>
                    </div>
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
