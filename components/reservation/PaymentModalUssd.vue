<script setup>
const props = defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close'])

const closeModal = () => {
    if (props.isOpen) return;
    emit('close')
}
</script>

<template>
    <Transition name="modal">
        <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
            <div class="modal-container">
                <div class="modal-content">
                    <div class="icon-container">
                        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </div>
                    <h3 class="modal-title">Paiement initié</h3>
                    <p class="modal-message">Validez sur votre mobile</p>
                    <p class="modal-instructions">
                        Un popup de confirmation est apparu sur votre téléphone. Si ce n'est pas le cas,
                        merci de composer le <span class="text-bold">*126#</span> ou le <span class="text-bold">#150#</span> pour valider le paiement.
                    </p>
                    <button @click="closeModal" class="modal-close-btn">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.text-bold {
    font-weight: bold;
}
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    backdrop-filter: blur(2px);

}

.modal-container {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    max-width: 28rem;
    width: 100%;
    margin-left: 1rem;
    margin-right: 1rem;
    animation: slideIn 0.3s ease-out;
}

.modal-content {
    padding: 1.5rem;
    text-align: center;
}

.icon-container {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    width: 3rem;
    border-radius: 9999px;
    background-color: #dbeafe;
    margin-bottom: 1rem;
}

.icon-container svg {
    height: 2rem;
    width: 2rem;
    color: #0F172A;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.5rem;
}

.modal-message {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: gold;
    margin-bottom: 1rem;
}

.modal-instructions {
    color: #4b5563;
    margin-bottom: 1.5rem;
}

.modal-close-btn {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background-color: #0F172A;
    color: white;
    border-radius: 0.375rem;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.modal-close-btn:hover {
    background-color: #1e293b;
}
</style>