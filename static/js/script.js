// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Close menu when clicking outside (for mobile)
    document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (!e.target.closest('.nav-container') && window.innerWidth <= 992) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Animation on scroll for course cards, feature cards, and testimonials
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.course-card, .feature-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };

    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Form submission with loading indicator
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const loader = document.createElement('div');
                loader.className = 'loader';
                submitButton.insertAdjacentElement('beforeend', loader);
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    loader.remove();
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    });

    // Touch device hover fix
    document.querySelectorAll('.btn, .course-card, .feature-card').forEach(element => {
        element.addEventListener('touchstart', () => {
            element.classList.add('hover-effect');
            setTimeout(() => element.classList.remove('hover-effect'), 500);
        });
    });

    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.comment-slide');
    const pagination = document.querySelector('.pagination');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let slideIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    // Create pagination dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === slideIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        pagination.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Determine slides per view based on screen width
    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 4;
    }
    
    // Update slider position
    function updateSliderPosition() {
        const slidesPerView = getSlidesPerView();
        const slideWidth = sliderWrapper.clientWidth / slidesPerView + 30;
        sliderWrapper.style.transform = `translateX(-${slideIndex * slideWidth + 15}px)`;
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex].classList.add('active');
    }
    
    // Go to specific slide
    function goToSlide(index) {
        slideIndex = index;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        if (slideIndex >= slides.length) slideIndex = 0;
        updateSliderPosition();
    }
    
    // Next slide
    function nextSlide() {
        slideIndex++;
        if (slideIndex >= slides.length) slideIndex = 0;
        updateSliderPosition();
    }
    
    // Previous slide
    function prevSlide() {
        slideIndex--;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        updateSliderPosition();
    }
    
    // Touch and mouse events for dragging
    slides.forEach(slide => {
        // Touch events
        slide.addEventListener('touchstart', touchStart);
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);
        
        // Mouse events
        slide.addEventListener('mousedown', touchStart);
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });
    
    function touchStart(event) {
        event.preventDefault();
        isDragging = true;
        startPos = getPositionX(event);
        
        animationID = requestAnimationFrame(animation);
        sliderWrapper.style.transition = 'none';
    }
    
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        const slidesPerView = getSlidesPerView();
        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -100) nextSlide();
        if (movedBy > 100) prevSlide();
        
        sliderWrapper.style.transition = 'transform 0.5s ease';
        currentTranslate = 0;
        prevTranslate = 0;
        setSliderPosition();
    }
    
    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = currentPosition - startPos;
        }
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? 
            event.pageX : 
            event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    function setSliderPosition() {
        const slidesPerView = getSlidesPerView();
        const slideWidth = sliderWrapper.clientWidth / slidesPerView;
        sliderWrapper.style.transform = `translateX(calc(-${slideIndex * slideWidth + 15}px + ${currentTranslate}px))`;
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Initialize
    updateSliderPosition();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateSliderPosition();
    });

            // اسکریپت اسکرول
    document.querySelector('.scroll-prompt').addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector('#courses');
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });

    const consultationBtn = document.getElementById('consultationBtn');
    const consultationModal = document.getElementById('consultationModal');
    const modalClose = document.querySelector('.modal-close');
    const consultationForm = document.querySelector('.consultation-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    // باز کردن مودال
    consultationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        consultationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // بستن مودال
    function closeModal() {
        consultationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    consultationModal.addEventListener('click', function(e) {
        if (e.target === consultationModal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && consultationModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // ارسال فرم
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // اعتبارسنجی
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!name || !phone) {
                alert('لطفاً تمام فیلدهای ضروری را پر کنید.');
                return;
            }
            
            if (!/^09[0-9]{9}$/.test(phone)) {
                alert('لطفاً شماره تماس معتبر وارد کنید.');
                return;
            }
            
            // نمایش لودر
            submitBtn.classList.add('loading');
            
            // شبیه‌سازی ارسال به سرور
            setTimeout(function() {
                submitBtn.classList.remove('loading');
                
                // نمایش پیام موفقیت
                const successMsg = `
                    <div style="text-align:center; padding:15px;">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>
                            <path d="M22 4L12 14.01L9 11.01" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h3 style="color:var(--primary); margin:10px 0 5px;">درخواست شما ثبت شد!</h3>
                        <p style="color:var(--text-secondary); font-size:14px;">مشاور ما به زودی با شما تماس خواهد گرفت.</p>
                    </div>
                `;
                
                document.querySelector('.modal-body').innerHTML = successMsg;
                
                setTimeout(closeModal, 2000);
                
                // ردیابی رویداد
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'consultation_submit', {
                        'event_category': 'lead',
                        'event_label': 'Consultation Form Submit'
                    });
                }
            }, 1500);
        });
    }

    window.addEventListener('goftino_ready', function () {
        Goftino.setWidget({
            hasIcon: false,
        });

        document.getElementsByClassName("chat")[0].addEventListener("click", function () {
            closeModal();
            Goftino.toggle();
        });
    });
});
