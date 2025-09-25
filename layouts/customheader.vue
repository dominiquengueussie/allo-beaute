<template>
  <div class="min-h-screen flex flex-col">
    <NavBar/>
    <div class="flex-grow py-16 ">
      <slot />
    </div>
    <Footer />
    <ServiceCart />
    <ProductCart />
  </div>
</template>

<script setup></script>
