<script setup>
import { debounce } from 'lodash';

const localFilters = reactive({
    location: '',
    serviceType: '',
    rating: null
});

const emit = defineEmits(['filter-changed']);

const emitFilters = () => {
    emit('filter-changed', { ...localFilters });
};

const debouncedEmitFilters = debounce(emitFilters, 500);
</script>

<template>
    <div class="bg-white shadow-md p-4">
        <div class="flex flex-wrap gap-4 items-center justify-center">
            <div class="w-full md:w-auto">
                <label class="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <input v-model="localFilters.location" type="text" placeholder="Ville, code postal..."
                    class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d4aa58] focus:border-[#d4aa58] transition-all"
                    @input="debouncedEmitFilters">
            </div>

            <div class="w-full md:w-auto">
                <label class="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
                <select v-model="localFilters.serviceType"
                    class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d4aa58] focus:border-[#d4aa58] transition-all"
                    @change="emitFilters">
                    <option value="">Tous les services</option>
                    <option value="coiffure">Coiffure</option>
                    <option value="maquillage">Maquillage</option>
                    <option value="onglerie">Onglerie</option>
                    <option value="epilation">Épilation</option>
                </select>
            </div>

            <div class="w-full md:w-auto">
                <label class="block text-sm font-medium text-gray-700 mb-1">Note minimale</label>
                <div class="flex items-center">
                    <input v-model="localFilters.rating" type="range" min="0" max="5" step="0.5"
                        class="w-24 mr-2 accent-[#d4aa58]" @change="emitFilters">
                    <span class="text-sm text-gray-600">{{ localFilters.rating || 'Aucune' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

