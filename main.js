document.addEventListener("DOMContentLoaded", () => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Philosophy Section Animations
    const revealTexts = document.querySelectorAll('.reveal-text');
    
    revealTexts.forEach((text) => {
        gsap.to(text, {
            backgroundPositionX: "0%",
            ease: "none",
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
                end: "bottom 35%",
                scrub: 1,
            }
        });
    });

    // 2. Video Grid Animations
    const videoCards = document.querySelectorAll('.video-card');
    
    gsap.from(videoCards, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
            trigger: '.video-grid',
            start: "top 80%",
        }
    });

    // 3. Innovative Contact Section - Click to Copy Email
    const copyWidget = document.getElementById('copy-email');
    if (copyWidget) {
        copyWidget.addEventListener('click', async () => {
            const email = "edisid25@gmail.com";
            try {
                await navigator.clipboard.writeText(email);
                copyWidget.classList.add('copied');
                
                // Add a cool little pop animation
                gsap.fromTo(copyWidget, 
                    { scale: 0.95 }, 
                    { scale: 1, duration: 0.4, ease: "back.out(1.7)" }
                );

                setTimeout(() => {
                    copyWidget.classList.remove('copied');
                }, 2500);
            } catch (err) {
                console.error("Failed to copy", err);
                // Fallback for older browsers
                window.location.href = `mailto:${email}`;
            }
        });
    }

    // 4. Custom YouTube Player Logic
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('youtube-player');
    const closeBtn = document.querySelector('.close-modal');

    // Function to extract YouTube ID
    function getYouTubeID(url) {
        if (!url || url === 'YOUR_GYM_EDIT_URL' || url.includes('YOUR_')) return null;
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        } else if (url.includes('youtube.com/shorts/')) {
            videoId = url.split('shorts/')[1].split('?')[0];
        }
        return videoId;
    }

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            const videoId = getYouTubeID(url);
            
            if (videoId) {
                // YouTube embed
                iframe.style.display = 'block';
                const existingVideo = document.getElementById('local-video-player');
                if (existingVideo) existingVideo.remove();

                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else if (url.endsWith('.mp4') || url.includes('videos/')) {
                // Local video playback
                iframe.style.display = 'none';
                iframe.src = '';
                
                let videoTag = document.getElementById('local-video-player');
                if (!videoTag) {
                    videoTag = document.createElement('video');
                    videoTag.id = 'local-video-player';
                    videoTag.style.position = 'absolute';
                    videoTag.style.top = '0';
                    videoTag.style.left = '0';
                    videoTag.style.width = '100%';
                    videoTag.style.height = '100%';
                    videoTag.controls = true;
                    videoTag.autoplay = true;
                    document.querySelector('.video-wrapper').appendChild(videoTag);
                }
                videoTag.src = url;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                alert("Please replace the placeholder URL with your actual YouTube link or a local video path (.mp4)");
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        // Small delay to allow fade out animation before resetting iframe/video
        setTimeout(() => {
            iframe.src = '';
            const existingVideo = document.getElementById('local-video-player');
            if (existingVideo) existingVideo.remove();
            document.body.style.overflow = ''; // Restore scrolling
        }, 400);
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('video-wrapper')) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
