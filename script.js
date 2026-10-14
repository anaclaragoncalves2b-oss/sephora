const products = [
  {
    id: 1,
    brand: "HUDA BEAUTY",
    name: "Pó solto Easy Bake",
    price: 189.90,
    category: "Maquiagem",
    art: "powder",
    label: "NOVIDADE",
    symbol: "H"
  },
  {
    id: 2,
    brand: "E.L.F. COSMETICS",
    name: "Blush líquido Camo",
    price: 69.90,
    category: "Maquiagem",
    art: "liquid",
    label: "MAIS VENDIDO",
    symbol: "elf"
  },
  {
    id: 3,
    brand: "E.L.F. COSMETICS",
    name: "Blush líquido Sheer For It",
    price: 59.90,
    category: "Maquiagem",
    art: "gloss",
    label: "NOVIDADE",
    symbol: "elf"
  },
  {
    id: 4,
    brand: "E.L.F. COSMETICS",
    name: "Iluminador Halo Glow",
    price: 79.90,
    category: "Maquiagem",
    art: "compact",
    label: "DESTAQUE",
    symbol: "e.l.f."
  },
  {
    id: 5,
    brand: "BEAUTY CARE",
    name: "Creme hidratante facial",
    price: 99.90,
    category: "Skincare",
    art: "cream",
    label: "CUIDADO",
    symbol: "✦"
  },
  {
    id: 6,
    brand: "PARFUM",
    name: "Perfume floral elegante",
    price: 249.90,
    category: "Perfumes",
    art: "perfume",
    label: "EXCLUSIVO",
    symbol: "PARIS"
  },
  {
    id: 7,
    brand: "HAIR EXPERT",
    name: "Sérum para cabelos",
    price: 149.90,
    category: "Cabelos",
    art: "hair",
    label: "NOVIDADE",
    symbol: "K"
  },
  {
    id: 8,
    brand: "BEAUTY CARE",
    name: "Balm hidratante",
    price: 49.90,
    category: "Maquiagem",
    art: "gloss",
    label: "OFERTA",
    symbol: "LOVE"
  }
];

const favorites = new Set();
const cart = [];
let selectedCategory = "Todos";
let searchText = "";

const grid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function renderProducts() {
  const filtered = products.filter(product => {
    const text = (
      product.brand + " " +
      product.name + " " +
      product.category
    ).toLowerCase();

    const matchesSearch = text.includes(searchText);
    const matchesCategory =
      selectedCategory === "Todos" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-tag">
          SÓ NA LOJA<br>${product.label}
        </span>

        <button
          class="favorite ${favorites.has(product.id) ? "active" : ""}"
          data-favorite="${product.id}"
          aria-label="Favoritar ${product.name}"
          aria-pressed="${favorites.has(product.id)}"
        >${favorites.has(product.id) ? "♥" : "♡"}</button>

        <div class="product-art ${product.art}">
          ${product.symbol}
        </div>
      </div>

      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${money(product.price)}</p>

        <div class="product-actions">
          <button data-favorite="${product.id}">
            ${favorites.has(product.id) ? "♥ Favorito" : "♡ Favoritar"}
          </button>
          <button data-cart="${product.id}">
            Adicionar
          </button>
        </div>
      </div>
    </article>
  `).join("");

  resultCount.textContent = `${filtered.length} produtos`;
  emptyMessage.hidden = filtered.length !== 0;
}

document.getElementById("searchForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();
    searchText = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();

    renderProducts();
  }
);

document.getElementById("searchInput").addEventListener(
  "input",
  event => {
    searchText = event.target.value.trim().toLowerCase();
    renderProducts();
  }
);

document.querySelectorAll(".nav [data-category]").forEach(link => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.category;
    renderProducts();
  });
});

grid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const cartButton = event.target.closest("[data-cart]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);

    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    renderProducts();
  }

  if (cartButton) {
    const id = Number(cartButton.dataset.cart);
    const product = products.find(item => item.id === id);

    if (product) {
      cart.push(product);
      document.getElementById("cartCount").textContent = cart.length;

      cartButton.textContent = "Adicionado ✓";
      setTimeout(() => {
        if (cartButton.isConnected) {
          cartButton.textContent = "Adicionar";
        }
      }, 1200);
    }
  }
});

document.getElementById("newsletterForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    document.getElementById("newsletterMessage").textContent =
      "Cadastro demonstrativo recebido!";

    event.target.reset();
  }
);

renderProducts();