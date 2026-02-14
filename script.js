document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to my website");

    // Robotic click sound for clickable buttons/links (Web Audio API)
    var clickCtx = null;
    function playRoboticClick() {
        try {
            if (!clickCtx) clickCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (clickCtx.state === 'suspended') clickCtx.resume();
            var now = clickCtx.currentTime;
            var g = clickCtx.createGain();
            g.gain.setValueAtTime(0.25, now);
            g.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
            g.connect(clickCtx.destination);
            var osc = clickCtx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
            osc.connect(g);
            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {}
    }
    document.addEventListener('click', function(e) {
        var t = e.target;
        if (t.closest('button, a[href], .cta-button, .expertise-tag, .contact-button, .audio-toggle-btn, .lab-toggle-btn, .lightbox-close')) playRoboticClick();
    });

    // Audio Control Functionality
    const audio = document.getElementById('background-audio');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    
    var continuedFromWelcome = false;
    try {
        var wasPlaying = sessionStorage.getItem('portfolioAudioPlaying');
        var savedTime = sessionStorage.getItem('portfolioAudioTime');
        var wasMuted = sessionStorage.getItem('portfolioAudioMuted');
        if (wasPlaying === '1' && audio) {
            continuedFromWelcome = true;
            audio.volume = 0.5;
            if (savedTime !== null && savedTime !== '') {
                var t = parseFloat(savedTime, 10);
                if (!isNaN(t) && t >= 0) audio.currentTime = t;
            }
            audio.muted = (wasMuted === '1');
            audio.play().catch(function() {});
            audioIcon.className = 'fas fa-pause';
            if (audioToggle) audioToggle.classList.add('playing');
            sessionStorage.removeItem('portfolioAudioPlaying');
            sessionStorage.removeItem('portfolioAudioTime');
            sessionStorage.removeItem('portfolioAudioMuted');
        }
    } catch (e) {}

    if (audio && !continuedFromWelcome) {
        audio.muted = true;
        audio.volume = 0.5;
    }
    
    const muteButton = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');
    
    if (muteButton) {
        if (continuedFromWelcome) {
            muteButton.style.display = 'block';
            if (muteIcon) muteIcon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        } else {
            muteButton.style.display = 'none';
        }
    }

    // Audio toggle (play / pause)
    audioToggle.addEventListener('click', () => {
        if (audio.paused) {
            // Automatically unmute when playing
            audio.muted = false;
            // Update mute button icon to show unmuted state
            muteIcon.className = 'fas fa-volume-up';
            
            audio.play().catch(e => console.log('Audio play failed:', e));
            audioIcon.className = 'fas fa-pause';
            audioToggle.classList.add('playing');
            
            // Show mute button when playing
            muteButton.style.display = 'block';
        } else {
            audio.pause();
            audioIcon.className = 'fas fa-play';
            audioToggle.classList.remove('playing');
            
            // Hide mute button when paused
            muteButton.style.display = 'none';
        }
    });

    // Mute/unmute (use same icon style family as play/pause)
    muteButton.addEventListener('click', () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
            muteIcon.className = 'fas fa-volume-mute';
        } else {
            muteIcon.className = 'fas fa-volume-up';
        }
    });
    
    // Handle audio ended event to hide mute button
    audio.addEventListener('ended', () => {
        audioIcon.className = 'fas fa-play';
        audioToggle.classList.remove('playing');
        muteButton.style.display = 'none';
    });

    // Handle expertise tag clicks
    const expertiseTags = document.querySelectorAll('.expertise-tag');
    const projectsContent = document.getElementById('projects-content');
    const skillsContent = document.getElementById('skills-content');
    const aboutContent = document.getElementById('about-content');
    const careerContent = document.getElementById('career-content');
    const datacomLabContent = document.getElementById('datacom-lab-content');

    expertiseTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active from all tags, then set active on clicked tag
            expertiseTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            // Hide all content first
            projectsContent.style.display = 'none';
            skillsContent.style.display = 'none';
            aboutContent.style.display = 'none';
            careerContent.style.display = 'none';
            datacomLabContent.style.display = 'none';

            // Show the appropriate content based on the clicked tag
            if (tag.textContent === 'Project & Achievement') {
                projectsContent.style.display = 'block';
            } else if (tag.textContent === 'Technical Expertise') {
                skillsContent.style.display = 'block';
            } else if (tag.textContent === 'About Me') {
                aboutContent.style.display = 'block';
            } else if (tag.textContent === 'Career Summary') {
                careerContent.style.display = 'block';
            } else if (tag.textContent === 'Simulation Lab') {
                datacomLabContent.style.display = 'block';
            }

            // Scroll to the content
            if (projectsContent.style.display === 'block' || 
                skillsContent.style.display === 'block' || 
                aboutContent.style.display === 'block' ||
                careerContent.style.display === 'block' ||
                datacomLabContent.style.display === 'block') {
                window.scrollTo({
                    top: tag.offsetTop + 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox / click-to-enlarge for lab images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Enlarged image';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    // Attach click handlers to images inside the datacom lab section (includes topology image)
    const labImages = document.querySelectorAll('.datacom-lab-section img.lab-image');
    labImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            openLightbox(e.currentTarget.src, e.currentTarget.alt);
        });
    });

    // Close handlers
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // close when clicking outside the image
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
            closeLightbox();
        }
    });

    // Generalized lab toggle: wire all .lab-toggle-btn buttons
    const labToggleButtons = document.querySelectorAll('.lab-toggle-btn');
    labToggleButtons.forEach(btn => {
        // each button uses aria-controls listing target ids separated by space
        const controls = (btn.getAttribute('aria-controls') || '').split(/\s+/).filter(Boolean);
        const icon = btn.querySelector('.toggle-icon');

        // ensure panels referenced by controls start collapsed
        controls.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('collapsed');
        });

        btn.addEventListener('click', () => {
            const nowExpanded = btn.getAttribute('aria-expanded') === 'true';
            const willExpand = !nowExpanded;
            btn.setAttribute('aria-expanded', String(willExpand));
            if (icon) icon.textContent = willExpand ? '\u2212' : '+';

            // toggle each controlled panel
            controls.forEach(id => {
                const panel = document.getElementById(id);
                if (panel) panel.classList.toggle('collapsed', !willExpand);
            });

            // If expanding, scroll to the first controlled panel (assumed cfg)
            if (willExpand && controls.length) {
                const cfgId = controls[0];
                const cfgPanelEl = document.getElementById(cfgId);
                if (cfgPanelEl) {
                    cfgPanelEl.setAttribute('tabindex', '-1');
                    setTimeout(() => {
                        try {
                            const y = cfgPanelEl.getBoundingClientRect().top + window.pageYOffset - 24;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            cfgPanelEl.focus({ preventScroll: true });
                        } catch (err) {
                            cfgPanelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 120);
                }
            }

            // If collapsing, scroll back to the project title
            if (!willExpand && controls.length) {
                const firstPanel = document.getElementById(controls[0]);
                const project = firstPanel ? firstPanel.closest('.lab-project') : null;
                const title = project ? project.querySelector('h3') : null;
                if (title) {
                    title.setAttribute('tabindex', '-1');
                    setTimeout(() => {
                        try {
                            const y = title.getBoundingClientRect().top + window.pageYOffset - 24;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            title.focus({ preventScroll: true });
                        } catch (err) {
                            title.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 140);
                }
            }
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
});

// Scroll reveal animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add reveal class to elements
document.addEventListener('DOMContentLoaded', function() {
    // Add reveal class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('reveal'));
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.project-icon i');
            icon.style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.project-icon i');
            icon.style.transform = 'rotateY(0)';
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
});

// Listen for scroll events
window.addEventListener('scroll', reveal);

// Initial reveal check
reveal();
