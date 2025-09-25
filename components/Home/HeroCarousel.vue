<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: 'Découvrez nos services de beauté',
    description: 'Des soins professionnels pour votre bien-être'
  },
  {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: 'Offres spéciales',
    description: 'Profitez de nos promotions exclusives'
  },
  {
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: 'Massage et relaxation',
    description: 'Détendez-vous entre des mains expertes'
  }
];
</script>

<template>
  <div class="relative h-[600px] mt-16">
    <Swiper
      :modules="[Autoplay, Pagination, Navigation]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      :navigation="true"
      class="h-full"
    >
      <SwiperSlide v-for="(slide, index) in slides" :key="index" class="relative">
        <div class="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div class="container mx-auto px-4">
            <h2 class="text-4xl md:text-6xl font-bold text-white mb-4">{{ slide.title }}</h2>
            <p class="text-xl md:text-2xl text-white mb-8">{{ slide.description }}</p>
            <button class="bg-beauty-primary text-white px-8 py-3 rounded-full text-lg hover:bg-beauty-secondary transition-colors">
              Réserver maintenant
            </button>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style>
.swiper-pagination-bullet {
  background: white !important;
}
.swiper-button-next,
.swiper-button-prev {
  color: white !important;
}
</style>