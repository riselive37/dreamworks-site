document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Header Transparency
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        } else {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Works Slider
    const track = document.querySelector('.works-track');
    const items = document.querySelectorAll('.work-item');
    
    if (track && items.length > 0) {
        let currentIndex = 0;
        const totalItems = items.length;
        let itemsToShow = 3;

        // Update itemsToShow based on screen width
        const updateItemsToShow = () => {
            if (window.innerWidth <= 768) {
                itemsToShow = 1;
            } else if (window.innerWidth <= 992) {
                itemsToShow = 2;
            } else {
                itemsToShow = 3;
            }
        };

        updateItemsToShow();
        window.addEventListener('resize', updateItemsToShow);

        // Auto slide
        setInterval(() => {
            currentIndex++;
            if (currentIndex > totalItems - itemsToShow) {
                currentIndex = 0;
            }
            updateSlider();
        }, 4000);

        function updateSlider() {
            // Calculate move percentage
            // Item width is roughly 100% / itemsToShow
            // But we have gap.
            // Simplest way: use item.offsetWidth + gap
            const itemWidth = items[0].offsetWidth;
            const gap = 30; // from CSS
            const moveAmount = (itemWidth + gap) * currentIndex;
            
            track.style.transform = `translateX(-${moveAmount}px)`;
        }
    }
});
