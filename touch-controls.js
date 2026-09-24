// Native clicks support touch, mouse, keyboard and assistive technology once per activation.
export function bindTouchControls(canvas, buttons, onDirection, isRunning) {
  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (isRunning()) onDirection(button.dataset.direction);
    });
  }

  let gesture = null;
  function reset() {
    const previous = gesture;
    gesture = null;
    if (previous && canvas.hasPointerCapture(previous.id)) {
      canvas.releasePointerCapture(previous.id);
    }
  }
  canvas.addEventListener('pointerdown', event => {
    if (!isRunning() || gesture || !event.isPrimary || event.button !== 0) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    reset();
    if (!isRunning() || Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
    onDirection(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
  });
  for (const type of ['pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(type, event => {
      if (gesture?.id === event.pointerId) reset();
    });
  }
  return reset;
}
