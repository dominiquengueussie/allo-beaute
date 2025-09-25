import { useToast } from 'vue-toastification'; // ou ton système de notifications

export function usePaymentPolling() {
  const isProcessingPayment = ref(false);
  const paymentStatus = ref<'success' | 'failed' | 'initiated' | null>(null); // Explicitly type possible statuses
  const showPaymentModal = ref(false);
  const paymentPollingInterval = ref<number | null>(null); // Correct type for browser setInterval/setTimeout

  const toast = useToast();
  const auth = useAuthStore(); 
  const router = useRouter();

  // Define interface for the expected API response structure
  interface PaymentData {
    status: 'success' | 'failed' | 'initiated'; // Assuming 'initiated' is a possible status
    // Add other properties if the API returns them and they are used
  }

  interface PaymentApiResponse {
    data: PaymentData;
  }

  // Define interface for startPolling options
  interface StartPollingOptions {
    onSuccess?: () => void;
    onFailure?: () => void;
    onError?: (error: unknown) => void; // Use 'unknown' for robust error handling
    redirectOnSuccess?: string | null; // Allow null if no redirect
    showSuccessToast?: boolean;
    showFailureToast?: boolean;
  }

  const startPolling = (paymentId: string, options: StartPollingOptions = {}) => {
    const {
      onSuccess = () => {},
      onFailure = () => {},
      onError = () => {},
      redirectOnSuccess = '/paiement/success',
      showSuccessToast = true,
      showFailureToast = true,
    } = options;
    if (paymentPollingInterval.value) {
      clearInterval(paymentPollingInterval.value);
    }

    isProcessingPayment.value = true;

    paymentPollingInterval.value = setInterval(async () => {
      try {
        const { data } = await useFetch<PaymentApiResponse>(`https://demo-allobeaute.tikaplace.com/api/payments/${paymentId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.getToken()}`,
          },
        });

        const status = data.value?.data?.status;

        if (status === 'success') {
          clearInterval(paymentPollingInterval.value);
          paymentStatus.value = 'success';
          isProcessingPayment.value = false;
          if (showSuccessToast) toast.success('Paiement confirmé !');
          if (redirectOnSuccess) router.push(redirectOnSuccess);
          onSuccess();
        } else if (status === 'failed') {
          clearInterval(paymentPollingInterval.value);
          paymentStatus.value = 'failed';
          isProcessingPayment.value = false;
          if (showFailureToast) toast.error('Paiement échoué - Veuillez réessayer');
          onFailure();
        } else if (status === 'initiated') {
          paymentStatus.value = 'initiated'; // Explicitly set status if polling continues
        }

      } catch (err: unknown) { // Catch error as unknown
        console.error('Erreur durant le polling :', err);
        clearInterval(paymentPollingInterval.value);
        isProcessingPayment.value = false;
        toast.error('Erreur réseau pendant la vérification du paiement');
        onError(err);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (paymentPollingInterval.value) {
      clearInterval(paymentPollingInterval.value);
    }
    isProcessingPayment.value = false;
  };

  onUnmounted(() => {
    stopPolling();
  });

  return {
    isProcessingPayment,
    paymentStatus,
    showPaymentModal,
    startPolling,
    stopPolling,
  };
}
