const squirtleImg = new Image();
squirtleImg.src = 'squirtle-sprite2.png';

let playerImg = squirtleImg;
const _savedSprite = localStorage.getItem('outfit_sprite');
if (_savedSprite) {
  const _customImg = new Image();
  _customImg.onload = () => { playerImg = _customImg; };
  _customImg.src = _savedSprite;
}

const platImg = new Image();
platImg.src = 'pixil-frame-2.png';

const shortcakeImg = new Image();
shortcakeImg.src = 'shortcake.png';

const beeEnemyImg = new Image();
beeEnemyImg.src = 'bee-enemy.png';

const pokeballImg = new Image();
pokeballImg.src = 'pokeballs.PNG';

const strawberryImg = new Image();
strawberryImg.src = 'strawberry.png';

const ENEMY_SOURCES = [
    'enemy.PNG',
    'iggly-pokm.png',
    'ditto-pokm.png',
    'lit-pokm.png',
    'pika-enemy.png'
];

const enemyImages = ENEMY_SOURCES.map(src => {
    const img = new Image();
    img.src = src;
    return img;
})

const levelW=2600;
const LEVELS = {
    1: {
        platforms: [
            {x:0,    y:420,w:2600,h:60},
            {x:180,  y:350,w:120, h:30},{x:350, y:290,w:100,h:30},
            {x:500,  y:240,w:110, h:30},{x:660, y:320,w:90, h:30},
            {x:980,  y:200,w:120, h:30},
            {x:1150, y:280,w:100, h:30},{x:1310,y:230,w:130,h:30},
            {x:1490, y:310,w:110, h:30},{x:1660,y:250,w:120,h:30},
            {x:1820, y:200,w:100, h:30},{x:1990,y:270,w:130,h:30},
            {x:2150, y:340,w:110, h:30},{x:2320,y:270,w:150,h:30},
            {x:580,  y:160,w:70,  h:30},{x:700, y:130,w:70, h:30},{x:820,y:160,w:70,h:30},
        ],
        enemies: [
            {x:320, y:388,vx:1.5, w:32,h:32,patrol:{min:180, max:480}},
            {x:680, y:388,vx:-1.2,w:32,h:32,patrol:{min:500, max:820}},
            {x:1060,y:388,vx:1.8, w:32,h:32,patrol:{min:820, max:1180}},
            {x:1430,y:388,vx:-1.5,w:32,h:32,patrol:{min:1180,max:1540}},
            {x:1750,y:388,vx:1.2, w:32,h:32,patrol:{min:1540,max:1900}},
            {x:2100,y:388,vx:-1.8,w:32,h:32,patrol:{min:1900,max:2350}},
            {x:700, y:98, vx:1,   w:32,h:32,patrol:{min:580, max:900}},
        ],
        pokeballs: [
            {x:500, y:390,r:12},{x:240,y:320,r:12},{x:280,y:320,r:12},{x:400,y:210,r:12},
            {x:550, y:210,r:12},{x:735,y:100,r:12},{x:700,y:100,r:12},{x:710,y:290,r:12},
            {x:850, y:390,r:12},{x:850,y:130,r:12},{x:1000,y:170,r:12},{x:1030,y:170,r:12},
            {x:1200,y:250,r:12},{x:1360,y:200,r:12},{x:1540,y:280,r:12},{x:1710,y:220,r:12},
            {x:1870,y:170,r:12},{x:2040,y:240,r:12},{x:2200,y:310,r:12},{x:2380,y:240,r:12},
        ]
    },
    2: {
        platforms: [
            {x:0,    y:420,w:2600,h:60},
            {x:150,  y:330,w:100, h:30},{x:300, y:250,w:100, h:30},{x:450, y:180,w:100, h:30},
            {x:650,  y:280,w:150, h:30},{x:850, y:340,w:120, h:30},{x:1050,y:260,w:100, h:30},
            {x:1200, y:180,w:80,  h:30},{x:1350,y:260,w:120, h:30},{x:1550,y:330,w:150, h:30},
            {x:1750, y:240,w:100, h:30},{x:1900,y:170,w:120, h:30},{x:2100,y:250,w:100, h:30},
            {x:2250, y:330,w:150, h:30}
        ],
        enemies: [
            {x:480, y:148,vx:2.2, w:32,h:32,patrol:{min:450, max:550}},
            {x:700, y:248,vx:-2.0,w:32,h:32,patrol:{min:650, max:800}},
            {x:1100,y:388,vx:2.5, w:32,h:32,patrol:{min:900, max:1400}},
            {x:1600,y:298,vx:-1.8,w:32,h:32,patrol:{min:1550,max:1700}},
            {x:1950,y:138,vx:2.0, w:32,h:32,patrol:{min:1900,max:2020}},
            {x:2200,y:388,vx:-3.0,w:32,h:32,patrol:{min:1800,max:2500}}
        ],
        pokeballs: [
            {x:180, y:300,r:12},{x:330,y:220,r:12},{x:480,y:150,r:12},{x:720, y:250,r:12},
            {x:910, y:310,r:12},{x:1070,y:230,r:12},{x:1220,y:150,r:12},{x:1410,y:230,r:12},
            {x:1620,y:300,r:12},{x:1770,y:210,r:12},{x:1960,y:140,r:12},{x:2120,y:220,r:12},
        ]
    }
};

