<script>
import {
  Flame,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-vue-next";
</script>

<template>
  <footer class="bg-gray-800 text-white py-12 px-6 md:px-12 lg:px-24 mt-42">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center mb-4">
            <img class="h-16 object-contain" src="../../public/img/logo.png" alt="">
          </div>
          <p class="text-gray-400 mb-4">
            Votre destination premium pour des produits de beauté de qualité
            supérieure.
          </p>
          <div class="flex space-x-4 mt-4">
            <a href="#" class="text-gray-300 hover:text-white"
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
          <h4 class="title-font text-lg font-bold mb-4">Boutique</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Nouveautés</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white"
                >Meilleures ventes</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Promotions</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Cadeaux</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Abonnements</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="title-font text-lg font-bold mb-4">Informations</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white">À propos</a>
            </li>
            <li><a href="#" class="text-gray-400 hover:text-white">Blog</a></li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Livraison</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Paiements</a>
            </li>
            <li><a href="#" class="text-gray-400 hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 class="title-font text-lg font-bold mb-4">Contact</h4>
          <ul class="space-y-2">
            <li class="flex items-center text-gray-400">
              <i class="fas fa-map-marker-alt mr-3 text-pink-400"></i> 123 Rue
              de la Beauté, Douala
            </li>
            <li class="flex items-center text-gray-400">
              <i class="fas fa-phone-alt mr-3 text-pink-400"></i> +237 671 657 197
            </li>
            <li class="flex items-center text-gray-400">
              <i class="fas fa-envelope mr-3 text-pink-400"></i>
              contact@allo-beaute.com
            </li>
            <li class="flex items-center text-gray-400">
              <i class="fas fa-clock mr-3 text-pink-400"></i> Lun-Ven: 9h-18h
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <p class="text-gray-400 text-sm mb-4 md:mb-0">
          © 2023 Beauté Élégante. Tous droits réservés.
        </p>
        <div class="flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-white text-sm"
            >Mentions légales</a
          >
          <a href="#" class="text-gray-400 hover:text-white text-sm"
            >Politique de confidentialité</a
          >
          <a href="#" class="text-gray-400 hover:text-white text-sm"
            >Conditions générales</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
