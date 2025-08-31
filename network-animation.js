(function() {
  'use strict';
  
  console.log('Network animation script loaded');
  
  class NetworkAnimation {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animationId = null;
      this.mouseX = 0;
      this.mouseY = 0;
      this.particleColor = 'rgba(0, 0, 0, 0.6)';
      this.lineColor = 'rgba(0, 0, 0, 0.2)';
      
      console.log('NetworkAnimation constructor called');
      this.init();
    }
    
    init() {
      try {
        console.log('Initializing network animation...');
        
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'network-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.4';
        
        this.ctx = this.canvas.getContext('2d');
        
        // Create container and add to body
        const container = document.createElement('div');
        container.className = 'network-background';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-2';
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.4';
        
        container.appendChild(this.canvas);
        document.body.insertBefore(container, document.body.firstChild);
        
        console.log('Canvas created and added to DOM');
        
        // Set up canvas
        this.resize();
        this.createParticles();
        this.updateColors();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        });
        
        // Listen for theme changes
        const observer = new MutationObserver(() => this.updateColors());
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme']
        });
        
        console.log('Network animation initialized successfully');
        
      } catch (error) {
        console.error('Error initializing network animation:', error);
      }
    }
    
    resize() {
      try {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        
        // Recreate particles on resize
        this.createParticles();
        console.log('Canvas resized:', window.innerWidth, 'x', window.innerHeight);
      } catch (error) {
        console.error('Error resizing canvas:', error);
      }
    }
    
    updateColors() {
      try {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.particleColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
        this.lineColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        console.log('Colors updated for theme:', isDark ? 'dark' : 'light');
      } catch (error) {
        console.error('Error updating colors:', error);
      }
    }
    
    createParticles() {
      try {
        this.particles = [];
        const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 20000));
        
        for (let i = 0; i < particleCount; i++) {
          this.particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 1.5 + 0.5,
            originalRadius: Math.random() * 1.5 + 0.5,
            pulse: Math.random() * Math.PI * 2
          });
        }
        
        console.log('Created', particleCount, 'particles');
      } catch (error) {
        console.error('Error creating particles:', error);
      }
    }
    
    animate() {
      try {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Bounce off edges
          if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
          if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
          
          // Keep particles in bounds
          particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
          particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
          
          // Subtle pulsing effect
          particle.pulse += 0.015;
          particle.radius = particle.originalRadius + Math.sin(particle.pulse) * 0.3;
          
          // Mouse interaction
          const dx = this.mouseX - particle.x;
          const dy = this.mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            const force = (80 - distance) / 80;
            particle.x -= (dx / distance) * force * 0.3;
            particle.y -= (dy / distance) * force * 0.3;
          }
          
          // Draw particle
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = this.particleColor;
          this.ctx.fill();
          
          // Draw connections to nearby particles
          for (let j = i + 1; j < this.particles.length; j++) {
            const other = this.particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const opacity = (100 - distance) / 100;
              this.ctx.beginPath();
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(other.x, other.y);
              this.ctx.strokeStyle = this.lineColor.replace('0.2)', `${0.15 * opacity})`);
              this.ctx.lineWidth = 0.5;
              this.ctx.stroke();
            }
          }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
      } catch (error) {
        console.error('Error in animation loop:', error);
      }
    }
    
    destroy() {
      try {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        const container = document.querySelector('.network-background');
        if (container) {
          container.remove();
        }
        console.log('Network animation destroyed');
      } catch (error) {
        console.error('Error destroying animation:', error);
      }
    }
  }

  // Initialize when DOM is loaded
  function initializeAnimation() {
    console.log('DOM loaded, initializing network animation...');
    
    // Wait a bit to ensure all styles are loaded
    setTimeout(() => {
      try {
        window.networkAnimation = new NetworkAnimation();
      } catch (error) {
        console.error('Failed to create NetworkAnimation:', error);
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimation);
  } else {
    initializeAnimation();
  }

})();
