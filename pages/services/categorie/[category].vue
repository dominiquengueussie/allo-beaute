<script setup>
const route = useRoute()
const { fetchServicesByCategory } = useApi()

const category = route.params.category
const services = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetchServicesByCategory(category)
    if (response.status === 'success') {
      services.value = response.data
    } else {
      error.value = 'Failed to load services'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Services: {{ category }}</h1>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <ul>
        <li v-for="service in services" :key="service.id">
          <h2>{{ service.name }}</h2>
          <p>Category: {{ service.category }}</p>
          <p>Active: {{ service.is_active ? 'Yes' : 'No' }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.error {
  color: red;
}
</style>