<template>
    <!-- Newsletter -->
    <section class="py-16 px-4 bg-slate-900 text-white mx-auto max-w-7xl mt-20 mb-20 rounded-xl">
        <div class="container mx-auto max-w-4xl text-center">
            <h2 class="title-font text-3xl font-bold mb-4 text-white">
                Abonnez-vous à notre newsletter
            </h2>
            <p class="mb-8 text-white max-w-2xl mx-auto">
                Recevez des offres exclusives, des conseils beauté et les dernières
                tendances directement dans votre boîte mail.
            </p>

            <div class="flex flex-col sm:flex-row justify-center max-w-md mx-auto sm:max-w-xl">
                <input type="email" placeholder="Votre adresse email"
                    class="px-4 py-3 rounded-l-full sm:rounded-r-none rounded-r-full mb-2 sm:mb-0 w-full text-gray-800 focus:outline-none" />
                <button
                    class="bg-gold hover:bg-gray-800 hover:text-white border  text-slate-900 font-medium py-3 px-6 rounded-r-full sm:rounded-l-none rounded-l-full sm:w-auto w-full transition duration-300 transform hover:scale-105">
                    S'abonner
                </button>
            </div>

            <p class="mt-4 text-sm text-white">
                Nous ne partagerons jamais votre email. Désabonnez-vous à tout moment.
            </p>
        </div>
    </section>
</template>
