<script setup>
import { Star } from 'lucide-vue-next'

defineProps({
    rating: {
        type: Number,
        required: true
    },
    reviewCount: {
        type: Number,
        required: true
    }
})
</script>

<template>
    <div class="flex items-center">
        <div class="flex">
            <Star v-for="i in 5" :key="i" :size="16" :fill="i <= Math.floor(rating) ? 'currentColor' : 'none'" :class="[
                'text-yellow-400',
                { 'text-gray-300': i > Math.ceil(rating) },
                { 'text-yellow-400': i <= Math.ceil(rating) },
                { 'text-opacity-50': i > rating && i <= Math.ceil(rating) }
            ]" />
        </div>
        <span class="text-gray-600 ml-2">{{ rating }} ({{ reviewCount }} avis)</span>
    </div>
</template>
