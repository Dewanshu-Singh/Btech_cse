import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Reveal Animations on Scroll ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });
  
  // Trigger reveal for elements already in viewport on load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight) {
         el.classList.add('active');
      }
    });
  }, 100);

  // --- Web Popup Banner ---
  const webPopup = document.getElementById('web-popup');
  const closePopupBtn = document.getElementById('popup-close');
  const applyPopupBtn = document.getElementById('popup-apply-btn');

  if (webPopup) {
    // Show popup after 1 second
    setTimeout(() => {
      webPopup.classList.add('active');
    }, 1000);

    // Close on X click
    closePopupBtn.addEventListener('click', () => {
      webPopup.classList.remove('active');
    });

    // Close on Apply Now click (which also redirects to #home via href)
    applyPopupBtn.addEventListener('click', () => {
      webPopup.classList.remove('active');
    });

    // Close on click outside content
    webPopup.addEventListener('click', (e) => {
      if (e.target === webPopup) {
        webPopup.classList.remove('active');
      }
    });
  }

  // --- 3D Coverflow Carousel Logic ---
  const track = document.getElementById('carousel-track');
  if (track) {
    const items = Array.from(track.querySelectorAll('.carousel-item'));
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    let currentIndex = 0;
    
    // Create dots
    items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot-btn');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.dot-btn'));

    function updateCarousel() {
      // Remove all classes
      items.forEach(item => {
        item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');
      });
      dots.forEach(dot => dot.classList.remove('active'));

      // Calculate indices (wrapping around)
      const prev2Index = (currentIndex - 2 + items.length) % items.length;
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      const nextIndex = (currentIndex + 1) % items.length;
      const next2Index = (currentIndex + 2) % items.length;

      // Assign classes
      items[currentIndex].classList.add('active');
      items[prevIndex].classList.add('prev');
      items[nextIndex].classList.add('next');
      items[prev2Index].classList.add('prev-2');
      items[next2Index].classList.add('next-2');
      
      dots[currentIndex].classList.add('active');
    }

    function moveNext() {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    }

    function movePrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
    }

    // Event Listeners
    if(nextBtn) nextBtn.addEventListener('click', () => { moveNext(); resetAutoPlay(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { movePrev(); resetAutoPlay(); });

    // Click on side images to navigate
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (item.classList.contains('prev') || item.classList.contains('next')) {
          currentIndex = index;
          updateCarousel();
          resetAutoPlay();
        }
      });
    });

    // Auto Play
    let autoPlayTimer = setInterval(moveNext, 3500);

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(moveNext, 3500);
    }
    
    // Pause auto-play on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', () => resetAutoPlay());

    // Initialize
    updateCarousel();
  }
});
