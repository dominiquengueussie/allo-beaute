<script setup lang="ts">
// No state management needed for this component
</script>

<template>
  <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mt-20">
    <div class="bg-slate-900 rounded-2xl p-8 md:p-12 shadow-lg">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Prêt à vous faire chouchouter ?
      </h2>
      <p class="text-xl text-white mb-8 max-w-3xl mx-auto">
        Inscrivez-vous dès maintenant pour bénéficier de 10% de réduction sur
        votre première réservation.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <nuxt-link to="/auth/register" class="">
          <button
            class="bg-slate-900 hover:bg-yellow-golden text-white px-8 py-4 border border-white rounded-lg text-lg font-semibold transition duration-300">
            S'inscrire
          </button>
        </nuxt-link>
        <nuxt-link to="/about" class="">
          <button
          class="border-2 border-gold hover:bg-white hover:bg-opacity-10 text-gold px-8 py-4 rounded-lg text-lg font-semibold transition duration-300">
          En savoir plus
        </button>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
