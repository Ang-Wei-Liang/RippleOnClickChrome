// Ripple effect logic for mouse clicks
let rippleEnabled = true;

// Load initial state from chrome.storage
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.sync.get(['rippleEnabled'], function(result) {
    rippleEnabled = result.rippleEnabled !== false; // default true
  });
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'sync' && changes.rippleEnabled) {
      rippleEnabled = changes.rippleEnabled.newValue;
    }
  });
}

function createRipple(x, y, color, radius) {
  const ripple = document.createElement('div');
  ripple.className = 'chrome-ext-ripple';
  ripple.style.left = `${x - radius / 2}px`;
  ripple.style.top = `${y - radius / 2}px`;
  ripple.style.width = `${radius}px`;
  ripple.style.height = `${radius}px`;
  ripple.style.background = color;
  document.body.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

document.addEventListener('mousedown', function(e) {
  if (!rippleEnabled) return;
  // Get color and radius from storage, fallback to defaults
  chrome.storage.sync.get({ rippleColor: 'rgba(0, 150, 255, 0.4)', rippleRadius: 60 }, function(result) {
    createRipple(e.clientX, e.clientY, result.rippleColor, result.rippleRadius);
  });
});

// Inject ripple CSS if not present
if (!document.getElementById('chrome-ext-ripple-style')) {
  const style = document.createElement('style');
  style.id = 'chrome-ext-ripple-style';
  style.textContent = `
    .chrome-ext-ripple {
      position: fixed;
      pointer-events: none;
      border-radius: 50%;
      transform: scale(0);
      animation: chrome-ext-ripple-anim 0.6s linear;
      z-index: 999999;
    }
    @keyframes chrome-ext-ripple-anim {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

function injectFullPageCSS() {
  if (!document.getElementById('chrome-ext-ripple-fullpage-style')) {
    const style = document.createElement('style');
    style.id = 'chrome-ext-ripple-fullpage-style';
    style.textContent = `
      html, body {
        width: 100vw !important;
        height: 100vh !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: auto !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function removeFullPageCSS() {
  const style = document.getElementById('chrome-ext-ripple-fullpage-style');
  if (style) style.remove();
}

// On load, and whenever enabled state changes, update page CSS
function updateFullPageCSS() {
  if (rippleEnabled) {
    injectFullPageCSS();
  } else {
    removeFullPageCSS();
  }
}

// Initial load
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.sync.get(['rippleEnabled'], function(result) {
    rippleEnabled = result.rippleEnabled !== false; // default true
    updateFullPageCSS();
  });
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'sync' && changes.rippleEnabled) {
      rippleEnabled = changes.rippleEnabled.newValue;
      updateFullPageCSS();
    }
  });
}
