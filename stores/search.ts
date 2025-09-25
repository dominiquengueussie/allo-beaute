import { defineStore } from 'pinia';

interface SearchResultItem {
  type: 'service' | 'product';
  data: any; // Vous pouvez typer plus précisément si vous le souhaitez
  relevance_score: number;
}

export const useSearchStore = defineStore('search', () => {
  // STATE
  const results = ref<SearchResultItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  // Un booléen pour savoir si on doit afficher les résultats ou le contenu par défaut
  const hasSearched = ref(false);

  // GETTERS (computed)
  const services = computed(() => results.value.filter(r => r.type === 'service').map(r => r.data));
  const products = computed(() => results.value.filter(r => r.type === 'product').map(r => r.data));

  // ACTIONS
  async function performSearch(query: string) {
    if (!query || query.trim() === '') {
      clearSearch();
      return;
    }

    loading.value = true;
    hasSearched.value = true;
    searchQuery.value = query;
    error.value = null;

    try {
      const response = await $fetch<{ data: { results: SearchResultItem[] } }>('https://demo-allobeaute.tikaplace.com/api/search/search', {
       params: { q: query, per_page: 15, type: 'all' }
      });
      results.value = response.data.results || [];
    } catch (e: any) {
      error.value = "Une erreur est survenue lors de la recherche.";
      results.value = [];
    } finally {
      loading.value = false;
    }
  }

  function clearSearch() {
    results.value = [];
    searchQuery.value = '';
    hasSearched.value = false;
    error.value = null;
  }

  return { results, loading, error, searchQuery, hasSearched, services, products, performSearch, clearSearch };
});