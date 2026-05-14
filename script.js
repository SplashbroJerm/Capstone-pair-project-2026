const player = document.getElementById('player');
const ctx = player.getContext("2d");

const img  = new Image();
const img2 = new Image();

let loaded = 0;
function onLoad() { if (++loaded === 2) update(); }
img.onload  = onLoad;
img2.onload = onLoad;
img.src  = "squirtle-sprite2.png";
img2.src = "pika-plat.png";

let x = 0, y = 500;
let vx = 0, vy = 0;
let grounded = false;

const jumpForce = -14;
const gravity   = 0.5;
const groundY   = 650;
const playerW   = 120;
const spriteH   = 120;

const platforms = [
    {x: 400, y:560, w:200, h:15},
    {x: 600, y:470, w:200, h:15},
    {x: 200, y:370, w:200, h:50}
];

const keys = {right: false, left: false};

function overlaps(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h>rect2.y;
}

function update() {
    vx = 0;
    if(keys.right) vx=5;
    if(keys.left) vx = -5;

    x += vx;
    if (x < 0) x = 0;
    if (x + playerW > player.width) x = player.width - playerW;

    let pBox = { x: x, y: y, w: playerW, h: spriteH };
    for (const plat of platforms) {
        if (overlaps(pBox, plat)) {
        if (vx > 0) x = plat.x - playerW;
        if(vx < -0) x = plat.x + plat.w;
        pBox.x = x;
    }
    }

    if (!grounded) vy += gravity;
    y += vy;
    grounded = false;

    pBox.y = y;
    for (const plat of platforms) {
        if (overlaps(pBox, plat)) {
            if (vy >0) { 
                    y = plat.y - spriteH; 
                    grounded = true;
                    vy=0;
                } else if (vy < 0) {
                    y = plat.y + plat.h;
                    vy = 0;
                }
                pBox.y = y
    }
    }

    if (y + spriteH >= groundY) {
        y = groundY - spriteH;
        vy = 0;
        grounded = true;
    }

    ctx.clearRect(0, 0, player.width, player.height);
    for(const plat of platforms) {
        ctx.drawImage(img2, plat.x, plat.y, plat.w, 50);
    }
    ctx.drawImage(img,  x, y, playerW, spriteH);
    requestAnimationFrame(update);
}

addEventListener("keydown", e => {
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft')  keys.left = true;
    if ((e.code === 'KeyW' || e.code === 'ArrowUp') && grounded) {
        vy = jumpForce;
        grounded = false;
    }
});

addEventListener("keyup", e => {
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right=false;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft')  keys.left=false;
});
