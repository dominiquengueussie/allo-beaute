<script setup lang="ts">
import { ref } from "vue";
const {productCount, serviceCount} = useCart();
const auth = useAuthStore();
//console.log('Nom utilisateur :', auth.user?.role)
import {
  UserRound,
  ChevronDown,
  LogIn,
  UserPlus,
  Gauge,
  Cog,
  User,
  ShoppingBag,
  AlignJustify,
  CalendarDays
} from "lucide-vue-next";

const mobileMenuOpen = ref(false);

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NuxtLink } from "#components";

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
const { openServiceCart, openProductCart } = useUIState();
const toggleServiceCart = () => {
  openServiceCart();
};
const toggleProductCart = () => {
  openProductCart();
};
</script>

<template>
  <nav class="bg-slate-900 shadow-sm shadow-gold fixed w-full z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <!-- Logo et bouton menu mobile -->
      <div class="flex items-center">
        <!-- Bouton menu mobile -->
        <button @click="toggleMenu" class="md:hidden mr-4 text-gray-400 hover:text-white focus:outline-none">
          <AlignJustify class="h-6 w-6" />
        </button>
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0 flex items-center">
          <img src="/img/logo.png" alt="logo AllôBeauté" class="h-10 md:h-16 object-contain" />
        </NuxtLink>
      </div>

      <!-- Menu desktop -->
      <div class="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
        <NuxtLink to="/"
          class="text-white hover:text-yellow-golden inline-flex items-center px-1 pt-1 border-b-2 text-sm lg:text-md font-medium border-transparent hover:border-[#d79516] router-link-active:text-yellow-golden router-link-active:border-yellow-golden">
          Accueil
        </NuxtLink>
        <NuxtLink to="/store"
          class="text-white hover:text-yellow-golden inline-flex items-center px-1 pt-1 text-sm lg:text-md font-medium border-b-2 border-transparent hover:border-[#d79516] router-link-active:text-yellow-golden router-link-active:border-yellow-golden">
          Boutique
        </NuxtLink>
        <NuxtLink to="/prestataires"
          class="text-white hover:text-yellow-golden inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#d79516] text-sm lg:text-md font-medium router-link-active:text-yellow-golden router-link-active:border-yellow-golden">
          Prestataires
        </NuxtLink>
        <NuxtLink to="/about"
          class="text-white hover:text-yellow-golden inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#d79516] text-sm lg:text-md font-medium router-link-active:text-yellow-golden router-link-active:border-yellow-golden">
          A propos
        </NuxtLink>
        <NuxtLink to="/contact"
          class="text-white hover:text-yellow-golden inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#d79516] text-sm lg:text-md font-medium router-link-active:text-yellow-golden router-link-active:border-yellow-golden">
          Contact
        </NuxtLink>
      </div>

      <!-- Actions (icones et profil) -->
      <div class="flex items-center space-x-3 md:space-x-4">
        <!-- Icônes (mobile et desktop) -->
        <div class="flex items-center space-x-3">
          <!-- Calendar -->
          <div @click="toggleServiceCart" class="hover:cursor-pointer relative">
            <CalendarDays class="text-gold h-6 w-6" />
            <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ serviceCount }}</span>
          </div>
          
          <!-- Shopping cart -->
          <div class="hover:cursor-pointer relative" @click="toggleProductCart">
            <ShoppingBag class="text-gold h-6 w-6" />
            <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ productCount }}</span>
          </div>
        </div>

        <!-- Profile dropdown (desktop) -->
        <div class="hidden md:block">
          <Popover>
            <PopoverTrigger as-child>
              <Button class="rounded-full h-10 w-10 p-0" variant="outline">
                <UserRound class="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-52">
              <div class="flex flex-col space-y-2">
                <div class="items-center gap-3 flex hover:bg-gray-400 text-gray-900 hover:bg-opacity-10 p-2 rounded-md">
                  <User class="h-4 w-4" />
                  <NuxtLink to="/dashboard/settings" class="text-sm">Profil</NuxtLink>
                </div>
                <div class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                  <Gauge class="h-4 w-4" />
                  <NuxtLink to="/dashboard" class="text-sm">Dashboard</NuxtLink>
                </div>
                <div v-show="!auth.user" class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                  <LogIn class="h-4 w-4" />
                  <NuxtLink to="/auth/login" class="text-sm">Connexion</NuxtLink>
                </div>
                <div v-show="!auth.user" class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                  <UserPlus class="h-4 w-4" />
                  <NuxtLink to="/auth/register" class="text-sm">Inscription</NuxtLink>
                </div>
                <div class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                  <Cog class="h-4 w-4" />
                  <NuxtLink to="/dashboard/settings" class="text-sm">Paramètres</NuxtLink>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="md:hidden bg-slate-800 pb-4">
      <div class="px-2 pt-2 space-y-3">
        <NuxtLink to="/" @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">
          Accueil
        </NuxtLink>
        <NuxtLink to="/store" @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">
          Boutique
        </NuxtLink>
        <NuxtLink to="/prestataires" @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">
          Prestataires
        </NuxtLink>
        <NuxtLink to="/about" @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">
          A propos
        </NuxtLink>
        <NuxtLink to="/contact" @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">
          Contact
        </NuxtLink>
      </div>

      <!-- Profile mobile -->
      <div class="px-4 pt-4 border-t border-slate-700">
        <Popover>
          <PopoverTrigger as-child>
            <Button class="w-full justify-start rounded-md px-3 py-2" variant="ghost">
              <UserRound class="h-5 w-5 mr-3" />
              <span class="text-white">Mon compte</span>
              <ChevronDown class="ml-auto h-5 w-5 text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-full">
            <div class="flex flex-col space-y-2">
              <div class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                <User class="h-4 w-4" />
                <NuxtLink to="/dashboard/settings" class="text-sm">Profil</NuxtLink>
              </div>
              <div class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                <Gauge class="h-4 w-4" />
                <NuxtLink to="/dashboard" class="text-sm">Dashboard</NuxtLink>
              </div>
              <div class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                <LogIn class="h-4 w-4" />
                <NuxtLink to="/auth/login" class="text-sm">Connexion</NuxtLink>
              </div>
              <div class="items-center gap-3 flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-md">
                <UserPlus class="h-4 w-4" />
                <NuxtLink to="/auth/register" class="text-sm">Inscription</NuxtLink>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <button
          class="w-full mt-4 bg-[#d79516] hover:bg-[#d79516]/90 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
          Connexion
        </button>
      </div>
    </div>
  </div>
</nav>
</template>
