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
  // Баннеры магазина: свайп / drag
  // --------------------------
  const shopTrack = document.querySelector('.shop-banners-track');
  const shopSlides = Array.from(document.querySelectorAll('.shop-banner-slide'));
  let shopIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationId = 0;

  function setShopPosition() {
    shopTrack.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setShopByIndex() {
    const slideWidth = shopTrack.clientWidth;
    currentTranslate = -shopIndex * slideWidth;
    prevTranslate = currentTranslate;
    setShopPosition();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  }

  function shopTouchStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    animationId = requestAnimationFrame(shopAnimation);
    shopTrack.style.cursor = 'grabbing';
  }

  function shopTouchMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const delta = currentX - startX;
    currentTranslate = prevTranslate + delta;
  }

  function shopTouchEnd() {
    cancelAnimationFrame(animationId);
    isDragging = false;
    const slideWidth = shopTrack.clientWidth;
    const movedBy = currentTranslate - prevTranslate;

    const threshold = slideWidth * 0.15; // 15% ширины для смены слайда
    if (movedBy < -threshold && shopIndex < shopSlides.length - 1) {
      shopIndex += 1;
    } else if (movedBy > threshold && shopIndex > 0) {
      shopIndex -= 1;
    }

    setShopByIndex();
    shopTrack.style.cursor = 'grab';
  }

  function shopAnimation() {
    setShopPosition();
    if (isDragging) requestAnimationFrame(shopAnimation);
  }

  if (shopTrack && shopSlides.length > 0) {
    // запретим браузеру тянуть картинки «как файлы»
    shopSlides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) {
        img.addEventListener('dragstart', e => e.preventDefault());
      }

      // тач
      slide.addEventListener('touchstart', shopTouchStart, { passive: true });
      slide.addEventListener('touchmove', shopTouchMove, { passive: true });
      slide.addEventListener('touchend', shopTouchEnd);

      // мышь
      slide.addEventListener('mousedown', shopTouchStart);
      slide.addEventListener('mousemove', shopTouchMove);
      slide.addEventListener('mouseup', shopTouchEnd);
      slide.addEventListener('mouseleave', () => {
        if (isDragging) shopTouchEnd();
      });
    });

    window.addEventListener('resize', setShopByIndex);
    setShopByIndex();
  }

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
