document.addEventListener('DOMContentLoaded', function() {
            const exploreBtn = document.getElementById('explore-menu');
            const menuSection = document.getElementById('menu-preview');
            
            exploreBtn.addEventListener('click', function() {
                menuSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

document.addEventListener('DOMContentLoaded', function() {
            const browseBtn = document.getElementById('browse-menu');
            const menuSection = document.getElementById('menu-preview');
            
            browseBtn.addEventListener('click', function() {
                menuSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('auth-modal');
            const closeBtn = document.getElementById('close-modal');
            const menuCards = document.querySelectorAll('.menu-card');
            
            // Intersection Observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, {
                threshold: 0.1
            });

            menuCards.forEach(card => {
                observer.observe(card);
                
                // Click/tap handler
                card.addEventListener('click', function(e) {
                    // Only open modal if clicking on the card itself (not buttons inside)
                    if (e.target === card || e.target.closest('button') === null) {
                        openModal();
                    }
                });
                
                // Touch devices - toggle animation on tap
                card.addEventListener('touchstart', function() {
                    card.classList.toggle('animate');
                }, { passive: true });
            });
            
            function openModal() {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            function closeModal() {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
            
            closeBtn.addEventListener('click', closeModal);
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    closeModal();
                }
            });

            // Add to cart functionality
            const addToCartButtons = document.querySelectorAll('.menu-card button');
            
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering card click
                    openModal();
                });
            });
        });