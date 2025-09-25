// composables/useApi.js
export const useApi = () => {
  const runtimeConfig = useRuntimeConfig()
  
  return $fetch.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}