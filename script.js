let slideIndex = 1;
showSlides(slideIndex);

// Kontrol Slide dengan Panah
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Kontrol Slide dengan Dot
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  let heroTextContent = document.querySelector(".hero-main-content");

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}

  // Sembunyikan semua slide dan nonaktifkan semua dot
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Tampilkan slide yang aktif dan aktifkan dot yang sesuai
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";

  // Logika untuk menampilkan/menyembunyikan teks "Elegansi dalam Kesederhanaan"
  // Teks muncul di slide 2 dan 3
  if (slideIndex === 2 || slideIndex === 3) {
    heroTextContent.style.display = "block";
  } else {
    heroTextContent.style.display = "none";
  }
}

// Otomatis pindah slide setiap 5 detik (opsional, hapus komentar untuk mengaktifkan)
// setInterval(function() {
//     plusSlides(1);
// }, 5000);


// Logika Modal Detail Produk
document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const modal = document.getElementById('productModal');
    const closeButton = document.querySelector('.close-button');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductPrice = document.getElementById('modal-price-display');
    const modalProductImage = document.getElementById('modal-product-image');
    const quantityInput = document.getElementById('quantity');
    const decreaseQuantityBtn = document.getElementById('decrease-quantity');
    const increaseQuantityBtn = document.getElementById('increase-quantity');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    let currentPrice = 0; // Untuk menyimpan harga dasar produk yang sedang ditampilkan di modal
    let currentProductName = ''; // Menyimpan nama produk
    let currentProductImage = ''; // Menyimpan URL gambar produk

    // Event Listener untuk setiap tombol "Beli Sekarang"
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card'); // Dapatkan parent .product-card
            
            // Ambil data dari atribut data- di HTML
            currentProductName = productCard.querySelector('h3').textContent; // Menggunakan textContent
            const productDescription = productCard.querySelector('.product-description').dataset.productDesc;
            const productPrice = parseInt(productCard.querySelector('.price').dataset.productPrice);
            currentProductImage = this.dataset.productImg; // Mengambil dari data-product-img di tombol

            modalProductName.textContent = currentProductName;
            modalProductDescription.textContent = productDescription;
            modalProductImage.src = currentProductImage;
            modalProductImage.alt = currentProductName;

            currentPrice = productPrice;
            quantityInput.value = 1; // Reset quantity
            modalProductPrice.textContent = formatRupiah(currentPrice * quantityInput.value);

            modal.style.display = 'flex'; // Gunakan 'flex' agar modal bisa di-align di tengah
        });
    });

    // Event Listener untuk tombol tutup modal
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Event Listener untuk klik di luar area modal content
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Kontrol kuantitas
    decreaseQuantityBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            modalProductPrice.textContent = formatRupiah(currentPrice * quantity);
        }
    });

    increaseQuantityBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        quantity++;
        quantityInput.value = quantity;
        modalProductPrice.textContent = formatRupiah(currentPrice * quantity);
    });

    // >>> PERUBAHAN DI SINI UNTUK "TAMBAH KE KERANJANG" / CHECKOUT
    addToCartBtn.addEventListener('click', function() {
        const orderItem = {
            name: modalProductName.textContent,
            quantity: parseInt(quantityInput.value),
            price: currentPrice,
            image: modalProductImage.src
        };

        // Simpan pesanan ke localStorage
        // Untuk simulasi ini, kita hanya akan menyimpan 1 item per checkout.
        // Jika ingin keranjang belanja sebenarnya, logikanya akan lebih kompleks (menyimpan array item)
        localStorage.setItem('currentOrder', JSON.stringify([orderItem])); // Simpan sebagai array

        // Arahkan ke halaman checkout
        window.location.href = 'checkout.html';
        modal.style.display = 'none'; // Sembunyikan modal sebelum redirect (opsional)
    });
    // <<< AKHIR PERUBAHAN

    // Fungsi format Rupiah
    function formatRupiah(angka) {
        let reverse = angka.toString().split('').reverse().join(''),
            ribuan = reverse.match(/\d{1,3}/g);
        ribuan = ribuan.join('.').split('').reverse().join('');
        return 'Rp ' + ribuan;
    }

    // Logika "Lihat Lainnya"
    const loadMoreBtn = document.getElementById('load-more-btn');
    const hiddenProductWrappers = document.querySelectorAll('.hidden-product-wrapper');
    let productsToShow = 3; // Jumlah produk tambahan yang akan ditampilkan setiap kali tombol diklik
    let loadedProducts = 0;

    // Sembunyikan semua produk tambahan di awal
    hiddenProductWrappers.forEach(wrapper => {
        wrapper.style.display = 'none';
    });

    // Tampilkan tombol "Lihat Lainnya" hanya jika ada produk tersembunyi
    if (hiddenProductWrappers.length > 0) {
        loadMoreBtn.style.display = 'block'; // Tampilkan tombol jika ada produk tersembunyi
    } else {
        loadMoreBtn.style.display = 'none'; // Sembunyikan jika tidak ada
    }

    loadMoreBtn.addEventListener('click', function() {
        for (let i = 0; i < productsToShow; i++) {
            if (hiddenProductWrappers[loadedProducts + i]) {
                hiddenProductWrappers[loadedProducts + i].style.display = 'block';
            } else {
                // Semua produk sudah dimuat
                loadMoreBtn.style.display = 'none';
                break;
            }
        }
        loadedProducts += productsToShow;

        // Sembunyikan tombol jika semua produk sudah dimuat
        if (loadedProducts >= hiddenProductWrappers.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
});