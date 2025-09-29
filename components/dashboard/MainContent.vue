<script setup>
import {
  ChevronRight,
  ArrowBigLeft,
  Trash2,
  SquarePen,
  Star,
  ArrowDown,
  UserPlus,
  ArrowUp,
  Euro,
  CalendarFold,
  Search,
  Bell,
} from "lucide-vue-next";
import * as echarts from "echarts";
import { useToast } from "vue-toastification";
// User avatar
const userAvatar =
  "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20beautiful%20young%20French%20woman%20with%20short%20brown%20hair%2C%20warm%20smile%2C%20natural%20makeup%2C%20beauty%20salon%20owner%2C%20professional%20headshot%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic&width=200&height=200&seq=1&orientation=squarish";
// Charts references
const revenueChartRef = ref(null);
const servicesChartRef = ref(null);
// Appointments data
const products = ref([]);
const orders = ref([]);
const isLoading = ref(true);
const isLoadingOrders = ref(true);
const error = ref(null);
const errorOrders = ref(null);
const selectedProduct = ref(null);
const isModalOpen = ref(false);
const currentPage = ref(1);
const paginationMeta = ref(null);
const isProcessingPayment = ref(false);
const paymentStatus = ref(null);
const paymentPollingInterval = ref(null);
const showPaymentModal = ref(false);

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch(
      "https://demo-allobeaute.tikaplace.com/api/products"
    );
    products.value = response.data;
    console.log("Produits chargés:", products.value);
  } catch (e) {
    error.value = "Erreur lors du chargement des produits";
    console.error("Erreur:", e);
  } finally {
    isLoading.value = false;
  }
};

const fetchOrders = async (page = 1) => {
  try {
    isLoadingOrders.value = true;
    const response = await $fetch(
      `https://demo-allobeaute.tikaplace.com/api/orders?page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    orders.value = response.orders;
    paginationMeta.value = response.meta;
    console.log("Commandes chargées:", orders.value);
  } catch (e) {
    errorOrders.value = "Erreur lors du chargement des commandes";
    console.error("Erreur:", e);
  } finally {
    isLoadingOrders.value = false;
  }
};

const toast = useToast();
// Gestion de l'ouverture du modal de détails de commande
const isOrderModalOpen = ref(false);
const selectedOrder = ref(null);
const isLoadingOrderDetails = ref(false);

const openOrderModal = async (order) => {
  isOrderModalOpen.value = true;
  isLoadingOrderDetails.value = true;
  selectedOrder.value = null; // Vider les anciennes données

  try {
    const response = await $fetch(
      `https://demo-allobeaute.tikaplace.com/api/orders/${order.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.success && response.data) {
      selectedOrder.value = response.data;
    } else {
      throw new Error("Impossible de récupérer les détails de la commande.");
    }
  } catch (err) {
    toast.error(err.message || "Une erreur est survenue.");
    closeOrderModal();
  } finally {
    isLoadingOrderDetails.value = false;
  }
};

const closeOrderModal = () => {
  isOrderModalOpen.value = false;
  selectedOrder.value = null;
};

