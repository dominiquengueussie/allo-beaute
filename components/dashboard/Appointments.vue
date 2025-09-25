<script lang="ts" setup>
import { Search, Clock9, Bell, Plus, Wand2, Syringe, Package2, SprayCan, ShowerHead, Euro, ShoppingBag, ChevronDown, Grid, Flame, Hand, Sparkles, Scissors, ArrowDownNarrowWide, SquarePen, Trash2, ConciergeBell, TriangleAlert } from "lucide-vue-next";

// User avatar
const userAvatar =
  "https://readdy.ai/api/search-image?query=professional%252520portrait%252520of%252520a%252520beautiful%252520young%252520French%252520woman%252520with%252520short%252520brown%252520hair%25252C%252520warm%252520smile%25252C%252520natural%252520makeup%25252C%252520beauty%252520salon%252520owner%25252C%252520professional%252520headshot%25252C%252520neutral%252520background%25252C%252520high%252520quality%25252C%252520photorealistic&width=200&height=200&seq=1&orientation=squarish";
// Categories
const categories = ref([
  { id: "all", name: "Tous les produits", icon: Grid },             // fas fa-th-large
  { id: "skincare", name: "Soins du visage", icon: Flame },           // fas fa-spa
  { id: "makeup", name: "Maquillage", icon: Wand2 },                // fas fa-magic
  { id: "haircare", name: "Soins capillaires", icon: Syringe },    // fas fa-pump-soap
  { id: "bodycare", name: "Soins du corps", icon: ShowerHead },     // fas fa-shower
  { id: "fragrance", name: "Parfums", icon: SprayCan },      // fas fa-air-freshener
])
// Products data

