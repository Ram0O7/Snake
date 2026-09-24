// Playback starts only after the player enables sound. A rejected play() never
// interrupts the game, and a later tap can retry it.
export function createMusic(onChange, makeAudio = source => new Audio(source)) {
  const tracks = { menu: makeAudio('./music.mp3'), game: makeAudio('./in-game.mp3') };
  for (const track of Object.values(tracks)) {
    track.loop = true;
    track.preload = 'none';
    track.volume = 0.35;
  }
  let enabled = false, status = 'ready', hidden = false, active = null, revision = 0;
  function sync() {
    const request = ++revision;
    const next = enabled && !hidden && status !== 'paused'
      ? tracks[status === 'running' ? 'game' : 'menu'] : null;
    for (const track of Object.values(tracks)) if (track !== next) track.pause();
    active = next;
    if (!next) return;
    const failed = () => {
      if (request !== revision || active !== next) return;
      enabled = false;
      sync();
      onChange(false, 'Audio could not start. Tap Play sound to retry.');
    };
    try { Promise.resolve(next.play()).catch(failed); } catch { failed(); }
  }
  return {
    get enabled() { return enabled; },
    toggle() { enabled = !enabled; onChange(enabled); sync(); },
    update(nextStatus, isHidden = false) { status = nextStatus; hidden = isHidden; sync(); }
  };
}
