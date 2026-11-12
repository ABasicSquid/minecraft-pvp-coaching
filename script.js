document.addEventListener('DOMContentLoaded', () => {
    // ========== Глобальні змінні ==========
let products = []; // Масив всіх товарів
let cart = []; // Масив товарів у кошику
let productsBlock = document.querySelector(".cards")
const cartModal = document.querySelector("#cart-modal");
const cartItemsBlock = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");

// ========== Отримання товарів з JSON ==========
async function fetchProducts() {
    const response = await fetch('storepvp.json');
    const data = await response.json();
    products = data; // Оновлюємо глобальний масив для роботи addToCart
    displayProducts(data);
}


// ========== Відображення товарів ==========
function displayProducts(products) {
    productsBlock.innerHTML = ''; // Очищаємо блок товарів

    products.forEach(product => {
        const card = createProductCard(product);
        productsBlock.innerHTML += card;
    });
}
function createProductCard(product){
    return `<div class="item ${product.title.toLowerCase()}" data-product-id="${product.id}">
        <span class="name" style="color:white;">${product.title}</span>
        <button class="buy">купити</button>
        <div class="price">${product.price}$</div>
    </div>`
}

function renderCart() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = itemCount;
    cartTotal.textContent = total;
    cartItemsBlock.innerHTML = cart.length
        ? cart.map(item => `<div class="cart-row">
            <div class="cart-row-info">
                <strong>${item.title}</strong>
                <span>${item.price}$ x ${item.quantity}</span>
            </div>
            <button class="cart-remove" type="button" data-remove-id="${item.id}">Видалити</button>
        </div>`).join("")
        : '<p class="cart-empty">Кошик порожній</p>';
}

productsBlock.addEventListener("click", event => {
    const buyButton = event.target.closest(".buy");
    if (!buyButton) return;

    const productId = Number(buyButton.closest(".item").dataset.productId);
    const product = products.find(item => item.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
});

document.querySelector("#cart-open").addEventListener("click", () => cartModal.showModal());
document.querySelector("#cart-close").addEventListener("click", () => cartModal.close());
document.querySelector("#cart-clear").addEventListener("click", () => {
    cart = [];
    renderCart();
});

cartItemsBlock.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-id]");
    if (!removeButton) return;

    const productId = Number(removeButton.dataset.removeId);
    cart = cart.filter(item => item.id !== productId);
    renderCart();
});

cartModal.addEventListener("click", event => {
    if (event.target === cartModal) cartModal.close();
});

cartModal.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        event.preventDefault();
        cartModal.close();
    }
});

renderCart();
fetchProducts()
});
