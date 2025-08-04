// Configurações globais
const CONFIG = {
  loadingDuration: 1500,
  scrollThreshold: 100,
  animationDuration: 800
};

// Utilitários
const Utils = {
  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  // Smooth scroll to element with offset for fixed header
  smoothScrollTo(element) {
    if (element) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20; // Extra 20px margin

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  },

  // Format phone number
  formatPhone(value) {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.substring(0, 11);

    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
  },

  // Show notification
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl transition-all duration-300 transform translate-x-full ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
    notification.innerHTML = `
          <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            <span>${message}</span>
          </div>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
};

// Loading Screen 
class LoadingScreen {
  constructor() {
    this.element = document.getElementById('loading-screen');
    this.init();
  } 

  init() {
    // Hide loading screen after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hide();
      }, CONFIG.loadingDuration);
    });
  }

  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
      setTimeout(() => {
        this.element.style.display = 'none';
      }, 500);
    }
  }
}


// Header Controller
class HeaderController {
  constructor() {
    this.header = document.querySelector('header');
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.mobileSubmenuButton = document.getElementById('mobile-submenu-button');
    this.mobileSubmenu = document.getElementById('mobile-submenu');
    this.lastScrollY = window.scrollY;

    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
  }

  setupScrollEffect() {
    const handleScroll = Utils.throttle(() => {
      const currentScrollY = window.scrollY;

      // Add/remove scrolled class
      if (currentScrollY > CONFIG.scrollThreshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      this.lastScrollY = currentScrollY;
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }

  setupMobileMenu() {
    // Toggle main mobile menu
    if (this.mobileMenuButton && this.mobileMenu) {
      this.mobileMenuButton.addEventListener('click', () => {
        this.mobileMenu.classList.toggle('hidden');

        // Update button icon
        const icon = this.mobileMenuButton.querySelector('i');
        if (this.mobileMenu.classList.contains('hidden')) {
          icon.className = 'fas fa-bars text-2xl';
        } else {
          icon.className = 'fas fa-times text-2xl';
        }
      });
    }

    // Toggle submenu
    if (this.mobileSubmenuButton && this.mobileSubmenu) {
      this.mobileSubmenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.mobileSubmenu.classList.toggle('hidden');

        // Update chevron icon
        const icon = this.mobileSubmenuButton.querySelector('i');
        if (this.mobileSubmenu.classList.contains('hidden')) {
          icon.className = 'fas fa-chevron-down text-sm transition-transform';
        } else {
          icon.className = 'fas fa-chevron-up text-sm transition-transform';
        }
      });
    }

    // Close mobile menu when clicking on links
    const mobileLinks = this.mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
      link.addEventListener('click', () => {
        this.mobileMenu.classList.add('hidden');
        const icon = this.mobileMenuButton.querySelector('i');
        icon.className = 'fas fa-bars text-2xl';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.mobileMenu?.contains(e.target) && !this.mobileMenuButton?.contains(e.target)) {
        this.mobileMenu?.classList.add('hidden');
        const icon = this.mobileMenuButton?.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-2xl';
      }
    });
  }

  setupSmoothScrolling() {
    // Handle all anchor links with improved scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          Utils.smoothScrollTo(targetElement);

          // Close mobile menu if open
          if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
            this.mobileMenu.classList.add('hidden');
            const icon = this.mobileMenuButton.querySelector('i');
            icon.className = 'fas fa-bars text-2xl';
          }
        }
      });
    });
  }
}

// Swiper Controllers
class SwiperController {
  constructor() {
    this.init();
  }

  init() {
    this.initEmpreendimentosSwiper();
  }

  initEmpreendimentosSwiper() {
    const empreendimentosSwiper = new Swiper('.empreendimentos-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      navigation: {
        nextEl: '.empreendimentos-slider .swiper-button-next',
        prevEl: '.empreendimentos-slider .swiper-button-prev',
      },
      pagination: {
        el: '.empreendimentos-slider .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 40,
        }
      }
    });
  }
}

// Form Controller
class FormController {
  constructor() {
    this.contactForm = document.getElementById('form-contato');
    this.newsletterForm = document.getElementById('newsletter-form');
    this.phoneInput = document.getElementById('telefone');

    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupNewsletterForm();
    this.setupPhoneMask();
  }

  setupContactForm() {
    if (!this.contactForm) return;

    this.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = this.contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      // Show loading state
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
      submitButton.disabled = true;

      try {
        const formData = new FormData(this.contactForm);

        const response = await fetch(this.contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          Utils.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
          this.contactForm.reset();
        } else {
          throw new Error('Erro no envio');
        }
      } catch (error) {
        Utils.showNotification('Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.', 'error');
      } finally {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  }

  setupNewsletterForm() {
    if (!this.newsletterForm) return;

    this.newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = this.newsletterForm.querySelector('button[type="submit"]');
      const emailInput = this.newsletterForm.querySelector('input[type="email"]');
      const originalText = submitButton.innerHTML;

      // Show loading state
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Cadastrando...';
      submitButton.disabled = true;

      // Simulate API call (replace with actual newsletter service)
      setTimeout(() => {
        Utils.showNotification('E-mail cadastrado com sucesso!', 'success');
        emailInput.value = '';

        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }, 1500);
    });
  }

  setupPhoneMask() {
    if (!this.phoneInput) return;

    this.phoneInput.addEventListener('input', (e) => {
      e.target.value = Utils.formatPhone(e.target.value);
    });
  }
}

// Scroll Progress Indicator
class ScrollProgress {
  constructor() {
    this.createIndicator();
    this.init();
  }

  createIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.id = 'scroll-progress';
    document.body.appendChild(indicator);
    this.indicator = indicator;
  }

  init() {
    const updateProgress = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      this.indicator.style.transform = `scaleX(${scrollPercent})`;
    }, 10);

    window.addEventListener('scroll', updateProgress);
  }
}

// Main App Controller
class App {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize AOS
    AOS.init({
      duration: CONFIG.animationDuration,
      easing: 'ease-out-cubic',
      once: false,
      offset: 100,
      delay: 0,
    });

    // Initialize all components
    new LoadingScreen();
    new HeaderController();
    new SwiperController();
    new FormController();
    new ScrollProgress();

    // Add custom event listeners
    this.setupCustomEvents();
  }

  setupCustomEvents() {
    // Handle floating button animations
    const floatingButtons = document.querySelectorAll('.floating-btn');
    floatingButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1) translateY(-2px)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1) translateY(0)';
      });
    });

    // Handle card hover effects
    const cards = document.querySelectorAll('.benefit-card, .empreendimento-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.willChange = 'transform';
      });

      card.addEventListener('mouseleave', () => {
        card.style.willChange = 'auto';
      });
    });
  }
}

// Initialize the app
new App();