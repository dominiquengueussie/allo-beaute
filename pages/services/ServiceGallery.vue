<script setup>
const images = [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1604658243842-83c3335f4850?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1608364699286-85a1f6dc6297?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
]

const currentImageIndex = ref(0)

const changeImage = (index) => {
    currentImageIndex.value = index
}

const openLightbox = (index) => {
    // Implement lightbox functionality here
    console.log('Opening lightbox for image', index)
}
</script>

<template>
    <div class="md:w-2/3 p-6">
        <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
                <div class="relative rounded-xl overflow-hidden h-80">
                    <img :src="images[currentImageIndex]" alt="Manucure Premium"
                        class="w-full h-full object-cover gallery-image" @click="openLightbox(currentImageIndex)">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <span class="text-white text-sm">Image {{ currentImageIndex + 1 }}/{{ images.length }}</span>
                    </div>
                </div>
            </div>
            <div v-for="(image, index) in images.slice(1, 3)" :key="index"
                class="relative rounded-xl overflow-hidden h-40">
                <img :src="image" alt="Manucure Premium" class="w-full h-full object-cover gallery-image"
                    @click="changeImage(index + 1)">
            </div>
        </div>
        <div class="mt-4 flex justify-center space-x-2">
            <button v-for="(_, index) in images" :key="index" class="w-3 h-3 rounded-full transition-colors"
                :class="currentImageIndex === index ? 'bg-[#FF6B6B]' : 'bg-gray-300'"
                @click="changeImage(index)"></button>
        </div>
    </div>
</template>
