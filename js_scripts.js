// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const header = document.getElementById('header');
const fullNav = document.getElementById('fullNav');

// Calculate scrollbar width for later use
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

// Set current year in footer - Adding null check
const yearElement = document.getElementById('currentYear');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Full-screen menu toggle with fix for layout shift
if (menuToggle && header && fullNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    header.classList.toggle('expanded');
    fullNav.classList.toggle('active');
    
    // Toggle no-scroll class on body with layout shift prevention
    if (document.body.classList.contains('no-scroll')) {
      document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = '0';
    } else {
      document.body.classList.add('no-scroll');
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
  });
}

// Navigation links - close menu when clicked
document.querySelectorAll('#fullNav a').forEach(link => {
  link.addEventListener('click', () => {
    if (menuToggle && header && fullNav) {
      menuToggle.classList.remove('active');
      header.classList.remove('expanded');
      fullNav.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = '0';
    }
  });
});

// Scroll-based header styles
if (header) {
  window.addEventListener('scroll', () => {
    if (!header.classList.contains('expanded')) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// Make header elements visible immediately for better user experience
document.addEventListener('DOMContentLoaded', function() {
  // Add class to body when DOM is loaded
  document.body.classList.add('loaded');
  
  // Make header elements visible immediately
  document.querySelectorAll('.page-header .fade-in').forEach(el => {
    el.classList.add('visible');
  });
});

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return; // Exit if element doesn't exist
  
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Create audio element for light switch sound
  const switchSound = new Audio('sounds/switchclick.mp3');
  switchSound.volume = 0.2; // Reduced from 0.5 to 0.2 (20% volume instead of 50%)
  
  // Set initial theme
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Add click event to toggle theme
  themeToggle.addEventListener('click', () => {
    let switchToTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    
    // Play the switch sound
    switchSound.currentTime = 0; // Reset sound to beginning
    switchSound.play().catch(e => {
      console.log('Audio play failed:', e);
      // Continue with theme toggle even if sound fails
    });
    
    document.documentElement.setAttribute('data-theme', switchToTheme);
    localStorage.setItem('theme', switchToTheme);
    
    // Optional: Announce theme change to screen readers
    const announce = document.getElementById('themeAnnounce');
    if (announce) {
      announce.textContent = `Theme changed to ${switchToTheme} mode`;
    }
  });
}

// Contact form submission and notification handling
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    // Check if we should show notification from previous submission
    checkAndShowNotification();
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitButton = document.getElementById('submitButton');
      if (submitButton) {
        const spinner = submitButton.querySelector('.spinner');
        if (spinner) spinner.style.display = 'inline-block';
        submitButton.disabled = true;
      }
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Send form using fetch API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Store success flag in localStorage
          localStorage.setItem('messageSent', 'true');
          localStorage.setItem('messageSentTime', Date.now());
          
          // Reset form
          contactForm.reset();
          
          // Show success notification instead of reloading
          showSuccessNotification();
        } else {
          // Handle error
          showFormError();
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        showFormError();
      })
      .finally(() => {
        // Reset button state
        if (submitButton) {
          const spinner = submitButton.querySelector('.spinner');
          if (spinner) spinner.style.display = 'none';
          submitButton.disabled = false;
        }
      });
    });
  }
  
  // Close notification button
  const notificationClose = document.querySelector('.notification-close');
  if (notificationClose) {
    notificationClose.addEventListener('click', function() {
      const notification = document.getElementById('notification');
      if (notification) {
        notification.classList.remove('show');
        
        // Clear the notification flag
        localStorage.removeItem('messageSent');
      }
    });
  }
}

// Show success notification
function showSuccessNotification() {
  const notification = document.getElementById('notification');
  if (notification) {
    // Update content to show success
    const title = notification.querySelector('.notification-title');
    const message = notification.querySelector('.notification-message');
    const icon = notification.querySelector('.notification-icon');
    
    if (title) title.textContent = 'Success!';
    if (message) message.textContent = 'Your message has been sent successfully.';
    if (icon) icon.style.fill = '#4caf50'; // Green for success
    
    // Show the notification
    notification.classList.add('show');
    
    // Automatically hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
  }
}

// Show form error message - updated to use notification system instead of removed elements
function showFormError() {
  // Create and show error notification
  const notification = document.getElementById('notification');
  if (notification) {
    // Update content to show error
    const title = notification.querySelector('.notification-title');
    const message = notification.querySelector('.notification-message');
    const icon = notification.querySelector('.notification-icon');
    
    if (title) title.textContent = 'Error!';
    if (message) message.textContent = 'Something went wrong. Please try again.';
    if (icon) icon.style.fill = '#f44336'; // Change to red for error
    
    // Show the notification
    notification.classList.add('show');
    
    // Automatically hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      // Reset to success state after hiding
      if (title) title.textContent = 'Success!';
      if (message) message.textContent = 'Your message has been sent successfully.';
      if (icon) icon.style.fill = '#4caf50';
    }, 5000);
  }
}

// Check localStorage and show notification if needed
function checkAndShowNotification() {
  const messageSent = localStorage.getItem('messageSent');
  const messageSentTime = localStorage.getItem('messageSentTime');
  
  // Only show notification if message was sent in the last minute
  if (messageSent === 'true' && messageSentTime) {
    const timePassed = Date.now() - parseInt(messageSentTime);
    const oneMinute = 60 * 1000;
    
    if (timePassed < oneMinute) {
      // Show notification
      const notification = document.getElementById('notification');
      if (notification) {
        setTimeout(() => {
          notification.classList.add('show');
          
          // Automatically hide after 5 seconds
          setTimeout(() => {
            notification.classList.remove('show');
            localStorage.removeItem('messageSent');
          }, 5000);
        }, 500);
      }
    } else {
      // Clear old notification flag
      localStorage.removeItem('messageSent');
      localStorage.removeItem('messageSentTime');
    }
  }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize contact form
  initContactForm();
  
  // Fix spinner missing issue
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    // Check if spinner exists, if not, create it
    let spinner = submitButton.querySelector('.spinner');
    if (!spinner) {
      spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.style.display = 'none';
      spinner.style.marginLeft = '10px';
      spinner.innerHTML = '⟳'; // Simple spinner character
      submitButton.appendChild(spinner);
    }
  }
});