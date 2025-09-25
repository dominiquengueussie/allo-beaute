<script setup lang="ts">
import { ref } from "vue";
import { ChevronRight } from "lucide-vue-next";	
interface PromoService {
    id: number;
    name: string;
    provider: string;
    originalPrice: number;
    discountedPrice: number;
    description: string;
    rating: number;
    reviews: number;
    validUntil: string;
}

const promoServices = ref<PromoService[]>([
    {
        id: 1,
        name: "Soin Visage Premium",
        provider: "Institut de Beauté Élégance",
        originalPrice: 85,
        discountedPrice: 59,
        description: "Soin complet du visage avec massage et masque personnalisé",
        rating: 4.8,
        reviews: 124,
        validUntil: "15/10/2023",
    },
    {
        id: 2,
        name: "Massage Relaxant 1h",
        provider: "Spa Harmony",
        originalPrice: 70,
        discountedPrice: 49,
        description:
            "Massage relaxant aux huiles essentielles pour détendre tout le corps",
        rating: 4.9,
        reviews: 98,
        validUntil: "20/10/2023",
    },
    {
        id: 3,
        name: "Manucure & Vernis Semi-Permanent",
        provider: "Nail Bar Paris",
        originalPrice: 45,
        discountedPrice: 32,
        description: "Soin complet des mains avec pose de vernis semi-permanent",
        rating: 4.7,
        reviews: 156,
        validUntil: "12/10/2023",
    },
]);
</script>

<template>
    <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-3xl font-bold text-gray-800">Services en Promotion</h2>
                <p class="text-gray-600">Offres limitées de nos prestataires</p>
            </div>
            <a href="#" class="text-pink-500 hover:text-pink-600 font-medium flex items-center">
                Voir tout <ChevronRight />
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="service in promoServices" :key="service.id"
                class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-pink-100 relative">
                <div class="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    PROMO
                </div>
                <div class="p-5">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-1">
                                {{ service.name }}
                            </h3>
                            <p class="text-gray-600 mb-3">{{ service.provider }}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-pink-500 font-bold text-xl">{{ service.discountedPrice }} €</span>
                            <span class="text-gray-400 text-sm line-through block">{{ service.originalPrice }} €</span>
                        </div>
                    </div>
                    <p class="text-gray-700 mb-4">{{ service.description }}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-star text-yellow-400 mr-1"></i>
                            <span class="text-gray-700 font-medium">{{
                                service.rating
                                }}</span>
                            <span class="text-gray-400 mx-1">•</span>
                            <span class="text-gray-500">{{ service.reviews }} avis</span>
                        </div>
                        <button
                            class="bg-[#b37c5d] hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300">
                            Réserver
                        </button>
                    </div>
                </div>
                <div class="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <div class="flex items-center text-sm text-gray-500">
                        <i class="far fa-clock mr-2"></i>
                        <span>Offre valable jusqu'au {{ service.validUntil }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