const handleRetryPayment = async ({ orderId, phone }) => {
  console.log(
    `Tentative de relance du paiement pour la commande ${orderId} avec le numéro ${phone}`
  );
  showPaymentModal.value = true;
  isProcessingPayment.value = true;

  try {
    // On utilise $fetch ici car useFetch peut causer des problèmes de contexte (async) dans les gestionnaires d'événements.
    const data = await $fetch(
      `https://demo-allobeaute.tikaplace.com/api/orders/${orderId}/retry-payment`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
          "Content-Type": "application/json",
        },
        body: {
          number: "237" + phone,
        },
      }
    );

    //console.log("Payment initiation response:", data);

    if (data?.status === "success" && data?.data?.payment?.id) {
      // Lancement du polling pour vérifier le statut
      const paymentId = data.data.payment.id;

      if (paymentPollingInterval.value) {
        clearInterval(paymentPollingInterval.value);
      }

      paymentPollingInterval.value = setInterval(async () => {
        try {
          const pollResponse = await $fetch(
            `https://demo-allobeaute.tikaplace.com/api/payments/${paymentId}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.getToken()}`,
              },
            }
          );

          const status = pollResponse?.data?.status;

          if (status === "success") {
            clearInterval(paymentPollingInterval.value);
            paymentStatus.value = "success";
            isProcessingPayment.value = false;
            showPaymentModal.value = false;
            toast.success("Paiement confirmé !");

            const order = orders.value.find((o) => o.id === orderId);
            if (order) {
              order.status = "confirmed";
            }
            closeOrderModal();
          } else if (status === "failed") {
            clearInterval(paymentPollingInterval.value);
            paymentStatus.value = "failed";
            isProcessingPayment.value = false;
            showPaymentModal.value = false;
            toast.error("Paiement échoué - Veuillez réessayer");
            closeOrderModal();
          }
        } catch (pollErr) {
          console.error("Erreur durant le polling :", pollErr);
          clearInterval(paymentPollingInterval.value);
          isProcessingPayment.value = false;
          showPaymentModal.value = false;
          toast.error("Erreur réseau pendant la vérification du paiement");
          closeOrderModal();
        }
      }, 5000);
    } else {
      throw new Error(data?.message || "Erreur lors de l'initiation du paiement");
    }
  } catch (err) {
    console.error("Payment error:", err);
    toast.error(err.data?.message || err.message || "Erreur lors du traitement du paiement");
    isProcessingPayment.value = false;
    showPaymentModal.value = false; // Ferme la modale en cas d'erreur d'initiation
    closeOrderModal();
  }
};

//génération de la facture
const handleGenerateInvoice = (orderId) => {
  console.log(`Génération de la facture pour la commande ${orderId}`);
  // Ici, vous pouvez ouvrir un nouvel onglet avec l'URL de la facture
  // en supposant que votre API a un endpoint comme /api/orders/{id}/invoice
  //const invoiceUrl = `https://demo-allobeaute.tikaplace.com/api/orders/${orderId}/invoice`;
  //window.open(invoiceUrl, '_blank');
};

