function getScrollbarWidth() {
  // Create a temporary div to measure scrollbar width
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  
  const inner = document.createElement('div');
  outer.appendChild(inner);
  
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  
  return scrollbarWidth;
}

function initMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const body = document.body;
  let originalPadding = window.getComputedStyle(body).paddingRight;
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      const isMenuOpen = body.classList.contains('no-scroll');
      const scrollbarWidth = getScrollbarWidth();
      
      if (!isMenuOpen) {
        // Store original padding
        originalPadding = window.getComputedStyle(body).paddingRight;
        // Add padding equal to scrollbar width to prevent shift
        body.style.paddingRight = `${scrollbarWidth}px`;
        body.classList.add('no-scroll');
      } else {
        // Restore original padding
        body.style.paddingRight = originalPadding;
        body.classList.remove('no-scroll');
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMenuToggle);
