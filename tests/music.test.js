import test from 'node:test';
import assert from 'node:assert/strict';
import { createMusic } from '../music.js';

function setup() {
  const tracks = [], changes = [];
  const music = createMusic((...change) => changes.push(change), source => {
    const track = { source, paused: true, plays: 0,
      play() { this.paused = false; this.plays++; return Promise.resolve(); },
      pause() { this.paused = true; } };
    tracks.push(track);
    return track;
  });
  return { music, tracks, changes };
}

test('opt-in music switches tracks, pauses, resumes, and mutes', () => {
  const { music, tracks: [menu, game] } = setup();
  assert.equal(menu.plays + game.plays, 0);
  music.toggle();
  assert.equal(menu.paused, false);
  assert.equal(menu.source, './music.mp3');
  music.update('running');
  assert.equal(menu.paused, true);
  assert.equal(game.paused, false);
  assert.equal(game.source, './in-game.mp3');
  music.update('paused');
  assert.equal(game.paused, true);
  music.update('running');
  assert.equal(game.paused, false);
  music.update('over');
  assert.equal(menu.paused, false);
  assert.equal(game.paused, true);
  music.update('over', true);
  assert.equal(menu.paused, true);
  music.update('over', false);
  assert.equal(menu.paused, false);
  music.toggle();
  assert.equal(menu.paused, true);
});

test('autoplay rejection reports failure and allows a user retry', async () => {
  const { music, tracks: [menu], changes } = setup();
  const play = menu.play;
  menu.play = () => Promise.reject(new Error('NotAllowedError'));
  music.toggle();
  await Promise.resolve();
  assert.equal(music.enabled, false);
  assert.match(changes.at(-1)[1], /retry/);
  menu.play = play;
  music.toggle();
  assert.equal(music.enabled, true);
  assert.equal(menu.paused, false);
});

test('a stale playback rejection cannot mute a newer track', async () => {
  const { music, tracks: [menu, game] } = setup();
  let reject;
  menu.play = () => new Promise((resolve, fail) => { reject = fail; });
  music.toggle();
  music.update('running');
  reject(new Error('Interrupted'));
  await Promise.resolve();
  assert.equal(music.enabled, true);
  assert.equal(game.paused, false);
});
