import test from 'node:test';
import assert from 'node:assert/strict';
import { bindTouchControls } from '../touch-controls.js';

class Surface extends EventTarget {
  captures = new Set();
  setPointerCapture(id) { this.captures.add(id); }
  hasPointerCapture(id) { return this.captures.has(id); }
  releasePointerCapture(id) { this.captures.delete(id); }
  emit(type, properties = {}) {
    this.dispatchEvent(Object.assign(new Event(type), {
      pointerId: 1, isPrimary: true, button: 0, clientX: 50, clientY: 50, ...properties
    }));
  }
}
function setup() {
  const canvas = new Surface(), button = new Surface(), turns = [];
  button.dataset = { direction: 'up' };
  let running = true;
  const reset = bindTouchControls(canvas, [button], direction => turns.push(direction), () => running);
  return { canvas, button, turns, reset, pause: () => { running = false; } };
}
test('native activation handles pointer clicks and keyboard/AT clicks exactly once', () => {
  const { button, turns, pause } = setup();
  button.emit('pointerdown'); button.emit('pointerup'); button.emit('click', { detail: 1 });
  assert.deepEqual(turns, ['up']);
  button.emit('click', { detail: 0 });
  assert.deepEqual(turns, ['up', 'up']);
  pause(); button.emit('click');
  assert.equal(turns.length, 2);
});
test('swipes select all four directions; taps and right clicks do not turn', () => {
  const { canvas, turns } = setup();
  for (const [clientX, clientY] of [[80,50],[20,50],[50,80],[50,20]]) {
    canvas.emit('pointerdown'); canvas.emit('pointerup', { clientX, clientY });
  }
  assert.deepEqual(turns, ['right', 'left', 'down', 'up']);
  canvas.emit('pointerdown'); canvas.emit('pointerup', { clientX: 55 });
  canvas.emit('pointerdown', { button: 2 }); canvas.emit('pointerup', { clientX: 80 });
  assert.equal(turns.length, 4);
  assert.equal(canvas.captures.size, 0);
});
test('secondary pointers cannot overwrite or complete another swipe', () => {
  const { canvas, turns } = setup();
  canvas.emit('pointerdown');
  canvas.emit('pointerdown', { pointerId: 2, isPrimary: false, clientX: 100 });
  canvas.emit('pointerup', { pointerId: 2, clientX: 150 });
  canvas.emit('pointercancel', { pointerId: 2 });
  assert.deepEqual(turns, []);
  canvas.emit('pointerup', { clientY: 10 });
  assert.deepEqual(turns, ['up']);
});
test('cancellation, lost capture and lifecycle resets discard stale gestures', () => {
  for (const type of ['pointercancel', 'lostpointercapture', 'reset']) {
    const { canvas, turns, reset } = setup();
    canvas.emit('pointerdown');
    if (type === 'reset') reset(); else canvas.emit(type);
    canvas.emit('pointerup', { clientX: 100 });
    assert.deepEqual(turns, []);
    assert.equal(canvas.captures.size, 0);
    canvas.emit('pointerdown'); canvas.emit('pointerup', { clientX: 100 });
    assert.deepEqual(turns, ['right']);
  }
});
test('a swipe cannot turn a paused game', () => {
  const { canvas, turns, pause } = setup();
  canvas.emit('pointerdown'); pause(); canvas.emit('pointerup', { clientX: 100 });
  canvas.emit('pointerdown'); canvas.emit('pointerup', { clientX: 100 });
  assert.deepEqual(turns, []);
  assert.equal(canvas.captures.size, 0);
});
