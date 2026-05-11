const player = document.getElementById('player');

const ctx = player.getContext("2d");
const img = new Image();
img.src = "squirtle-sprite2.png"


let x = -90;
let y = 460;
let vx = 0;
let vy = 0;
function update(){
    ctx.clearRect(0, 0, player.clientWidth, player.height);
    x += vx;
    y += vy;
    ctx.drawImage(img, x, y, 300, 150);
    requestAnimationFrame(update);
}

addEventListener("keydown", function(e){
    if(e.code == 'KeyD' || e.code == "ArrowRight") vx = 5;
    if(e.code == 'KeyA' || e.code == "ArrowLeft") vx = -5;
    if(e.code == 'KeyS' || e.code == "ArrowDown")vy = 5;
    if(e.code == 'KeyW' || e.code == "ArrowUp")vy = -5;
});

addEventListener("keyup", function(e){
    if(e.code == 'KeyD' || e.code == "ArrowRight")vx = 0;
    if(e.code == 'KeyA' || e.code == "ArrowLeft")vx = 0;
    if(e.code == 'KeyS' || e.code == "ArrowDown")vy = 0;
    if(e.code == 'KeyW' || e.code == "ArrowUp")vy = 5;
});



update();
