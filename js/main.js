document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.classList.remove('scrolled');
      header.style.backgroundColor = 'rgba(250, 248, 245, 0.95)';
      header.style.boxShadow = 'var(--shadow-sm)';
    }
  });

  // Cart Management — Toggle Add/Remove
  let cartItems = JSON.parse(localStorage.getItem('aura_cart_items') || '[]');
  const cartCounts = document.querySelectorAll('.cart-count');
  
  const updateCartUI = () => {
    const count = cartItems.length;
    cartCounts.forEach(el => {
      el.textContent = count;
      el.style.display = count === 0 ? 'none' : 'flex';
    });

    // Update all add-to-cart buttons on this page
    document.querySelectorAll('.add-to-cart-btn[data-product]').forEach(btn => {
      const name = btn.getAttribute('data-product');
      const inCart = cartItems.includes(name);
      const icon = btn.querySelector('i');
      if (inCart) {
        btn.classList.add('in-cart');
        btn.setAttribute('aria-label', '從購物車移除');
        if (icon) { icon.className = 'fa-solid fa-check'; }
      } else {
        btn.classList.remove('in-cart');
        btn.setAttribute('aria-label', '加到購物車');
        if (icon) { icon.className = 'fa-solid fa-bag-shopping'; }
      }
    });

    // Update detail page add-to-cart button if present
    const detailAddBtn = document.querySelector('.detail-add-btn');
    if (detailAddBtn) {
      const detailTitle = document.querySelector('.detail-title');
      if (detailTitle) {
        const productName = detailTitle.textContent;
        const inCart = cartItems.includes(productName);
        if (inCart) {
          detailAddBtn.textContent = '✓ 已加入購物車（點擊取消）';
          detailAddBtn.classList.add('in-cart');
        } else {
          detailAddBtn.textContent = '加入購物車';
          detailAddBtn.classList.remove('in-cart');
        }
      }
    }
  };
  
  updateCartUI();

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#111111';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.fontFamily = 'var(--font-sans)';
    toast.style.fontSize = '0.9rem';
    toast.style.zIndex = '10000';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  window.addToCart = (productName) => {
    const index = cartItems.indexOf(productName);
    if (index > -1) {
      // Remove from cart
      cartItems.splice(index, 1);
      localStorage.setItem('aura_cart_items', JSON.stringify(cartItems));
      updateCartUI();
      showToast(`已將「${productName}」從購物車移除`);
    } else {
      // Add to cart
      cartItems.push(productName);
      localStorage.setItem('aura_cart_items', JSON.stringify(cartItems));
      updateCartUI();
      showToast(`已將「${productName}」加入購物車`);
    }
  };

  // Product Catalog Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-grid .product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Set active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        productCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.5s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // FAQ Accordion
  const faqHeaders = document.querySelectorAll('.faq-header');
  if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        
        // Close all first for clean single-accordion behavior
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('open');
        });

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate API submit
      const btn = contactForm.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = '傳送中...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        contactForm.reset();
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeIn 0.4s ease';
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }

  // Newsletter Subscriptions
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value.trim();
      if (email) {
        alert('感謝您的訂閱！我們將為您發送最新優惠與美妝教學。');
        input.value = '';
      }
    });
  }

  // Product Detail Page Quantity Selector
  const btnMinus = document.querySelector('.qty-btn.minus');
  const btnPlus = document.querySelector('.qty-btn.plus');
  const qtyVal = document.querySelector('.qty-val');
  if (btnMinus && btnPlus && qtyVal) {
    let currentQty = 1;
    btnMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.textContent = currentQty;
      }
    });
    btnPlus.addEventListener('click', () => {
      currentQty++;
      qtyVal.textContent = currentQty;
    });

    // Handle add/remove toggle for detail page
    const detailAddBtn = document.querySelector('.detail-add-btn');
    if (detailAddBtn) {
      detailAddBtn.addEventListener('click', () => {
        const productName = document.querySelector('.detail-title').textContent;
        window.addToCart(productName);
      });
    }
  }

  // Product Detail Color Dots Selection
  const colorDots = document.querySelectorAll('.color-dot');
  if (colorDots.length > 0) {
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });
  }

  // Product Detail Tabs Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  }
});
