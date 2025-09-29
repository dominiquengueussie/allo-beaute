import { useToast } from "vue-toastification";
//const { openServiceCart } = useUIState();

export const useCart = () => {
  // Panier services
  const serviceCart = useState("serviceCart", () => []);
  // Panier produits
  const productCart = useState("productCart", () => []);

  // Chargement depuis localStorage
  if (process.client) {
    const savedServiceCart = localStorage.getItem("serviceCart");
    const savedProductCart = localStorage.getItem("productCart");
    if (savedServiceCart) serviceCart.value = JSON.parse(savedServiceCart);
    if (savedProductCart) productCart.value = JSON.parse(savedProductCart);
  }

  // Sauvegarde dans localStorage
  const saveToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem("serviceCart", JSON.stringify(serviceCart.value));
      localStorage.setItem("productCart", JSON.stringify(productCart.value));
    }
  };

  // === Méthodes Services ===
  const addService = (service, openCart = true) => {
    const { openServiceCart } = useUIState();
    const existingService = serviceCart.value.find(
      (item) => item.id === service.id
    );
    if (existingService) {
      existingService.quantity += 1;
    } else {
      const serviceWithDetails = {
        ...service,
        cartId: Date.now(), // ID unique pour le panier
        bookingDate: null, // À remplir plus tard
        quantity: 1, // Par défaut 1 pour les services
      };
      serviceCart.value.push(serviceWithDetails);
    }
    saveToLocalStorage();
    if (openCart) {
      nextTick(() => {
        openServiceCart();
      });
    }
    return existingService || serviceWithDetails;
  };

  const serviceIncrementQuantity = (cartId) => {
    const service = serviceCart.value.find((item) => item.cartId === cartId);
    if (service) {
      service.quantity += 1;
      saveToLocalStorage();
    }
  };

  const serviceDecrementQuantity = (cartId) => {
    const serviceIndex = serviceCart.value.findIndex(
      (item) => item.cartId === cartId
    );
    if (serviceIndex !== -1) {
      if (serviceCart.value[serviceIndex].quantity > 1) {
        serviceCart.value[serviceIndex].quantity -= 1;
      } else {
        // Si la quantité est 1, supprimer le service
        serviceCart.value.splice(serviceIndex, 1);
      }
      saveToLocalStorage();
    }
  };

  const removeService = (cartId) => {
    serviceCart.value = serviceCart.value.filter(
      (item) => item.cartId !== cartId
    );
    saveToLocalStorage();
    const toast = useToast();
    toast.info("Service retiré du panier");
  };

  const clearServiceCart = () => {
    serviceCart.value = [];
    saveToLocalStorage();
  };

  const updateServiceDate = (cartId, date) => {
    const service = serviceCart.value.find((item) => item.cartId === cartId);
    if (service) {
      service.bookingDate = date;
      saveToLocalStorage();
    }
  };

  // === Méthodes Produits ===
  const addProduct = (product, openCart = true) => {
    const { openProductCart } = useUIState();
    const existingProduct = productCart.value.find(
      (item) => item.id === product.id
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      productCart.value.push({
        ...product,
        quantity: 1,
      });
    }
    saveToLocalStorage();
    if (openCart) {
      nextTick(() => {
        openProductCart();
      });
    }
    return existingProduct || product;
  };

  const incrementProduct = (product) => {
    const existingProduct = productCart.value.find(
      (item) => item.id === product.id
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
      saveToLocalStorage();
    }
  };

  const decrementProduct = (product) => {
    const existingProduct = productCart.value.find(
      (item) => item.id === product.id
    );
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        saveToLocalStorage();
      } else {
        removeProduct(existingProduct.id);
      }
    }
  };

  const removeProduct = (id) => {
    productCart.value = productCart.value.filter((item) => item.id !== id);
    saveToLocalStorage();
  };

  const clearProductCart = () => {
    productCart.value = [];
    saveToLocalStorage();
  };

  const updateProductQuantity = (id, quantity) => {
    const product = productCart.value.find((item) => item.id === id);
    if (product) {
      product.quantity = quantity;
      saveToLocalStorage();
    }
  };

  // === Computed ===
  const serviceCount = computed(() => serviceCart.value.length);
  const productCount = computed(() =>
    productCart.value.reduce((total, item) => total + item.quantity, 0)
  );

  const serviceTotal = computed(() => {
    const total = serviceCart.value.reduce((sum, item) => {
      const price = Number(item.price.replace(/[^\d.]/g, "")) || 0;
      return sum + price * item.quantity;
    }, 0);
    return total.toFixed(2);
  });

  const productTotal = computed(() => {
    const total = productCart.value.reduce((sum, item) => {
      const price = Number(item.price.replace(/[^\d.]/g, "")) || 0;
      return sum + price * item.quantity;
    }, 0);
    return total.toFixed(2);
  });

  //****FORMATAGE DU PRIX * QUANTITE */
  const formattedPrice = (price, quantity) => {
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^\d.]/g, ""))
        : price;
    return (numericPrice * quantity).toFixed(2);
  };

  return {
    // Services
    serviceCart,
    serviceCount,
    serviceTotal,
    addService,
    removeService,
    updateServiceDate,
    clearServiceCart,
    serviceIncrementQuantity,
    serviceDecrementQuantity,

    // Produits
    productCart,
    productCount,
    productTotal,
    addProduct,
    removeProduct,
    updateProductQuantity,
    incrementProduct,
    decrementProduct,
    clearProductCart,

    // Méthodes communes
    saveToLocalStorage,
    formattedPrice,
  };
};
