document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to Azizul's Portfolio!");

    // Handle expertise tag clicks
    const expertiseTags = document.querySelectorAll('.expertise-tag');
    const projectsContent = document.getElementById('projects-content');
    const skillsContent = document.getElementById('skills-content');
    const aboutContent = document.getElementById('about-content');
    const careerContent = document.getElementById('career-content');

    expertiseTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Hide all content first
            projectsContent.style.display = 'none';
            skillsContent.style.display = 'none';
            aboutContent.style.display = 'none';
            careerContent.style.display = 'none';

            // Show the appropriate content based on the clicked tag
            if (tag.textContent === 'Achievement') {
                projectsContent.style.display = 'block';
            } else if (tag.textContent === 'Technical Expertise') {
                skillsContent.style.display = 'block';
            } else if (tag.textContent === 'About Me') {
                aboutContent.style.display = 'block';
            } else if (tag.textContent === 'Career Summary') {
                careerContent.style.display = 'block';
            }

            // Scroll to the content
            if (projectsContent.style.display === 'block' || 
                skillsContent.style.display === 'block' || 
                aboutContent.style.display === 'block' ||
                careerContent.style.display === 'block') {
                window.scrollTo({
                    top: tag.offsetTop + 100,
                    behavior: 'smooth'
                });
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
