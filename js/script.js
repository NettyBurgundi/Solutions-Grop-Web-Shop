const products = {
  stuhl: { name: "Ergo Drehstuhl", price: 249 },
  schreibtisch: { name: "Schreibtisch Klar", price: 399 },
  leuchte: { name: "Arbeitsleuchte Fokus", price: 79 },
};

const storageKey = "solutions-group-cart";
const authStorageKey = "solutions-group-user";
const demoEmail = "admin@ubungsfirma.de";
const demoPassword = "123456";

function readCart() {
  const savedCart = localStorage.getItem(storageKey);
  if (!savedCart) return [];

  const parsedCart = JSON.parse(savedCart);
  if (!Array.isArray(parsedCart)) return [];

  return parsedCart.filter((id) => Object.hasOwn(products, id));
}

function saveCart(cart) {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function renderCart() {
  const cart = readCart();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(cart.length);
  });

  const itemsContainer = document.querySelector("[data-cart-items]");
  const totalElement = document.querySelector("[data-cart-total]");
  if (!itemsContainer || !totalElement) return;

  itemsContainer.replaceChildren();
  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty";
    emptyMessage.textContent = "Dein Warenkorb ist noch leer.";
    itemsContainer.append(emptyMessage);
    totalElement.textContent = "";
    return;
  }

  cart.forEach((id, index) => {
    const product = products[id];
    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("p");
    details.textContent = `${product.name} – ${product.price.toFixed(2).replace(".", ",")} €`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Entfernen";
    removeButton.setAttribute("aria-label", `${product.name} aus dem Warenkorb entfernen`);
    removeButton.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });

    row.append(details, removeButton);
    itemsContainer.append(row);
  });

  const total = cart.reduce((sum, id) => sum + products[id].price, 0);
  totalElement.textContent = `Zwischensumme: ${total.toFixed(2).replace(".", ",")} €`;
}

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.addToCart;
    if (!Object.hasOwn(products, productId)) return;

    const cart = readCart();
    cart.push(productId);
    saveCart(cart);
    renderCart();
    button.textContent = "Hinzugefügt";
    window.setTimeout(() => {
      button.textContent = "In den Warenkorb";
    }, 1200);
  });
});

const contactForm = document.querySelector("#kontaktForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#formStatus");
    status.textContent = "Das Formular ist noch nicht mit einem E-Mail-Dienst verbunden. Es wurde keine Nachricht versendet.";
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const authAction = document.querySelector("[data-auth-action]");
const loggedInUser = localStorage.getItem(authStorageKey);
if (authAction && loggedInUser) {
  const logoutButton = document.createElement("button");
  logoutButton.className = "nav-auth-link";
  logoutButton.type = "button";
  logoutButton.textContent = "Abmelden";
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(authStorageKey);
    window.location.href = "login.html";
  });
  authAction.replaceWith(logoutButton);
}

const loginForm = document.querySelector("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;
    const status = document.querySelector("#loginStatus");

    if (email === demoEmail && password === demoPassword) {
      localStorage.setItem(authStorageKey, email);
      window.location.href = "index.html";
      return;
    }

    status.textContent = "E-Mail-Adresse oder Passwort ist falsch. Bitte versuche es erneut.";
  });
}

renderCart();
