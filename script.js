// ================================================
// Mobile Menu Toggle
// ================================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navActions = document.querySelector('.nav-actions');
const header = document.querySelector('.header');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navActions.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navActions.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) &&
        !hamburger.contains(e.target) &&
        !navActions.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navActions.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ================================================
// Smooth Scroll
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================================
// Active Nav Link on Scroll
// ================================================
const sections = document.querySelectorAll('section[id]');
const sectionNavLinks = Array.from(navLinks).filter((link) => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#');
});
let lastScrollY = window.pageYOffset;

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
        if (scrollY <= 24) {
            header.classList.remove('warning-hidden');
        } else if (scrollY > lastScrollY && scrollY > 120) {
            header.classList.add('warning-hidden');
        } else if (scrollY < lastScrollY) {
            header.classList.remove('warning-hidden');
        }
    }

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    lastScrollY = scrollY;
});

// ================================================
// 3D Carousel with Pop-Forward Effect & Swipe
// ================================================
const carouselPrev = document.querySelector('.carousel-btn-prev');
const carouselNext = document.querySelector('.carousel-btn-next');
const carouselTrack = document.querySelector('.carousel-track');
const carouselCards = document.querySelectorAll('.carousel-card');

if (carouselPrev && carouselNext && carouselTrack && carouselCards.length > 0) {
    let currentIndex = Math.floor(carouselCards.length / 2); // Start with center card
    const totalSlides = carouselCards.length;

    // Touch/drag state
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragDistance = 0;
    let isTouching = false;  // verjin
    let suppressClickUntil = 0; //vetjin
    let startY = 0;      //նորավելացրած
    let lockedDirection = null; // 'x' or 'y' nորավելացրած
    // let startTranslate = 0;  //նորավելացրած
    const DRAG_THRESHOLD = 10;  // Minimum pixels to consider it a drag vs click
    const SWIPE_THRESHOLD = 50; // Minimum pixels to trigger slide change

    // Update carousel - assign position classes
    const updateCarousel = () => {
        carouselCards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2');

            // Calculate relative position to active card
            let diff = index - currentIndex;

            // Handle wraparound
            if (diff > totalSlides / 2) diff -= totalSlides;
            if (diff < -totalSlides / 2) diff += totalSlides;

            // Assign classes based on position
            if (diff === 0) {
                card.classList.add('active');
            } else if (diff === -1) {
                card.classList.add('left-1');
            } else if (diff === -2) {
                card.classList.add('left-2');
            } else if (diff === 1) {
                card.classList.add('right-1');
            } else if (diff === 2) {
                card.classList.add('right-2');
            }
        });
    };

    // Navigate to next slide
    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    };

    // Navigate to previous slide
    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    };

    // Button click handlers
    carouselNext.addEventListener('click', nextSlide);
    carouselPrev.addEventListener('click', prevSlide);

    //Touch event handlers


    const handleTouchStart = (e) => {
        isTouching = true;
        suppressClickUntil = Date.now() + 450;

       isDragging = true;
       lockedDirection = null;
       startX = e.touches[0].clientX;
       startY = e.touches[0].clientY;
       currentX = startX;
        dragDistance = 0;
        };



    const handleTouchMove = (e) => {
  if (!isDragging) return;

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  const dx = x - startX;
  const dy = y - startY;

  currentX = x;
  dragDistance = Math.abs(dx);

  if (!lockedDirection && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
    lockedDirection = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  }

  if (lockedDirection === 'x' && e.cancelable) {
    e.preventDefault();
  }
};





    const handleTouchEnd = () => {
  if (!isDragging) return;

  const deltaX = currentX - startX;

  if (lockedDirection === 'x' && Math.abs(deltaX) > SWIPE_THRESHOLD) {
    deltaX > 0 ? prevSlide() : nextSlide();
  }

  isDragging = false;
  lockedDirection = null;
    setTimeout(() => {
    isTouching = false;
  }, 0);
};

    // Mouse event handlers for desktop
    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        dragDistance = 0;
        startTranslate = -currentIndex * 100;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.cursor = 'grabbing';
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        currentX = e.clientX;
        const deltaX = currentX - startX;
        dragDistance = Math.abs(deltaX);

        if (dragDistance > DRAG_THRESHOLD) {
            // Calculate drag percentage
            const containerWidth = carouselTrack.offsetWidth / totalSlides;
            const dragPercent = (deltaX / containerWidth) * 100;
            const newTranslate = startTranslate + dragPercent;

            carouselTrack.style.transform = `translateX(${newTranslate}%)`;
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;

        const deltaX = currentX - startX;

        // Check if drag was significant enough
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
            if (deltaX > 0) {
                prevSlide(); // Dragged right
            } else {
                nextSlide(); // Dragged left
            }
        } else {
            updateCarousel(); // Snap back to current slide
        }

        isDragging = false;
        carouselTrack.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            updateCarousel(); // Snap back if mouse leaves
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
        }
    };

    // Add event listeners for touch
    carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
    carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselTrack.addEventListener('touchend', handleTouchEnd);

    // Add event listeners for mouse
    carouselTrack.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    carouselTrack.addEventListener('mouseleave', handleMouseLeave);

    // Handle card clicks - distinguish between click and drag
    // carouselCards.forEach((card, index) => {
    //     card.addEventListener('click', (e) => {
    //         // Prevent navigation if we dragged
    //         if (dragDistance > DRAG_THRESHOLD) {
    //             e.preventDefault();
    //             return;
    //         }

    //         // If clicking a non-active card, make it active instead of following link
    //         if (index !== currentIndex) {
    //             e.preventDefault();
    //             currentIndex = index;
    //             updateCarousel();
    //         }
    //         // If clicking active card with no drag, allow link to work
    //     });
    // });

