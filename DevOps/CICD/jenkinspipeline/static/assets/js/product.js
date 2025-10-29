// Popular products Home
const products = [
  { name: "Gold Engraved Brass", image: "https://shreelaxminarayanhh.com//assets/img/home/gold-engraved-brass.png", price: 1299 },
  { name: "Handcrafted Lord Ganesh Figurine", image: "https://shreelaxminarayanhh.com//assets/img/home/handcrafted-lord-ganesh-figurine.jpg", price: 1599 },
  { name: "Blue Pottery Handcrafted Peacock Pot", image: "https://shreelaxminarayanhh.com//assets/img/home/blue-pottery-handcrafted-peacock-pot.jpg", price: 999 },
  { name: "Marble Handcrafted Lord Ganesh Figurine", image: "https://shreelaxminarayanhh.com//assets/img/home/marble-handcrafted-lord-ganesh-figurine.png", price: 1799 },
  { name: "Crystal Handcrafted Perfume Bottle with Spherical Lid", image: "https://shreelaxminarayanhh.com//assets/img/home/crystal-handcrafted-perfumebottle-with-spherical-lid.png", price: 799 },
  { name: "Handmade Metal Camel 'Ship of the Desert", image: "https://shreelaxminarayanhh.com//assets/img/home/handmade-metal-camel-ship of the-desert.jpg", price: 1199 }
];

const gallery = document.getElementById('productGallery');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.getElementsByClassName('close')[0];

products.forEach(product => {
  const slide = document.createElement('div');
  slide.classList.add('swiper-slide');

  slide.innerHTML = `
      <div class="animate-underline">
        <img src="${product.image}" alt="${product.name}" class="product-img rounded-4" style="cursor:pointer;"><br/><br/>
        <h3 class="d-block fs-sm fw-medium text-truncate product_title">
          <span class="animate-target">${product.name}</span>
        </h3>
        <p class="text-muted mb-2">₹${product.price}</p>
        <button class="btn btn-primary w-100 rounded-pill px-3 add-to-cart-btn"
          data-name="${product.name}"
          data-price="${product.price}"
          data-image="${product.image.replace('/static/', '')}">
          Add to Cart
        </button>
      </div>
    `;

  // Image Click Event for Popup
  slide.querySelector('.product-img').addEventListener('click', () => {
    modal.style.display = "block";
    modalImg.src = product.image;
  });

  gallery.appendChild(slide);
});

// Close Modal on X Click
closeBtn.onclick = () => {
  modal.style.display = "none";
};

// Close Modal on Outside Click
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Shop Products
const shopProducts = [
  { name: "Stone Work Handcrafted Coasters", image: "https://shreelaxminarayanhh.com//assets/img/shop/assorted-craft/handcrafted-wind-chimes-pack-of-2.png", price: 499 },
  { name: "Blue Pottery Handcrafted Aroma Candle Stand Blue", image: "https://shreelaxminarayanhh.com//assets/img/shop/blue-pottery/blue-pottery-handcrafted-jewellery-box.jpg", price: 899 },
  { name: "Brass Handcrafted Gold Plated Lord Ganesha 4.5", image: "https://shreelaxminarayanhh.com//assets/img/shop/brass-craft/brass-handcrafted-marori-khulai-pot.jpg", price: 1499 },
  { name: "Crystal Handcrafted Perfume Bottle With Handle", image: "https://shreelaxminarayanhh.com//assets/img/shop/crystal-craft/crystal-handcrafted-agarbatti-holder.png", price: 749 },
  { name: "Handcrafted Multicolor Mudda Blue & Red", image: "https://shreelaxminarayanhh.com//assets/img/shop/furniture/handcrafted-multicolor-mudda-blue&red.png", price: 999 },
  { name: "Marble Handcrafted Inlay Coasters", image: "https://shreelaxminarayanhh.com//assets/img/shop/marble-handicraft/marble-handcrafted-inlay-coasters.png", price: 1299 },
  { name: "Metal Handcrafte Decorative Peacock Smoll", image: "https://shreelaxminarayanhh.com//assets/img/shop/metal-craft/metal-handcrafted-decorative-peacock-smoll.jpg", price: 1199 },
  { name: "Camels Drinking Water Canvas Painting Unframed", image: "https://shreelaxminarayanhh.com//assets/img/shop/paintings/camels-drinking-water-canvas-painting-unframed.png", price: 899 },
  { name: "Sardar Vallabhbhai Patel Hand Carved Wooden Statue", image: "https://shreelaxminarayanhh.com//assets/img/shop/wooden-handicraft/sardar-vallabhbhai-patel-hand-carved-wooden-statue.jpg", price: 1699 },
  { name: "Handcrafted Shank with Lotus Print Design Blue Pottery", image: "https://shreelaxminarayanhh.com//assets/img/shop/blue-pottery/handcrafted-shank-with-lotus-print-design-blue-pottery.jpg", price: 799 },
  { name: "Handcrafte Metal Horse", image: "https://shreelaxminarayanhh.com//assets/img/shop/metal-craft/handcrafte-metal-horse.jpg", price: 999 },
  { name: "Handcrafted Marble Small Temple", image: "https://shreelaxminarayanhh.com//assets/img/shop/marble-handicraft/handcrafted-marble-small-temple.png", price: 1499 }
];

const shopGallery = document.getElementById('shopGalleryContainer');
const imgPopupModal = document.getElementById('imgPopupModal');
const popupImage = document.getElementById('popupFullImage');
const modalCloseBtn = document.getElementsByClassName('modalCloseBtn')[0];

shopProducts.forEach(item => {
  const productCard = document.createElement('div');

  productCard.innerHTML = `
      <div class="animate-underline">
        <img src="${item.image}" alt="${item.name}" class="productThumbnail rounded-4" style="cursor:pointer;"><br/><br/>
        <h3 class="d-block fs-sm fw-medium text-truncate product_title">
          <span class="animate-target">${item.name}</span>
        </h3>
        <p class="text-muted mb-2">₹${item.price}</p>
        <button class="btn btn-primary w-100 rounded-pill px-3 add-to-cart-btn"
          data-name="${item.name}"
          data-price="${item.price}"
          data-image="${item.image.replace('/static/', '')}">
          Add to Cart
        </button>
      </div>
    `;

  // Image Click Event for Popup
  productCard.querySelector('.productThumbnail').addEventListener('click', () => {
    imgPopupModal.style.display = "block";
    popupImage.src = item.image;
  });

  shopGallery.appendChild(productCard);
});

// Close Modal on X Click
modalCloseBtn.onclick = () => {
  imgPopupModal.style.display = "none";
};

// Close Modal on Outside Click
window.onclick = (event) => {
  if (event.target == imgPopupModal) {
    imgPopupModal.style.display = "none";
  }
};
