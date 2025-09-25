<script setup>
import {
  CircleGauge,
  ConciergeBell,
  ChevronDown,
  Star,
  List,
  Settings,
  LogOut,
  CalendarClock,
  CalendarDays,
  CircleSmall,
  NotebookTabs,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification'
const toast = useToast()
//const route = useRouter();
const isCollapsed = ref(false);
// Votre fonction isActive existante
const isActive = (path) => {
  return useRoute().path.startsWith(path);
};
const auth = useAuthStore();
const isLoggingOut = ref(false);
const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await auth.logout();
    toast.success('Déconnexion réussie !')
    navigateTo("/");
  } catch (error) {
    console.error("Erreur pendant la déconnexion", error);
  } finally {
    isLoggingOut.value = false;
  }
};

const role = computed(() => auth.getUser()?.role);
</script>

<template>
  <div class="w-64 bg-slate-900 text-white shadow-lg fixed h-full overflow-y-auto z-10 transition-all duration-300"
    :class="{ '!w-20': isCollapsed }">
    <div class="p-4 border-b flex justify-between items-center">
      <div :class="{ hidden: isCollapsed }">
        <NuxtLink to="/" class="text-2xl font-bold text-gold">AllôBeauté</NuxtLink>
        <p class="text-sm text-gray-100">Plateforme de services</p>
      </div>
      <div class="flex items-center space-x-2 hover:cursor-pointer" @click="isCollapsed = !isCollapsed">
        <List />
      </div>
    </div>
    <nav class="mt-6">
      <NuxtLink to="/dashboard" :class="[
        'flex items-center px-4 py-3 transition-colors duration-200 relative',
        isActive('/dashboard') ? 'bg-slate-800 text-gold' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
      ]">
        <div v-if="isActive('/dashboard')" class="absolute left-0 top-0 h-full w-1 bg-gold rounded-r-full"></div>
        <CircleGauge class="h-5 w-5" />
        <span :class="{ hidden: isCollapsed }" class="ml-3">Tableau de bord</span>
      </NuxtLink>
      <NuxtLink v-if="role === 'Prestataire'" to="/dashboard/services" :class="[
        'flex items-center px-4 py-3 transition-colors duration-200 relative',
        isActive('/dashboard/services') ? 'bg-slate-800 text-gold' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
      ]">
        <div v-if="isActive('/dashboard/services')" class="absolute left-0 top-0 h-full w-1 bg-gold rounded-r-full"></div>
        <ConciergeBell class="h-5 w-5" />
        <span :class="{ hidden: isCollapsed }" class="ml-3 ">Mes services</span>
      </NuxtLink>
      <NuxtLink v-if="role === 'Prestataire'" to="/schedule" :class="[
        'flex items-center px-4 py-3 transition-colors duration-200 relative',
        isActive('/schedule') ? 'bg-slate-800 text-gold' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
      ]">
        <div v-if="isActive('/schedule')" class="absolute left-0 top-0 h-full w-1 bg-gold rounded-r-full"></div>
        <CalendarDays class="h-5 w-5" />
        <span :class="{ hidden: isCollapsed }" class="ml-3">Mon emploi de temps</span>
      </NuxtLink>
        <details class="group" :open="isActive('/dashboard/incoming-bookings') || isActive('/dashboard/booked-services')">
          <summary
            :class="[
              'flex items-center px-4 py-3 cursor-pointer list-none transition-colors duration-200 relative',
              (isActive('/dashboard/incoming-bookings') || isActive('/dashboard/booked-services')) ? 'bg-slate-800 text-gold' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
            ]">
            <div v-if="isActive('/dashboard/incoming-bookings') || isActive('/dashboard/booked-services')" class="absolute left-0 top-0 h-full w-1 bg-gold rounded-r-full"></div>
            <CalendarClock class="h-5 w-5" />
            <span :class="{ hidden: isCollapsed }" class="ml-3">Réservation</span>
            <ChevronDown :class="{ hidden: isCollapsed }" class="h-4 w-4 transition-transform group-open:rotate-180 ml-auto" />
          </summary>
          <div :class="{ hidden: isCollapsed }" class="mt-2 ml-4 pl-5 border-l-2 border-slate-700">
            <NuxtLink v-if="role === 'Prestataire'" to="/dashboard/incoming-bookings" :class="[
              'py-2 text-sm flex items-center transition-colors duration-200',
              isActive('/dashboard/incoming-bookings') ? 'text-gold' : 'text-gray-400 hover:text-white',
            ]">
              <CircleSmall class="mr-2 h-4 w-4" />Réservations reçues
            </NuxtLink>
            <NuxtLink to="/dashboard/booked-services" :class="[
              'py-2 text-sm flex items-center transition-colors duration-200',
              isActive('/dashboard/booked-services') ? 'text-gold' : 'text-gray-400 hover:text-white',
            ]">
              <CircleSmall class="mr-2 h-4 w-4" />Services réservés
            </NuxtLink>
          </div>
        </details>
      <!--     <NuxtLink to="/dashboard/reviews"
              :class="[
                'py-2 text-sm hover:text-gold transition-colors flex items-center ml-4',
                isActive('/dashboard/reviews') ? '' : 'text-white hover:bg-gray-500 transition-colors duration-200',
              ]">
        <Star class="h-5 w-5" />
        <span :class="{ hidden: isCollapsed }" class="ml-3">Avis clients</span>
      </NuxtLink> -->
      <div :class="{ hidden: isCollapsed }" class="px-4 mt-6 mb-3">
        <p class="text-xs uppercase text-gray-400 tracking-wider">Paramètres</p>
      </div>
      <NuxtLink to="/dashboard/settings" :class="[
        'flex items-center px-4 py-3 transition-colors duration-200 relative',
        isActive('/dashboard/settings') ? 'bg-slate-800 text-gold' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
      ]">
        <div v-if="isActive('/dashboard/settings')" class="absolute left-0 top-0 h-full w-1 bg-gold rounded-r-full"></div>
        <Settings class="h-5 w-5" />
        <span :class="{ hidden: isCollapsed }" class="ml-3">Paramètres du compte</span>
      </NuxtLink>
      <p @click.prevent="handleLogout"
        class="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors duration-200 cursor-pointer">
        <LogOut class="h-5 w-5" />
        <span :class="{ hidden: isCollapsed }" class="ml-3 hover:text-gold">
          <span v-if="isLoggingOut">Déconnexion en cours...</span>
          <span v-else>Déconnexion</span>
        </span>
      </p>
    </nav>
  </div>
  <div :class="{ '-ml-48': isCollapsed }">
    <slot />
  </div>
</template>

<style scoped>
span {
  font-family: "Playfair Display", serif;
  font-weight: 700;
}
</style>
