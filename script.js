// Smooth scrolling for navigation links
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

// Interactive Mountain Range Component with Star Field
class MountainRange {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.mouse = { x: 0, y: 0 };
        this.dpr = window.devicePixelRatio || 1;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createStars();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createStars() {
        const baseY = this.height * 0.85;
        const triangles = [
            { x: this.width * 0.25, y: baseY, size: 200, index: 0 },
            { x: this.width * 0.5, y: baseY, size: 240, index: 1 },
            { x: this.width * 0.75, y: baseY, size: 200, index: 2 }
        ];
        
        const numStars = 120;
        const starsPerTriangle = Math.floor(numStars / 3);
        
        // Create stars specifically inside each triangle
        triangles.forEach((tri, triIndex) => {
            const height = (Math.sqrt(3) / 2) * tri.size;
            const starsInThisTriangle = triIndex === triangles.length - 1 
                ? numStars - (starsPerTriangle * triIndex) 
                : starsPerTriangle;
            
            for (let i = 0; i < starsInThisTriangle; i++) {
                // Generate random point inside triangle
                let x, y;
                let attempts = 0;
                do {
                    // Random point in bounding box
                    const r1 = Math.random();
                    const r2 = Math.random();
                    const sqrtR1 = Math.sqrt(r1);
                    
                    // Barycentric coordinates for uniform distribution in triangle
                    const a = 1 - sqrtR1;
                    const b = sqrtR1 * (1 - r2);
                    const c = sqrtR1 * r2;
                    
                    const x1 = tri.x;
                    const y1 = tri.y - height / 2;
                    const x2 = tri.x - tri.size / 2;
                    const y2 = tri.y + height / 2;
                    const x3 = tri.x + tri.size / 2;
                    const y3 = tri.y + height / 2;
                    
                    x = a * x1 + b * x2 + c * x3;
                    y = a * y1 + b * y2 + c * y3;
                    
                    attempts++;
                } while (attempts < 10 && !this.isPointInTriangle(x, y, tri.x, tri.y, tri.size));
                
                this.stars.push({
                    x: x,
                    y: y,
                    homeX: x,
                    homeY: y,
                    triangleIndex: triIndex,
                    triangle: tri,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.8 + 0.4, // Faster twinkle (0.4 to 1.2)
                    twinklePhase: Math.random() * Math.PI * 2, // Random starting phase
                    floatOffsetX: Math.random() * Math.PI * 2,
                    floatOffsetY: Math.random() * Math.PI * 2,
                    floatSpeedX: Math.random() * 0.08 + 0.03,
                    floatSpeedY: Math.random() * 0.08 + 0.03,
                    floatRangeX: Math.random() * 8 + 4,
                    floatRangeY: Math.random() * 8 + 4
                });
            }
        });
    }
    
