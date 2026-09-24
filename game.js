import { bindTouchControls } from './touch-controls.js';
import { SIZE, PACES, createGame, turn, step } from './engine.js';
const $ = id => document.getElementById(id);
const canvas = $('board'), ctx = canvas.getContext('2d');
let game = createGame(), mode = 'normal', lastTime = 0, sound = false, audio;
let records = {};
try { const saved=JSON.parse(localStorage.getItem('snake-arcade-records') || '{}'); if(saved && typeof saved==='object') for(const key of Object.keys(PACES)) if(Number.isFinite(saved[key]) && saved[key]>=0) records[key]=saved[key]; } catch {}
const directions={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
const keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
function announce(message){$('announcement').textContent=message;}
function updateScore(){ $('score').textContent=String(game.score).padStart(3,'0'); $('best').textContent=String(records[mode] || 0).padStart(3,'0'); }
function draw(){
 const w=canvas.width,h=canvas.height,cw=w/SIZE,ch=h/SIZE;
 ctx.fillStyle='#cbd9a6';ctx.fillRect(0,0,w,h);
 ctx.strokeStyle='#bcca9855';ctx.lineWidth=1;
 for(let n=1;n<SIZE;n++){ctx.beginPath();ctx.moveTo(n*cw,0);ctx.lineTo(n*cw,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,n*ch);ctx.lineTo(w,n*ch);ctx.stroke();}
 game.snake.forEach((p,i)=>{ctx.fillStyle=i===0?'#29472b':'#42643a';ctx.beginPath();ctx.roundRect(p.x*cw+1.5,p.y*ch+1.5,cw-3,ch-3,i===0?5:3);ctx.fill();});
 const head=game.snake[0],d=game.direction;
 ctx.fillStyle='#dceab6';
 for(const side of [-1,1]){let x=head.x*cw+cw/2+d.x*cw*.2+(d.y?side*cw*.2:0),y=head.y*ch+ch/2+d.y*ch*.2+(d.x?side*ch*.2:0);ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();}
 if(game.food){const x=(game.food.x+.5)*cw,y=(game.food.y+.5)*ch;ctx.fillStyle='#bd4d39';ctx.beginPath();ctx.ellipse(x,y+1,cw*.33,ch*.34,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#52643b';ctx.fillRect(x,y-ch*.44,2,ch*.18);ctx.fillStyle='#e99870';ctx.fillRect(x-cw*.13,y-ch*.12,3,3);}
}
function resize(){const r=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.height*ratio);draw();}
new ResizeObserver(resize).observe(canvas);
function lockModes(locked){document.querySelectorAll('[data-mode]').forEach(b=>b.disabled=locked);$('setting-note').textContent=locked?'Finish this run to change your pace.':'Choose a pace before your next run.';}
function start(){resetTouch();game=createGame();game.status='running';lastTime=0;$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='Ⅱ Pause';$('pause').setAttribute('aria-label','Pause game');$('state-label').textContent='KEEP GROWING';lockModes(true);updateScore();draw();canvas.focus({preventScroll:true});$('game').scrollIntoView({block:'start',behavior:'instant'});announce('Game started. '+mode+' pace.');}
function showOverlay(title,copy,button,kicker){$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;$('start').textContent=button;$('overlay-kicker').textContent=kicker;$('start-hint').textContent=game.status==='paused'?'or press Space to resume':'or press Enter to play again';$('overlay').hidden=false;}
function pause(){resetTouch();if(game.status==='running'){game.status='paused';showOverlay('Take a breather.','Your apples can wait. Pick up where you left off.','Keep going ↗','NO RUSH');$('pause').textContent='▶ Resume';$('pause').setAttribute('aria-label','Resume game');$('state-label').textContent='ON A LITTLE BREAK';announce('Game paused.');}else if(game.status==='paused'){game.status='running';lastTime=0;$('overlay').hidden=true;$('pause').textContent='Ⅱ Pause';$('pause').setAttribute('aria-label','Pause game');$('state-label').textContent='KEEP GROWING';canvas.focus({preventScroll:true});announce('Game resumed.');}}
function tone(frequency){if(!sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.045,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+.13);}catch{}}
function end(){resetTouch();const record=game.score>(records[mode]||0);if(record){records[mode]=game.score;try{localStorage.setItem('snake-arcade-records',JSON.stringify(records));}catch{}}
 updateScore();lockModes(false);$('pause').disabled=true;$('state-label').textContent=game.status==='won'?'BOARD COMPLETE':'THAT WAS A GOOD RUN';showOverlay(game.status==='won'?'You grew it all.':record?'A new personal best.':'One more bite?',`You scored ${game.score} points. ${record?'Your best run at this pace!':'A fresh start is one click away.'}`,'Play again ↗',game.status==='won'?'ALL APPLES ACCOUNTED FOR':'EVERY END IS A NEW BEGINNING');announce(`Game ${game.status==='won'?'won':'over'}. Score ${game.score}. ${record?'New personal best.':''}`);tone(160);}
function frame(time){if(game.status==='running'){if(!lastTime)lastTime=time;if(time-lastTime>=PACES[mode]){lastTime=time;const ate=step(game);if(ate){tone(620);updateScore();}draw();if(game.status==='over'||game.status==='won')end();}}requestAnimationFrame(frame);}
$('start').addEventListener('click',()=>game.status==='paused'?pause():start());$('pause').addEventListener('click',pause);
$('sound').addEventListener('click',()=>{sound=!sound;$('sound').textContent=sound?'♪ Sound on':'♪ Sound off';$('sound').setAttribute('aria-pressed',String(sound));if(sound)tone(440);});
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{mode=button.dataset.mode;for(const b of document.querySelectorAll('[data-mode]')){b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));}$('mode-caption').textContent='CLASSIC / '+mode.toUpperCase();updateScore();});
window.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select'))return;const direction=keys[event.key]||keys[event.key.toLowerCase()];if(direction && game.status==='running'){event.preventDefault();turn(game,directions[direction]);}else if(event.code==='Space'&&!event.target.closest('button,summary,a')){if(game.status==='running'||game.status==='paused'){event.preventDefault();if(!event.repeat)pause();}}else if(event.key==='Enter'&&!event.repeat&&!event.target.closest('button,summary,a')){event.preventDefault();if(game.status==='paused')pause();else if(game.status!=='running')start();}});
const resetTouch = bindTouchControls(canvas, document.querySelectorAll('[data-direction]'),
 direction => turn(game, directions[direction]), () => game.status === 'running');
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.status==='running')pause();});window.addEventListener('blur',()=>{if(game.status==='running')pause();});
updateScore();draw();requestAnimationFrame(frame);