const handleCancelOrder = async (orderId) => {
  try {
    await $fetch(
      `https://demo-allobeaute.tikaplace.com/api/orders/${orderId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    toast.success("La commande a été annulée avec succès.");
    // Mettre à jour l'interface
    const order = orders.value.find((o) => o.id === orderId);
    if (order) {
      order.status = "cancelled";
    }
    closeOrderModal(); // Fermer le modal après l'action
  } catch (err) {
    console.error("Erreur lors de l'annulation :", err);
    toast.error(
      err.data?.message ||
        "Échec de l'annulation de la commande. Veuillez réessayer."
    );
  }
};

// Status class helper
const getStatusClass = (status) => {
  switch (status) {
    case "confirmed":
      return "px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800";
    case "pending":
      return "px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800";
    case "delivered":
      return "px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800";
    default:
      return "px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const paginationInfo = computed(() => {
  if (!paginationMeta.value || !orders.value.length) return "";
  const from =
    (paginationMeta.value.current_page - 1) * paginationMeta.value.per_page + 1;
  const to = from + orders.value.length - 1;
  return `Affichage de ${from} à ${to} sur ${paginationMeta.value.total} commandes`;
});

const changePage = (page) => {
  if (
    page > 0 &&
    page <= paginationMeta.value.last_page &&
    page !== currentPage.value
  ) {
    currentPage.value = page;
    fetchOrders(page);
  }
};

onUnmounted(() => {
  if (paymentPollingInterval.value) {
    clearInterval(paymentPollingInterval.value);
  }
});

onMounted(() => {
  fetchProducts();
  fetchOrders(currentPage.value);
  // Initialize Revenue Chart
  if (revenueChartRef.value) {
    const revenueChart = echarts.init(revenueChartRef.value);
    const revenueOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} €",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value} €",
        },
        splitLine: {
          lineStyle: {
            color: "#f0f0f0",
          },
        },
      },
      series: [
        {
          name: "Revenus",
          type: "line",
          smooth: true,
          data: [280, 350, 310, 420, 390, 530, 480],
          itemStyle: {
            color: "#ec4899",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(236, 72, 153, 0.5)" },
              { offset: 1, color: "rgba(236, 72, 153, 0.05)" },
            ]),
          },
        },
      ],
    };
    revenueChart.setOption(revenueOption);
    window.addEventListener("resize", () => {
      revenueChart.resize();
    });
  }
  // Initialize Services Chart
  if (servicesChartRef.value) {
    const servicesChart = echarts.init(servicesChartRef.value);
    const servicesOption = {
      animation: false,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        data: ["Soins visage", "Massages", "Manucure", "Coiffure", "Autres"],
      },
      series: [
        {
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 35,
              name: "Soins visage",
              itemStyle: { color: "#ec4899" },
            },
            { value: 25, name: "Massages", itemStyle: { color: "#8b5cf6" } },
            { value: 20, name: "Manucure", itemStyle: { color: "#3b82f6" } },
            { value: 15, name: "Coiffure", itemStyle: { color: "#10b981" } },
            { value: 5, name: "Autres", itemStyle: { color: "#f59e0b" } },
          ],
        },
      ],
    };
    servicesChart.setOption(servicesOption);
    window.addEventListener("resize", () => {
      servicesChart.resize();
    });
  }
});

const openProductModal = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeModal = () => {
  selectedProduct.value = null;
  isModalOpen.value = false;
};

const auth = useAuthStore();
const fullName = computed(() => {
  return `${auth.user?.fullname}`;
});
const enterpriseName = computed(() => {
  return `${auth.user?.fullname}`;
});
const getNotifications = () => {
  toast.info("Fonctionnalités bientôt disponible.");
};

console.log("user du dashboard", auth.getUser());
</script>

<template>
  <div class="ml-64 flex-1">
    <!-- Header -->
    <header
      class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-5"
    >
      <div class="flex items-center">
        <div class="relative">
         <!--  <input
            type="text"
            placeholder="Rechercher une commande..."
            class="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
          />
          <Search
            class="fas fa-search absolute left-3 top-2.5 text-gray-400 h-4 w-4"
          /> -->
          <NuxtLink to="/"
          class="text-slate-600 hover:text-slate-900 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap flex items-center">
          <ArrowBigLeft class="w-4 h-4 mr-1" />
          Retour à l'accueil
        </NuxtLink>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative" @click="getNotifications()">
          <button
            class="text-gray-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer"
          >
            <Bell class="text-xl" />
            <span
              class="absolute -top-1 -right-1 bg-slate-900 text-gold text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >0</span
            >
          </button>
        </div>
        <div class="flex items-center space-x-3 cursor-pointer">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img
              :src="userAvatar"
              alt="Avatar utilisateur"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <p class="font-medium text-sm">{{ auth.getUser()?.name }}</p>
            <p class="text-xs text-gray-500">{{ auth.getUser()?.enterprise?.type || "Utilisateur"  }}</p>
          </div>
        </div>
      </div>
    </header>
    <!-- Dashboard Content -->
    <main class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">
          Bonjour, {{ enterpriseName }}
        </h1>
        <p class="text-gray-600">
          Voici un aperçu de votre activité aujourd'hui
        </p>
      </div>
      <!-- Stats Cards -->
     <!--  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-pink-500"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Rendez-vous aujourd'hui</p>
              <p class="text-2xl font-bold mt-1">8</p>
            </div>
            <div class="bg-pink-100 p-3 rounded-full">
              <CalendarFold class="fas fa-calendar text-pink-500" />
            </div>
          </div>
          <div class="mt-4 text-sm flex">
            <ArrowUp class="text-green-500" />
            <span class="text-green-500 mr-1"> 12% </span>
            <span>depuis hier</span>
          </div>
        </div>
        <div
          class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Ventes du jour</p>
              <p class="text-2xl font-bold mt-1">320 000 Fcfa</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <Euro class="fas fa-euro-sign text-purple-500" />
            </div>
          </div>
          <div class="mt-4 text-sm flex">
            <ArrowUp class="text-green-500" />
            <span class="text-green-500 mr-1"> 8% </span>
            <span>depuis hier</span>
          </div>
        </div>
        <div
          class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Nouveaux clients</p>
              <p class="text-2xl font-bold mt-1">3</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <UserPlus class="fas fa-user-plus text-blue-500" />
            </div>
          </div>
          <div class="mt-4 text-sm flex">
            <ArrowDown class="text-red-500" />
            <span class="text-red-500 mr-1"> 5% </span>
            <span>depuis hier</span>
          </div>
        </div>
        <div
          class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Avis reçus</p>
              <p class="text-2xl font-bold mt-1">
                4.8 <span class="text-sm font-normal text-gray-500">/5</span>
              </p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-full">
              <Star class="text-yellow-500" />
            </div>
          </div>
          <div class="mt-4 text-sm">
            <span class="text-gray-500">12 nouveaux avis</span>
          </div>
        </div>
      </div> -->
      <!-- Charts Section -->
     <!--  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-bold text-gray-800">Revenus mensuels</h2>
            <div class="text-sm text-gray-500">Mai 2025</div>
          </div>
          <div class="h-80">
            <div ref="revenueChartRef" class="w-full h-full"></div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-bold text-gray-800">Services populaires</h2>
            <div class="text-sm text-gray-500">Derniers 30 jours</div>
          </div>
          <div class="h-80">
            <div ref="servicesChartRef" class="w-full h-full"></div>
          </div>
        </div>
      </div> -->
      <!-- Upcoming Orders -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-gray-800">Mes commandes produits</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact / ID Commande
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Méthode de livraison
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de commande
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Montant Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoadingOrders">
                <td colspan="5" class="text-center py-8">
                  <div class="flex justify-center items-center">
                    <div
                      class="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="errorOrders">
                <td colspan="5" class="text-center text-red-500 py-8">
                  {{ errorOrders }}
                </td>
              </tr>
              <tr
                v-else
                v-for="order in orders"
                :key="order.id"
                @click="openOrderModal(order)"
                class="hover:bg-gray-50 cursor-pointer"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">
                    {{ order.delivery_contact_name || "N/A" }}
                  </div>
                  <div class="text-xs text-gray-500">
                    ID: {{ order.id.substring(0, 8) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    :class="
                      order.is_delivery
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    "
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ order.is_delivery ? "Livraison" : "Au point de vente" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(order.ordered_at) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold"
                >
                  {{ Number(order.total_amount).toLocaleString() }} Fcfa
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)">
                    {{
                      {
                        confirmed: "Confirmé",
                        pending: "En attente",
                        cancelled: "Annulé",
                        delivered: "Livré",
                      }[order.status] || order.status
                    }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div
          v-if="paginationMeta && paginationMeta.last_page > 1"
          class="flex justify-between items-center mt-4 text-sm text-gray-600"
        >
          <span>{{ paginationInfo }}</span>
          <div class="flex items-center space-x-1">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              v-for="page in paginationMeta.last_page"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 leading-tight border border-gray-300',
                currentPage === page
                  ? 'text-pink-600 bg-pink-50 border-pink-300'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === paginationMeta.last_page"
              class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
      <!-- Recent Products -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-gray-800">Produits récemment ajoutés</h2>
          <NuxtLink
            to="/dashboard/appointments"
            class="text-slate-600 hover:text-slate-900 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap flex items-center"
          >
            Voir tous
            <ChevronRight class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-if="isLoading"
            class="col-span-4 flex justify-center items-center py-12"
          >
            <div
              class="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div
            v-else-if="error"
            class="col-span-4 text-center text-red-500 py-8"
          >
            {{ error }}
          </div>

          <div
            v-else
            v-for="product in products"
            :key="product.id"
            class="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            @click="openProductModal(product)"
          >
            <div class="h-48 overflow-hidden">
              <img
                :src="
                  product.medias[0]?.preview || '/img/product-placeholder.jpg'
                "
                :alt="product.name"
                class="w-full h-full object-cover object-top"
              />
            </div>
            <div class="p-4">
              <h3 class="font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-gray-500 text-sm mt-1">
                {{ product.category.name }}
              </p>
              <div class="flex justify-between items-center mt-3">
                <p class="font-bold text-slate-900">
                  {{ Number(product.price).toLocaleString() }} Fcfa
                </p>
                <p class="text-sm text-gray-500">Stock: {{ product.stock }}</p>
              </div>
            </div>
          </div>

          <!-- Modal des détails du produit -->
          <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 overflow-y-auto"
            @click.self="closeModal"
          >
            <div class="flex items-center justify-center min-h-screen p-4">
              <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div
                class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-2xl w-full relative"
              >
                <!-- Modal header -->
                <div class="flex justify-between items-center p-6 border-b">
                  <h3 class="text-lg font-medium text-gray-900">
                    Détails du produit
                  </h3>
                  <button
                    @click="closeModal"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <span class="sr-only">Fermer</span>
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Modal content -->
                <div class="p-6" v-if="selectedProduct">
                  <div class="flex flex-col md:flex-row gap-6">
                    <div class="md:w-1/2">
                      <img
                        :src="
                          selectedProduct.medias[0]?.preview ||
                          '/img/product-placeholder.jpg'
                        "
                        :alt="selectedProduct.name"
                        class="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div class="md:w-1/2">
                      <h4 class="text-xl font-bold text-gray-900 mb-2">
                        {{ selectedProduct.name }}
                      </h4>
                      <p class="text-gray-600 mb-4">
                        {{
                          selectedProduct.description ||
                          "Aucune description disponible"
                        }}
                      </p>
                      <div class="space-y-3">
                        <p class="flex justify-between text-sm">
                          <span class="text-gray-500">Catégorie:</span>
                          <span class="font-medium">{{
                            selectedProduct.category.name
                          }}</span>
                        </p>
                        <p class="flex justify-between text-sm">
                          <span class="text-gray-500">Prix:</span>
                          <span class="font-medium text-slate-900"
                            >{{
                              Number(selectedProduct.price).toLocaleString()
                            }}
                            Fcfa</span
                          >
                        </p>
                        <p class="flex justify-between text-sm">
                          <span class="text-gray-500">Stock:</span>
                          <span
                            class="font-medium"
                            :class="{
                              'text-green-600': selectedProduct.stock > 10,
                              'text-orange-600':
                                selectedProduct.stock <= 10 &&
                                selectedProduct.stock > 0,
                              'text-red-600': selectedProduct.stock === 0,
                            }"
                          >
                            {{ selectedProduct.stock }} unités
                          </span>
                        </p>
                        <p class="flex justify-between text-sm">
                          <span class="text-gray-500">Référence:</span>
                          <span class="font-medium">{{
                            selectedProduct.reference || "N/A"
                          }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Modal footer -->
                <div class="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    @click="closeModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Modal des détails du produit -->
          <ModalDetailOrder
            :is-open="isOrderModalOpen"
            :is-loading="isLoadingOrderDetails"
            :order="selectedOrder"
            @close="closeOrderModal"
            @retry-payment="handleRetryPayment"
            @cancel-order="handleCancelOrder"
            @generate-invoice="handleGenerateInvoice"
          />
          <Trasition class="fade-in" appear>
            <PaymentModalUssd
              :isOpen="showPaymentModal"
              @close="showPaymentModal = false"
            />
          </Trasition>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
