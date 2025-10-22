<script setup lang="ts">
import {
  Flame,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-vue-next";
// No state management needed for this component
</script>

<template>
  <footer class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <img
                src="/img/logo.png"
                alt="logo AllôBeauté"
                class="h-16 object-contain"
              />
            </div>
          </div>
          <p class="text-gray-300">
            Votre plateforme de réservation de services de beauté en ligne.
          </p>
          <div class="flex space-x-4 mt-4">
            <a href="https://web.facebook.com/obsessioninstitut2beaute" target="_blank" class="text-gray-300 hover:text-white"
              ><Facebook class="w-5 h-5"
            /></a>
            <a href="#" class="text-gray-300 hover:text-white"
              ><Instagram class="w-5 h-5"
            /></a>
            <a href="#" class="text-gray-300 hover:text-white"
              ><Twitter class="w-5 h-5"
            /></a>
          </div>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Services</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-300 hover:text-white"
                >Soins du visage</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white">Massages</a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white">Épilation</a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white">Onglerie</a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white">Coiffure</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Entreprise</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-300 hover:text-white">À propos</a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white">Carrières</a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white"
                >Devenir prestataire</a
              >
            </li>
            <li><a href="#" class="text-gray-300 hover:text-white">Blog</a></li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white">Presse</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <ul class="space-y-2">
            <li class="flex items-start text-gray-300">
              <MapPin class="mr-3 w-5 h-5 flex-shrink-0" /> <span>Rue des manguiers, Bali. Proche de la pharmacie Gabelou, Douala, Cameroon</span>
            </li>
            <li class="flex items-start text-gray-300">
              <Phone class="mr-3 w-5 h-5 flex-shrink-0" /> <span>+237 691 323 407</span>
            </li>
            <li class="flex items-start text-gray-300">
              <Mail class="mr-3 w-5 h-5 flex-shrink-0" /> <span>obsession.institut2beaute@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <p class="text-gray-300 text-sm">
          © 2025 AllôBeauté. Tous droits réservés.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
         <NuxtLink to="/PrivatePolicy" class="text-gray-300 hover:text-white text-sm">Confidentialité</NuxtLink>
          <a href="#" class="text-gray-300 hover:text-white text-sm"
            >Conditions</a
          >
          <a href="#" class="text-gray-300 hover:text-white text-sm">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
