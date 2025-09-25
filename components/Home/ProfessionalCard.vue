<script setup lang="ts">
import { Star, BadgeCheck } from 'lucide-vue-next';

const props = defineProps({
    professional: {
        type: Object,
        required: true
    }
});
//console.log("professional", props.professional);
const emit = defineEmits(['bookService'])
const handleBook = () => {
    emit('bookService', props.professional.id)
}
</script>

<template>
    <div class="bg-slate-900 rounded-xl shadow-md overflow-hidden w-full max-w-sm">
        <div class="relative h-48 bg-gray-200">
            <img :src="professional.medias[0]?.link || '/placeholder-image.jpg'" :alt="professional.name"
                class="w-full h-48 object-cover" />
            <div class="absolute top-4 left-4">
                <span
                    class="bg-white/90 text-blue-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <span class="text-white bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        <BadgeCheck />
                    </span>
                    Vérifié
                </span>
                <!--  <span v-if="professional.enterprise.isVerified"
                    class="bg-white/90 text-blue-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <span
                        class="text-white bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-xs"><BadgeCheck /></span>
                    Vérifié
                </span> -->
            </div>

            <div class="absolute top-4 right-4 flex items-center gap-2">
                <span
                    class="bg-premium text-white bg-[#d79516] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star class="h-4 w-4" /> PREMIUM
                </span>
            </div>
            <!--  <div class="absolute top-4 right-4 flex items-center gap-2">
                <span v-if="professional.isPremium"
                    class="bg-premium text-white bg-[#d79516] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star class="h-4 w-4" /> PREMIUM
                </span>
            </div> -->

            <div
                class="absolute bottom-4 right-4 bg-gray-500 opacity-80 px-3 py-1 rounded-full flex items-center gap-1">
                <span class="text-[#d79516]">
                    <Star class="h-4 w-4" />
                </span>
                <span class="font-bold text-white">4.9</span>
                <span class="text-white">(150)</span>
                <!-- <span class="font-bold text-white">{{ professional.rating }}</span>
                <span class="text-white">({{ professional.reviews }})</span> -->
            </div>
        </div>

        <div class="p-6">
            <div class="flex items-center justify-start text-[16px]">
                <img :alt="professional.title" class="w-10 h-10 rounded-full object-cover mr-2"
                    :src="professional.medias[0]?.link || '/placeholder-image.jpg'" />
                <h4 class="font-semibold text-white">{{ professional.enterprise.name.slice(0, 10) + "..." }} </h4>
            </div>
            <div class="flex items-center justify-between mt-3 text-[13px]">
                <h4 class="font-semibold text-white text-[13px]">{{ professional.name.slice(0, 25) + "..." }}</h4>

                <p class="text-gold font-semibold text-sm mt-1">{{ professional.price }} Fcfa</p>

            </div>
            <div class="flex items-center gap-2 mt-4 text-gray-500 text-sm">
                <span>📍</span>
                {{ professional?.enterprise?.address ? professional?.enterprise?.address?.slice(0, 25) + "..." :
                "Adresse non disponible" }}
            </div>

            <button @click="handleBook"
                class="w-full mt-6 bg-gold text-slate-900 py-3 rounded-lg font-medium hover:bg-premium/90 transition-colors">
                Voir les détails
            </button>
        </div>
    </div>
</template>