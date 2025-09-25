<script setup lang="ts">
const auth = useAuthStore();

onMounted(() => {
  auth.restoreSession();
  if (auth.user) {
    //console.log("Utilisateur connecté :", auth.user.fullname);
  } else {
    console.log("Aucun utilisateur connecté");
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>
