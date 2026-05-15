const squirtleImg = new Image();
squirtleImg.src = 'squirtle-sprite2.png';

const platImg = new Image();
platImg.src = 'pika-plat.png';

const pokeballImg = new Image();
pokeballImg.src = 'pokeballs.PNG';

const enemyImg = new Image();
enemyImg.src = 'enemy.PNG';

const levelW=2600;
const PLATFORMS=[
  {x:0,   y:440,w:2600,h:60},
  {x:180, y:370,w:120, h:16},{x:350, y:310,w:100,h:16},
  {x:500, y:260,w:110, h:16},{x:660, y:340,w:90, h:16},
  {x:800, y:280,w:130, h:16},{x:980, y:220,w:120,h:16},
  {x:1150,y:300,w:100, h:16},{x:1310,y:250,w:130,h:16},
  {x:1490,y:330,w:110, h:16},{x:1660,y:270,w:120,h:16},
  {x:1820,y:220,w:100, h:16},{x:1990,y:290,w:130,h:16},
  {x:2150,y:360,w:110, h:16},{x:2320,y:290,w:150,h:16},
  {x:580, y:180,w:70,  h:16},{x:700, y:150,w:70, h:16},{x:820,y:180,w:70,h:16},
];
const ENEMY_DEFS=[
  {x:320, y:408,vx:1.5, w:32,h:32,patrol:{min:180, max:480}},
  {x:680, y:408,vx:-1.2,w:32,h:32,patrol:{min:500, max:820}},
  {x:1060,y:408,vx:1.8, w:32,h:32,patrol:{min:820, max:1180}},
  {x:1430,y:408,vx:-1.5,w:32,h:32,patrol:{min:1180,max:1540}},
  {x:1750,y:408,vx:1.2, w:32,h:32,patrol:{min:1540,max:1900}},
  {x:2100,y:408,vx:-1.8,w:32,h:32,patrol:{min:1900,max:2350}},
  {x:700, y:118,vx:1,   w:32,h:32,patrol:{min:580, max:900}},
];
const POKEBALL_DEFS=[
  {x:100,y:410,r:12},{x:240,y:340,r:12},{x:280,y:340,r:12},{x:400,y:230,r:12},
  {x:550,y:230,r:12},{x:735,y:120,r:12},{x:700,y:120,r:12},{x:710,y:310,r:12},
  {x:850,y:250,r:12},{x:850,y:150,r:12},{x:1000,y:190,r:12},{x:1030,y:190,r:12},
  {x:1200,y:270,r:12},{x:1360,y:220,r:12},{x:1540,y:300,r:12},{x:1710,y:240,r:12},
  {x:1870,y:190,r:12},{x:2040,y:260,r:12},{x:2200,y:330,r:12},{x:2380,y:260,r:12},
];

const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const W=canvas.width;
const H=canvas.height;

let lives=3;
let platforms=[];
let enemies=[];
let pokeballs=[];
let completing=false;
const cam={x:0};

const P={x:80,y:360,vx:0,vy:0,w:36,h:56,onGround:false,facing:'right',inv:0};
const keys={};
document.addEventListener('keydown',e=>{
  keys[e.key]=true;
  if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
});
document.addEventListener('keyup',e=>keys[e.key]=false);

function resetLevel(){
  platforms=PLATFORMS.map(p=>({...p}));
  enemies=ENEMY_DEFS.map(e=>({...e,alive:true}));
  pokeballs=POKEBALL_DEFS.map(b=>({...b,collected:false}));
  P.x=80;P.y=360;P.vx=0;P.vy=0;P.inv=0;cam.x=0;completing=false;
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

function update(){
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

  for(const b of pokeballs){
    if(!b.collected && Math.hypot(P.x+18-b.x, P.y+28-b.y) < 26){
      b.collected=true;
    }
  }
  if(!completing && pokeballs.every(b=>b.collected)){completing=true;setTimeout(showComplete,400);return;}

  if (P.inv > 0) P.inv--;

  for (const e of enemies) {
    if (!e.alive) continue;
    e.x += e.vx;
    if (e.x < e.patrol.min || e.x + e.w > e.patrol.max) e.vx *= -1;
    if (P.inv > 0 || !overlap(P, e)) continue;
    const stompedFromAbove = P.vy > 0 && P.y + P.h < e.y + e.h * 0.6;
    if (stompedFromAbove) {
      e.alive = false;
      P.vy = jumpForce * 0.7;
    } else {
      loseLife();
      return;
    }
  }

  cam.x = Math.max(0, Math.min(P.x - W/2 + P.w/2, levelW - W));
}

function draw(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,W,H);
  ctx.setTransform(1,0,0,1,-cam.x,0);

  for(const p of platforms){
    if(p.x+p.w<cam.x||p.x>cam.x+W) continue;
    ctx.drawImage(platImg, p.x, p.y, p.w, p.h);
  }

  for(const b of pokeballs){
    if(b.collected||b.x<cam.x-30||b.x>cam.x+W+30)continue;
    ctx.drawImage(pokeballImg, b.x-b.r, b.y-b.r, b.r*2, b.r*2);
  }

  for(const e of enemies){
    if(!e.alive||e.x+e.w<cam.x||e.x>cam.x+W)continue;
    ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);
  }

  drawPlayer();
}

function drawPlayer(){
  const{x,y,w,h,facing}=P;
  ctx.save();
  const drawW=72, drawH=72;
  const drawX=x-(drawW-w)/2;
  const drawY=y-(drawH-h);
  if(facing==='left'){
    ctx.translate(drawX+drawW, drawY);
    ctx.scale(-1,1);
    ctx.drawImage(squirtleImg, 0, 0, drawW, drawH);
  } else {
    ctx.drawImage(squirtleImg, drawX, drawY, drawW, drawH);
  }
  ctx.restore();
}

function loseLife(){
  lives--;
  if(lives<=0){ lives=3; resetLevel(); }
  else { P.x=80; P.y=360; P.vx=0; P.vy=0; P.inv=120; cam.x=0; }
}

function showComplete(){ lives=3; resetLevel(); }

function loop(){
  update();draw();
  requestAnimationFrame(loop);
}

let loaded=0;
[squirtleImg,platImg,pokeballImg,enemyImg].forEach(img=>img.onload=()=>{if(++loaded===4){resetLevel();loop();}});
