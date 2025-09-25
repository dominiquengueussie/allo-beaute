<script setup lang="ts">
definePageMeta({
  layout: 'customheader'
})

// Animation au scroll
onMounted(() => {
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeInOnScroll = function () {
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Initial check
  fadeInOnScroll();

  // Check on scroll
  window.addEventListener('scroll', fadeInOnScroll);
});
</script>

<template>
  <div>
    <ServiceCards />
</div>
  <Testimonials />
  <section class="-mb-16 bg-slate-900 h-96 flex items-center justify-center text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="title-font text-3xl font-bold text-white mb-6">Vous êtes professionnel de beauté ?</h2>
      <p class="text-white mb-8 max-w-2xl mx-auto">Rejoignez notre plateforme et augmentez votre visibilité auprès de
        milliers de clients à la recherche de services premium.</p>
      <NuxtLink to="/becomeProvider" class="bg-gold text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium shadow-lg transition">
        Devenir prestataire
      </NuxtLink>
    </div>
  </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background-color: #faf7f5;
}

.title-font {
  font-family: 'Playfair Display', serif;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.star-rating .star {
  color: #e2e8f0;
}

.star-rating .star.active {
  color: #f59e0b;
}

.filter-section {
  transition: all 0.3s ease;
}

.filter-section:hover {
  background-color: #fff9f8;
}

.price-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f472b6;
  cursor: pointer;
}

.scroll-hidden::-webkit-scrollbar {
  display: none;
}
body {
    font-family: "Montserrat", sans-serif;
    color: #333;
    scroll-behavior: smooth;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "Playfair Display", serif;
}
</style>