// State variables
const searchQuery = ref("");
const selectedCategory = ref("all");
const priceFilter = ref("all");
const stockFilter = ref("all");
const sortBy = ref("name-asc");
const openDropdown = ref("");
const showProductModal = ref(false);
const showDeleteModal = ref(false);
const editingProduct = ref(false);
const productToDelete = ref<any>(null);
const currentProduct = ref({
  id: 0,
  name: "",
  categoryId: "skincare",
  price: 0,
  stock: 0,
  reference: "",
  brand: "",
  description: "",
  image: "",
});
// Close dropdowns when clicking outside
const closeDropdowns = (event: MouseEvent) => {
  if (openDropdown.value !== "") {
    openDropdown.value = "";
  }
};
onMounted(() => {
  document.addEventListener("click", closeDropdowns);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdowns);
});
// Toggle filter dropdowns
const toggleFilterDropdown = (dropdown: string) => {
  openDropdown.value = openDropdown.value === dropdown ? "" : dropdown;
};
// Select category
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
};
// Get category name by ID
/* const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "";
}; */
// Get stock status text
const getStockStatusText = (stock: number) => {
  if (stock === 0) return "Rupture de stock";
  if (stock <= 5) return "Stock faible";
  return `En stock (${stock})`;
};
// Get stock status class
const getStockStatusClass = (stock: number) => {
  if (stock === 0) return "text-red-600";
  if (stock <= 5) return "text-orange-600";
  return "text-green-600";
};
// Filtered products
/* const filteredProducts = computed(() => {
  let result = [...products.value];
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.reference.toLowerCase().includes(query),
    );
  }
  // Filter by category
  if (selectedCategory.value !== "all") {
    result = result.filter(
      (product) => product.categoryId === selectedCategory.value,
    );
  }
  // Filter by price
  if (priceFilter.value !== "all") {
    switch (priceFilter.value) {
      case "low":
        result = result.filter((product) => product.price < 20);
        break;
      case "medium":
        result = result.filter(
          (product) => product.price >= 20 && product.price <= 50,
        );
        break;
      case "high":
        result = result.filter((product) => product.price > 50);
        break;
    }
  }
  // Filter by stock
  if (stockFilter.value !== "all") {
    switch (stockFilter.value) {
      case "inStock":
        result = result.filter((product) => product.stock > 5);
        break;
      case "lowStock":
        result = result.filter(
          (product) => product.stock > 0 && product.stock <= 5,
        );
        break;
      case "outOfStock":
        result = result.filter((product) => product.stock === 0);
        break;
    }
  }
  // Sort results
  switch (sortBy.value) {
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "stock-asc":
      result.sort((a, b) => a.stock - b.stock);
      break;
    case "stock-desc":
      result.sort((a, b) => b.stock - a.stock);
      break;
  }
  return result;
}); */
// Open add product modal
/* const openAddProductModal = () => {
  editingProduct.value = false;
  currentProduct.value = {
    id: products.value.length + 1,
    name: "",
    categoryId: "skincare",
    price: 0,
    stock: 0,
    reference: `PROD-${String(products.value.length + 1).padStart(3, "0")}`,
    brand: "BeautéPro",
    description: "",
    image: getRandomProductImage(),
  };
  showProductModal.value = true;
}; */
// Edit product
const editProduct = (product: any) => {
  editingProduct.value = true;
  currentProduct.value = { ...product };
  showProductModal.value = true;
};
// Close product modal
const closeProductModal = () => {
  showProductModal.value = false;
};
// Save product
/* const saveProduct = () => {
  if (editingProduct.value) {
    // Update existing product
    const index = products.value.findIndex(
      (p) => p.id === currentProduct.value.id,
    );
    if (index !== -1) {
      products.value[index] = { ...currentProduct.value };
    }
  } else {
    // Add new product
    products.value.push({ ...currentProduct.value });
  }
  showProductModal.value = false;
}; */
// Confirm delete product
const confirmDeleteProduct = (product: any) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};
// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};
// Delete product
/* const deleteProduct = () => {
  if (productToDelete.value) {
    products.value = products.value.filter(
      (p) => p.id !== productToDelete.value.id,
    );
    closeDeleteModal();
  }
}; */
// Helper function to get random product image for new products
const getRandomProductImage = () => {
  const imageUrls = [
    "https://readdy.ai/api/search-image?query=elegant%252520beauty%252520product%252520in%252520premium%252520packaging%25252C%252520luxury%252520cosmetic%252520product%252520photography%252520on%252520soft%252520pink%252520background%25252C%252520high-end%252520skincare%252520or%252520makeup%252520item%252520with%252520professional%252520lighting%25252C%252520minimalist%252520beauty%252520product%252520showcase&width=600&height=600&seq=110&orientation=squarish",
    "https://readdy.ai/api/search-image?query=premium%252520beauty%252520product%252520in%252520elegant%252520glass%252520container%25252C%252520luxury%252520cosmetic%252520photography%252520with%252520soft%252520pink%252520background%25252C%252520high-end%252520skincare%252520item%252520with%252520professional%252520lighting%252520and%252520subtle%252520reflections%25252C%252520minimalist%252520product%252520presentation&width=600&height=600&seq=111&orientation=squarish",
    "https://readdy.ai/api/search-image?query=luxury%252520cosmetic%252520product%252520in%252520elegant%252520packaging%25252C%252520premium%252520beauty%252520item%252520photography%252520on%252520soft%252520pink%252520background%25252C%252520high-end%252520makeup%252520or%252520skincare%252520with%252520professional%252520lighting%252520and%252520clean%252520aesthetic%25252C%252520minimalist%252520product%252520showcase&width=600&height=600&seq=112&orientation=squarish",
  ];
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
};
</script>


<template>
  <!-- Main Content -->
  <div class="ml-64 flex-1">
    <!-- Header -->
    <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-5">
      <div class="flex items-center">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..."
            class="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
          <Search class="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <button class="text-gray-500 hover:text-pink-500 transition-colors duration-200 cursor-pointer">
            <Bell class="text-xl" />
            <span
              class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>
        </div>
        <div class="flex items-center space-x-3 cursor-pointer">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img :src="userAvatar" alt="Avatar utilisateur" class="w-full h-full object-cover" />
          </div>
          <div>
            <p class="font-medium text-sm">Dominique Ngueussie</p>
            <p class="text-xs text-gray-500">Esthéticien</p>
          </div>
        </div>
      </div>
    </header>
    <!-- Products Content -->
   
  </div>
  <!-- Add/Edit Product Modal -->
  
  <!-- Delete Confirmation Modal -->
 
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
/* Line clamp for descriptions */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