//     carouselCards.forEach((card, index) => {
//   card.addEventListener('click', (e) => {
//     // եթե սա swipe է եղել, ոչ թե tap
//     if (lockedDirection === 'x') {
//       e.preventDefault();
//       return;
//     }

//     // tap ոչ ակտիվ card-ի վրա → դարձնում ենք active     ////մնա
//     if (index !== currentIndex) {
//       e.preventDefault();
//       currentIndex = index;
//       updateCarousel();
//     }
//   });
// });


carouselCards.forEach((card, index) => {
  card.addEventListener('click', (e) => {
    // եթե touch է եղել կամ swipe է եղել → click-ը անտեսել
    if (isTouching || dragDistance > DRAG_THRESHOLD) {
      e.preventDefault();
      return;
    }

    // tap ոչ ակտիվ card-ի վրա → դարձնում ենք active
    if (index !== currentIndex) {
      e.preventDefault();
      currentIndex = index;
      updateCarousel();
    }
  });
});

    // Set initial cursor
    carouselTrack.style.cursor = 'grab';

    // Initialize on load
    updateCarousel();

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// ================================================
// Filter Buttons
// ================================================
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// ================================================
// Scroll Animation (Add smooth reveal effects)
// ================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animateElements = document.querySelectorAll('.nft-card, .work-card, .category-card, .feature-card');
animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

/// footer
const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");

city.addEventListener("toggle", toggleCont);

city.addEventListener("click", () => {
    city.dispatchEvent(new Event("toggle"));
});

function toggleCont() {
    city.classList.toggle("active");
    cont.forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

// ================================================
// Product Overview Cards
// ================================================
const reviewCardContent = {
    "Mega Box 25K": {
        image: "images/4.jpg",
        alt: "JNR Mega Box 25K Einweg Vape in Nahaufnahme",
        text: "Die JNR Mega Box 25K Einweg Vape steht fuer markantes Design, hohe Kapazitaet und ein JNR Vape Erlebnis fuer alle, die ein Modell mit bis zu 25.000 Zuegen und starkem Auftritt suchen."
    },
    "Falcon Pro 28K": {
        image: "images/JNR Falcon.png",
        alt: "JNR Falcon Pro 28K Einweg Vape in Nahaufnahme",
        text: "Die JNR Falcon Pro 28K Einweg Vape verbindet das auffaellige Falcon Design mit Blue Razz Ice Look, moderner Anzeige und einer starken Position fuer Nutzer, die eine JNR Vape mit bis zu 28.000 Zuegen suchen."
    },
    "RageGorilla 55K": {
        image: "images/2-4.jpg",
        alt: "JNR RageGorilla 55K Cola Ice Einweg Vape in der Hand",
        text: "Die JNR RageGorilla 55K Einweg Vape im Cola Ice Design richtet sich an Fans von grosser Reichweite, intensivem Geschmack und einem JNR Modell mit extra hoher Zugzahl und praesenter Optik."
    },
    "Alien 10K": {
        image: "images/tt0EhkJ-a.jpg",
        alt: "JNR Alien 10K Einweg Vape mit Relief-Design und Display",
        text: "Die JNR Alien 10K Einweg Vape zeigt ein kompaktes Format mit auffaelligem Relief, Display und JNR Charakter fuer alle, die eine Einweg E-Zigarette mit bis zu 10.000 Zuegen und eigenstaendigem Stil bevorzugen."
    }
};

document.querySelectorAll('.customer-reviews .review-card').forEach((card) => {
    const title = card.querySelector('.review-user-name')?.textContent?.trim();
    const content = title ? reviewCardContent[title] : null;

    if (!content) {
        return;
    }

    const image = card.querySelector('.review-product img');
    const text = card.querySelector('.review-text');

    if (image) {
        image.src = content.image;
        image.alt = content.alt;
    }

    if (text) {
        text.textContent = content.text;
    }
});
