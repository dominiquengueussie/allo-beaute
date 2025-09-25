<script setup>

definePageMeta({
    title: 'Contact',
    layout: 'customheader',
    meta: [
        {
            name: 'description',
            content: 'Contactez-nous pour toute question ou demande d\'information.'
        },
        {
            name: 'keywords',
            content: 'contact, questions, informations, beauté'
        }
    ]
})
</script>

<template>
    <div class="max-w-full bg-slate-900 py-16 md:py-20">
        <div class="container px-4 md:px-6">
            <div class="flex flex-col items-center text-center space-y-4 animate-fade-in">
                <h1 class="text-4xl text-white font-playfair md:text-5xl lg:text-6xl font-bold text-beauty-dark tracking-tight playfair">
                    Contactez-nous
                </h1>
                <p class="text-lg md:text-xl montserrat text-white max-w-2xl">
                    Nous sommes à votre écoute pour répondre à vos questions et vous
                    accompagner dans votre expérience beauté.
                </p>
            </div>
        </div>
    </div>
    <div>
     <Contact/>
    </div>
</template>

<style scoped>
.playfair {
    font-family: 'Playfair Display', serif;
}
.montserrat {
  font-family: 'Montserrat', sans-serif;
}
</style>