const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const W=canvas.width;
const H=canvas.height;

let currentLevel = 1;
let lives=3;
let platforms=[];
let enemies=[];
let pokeballs=[];
let completing=false;
const cam={x:0};

let particles = [];

let startTime = 0;
let elapsedTime = 0;

const ballDisp = document.getElementById('ballDisplay');
const livesDisp = document.getElementById('livesDisplay');
const timerDisp = document.getElementById('timerDisplay');

if (ballDisp) ballDisp.textContent = 'Pokeballs: 0/20'; 
if (livesDisp) livesDisp.textContent = 'Lives: 3'; 
if (timerDisp) timerDisp.textContent = 'Time: 00:00';

const P={x:80,y:320,vx:0,vy:0,w:42,h:92,onGround:false,facing:'right',inv:0};
const keys={};
document.addEventListener('keydown',e=>{
  keys[e.key]=true;
  if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
});
document.addEventListener('keyup',e=>keys[e.key]=false);

function formatTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const millies = Math.floor((ms % 1000) / 10);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millies.toString().padStart(2, '0')}`;
}

function createExplosion(x, y) {
    const particleCount = 15;
    const colors = currentLevel === 2
        ? ['#FF69B4', '#FF1493', '#FFB6C1', '#FF85C0']
        : ['#FF4500', '#FFA500', '#FFD700', '#FF3333'];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1, // Slight upward trajectory bump
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: 2 + Math.random() * 4,
            alpha: 1,
            life: 25 + Math.random() * 15 // Ticks/Frames before fading completely
        });
    }
}
function updateEnemyDisplay() {
    const enemyDisp = document.getElementById('enemyDisplay');
    if (enemyDisp) {
        if (currentLevel === 2) {
            const defeated = enemies.filter(e => !e.alive).length;
            enemyDisp.style.display = 'block';
            enemyDisp.textContent = `Enemies: ${defeated}/${enemies.length}`;
            enemyDisp.style.color = defeated === enemies.length ? '#4CAF50' : '#FF9800';
        } else {
            enemyDisp.style.display = 'none'; // Hidden on Level 1
        }
    }
}


function resetLevel() { 
    const data = LEVELS[currentLevel] || LEVELS[1];

    platforms = data.platforms.map(p => ({...p})); 
    
    enemies = data.enemies.map(e => {
        const randImg = currentLevel === 2 ? beeEnemyImg : enemyImages[Math.floor(Math.random() * enemyImages.length)];
        return {...e, alive: true, deathTimer: 0, img: randImg};
    });
    
    pokeballs = data.pokeballs.map(b => ({...b,collected:false})); 
    particles = [];
    P.x = 80; P.y = 320; P.vx = 0; P.vy = 0; P.inv = 0; cam.x = 0; completing = false;
    
    startTime = performance.now();
    elapsedTime = 0;

    const ballDisp = document.getElementById('ballDisplay');
    const livesDisp = document.getElementById('livesDisplay');
    const timerDisp = document.getElementById('timerDisplay');
    const currentLvlDisp = document.getElementById('currentLevelDisplay');
    
    if (ballDisp) ballDisp.textContent = `Pokeballs: 0/${pokeballs.length}`; 
    if (livesDisp) livesDisp.textContent = 'Lives: ' + lives; 
    if (timerDisp) timerDisp.textContent = 'Time: 00:00.00';
    if (currentLvlDisp) currentLvlDisp.textContent = 'Level: ' + currentLevel;
    updateEnemyDisplay();
    canvas.style.backgroundImage = currentLevel === 2 ? "url('bg-2.png')" : "url('bg-1.jpg')";
}

const gravity   = 0.55;
const jumpForce = -13;
const moveSpeed = 4.5;
const maxFall   = 18;
const friction  = 0.82;
const airFric   = 0.95;

function overlap(a, b) {
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

function checkWinCondition() {
    const allBallsCollected = pokeballs.every(b => b.collected);
    
    if (currentLevel === 2) {
        const allEnemiesDefeated = enemies.every(e => !e.alive);
        return allBallsCollected && allEnemiesDefeated;
    }
  
    return allBallsCollected;
}

function update(){
    if (!completing) {
        elapsedTime = performance.now() - startTime;
        const timerDisp = document.getElementById('timerDisplay');
        if (timerDisp) timerDisp.textContent = 'Time: ' + formatTime(elapsedTime);
    }
  if (keys['ArrowLeft']  || keys['a'] || keys['A']) { P.vx = -moveSpeed; P.facing = 'left'; }
  else if (keys['ArrowRight'] || keys['d'] || keys['D']) { P.vx = moveSpeed; P.facing = 'right'; }
  else { P.vx *= P.onGround ? friction : airFric; if (Math.abs(P.vx) < 0.2) P.vx = 0; }

  if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && P.onGround) {
    P.vy = jumpForce;
    P.onGround = false;
  }

  P.vy = Math.min(P.vy + gravity, maxFall);
  P.x = Math.max(0, Math.min(P.x + P.vx, levelW - P.w));
  P.y += P.vy;

  P.onGround = false;
  for (const p of platforms) {
    if (!overlap(P, p)) continue;
    const left  = (P.x + P.w) - p.x;
    const right = (p.x + p.w) - P.x;
    const top   = (P.y + P.h) - p.y;
    const bot   = (p.y + p.h) - P.y;
    const min   = Math.min(left, right, top, bot);
    if      (min === top  && P.vy >= 0) { P.y = p.y - P.h; P.vy = 0; P.onGround = true; }
    else if (min === bot  && P.vy <  0) { P.y = p.y + p.h; P.vy = 0; }
    else if (min === left)              { P.x = p.x - P.w; P.vx = 0; }
    else if (min === right)             { P.x = p.x + p.w; P.vx = 0; }
  }

  for(const b of pokeballs) { 
        if (!b.collected && Math.hypot((P.x + P.w/2) - b.x, (P.y + P.h/2) - b.y) < 26) { 
            b.collected = true; 
            const ballDisp = document.getElementById('ballDisplay');
            if (ballDisp) ballDisp.textContent = `Pokeballs: ${pokeballs.filter(b=>b.collected).length}/${pokeballs.length}`; 
        } 
    } 
    
    if(!completing && checkWinCondition()) { 
        completing = true; 
        setTimeout(showComplete, 400); 
        return; 
    } 

  if (P.inv > 0) P.inv--;

  for (const e of enemies) {
    if (!e.alive) {
        if (e.deathTimer > 0) e.deathTimer--;
        continue;

    } 
    e.x += e.vx;
    if (e.x < e.patrol.min || e.x + e.w > e.patrol.max) e.vx *= -1;
    if (P.inv > 0 || !overlap(P, e)) continue;
    const stompedFromAbove = P.vy > 0 && (P.y + P.h - P.vy) <= e.y + 10;
    if (stompedFromAbove) { 
            e.alive = false; 
            e.deathTimer = 30;
            createExplosion(e.x + e.w / 2, e.y + e.h / 2);
            P.vy = jumpForce * 0.7;
            updateEnemyDisplay();
        } else {
      loseLife();
      return;
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.05;
        pt.life--;
        pt.alpha = Math.max(0, pt.life / 40);
        
        if (pt.life <= 0) {
            particles.splice(i, 1);
        }
    }

  cam.x = Math.max(0, Math.min(P.x - W/2 + P.w/2, levelW - W));
}

function draw(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0,0,W,H);
  ctx.setTransform(1,0,0,1,-cam.x,0);

  const currentPlatImg = currentLevel === 2 ? shortcakeImg : platImg;
  for(const p of platforms){
    if(p.x+p.w<cam.x||p.x>cam.x+W) continue;
    if (p.w === 2600) continue;
    ctx.drawImage(currentPlatImg, p.x, p.y, p.w, p.h);
  }

  for(const b of pokeballs){
    if(b.collected||b.x<cam.x-30||b.x>cam.x+W+30)continue;
    const collectibleImg = currentLevel === 2 ? strawberryImg : pokeballImg;
    ctx.drawImage(collectibleImg, b.x-b.r, b.y-b.r, b.r*2, b.r*2);
  }

  for(const e of enemies) { 
        if(e.x+e.w<cam.x||e.x>cam.x+W) continue; 
        
        if (!e.alive) {
            if (e.deathTimer > 0) {
                ctx.save();
                ctx.globalAlpha = e.deathTimer / 30; 
                ctx.drawImage(e.img, e.x, e.y + (e.h - 8), e.w, 8);
                ctx.restore();
            }
            continue;
        }
        
        ctx.drawImage(e.img, e.x, e.y, e.w, e.h); 
    } 
    for (const pt of particles) {
        if(pt.x < cam.x - 10 || pt.x > cam.x + W + 10) continue;
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

  drawPlayer();
}

function drawPlayer() { 
    const {x, y, w, h, facing} = P; 
    ctx.save(); 
    
    
    if (facing === 'left') { 
        ctx.translate(x + w, y); 
        ctx.scale(-1, 1); 
        ctx.drawImage(playerImg, 0, 0, w, h); 
    } else { 
        ctx.drawImage(playerImg, x, y, w, h); 
    } 
    ctx.restore(); 
} 

function loseLife(){
  lives--;
  document.getElementById('livesDisplay').textContent='Lives: '+lives;
  if(lives<=0){
    const overlay = document.getElementById('gameOverOverlay');
    const timeEl = document.getElementById('gameOverTime');
    if(timeEl) timeEl.textContent = 'Time: ' + formatTime(elapsedTime);
    if(overlay) overlay.style.display='flex';
  } else {
    P.x=80; P.y=320; P.vx=0; P.vy=0; P.inv=120; cam.x=0;
  }
}

function showComplete() { 
    const winOverlay = document.getElementById('winOverlay');
    if (winOverlay) {
        winOverlay.style.display = 'flex'; 
        
   
        let finalTimeDisp = document.getElementById('finalTimeDisplay');
        if (!finalTimeDisp) {
            finalTimeDisp = document.createElement('p');
            finalTimeDisp.id = 'finalTimeDisplay';
            finalTimeDisp.style.fontSize = '22px';
            finalTimeDisp.style.margin = '10px 0';
            finalTimeDisp.style.color = '#FFD700';
            winOverlay.appendChild(finalTimeDisp);
        }
        finalTimeDisp.textContent = `Level ${currentLevel} Complete! Time: ${formatTime(elapsedTime)}`;
        
      
        const nextBtn = document.getElementById('nextLevelBtn');
        const winHeader = winOverlay.querySelector('h1');
        
        if (LEVELS[currentLevel + 1]) {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (winHeader) winHeader.textContent = 'Stage Clear!';
        } else {
            
            if (nextBtn) nextBtn.style.display = 'none';
            if (winHeader) winHeader.textContent = 'Victory! Ultimate Champion!';
        }
    }
} 
function restartGame(){
  document.getElementById('winOverlay').style.display='none';
  document.getElementById('gameOverOverlay').style.display='none';
  lives=3; currentLevel=1; resetLevel();
}
function nextLevel() { 
    const winOverlay = document.getElementById('winOverlay');
    if (winOverlay) winOverlay.style.display = 'none'; 
    
    if (LEVELS[currentLevel + 1]) {
        currentLevel++;
        resetLevel(); 
    } else {
        restartGame();
    }
} 

function loop(){
  update();draw();
  requestAnimationFrame(loop);
}

let loaded=0;
const coreAssets = [squirtleImg, platImg, pokeballImg, ...enemyImages];
const totalRequired = coreAssets.length;

coreAssets.forEach(img => {
    img.onload = () => { 
        if (++loaded === totalRequired) { 
            resetLevel(); 
            loop(); 
        } 
    };
});
