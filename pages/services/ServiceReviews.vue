<script setup>
import { ChevronDown } from 'lucide-vue-next'

const reviews = ref([
    {
        id: 1,
        author: 'Sophie Martin',
        date: '15 juin 2023',
        rating: 5,
        comment: 'Service exceptionnel ! La manucure est parfaite et tient très bien. L\'esthéticienne était très professionnelle et attentive. Je recommande vivement.'
    },
    {
        id: 2,
        author: 'Claire Dubois',
        date: '2 juin 2023',
        rating: 4.5,
        comment: 'Très bon service, résultat impeccable. Le seul petit bémol est l\'attente de 10 minutes car le salon était complet. À part ça, tout était parfait.'
    }
])

const loadMoreReviews = () => {
    // Implement load more functionality
    console.log('Loading more reviews...')
}

const handleReviewSubmit = (review) => {
    // Implement review submission
    console.log('New review submitted:', review)
    reviews.value.unshift({
        id: reviews.value.length + 1,
        author: 'Vous',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        rating: review.rating,
        comment: review.comment
    })
}
</script>


<template>
    <div>
        <h3 class="text-2xl font-semibold text-dark mb-4">Avis clients (128)</h3>
        <div class="space-y-6">
            <ServiceReview v-for="review in reviews" :key="review.id" :review="review" />
        </div>

        <div class="mt-6 text-center">
            <button
                class="bg-gray-100 text-dark px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center mx-auto"
                @click="loadMoreReviews">
                <ChevronDown class="w-4 h-4 mr-2" />
                Voir plus d'avis
            </button>
        </div>

        <AddReviewForm @submit-review="handleReviewSubmit" />
    </div>
</template>
