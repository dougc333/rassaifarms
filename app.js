const products = [
  {
    id: "fresh-box",
    name: "Fresh Blenheim Apricot Box",
    category: "fresh",
    price: 28,
    unit: "5 lb box",
    description:
      "A seasonal box of fresh-picked Blenheim apricots with bright acidity and fragrant sweetness.",
  },
  {
    id: "sun-dried",
    name: "Sun-Dried Apricots",
    category: "dried",
    price: 16,
    unit: "12 oz bag",
    description:
      "Naturally dried halves with concentrated flavor, perfect for snacking, cheese boards, or baking.",
  },
  {
    id: "apricot-jam",
    name: "Small Batch Apricot Jam",
    category: "pantry",
    price: 12,
    unit: "9 oz jar",
    description:
      "Cooked gently in small batches to preserve the floral taste of ripe Blenheim fruit.",
  },
  {
    id: "gift-crate",
    name: "Harvest Gift Crate",
    category: "gift",
    price: 44,
    unit: "curated set",
    description:
      "A giftable assortment with dried apricots, jam, and farm notes packed in a rustic presentation box.",
  },
  {
    id: "apricot-honey",
    name: "Apricot Blossom Honey",
    category: "pantry",
    price: 18,
    unit: "11 oz jar",
    description:
      "Golden honey with a delicate orchard aroma, ideal for toast, yogurt, and glazes.",
  },
  {
    id: "baking-pack",
    name: "Baker's Apricot Pack",
    category: "gift",
    price: 32,
    unit: "recipe bundle",
    description:
      "A kitchen-ready set with dried fruit and jam, assembled for pastries, tarts, and breakfast bakes.",
  },
];

const cart = new Map();
let activeFilter = "all";

const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartShipping = document.querySelector("#cart-shipping");
const cartTotal = document.querySelector("#cart-total");
const filterButtons = document.querySelectorAll(".sidebar-link");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getVisibleProducts() {
  if (activeFilter === "all") {
    return products;
  }

  return products.filter((product) => product.category === activeFilter);
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">${product.unit}</div>
          <div class="product-meta">
            <div>
              <p>${product.category}</p>
              <h3>${product.name}</h3>
            </div>
            <strong class="price-tag">${formatPrice(product.price)}</strong>
          </div>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span>${product.unit}</span>
            <button class="add-to-cart" type="button" data-product-id="${product.id}">
              Add to cart
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  const items = Array.from(cart.values());
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 8 : 0;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = String(totalItems);
  cartSubtotal.textContent = formatPrice(subtotal);
  cartShipping.textContent = formatPrice(shipping);
  cartTotal.textContent = formatPrice(subtotal + shipping);

  if (items.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your cart is empty. Add products to begin your order.</p>';
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
        <article class="cart-item">
          <div class="cart-item-header">
            <div>
              <strong>${item.name}</strong>
              <p>${item.unit}</p>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
          </div>
          <div class="qty-controls">
            <button class="qty-button" type="button" data-action="decrement" data-product-id="${item.id}">-</button>
            <span>Qty ${item.quantity}</span>
            <button class="qty-button" type="button" data-action="increment" data-product-id="${item.id}">+</button>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.get(productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(productId, { ...product, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(productId, action) {
  const existing = cart.get(productId);
  if (!existing) return;

  if (action === "increment") {
    existing.quantity += 1;
  }

  if (action === "decrement") {
    existing.quantity -= 1;
    if (existing.quantity <= 0) {
      cart.delete(productId);
    }
  }

  renderCart();
}

productGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const productId = target.dataset.productId;
  if (target.classList.contains("add-to-cart") && productId) {
    addToCart(productId);
  }
});

cartItems.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const productId = target.dataset.productId;
  const action = target.dataset.action;

  if (target.classList.contains("qty-button") && productId && action) {
    updateQuantity(productId, action);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";

    filterButtons.forEach((entry) => entry.classList.remove("is-active"));
    button.classList.add("is-active");

    renderProducts();
  });
});

renderProducts();
renderCart();
