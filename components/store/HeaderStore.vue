<script setup>
import { ref } from 'vue'
import { Flame, Menu, Cookie, Droplet, Search, User, Brush, Sparkles, Heart, Sun, Droplets, ShoppingCart } from 'lucide-vue-next'
const isSidebarOpen = ref(false)
const cartBounce = ref(false)
const {productCount} = useCart()
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

function handleSearchClick() {
  const input = document.querySelector('input[type="text"]')
  if (input && input.value) {
    alert(`Recherche pour: ${input.value}`)
  }
}

const { openProductCart } = useUIState();

const toggleProductCart = () => {
  openProductCart();
};
</script>

<template>
  <header class="w-full shadow-lg">
    <!-- Bandeau promo -->
    <div
      class="flex justify-between items-center mx-auto max-w-7xl bg-white px-4 py-2 text-sm font-semibold border-b border-gray-200">
      <span class="text-gold text-2xl pulse-animation">Commandez maintenant !</span>
      <div class="bg-gold text-slate-900 px-3 py-1 rounded hover:bg-gray-800 transition duration-300 cursor-pointer">
        Commandez par appel au <span class="font-bold text-xl">233 50 73 00</span>
      </div>
    </div>
    <!-- Zone principale du header -->
    <div class="bg-[#0a1f44] text-white flex flex-wrap items-center justify-between px-5 py-3 sm:px-6 md:px-8 lg:px-28 gap-3">
  <!-- Menu burger + logo -->
  <div class="flex items-center gap-2 sm:gap-4 order-1">
    <button @click="toggleCategories" class="hover:text-yellow-400 transition duration-200 lg:hidden">
      <Menu class="w-6 h-6" />
    </button>
    <div class="text-[#fbd964] font-bold flex items-center gap-1 cursor-pointer hover:text-yellow-300 transition duration-200">
      <Menu class="w-6 h-6 hidden md:block" @click="toggleCategories" />
      <NuxtLink to="/">
        <img class="h-8 w-auto sm:h-9 md:h-10" src="/img/logo.png" alt="Logo">
      </NuxtLink>
    </div>
  </div>

  <!-- Barre de recherche - prend toute la largeur sur mobile -->
  <div class="w-full order-3 md:order-2 md:flex-1 md:mx-4 mt-2 md:mt-0">
    <div class="relative">
      <input type="text" placeholder="Que cherchez-vous ?"
        class="w-full rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:bg-gold transition duration-200 text-sm sm:text-base" />
      <button @click="handleSearchClick"
        class="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700">
        <Search class="w-5 h-5" />
      </button>
    </div>
  </div>

  <!-- Actions utilisateur -->
  <div class="flex items-center gap-2 sm:gap-4 order-2 md:order-3">
    <button class="bg-gold text-slate-900 px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-yellow-500 transition duration-200 hidden md:block text-sm sm:text-base">
      Rechercher
    </button>

    <select class="bg-[#0a1f44] border border-white rounded-md px-2 py-1 hover:bg-[#efb533] transition duration-200 cursor-pointer text-xs sm:text-sm">
      <option>FR</option>
      <option>EN</option>
    </select>

    <div class="flex items-center gap-1 cursor-pointer hover:text-yellow-300 transition duration-200">
      <User class="w-4 h-4 sm:w-5 sm:h-5" />
      <span class="hidden sm:inline text-xs sm:text-sm">Mon Compte</span>
    </div>

    <div @click="toggleProductCart" class="relative cursor-pointer hover:text-yellow-300 transition duration-200">
      <ShoppingCart :class="['text-lg sm:text-xl', cartBounce ? 'animate-bounce' : '']" />
      <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ productCount }}</span>
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
</template>

<style scoped>
/* Custom scrollbar for navigation */
.custom-scroll::-webkit-scrollbar {
  height: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #0a1f44;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #f59e0b;
  border-radius: 10px;
}

/* Animation for promo banner */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}
</style>
