document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Ocultar preloader después de 2.5 segundos
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2500);
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            header.classList.add('hidden');
            header.classList.remove('scrolled');
        } else {
            header.classList.remove('hidden');
            header.classList.add('scrolled');
        }
    });
    
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Smooth scrolling para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Actualizar clase activa
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Inicializar carruseles después del preloader
    setTimeout(() => {
        initHeroCarousel();
        initProyectosCarousel();
    }, 2500);
    
    // Animaciones al hacer scroll
    // Ocultar el header al cargar la página si está en la parte superior
    window.addEventListener('load', () => {
        if (window.scrollY === 0) {
            header.classList.add('hidden');
        }
    });
    window.addEventListener('scroll', animateOnScroll);
    
    // Formulario de contacto
    const contactForm = document.querySelector('.contacto-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const mensaje = this.querySelector('textarea').value.trim();
            
            if (!nombre || !email || !mensaje) {
                alert('Por favor complete todos los campos requeridos.');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Por favor ingrese un email válido.');
                return;
            }
            
            // Simular envío
            alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }
    
    // Actualizar ítem activo del menú al hacer scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Función para el carrusel hero
    function initHeroCarousel() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;

        function adjustSlideHeights() {
            const windowHeight = window.innerHeight;
            document.querySelectorAll('.slide').forEach(slide => {
                slide.style.height = `${windowHeight}px`;
            });
        } // ← Cierre correcto aquí
        
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.carousel .prev');
        const nextBtn = document.querySelector('.carousel .next');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        const slideCount = slides.length;
        let slideInterval;
        
        // Crear indicadores
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
        
        const indicators = document.querySelectorAll('.indicator');
        
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            currentSlide = (index + slideCount) % slideCount;
            
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        function startAutoPlay() {
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        function restartAutoPlay() {
            clearInterval(slideInterval);
            startAutoPlay();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoPlay();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoPlay();
        });
        
        // Iniciar autoplay
        startAutoPlay();
        
        // Pausar al hacer hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
                restartAutoPlay();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                restartAutoPlay();
            }
        });
        
        // Touch events para móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        function handleSwipe() {
            const threshold = 50;
            
            if (touchStartX - touchEndX > threshold) {
                nextSlide();
            } else if (touchEndX - touchStartX > threshold) {
                prevSlide();
            }
            restartAutoPlay();
        }
    }
    
    // Función para el carrusel de proyectos
    function initProyectosCarousel() {
        const container = document.querySelector('.proyectos-container');
        const cards = document.querySelectorAll('.proyecto-card');
        const prevBtn = document.querySelector('.prev-proyecto');
        const nextBtn = document.querySelector('.next-proyecto');
        const indicatorsContainer = document.querySelector('.proyectos-indicators');
        
        if (!container || cards.length === 0) return;
        
        let currentIndex = 0;
        let cardWidth = cards[0].offsetWidth + 20;
        let visibleCards = calculateVisibleCards();
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        
        // Calcular tarjetas visibles según el ancho de pantalla
        function calculateVisibleCards() {
            const screenWidth = window.innerWidth;
            if (screenWidth < 576) return 1;
            if (screenWidth < 992) return 2;
            return 3;
        }
        
        // Crear indicadores
        const totalSlides = Math.ceil(cards.length / visibleCards);
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToProject(i));
            indicatorsContainer.appendChild(indicator);
        }
        
        const indicators = document.querySelectorAll('.proyectos-indicators .indicator');
        
        function goToProject(slideIndex) {
            currentIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
            const offset = -currentIndex * visibleCards * cardWidth;
            container.style.transform = `translateX(${offset}px)`;
            currentTranslate = offset;
            prevTranslate = offset;
            
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === currentIndex);
            });
        }
        
        // Event listeners para botones
        prevBtn.addEventListener('click', () => goToProject(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToProject(currentIndex + 1));
        
        // Touch events para móviles
        container.addEventListener('touchstart', touchStart, {passive: true});
        container.addEventListener('touchend', touchEnd, {passive: true});
        container.addEventListener('touchmove', touchMove, {passive: true});
        
        // Mouse events para desktop
        container.addEventListener('mousedown', touchStart);
        container.addEventListener('mouseup', touchEnd);
        container.addEventListener('mouseleave', touchEnd);
        container.addEventListener('mousemove', touchMove);
        
        function touchStart(e) {
            if (e.type === 'touchstart') {
                startPos = e.touches[0].clientX;
            } else {
                startPos = e.clientX;
                e.preventDefault();
            }
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            container.style.cursor = 'grabbing';
            container.style.transition = 'none';
        }
        
        function touchEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);
            
            const movedBy = currentTranslate - prevTranslate;
            
            if (movedBy < -100 && currentIndex < totalSlides - 1) {
                currentIndex += 1;
            } else if (movedBy > 100 && currentIndex > 0) {
                currentIndex -= 1;
            }
            
            goToProject(currentIndex);
            container.style.cursor = 'grab';
            container.style.transition = 'transform 0.5s ease';
        }
        
        function touchMove(e) {
            if (isDragging) {
                const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }
        
        function animation() {
            container.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }
        
        // Manejo responsive
        function handleResize() {
            const newVisibleCards = calculateVisibleCards();
            const newCardWidth = cards[0].offsetWidth + 20;
            
            if (newVisibleCards !== visibleCards || Math.abs(newCardWidth - cardWidth) > 5) {
                visibleCards = newVisibleCards;
                cardWidth = newCardWidth;
                const newTotalSlides = Math.ceil(cards.length / visibleCards);
                
                // Actualizar indicadores si cambió el total de slides
                if (newTotalSlides !== totalSlides) {
                    indicatorsContainer.innerHTML = '';
                    for (let i = 0; i < newTotalSlides; i++) {
                        const indicator = document.createElement('div');
                        indicator.classList.add('indicator');
                        if (i === currentIndex) indicator.classList.add('active');
                        indicator.addEventListener('click', () => goToProject(i));
                        indicatorsContainer.appendChild(indicator);
                    }
                }
                
                currentIndex = Math.min(currentIndex, newTotalSlides - 1);
                goToProject(currentIndex);
            }
        }
        
        window.addEventListener('resize', handleResize);
        adjustSlideHeights();
        window.addEventListener('resize', adjustSlideHeights);
        
        // Inicializar
        goToProject(0);
    }
    
    // Función para animaciones al hacer scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.slide-content, .servicio-card, .nosotros-image, .proyecto-card, .contacto-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Estilos iniciales para elementos animados
    document.querySelectorAll('.slide-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    document.querySelectorAll('.servicio-card, .nosotros-image, .proyecto-card, .contacto-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

let lastScroll = 0;
const scrollThreshold = 100; // Ajusta este valor según necesites

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll === 0) {
        // Si está en el tope, ocultar
        header.classList.add('hidden');
        header.classList.remove('scrolled');
    } else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        // Si el usuario baja la página, ocultar
        header.classList.add('hidden');
    } else {
        // Si el usuario sube la página, mostrar
        header.classList.remove('hidden');
        header.classList.add('scrolled');
    }

    lastScroll = currentScroll;
});