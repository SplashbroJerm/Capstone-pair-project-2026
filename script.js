const player = document.getElementById('player');

const ctx = player.getContext("2d");

let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
function update(){
    ctx.clearRect(0, 0, player.clientWidth, player.height);
    x += vx;
    y += vy;
    ctx.fillRect(x, y, 50, 50);
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
    if(e.code == 'KeyW' || e.code == "ArrowUp")vy = 0;
});



update();
