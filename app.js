/**
 * Main application controller
 * Wires color buttons and model switcher to the FM audio engine.
 */
(function () {
  const engine = new AudioEngine();
  let currentModel = 'messiaen';

  // --- Model switcher ---
  const modelBtns = document.querySelectorAll('.model-btn');
  const currentModelLabel = document.getElementById('current-model');

  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentModel = btn.dataset.model;
      currentModelLabel.textContent = MODELS[currentModel].name;
    });
  });

  // --- Color buttons ---
  const colorBtns = document.querySelectorAll('.color-btn');
  const currentColorLabel = document.getElementById('current-color');

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      const model = MODELS[currentModel];
      const params = model.colors[color];

      if (!params) return;

      // Visual feedback
      currentColorLabel.textContent = color.charAt(0).toUpperCase() + color.slice(1);
      colorBtns.forEach(b => b.classList.remove('playing'));
      btn.classList.add('playing');
      setTimeout(() => btn.classList.remove('playing'), params.duration * 1000);

      // Play the sound
      engine.play(params);
    });
  });

  // Resume AudioContext on first interaction (browser autoplay policy)
  document.addEventListener('click', () => {
    engine.init();
    if (engine.ctx && engine.ctx.state === 'suspended') {
      engine.ctx.resume();
    }
  }, { once: true });
})();
