<script setup>
import {BadgeCheck,Star,MoveRight,Clock} from "lucide-vue-next";
const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['bookService'])
const handleBook = () => {
  emit('bookService', props.service.id)
}
</script>

<template>
    <article class="bg-grid-400 rounded-md overflow-hidden shadow-sm">
        <img :alt="service.title" class="w-full h-[180px] object-cover" :src="service.medias[0]?.link || '/placeholder-image.jpg'" />
        <div class="p-3 bg-slate-900 text-white">
            <div class="flex items-center text-[13px] text-[#4a4a4a] mb-1">
                <img :alt="service.title" class="w-10 h-10 rounded-full object-cover mr-2" :src="service.medias[0]?.link || '/placeholder-image.jpg'" />
                <span class="font-semibold text-white text-[16px]">{{ service.enterprise.name }}</span>
                <BadgeCheck class="text-gold ml-1 h-4 w-4"/>
                <Star class="text-white ml-auto h-4 w-4"/>
                <span class="ml-1 font-semibold text-gold">{{ service.rating }}</span>
                <span class="ml-1 text-gold">(4)</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-[14px] mb-1 mt-2">{{ service.name }}</p>
              <p class="text-[14px] mb-1 mt-2 flex items-center"><Clock class="text-gold mr-1 h-4 w-4"/>{{ service.duration }} min</p>
            </div>
            <div class="flex items-center justify-between">
               <p class="text-[11px] mt-1" :class="service.served_at_home ? 'text-yellow-golden' : 'text-gold font-bold'">
                {{ service.served_at_home ? 'Service à domicile' : "Service à l'institut" }}
            </p>
              <p class="font-semibold text-[12px] mb-0 text-gold">{{ service.price }} Fcfa</p>
            </div>
          <div class="flex items-center justify-between mt-4">
            <p class="text-[11px] mt-1" :class="service.sponsored ? 'text-yellow-golden' : 'text-gold font-bold'">
                {{ service.sponsored ? 'Sponsorisé' : service.badge }}
            </p>
            <button @click="handleBook" class="bg-gold hover:bg-yellow-golden text-slate-900 font-medium py-1 px-4 rounded-full inline-flex items-center transition-colors mt-2">
                <span class="text-[13px]">Voir les détails</span>
                <MoveRight class="ml-2 text-slate-900"/>
            </button>
          </div>
        </div>
    </article>
</template>