<script setup>
import { Grip, SprayCan, Bath, Cookie, Droplet, ShowerHead, User, Brush, Sparkles, Heart, Sun, Droplets, ShoppingCart } from "lucide-vue-next";
import visuel1 from '@/public/img/visuel-1.png'
import visuel2 from '@/public/img/visuel-2.png'


// État pour le menu mobile
const isMobileMenuOpen = ref(false)
onMounted(() => {
  // Ré-initialiser le carousel au montage du composant
  initCarousels()
})

// Optionnel : si tu veux éviter les doublons en cas de navigation rapide
onBeforeUnmount(() => {
  // Tu pourrais aussi nettoyer ici si besoin
})

</script>

<template>
  <div class="bg-white max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 mt-7">
    <!-- Version mobile avec sidebar repliée -->
    <div class="md:hidden mb-4">
      <button @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="flex items-center justify-between w-full bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <span class="text-gray-700 font-medium">Catégories</span>
        <svg :class="{ 'rotate-180': isMobileMenuOpen }" class="w-5 h-5 text-gray-600 transition-transform duration-300"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <div v-if="isMobileMenuOpen" class="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <ul class="space-y-2">
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Droplet class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Soins visage
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Brush class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Maquillage
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <SprayCan class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Parfums
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Bath class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Cheveux
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Cookie class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Accessoires
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Heart class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Corps & Bain
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <ShowerHead class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Homme
          </li>
          <li
            class="text-slate-600 hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <i class="fa-solid fa-person hover:text-gold"></i>
            Bio & Naturel
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 md:gap-6">
      <!-- Sidebar desktop -->
      <div class="hidden md:block w-full md:w-1/5 bg-white rounded-xl shadow-sm border border-gray-100 max-h-96">
        <div class="flex bg-[#122a51] w-full rounded-t-xl p-3 items-center text-center text-white">
          <div>
            <Grip class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-white font-semibold text-lg ml-2">Catégories</h3>
          </div>
        </div>
        <ul class="space-y-1 p-4 mt-2">
          <!--  <li v-for="category in categories" :key="category"
            class="text-slate-600 hover:text-white transition-colors duration-200 cursor-pointer py-2 px-3 hover:bg-slate-900 rounded-md">
            {{ category }}
          </li> -->
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Droplet class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Soins visage
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Brush class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Maquillage
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <SprayCan class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Parfums
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Bath class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Cheveux
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Cookie class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Accessoires
          </li>
          <li
            class="text-slate-600 border-b hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <Heart class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Corps & Bain
          </li>
          <li
            class="text-slate-600 hover:text-white transition-colors duration-200 cursor-pointer py-2 hover:bg-slate-900 rounded-md flex items-center gap-1">
            <ShowerHead class="w-4 h-4 text-gray-700 hover:text-[#efb533]" />
            Homme
          </li>
        </ul>
      </div>

      <!-- Bannière principale -->
      <div class="w-full h-56 md:h-96 sm:h-52">
        <div id="default-carousel" class="relative w-full" data-carousel="slide" :key="$route.fullPath">
          <!-- Carousel wrapper -->
          <div class="relative h-56 overflow-hidden md:h-96">
            <!-- Item 1 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/img/slide-1.png"
                class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 shadow-md border" alt="...">
            </div>
            <!-- Item 2 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/img/slide-2.png"
                class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 shadow-md border" alt="...">
            </div>
            <!-- Item 3 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/img/slide-3.png"
                class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 shadow-md border" alt="...">
            </div>
            <!-- Item 4 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/img/slide-4.png"
                class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 shadow-md border" alt="...">
            </div>
            <!-- Item 5 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/img/slide-5.png"
                class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 shadow-md border" alt="...">
            </div>
          </div>
          <!-- Slider indicators -->
          <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button type="button" class="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1"
              data-carousel-slide-to="0"></button>
            <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2"
              data-carousel-slide-to="1"></button>
            <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3"
              data-carousel-slide-to="2"></button>
            <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4"
              data-carousel-slide-to="3"></button>
            <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5"
              data-carousel-slide-to="4"></button>
          </div>
          <!-- Slider controls -->
          <button type="button"
            class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev>
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 1 1 5l4 4" />
              </svg>
              <span class="sr-only">Previous</span>
            </span>
          </button>
          <button type="button"
            class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next>
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 9 4-4-4-4" />
              </svg>
              <span class="sr-only">Next</span>
            </span>
          </button>
        </div>

      </div>
      <!-- Encarts produits à droite -->
<div class="w-full md:w-1/5 flex flex-col gap-4 h-auto">
  <!-- Encarts 1 -->
  <div 
    class="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300 group flex flex-col">
    <div class="w-full flex justify-center">
      <img :src="visuel1" alt="Visuel 1"
        class="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg">
    </div>
  </div>

  <!-- Encarts 2 -->
  <div 
    class="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300 group flex flex-col">
    <div class="w-full flex justify-center">
      <img :src="visuel2" alt="Visuel 2"
        class="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg">
    </div>
  </div>
</div>

    </div>
  </div>

</template>


<style scoped>
.banner-image {
  @apply w-full h-full object-bottom scale-[1.1] transition-transform duration-500 ease-in-out;
}

.swiper-slide-active .banner-image {
  @apply scale-100;
}

.banner-content {
  @apply absolute bottom-[35%] md:bottom-[35%] lg:bottom-[35%] xl:bottom-[40%] left-[10%] w-[40%] min-w-[300px] p-10 bg-black/30 backdrop-blur-sm rounded-[10px] text-white opacity-0 translate-x-[100px] transition-all duration-1000 ease-in-out;
}

.banner-content.active {
  @apply opacity-100 translate-x-0;
}

.banner-title {
  @apply text-4xl font-bold mb-4 opacity-0 translate-y-[30px] transition-all duration-700 delay-300 ease-in-out;
}

.banner-description {
  @apply text-lg leading-relaxed mb-10 opacity-0 translate-y-[30px] transition-all duration-700 delay-500 ease-in-out;
}

.banner-button {
  @apply px-8 py-3 font-bold rounded-full no-underline opacity-0 translate-y-[30px] transition-all duration-700 delay-700 ease-in-out;
}

.banner-content.active .banner-title,
.banner-content.active .banner-description,
.banner-content.active .banner-button {
  @apply opacity-100 translate-y-0;
}

.swiper-button-next,
.swiper-button-prev {
  @apply text-white bg-white/20 w-[60px] h-[60px] rounded-full hidden backdrop-blur-sm transition-all duration-300 ease-in-out;
}


@media (max-width: 768px) {
  .swiper {
    @apply h-[70vh];
  }

  .banner-content {
    @apply w-[80%] left-[5%] bottom-[10%] p-5;
  }

  .banner-title {
    @apply text-2xl;
  }

  .banner-description {
    @apply text-base;
  }

  .swiper-button-next,
  .swiper-button-prev {
    @apply w-10 h-10 hidden;
  }
}
</style>
