<template>
  <section class="bg-slate-900 py-16">
    <div class="container mx-auto px-4">
      <h2 class="title-font text-3xl font-semibold text-center text-white mb-12">Nos clients témoignent</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Testimonial 1 -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center mb-4">
            <div class="flex">
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
            </div>
          </div>
          <p class="text-gray-600 mb-4">"Camille est une professionnelle exceptionnelle. Son travail sur mes ongles est
            toujours impeccable et son salon est d'une propreté irréprochable."</p>
          <div class="flex items-center">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Marie D."
              class="w-10 h-10 rounded-full mr-3">
            <div>
              <p class="font-medium text-gray-800">Fatou B..</p>
              <p class="text-sm text-gray-500">Yaoundé</p>
            </div>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center mb-4">
            <div class="flex">
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
            </div>
          </div>
          <p class="text-gray-600 mb-4">"Sophie a fait un maquillage sublime pour mon mariage. Elle a su comprendre
            exactement ce que je voulais et le résultat était encore mieux que ce que j'imaginais."</p>
          <div class="flex items-center">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Julie T."
              class="w-10 h-10 rounded-full mr-3">
            <div>
              <p class="font-medium text-gray-800">Aïcha T..</p>
              <p class="text-sm text-gray-500">Douala</p>
            </div>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center mb-4">
            <div class="flex">
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
              <Star class="text-amber-400 fill-amber-400 h-4 w-4" />
            </div>
          </div>
          <p class="text-gray-600 mb-4">"Anaïs possède des mains en or ! Son massage a soulagé mes tensions dorsales
            chroniques. Je recommande vivement ses services à tous ceux qui souffrent de stress."</p>
          <div class="flex items-center">
            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah L."
              class="w-10 h-10 rounded-full mr-3">
            <div>
              <p class="font-medium text-gray-800"> Nadia K.</p>
              <p class="text-sm text-gray-500">Bafoussam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Star } from 'lucide-vue-next';
</script>