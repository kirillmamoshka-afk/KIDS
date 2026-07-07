// app.js

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------
  // Переключение табов / экранов
  // --------------------------
  const tabs = document.querySelectorAll('.bottom .tab');
  const screens = document.querySelectorAll('.screen-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      screens.forEach(screen => {
        screen.classList.toggle(
          'active',
          screen.getAttribute('data-screen') === target
        );
      });
    });
  });

  // --------------------------
  // Hero-карусель вверху (как раньше, но компактно)
  // --------------------------
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.carousel-dots .dot');
  const heroPrev = document.querySelector('.carousel-arrow.prev');
  const heroNext = document.querySelector('.carousel-arrow.next');
  let heroIndex = 0;

  function setHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    heroIndex = index;
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.slide) || 0;
      setHeroSlide(idx);
    });
  });

  if (heroPrev && heroNext) {
    heroPrev.addEventListener('click', () => {
      const next = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
      setHeroSlide(next);
    });

    heroNext.addEventListener('click', () => {
      const next = (heroIndex + 1) % heroSlides.length;
      setHeroSlide(next);
    });
  }

  // Можно включить автопрокрутку, если захочешь:
  // setInterval(() => setHeroSlide((heroIndex + 1) % heroSlides.length), 8000);

  // --------------------------
  // Баннеры магазина (простой слайдер)
  // --------------------------
  const shopTrack = document.querySelector('.shop-banners-track');
  const shopSlides = document.querySelectorAll('.shop-banner-slide');
  const shopDots = document.querySelectorAll('.shop-banners-dots .dot');
  let shopIndex = 0;

  function updateShopSlider(index) {
    if (!shopTrack || shopSlides.length === 0) return;
    const clamped = Math.max(0, Math.min(index, shopSlides.length - 1));

    // смещение всей ленты по X
    const offset = -clamped * 100;
    shopTrack.style.transform = `translateX(${offset}%)`;

    shopSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === clamped);
    });
    shopDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === clamped);
    });

    shopIndex = clamped;
  }

  shopDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.shopBanner) || 0;
      updateShopSlider(idx);
    });
  });

  // Простая поддержка свайпа для баннеров магазина
  let startX = null;
  let isTouching = false;

  function onShopTouchStart(e) {
    isTouching = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onShopTouchMove(e) {
    if (!isTouching || startX === null) return;
    // Если захочешь добавить "перетаскивание" превью — здесь можно менять translateX во время движения.
  }

  function onShopTouchEnd(e) {
    if (!isTouching || startX === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dx = endX - startX;

    const threshold = 40; // сколько пикселей нужно "протащить", чтобы считать свайпом
    if (dx > threshold && shopIndex > 0) {
      updateShopSlider(shopIndex - 1); // свайп вправо -> предыдущий
    } else if (dx < -threshold && shopIndex < shopSlides.length - 1) {
      updateShopSlider(shopIndex + 1); // свайп влево -> следующий
    }

    isTouching = false;
    startX = null;
  }

  if (shopTrack) {
    // тач
    shopTrack.addEventListener('touchstart', onShopTouchStart, { passive: true });
    shopTrack.addEventListener('touchmove', onShopTouchMove, { passive: true });
    shopTrack.addEventListener('touchend', onShopTouchEnd);

    // мышь (опционально — для десктопа)
    shopTrack.addEventListener('mousedown', onShopTouchStart);
    shopTrack.addEventListener('mouseup', onShopTouchEnd);
    shopTrack.addEventListener('mouseleave', onShopTouchEnd);
  }

  // начальное состояние
  setHeroSlide(0);
  updateShopSlider(0);
});
