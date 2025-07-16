document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('rippleToggle');
  const colorInput = document.getElementById('rippleColor');
  const radiusInput = document.getElementById('rippleRadius');
  const radiusValue = document.getElementById('radiusValue');

  // Load initial state
  chrome.storage.sync.get(['rippleEnabled', 'rippleColor', 'rippleRadius'], function(result) {
    toggle.checked = result.rippleEnabled !== false; // default true
    colorInput.value = result.rippleColor ? rgbToHex(result.rippleColor) : '#0096ff';
    radiusInput.value = result.rippleRadius || 60;
    radiusValue.textContent = result.rippleRadius || 60;
  });

  toggle.addEventListener('change', function() {
    chrome.storage.sync.set({ rippleEnabled: toggle.checked });
  });

  colorInput.addEventListener('input', function() {
    chrome.storage.sync.set({ rippleColor: colorInput.value });
  });

  radiusInput.addEventListener('input', function() {
    radiusValue.textContent = radiusInput.value;
    chrome.storage.sync.set({ rippleRadius: parseInt(radiusInput.value, 10) });
  });
});

// Helper to convert rgb/rgba to hex for color input
function rgbToHex(rgb) {
  if (!rgb) return '#0096ff';
  if (rgb.startsWith('#')) return rgb;
  const result = rgb.match(/\d+/g);
  if (!result) return '#0096ff';
  let r = parseInt(result[0]).toString(16).padStart(2, '0');
  let g = parseInt(result[1]).toString(16).padStart(2, '0');
  let b = parseInt(result[2]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
} 