    drawTriangle(x, y, size, rotation = 0) {
        const height = (Math.sqrt(3) / 2) * size;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -height / 2);
        this.ctx.lineTo(-size / 2, height / 2);
        this.ctx.lineTo(size / 2, height / 2);
        this.ctx.closePath();
        this.ctx.restore();
    }
    
    isPointInTriangle(px, py, x, y, size) {
        const height = (Math.sqrt(3) / 2) * size;
        const x1 = x, y1 = y - height / 2;
        const x2 = x - size / 2, y2 = y + height / 2;
        const x3 = x + size / 2, y3 = y + height / 2;
        
        const areaOrig = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
        const area1 = Math.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
        const area2 = Math.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
        const area3 = Math.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));
        
        return Math.abs(areaOrig - (area1 + area2 + area3)) < 1;
    }
    
    drawMountains() {
        const baseY = this.height * 0.85;
        
        // Triangle configurations
        const triangles = [
            { x: this.width * 0.25, y: baseY, size: 200 },
            { x: this.width * 0.5, y: baseY, size: 240 },
            { x: this.width * 0.75, y: baseY, size: 200 }
        ];
        
        // Draw background glow triangles (outlines)
        triangles.forEach((tri, index) => {
            this.drawTriangle(tri.x, tri.y, tri.size + 40);
            
            // Gradient strokes for each triangle
            const colors = ['#E91E8C', '#6366f1', '#8b5cf6'];
            this.ctx.strokeStyle = colors[index];
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = colors[index];
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        });
        
        // Draw foreground solid triangles FIRST
        triangles.forEach(tri => {
            this.drawTriangle(tri.x, tri.y, tri.size);
            this.ctx.fillStyle = '#0a0a2e';
            this.ctx.fill();
        });
        
        // Now draw stars ON TOP of the dark triangles
        this.ctx.save();
        
        // Create clipping region for stars (only inside triangles)
        this.ctx.beginPath();
        triangles.forEach(tri => {
            const height = (Math.sqrt(3) / 2) * tri.size;
            this.ctx.moveTo(tri.x, tri.y - height / 2);
            this.ctx.lineTo(tri.x - tri.size / 2, tri.y + height / 2);
            this.ctx.lineTo(tri.x + tri.size / 2, tri.y + height / 2);
            this.ctx.closePath();
        });
        this.ctx.clip();
        
        // Draw stars inside clipping region
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            
            // Bright white/yellow stars
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 200, ${star.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 255, 200, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = `rgba(255, 255, 200, ${star.opacity})`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        this.ctx.restore();
    }
    
    updateStars() {
        const time = Date.now() * 0.001;
        
        this.stars.forEach(star => {
            // Natural floating motion (slower and more subtle)
            const floatX = Math.sin(time * star.floatSpeedX + star.floatOffsetX) * star.floatRangeX;
            const floatY = Math.sin(time * star.floatSpeedY + star.floatOffsetY) * star.floatRangeY;
            
            // Base target is home position with gentle floating
            let targetX = star.homeX + floatX;
            let targetY = star.homeY + floatY;
            
            // Calculate distance from mouse
            const dx = this.mouse.x - star.x;
            const dy = this.mouse.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 180;
            
            // Very gentle magnetic effect when mouse is near
            if (distance < maxDistance && this.mouse.x > 0) {
                // Gradual attraction that doesn't overpower the floating
                const force = (maxDistance - distance) / maxDistance;
                const pullStrength = 0.3 * force; // Very gentle pull
                
                // Add velocity towards mouse instead of direct position change
                targetX += dx * pullStrength;
                targetY += dy * pullStrength;
            }
            
            // Smooth interpolation with damping (prevents jelly effect)
            const moveSpeed = 0.05; // Slower, smoother movement
            star.x += (targetX - star.x) * moveSpeed;
            star.y += (targetY - star.y) * moveSpeed;
            
            // Keep star within its triangle boundaries (soft constraint)
            const tri = star.triangle;
            
            // Check if star is outside triangle, gently guide it back
            if (!this.isPointInTriangle(star.x, star.y, tri.x, tri.y, tri.size)) {
                // Very gentle push back towards home position
                star.x += (star.homeX - star.x) * 0.02;
                star.y += (star.homeY - star.y) * 0.02;
            }
            
            // Fast twinkle effect - stars fade in and out of existence
            // Using sine wave to go from 0 (invisible) to 1 (fully visible)
            const twinkleValue = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
            
            // Map sine wave (-1 to 1) to opacity (0 to 1) with smooth transitions
            // Some stars will be completely invisible, creating birth/death effect
            star.opacity = (twinkleValue + 1) / 2; // Convert -1..1 to 0..1
            
            // Add some variation - occasionally make stars stay visible longer
            if (Math.random() < 0.3 && star.opacity < 0.1) {
                star.opacity = 0; // Fully dead
            } else if (star.opacity > 0.9) {
                star.opacity = Math.min(1, star.opacity * 1.1); // Bright burst
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.updateStars();
        this.drawMountains();
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
        
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });
    }
}

// Initialize mountain range
document.addEventListener('DOMContentLoaded', () => {
    new MountainRange('mountainCanvas');
});

// CTA Button interactions
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Thank you for your interest! Contact us at pleasanton@trivalleytech.org to get started.');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
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

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Observe feature cards
document.querySelectorAll('.feature-card, .program-card, .team-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
};

// Observe stat cards for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const number = entry.target.querySelector('.stat-number');
            const target = parseInt(number.textContent);
            animateCounter(number, target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Add hover effect sounds (optional - silent by default)
document.querySelectorAll('.feature-card, .program-card, .team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

console.log('🚀 Tri-Valley Tech Pleasanton website loaded successfully!');