const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')

const blockImage = new Image()
blockImage.src = "img/block01.png"
const backgroundImage = new Image()
backgroundImage.src = "img/background.jpg"
const ballImage = new Image()
ballImage.src = "img/ball.png"
const paddleImage = new Image()
paddleImage.src = "img/paddle.png"

const W_W = 520;
const W_H = 450;

var blocks_count;

var isAlive;
var paddle;
var blocks = [];
var ball;

function randint(min, max) {
    return Math.floor(Math.random()*max+min);
}

class Paddle {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 12;
        this.image = image;
        this.lives = 3;
    }

    move(event) {
        if ((event.code == 'ArrowLeft') && (this.x - this.speed + 1 > 0)){
            this.x -= this.speed;
        } else if ((event.code == 'ArrowRight') && (this.x + this.width + this.speed < W_W)){
            this.x += this.speed;
        }
    }

    moveM(event) {
        var rect = canvas.getBoundingClientRect();
        var newX = Math.floor(event.clientX - rect.left);
        if ((newX - this.width/2 > 0) && (newX + this.width/2 < W_W)){
            this.x = newX - this.width/2;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

class Ball {
    constructor(x, y, width, height, dx, dy, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.image = image;
    }

    move() {
        this.x += this.dx;
        for (var i = 0; i < blocks.length; i++)
            if ( (this.x + this.width > blocks[i].x) && (this.x < blocks[i].x + 42) && (this.y + this.height > blocks[i].y) && (this.y < blocks[i].y + 20) ) {
                blocks[i].x = -100;
                this.dx = -this.dx;
                blocks_count--;
                if (blocks_count < 1) {
                    youWin();
                    isAlive = false;
                    playAgain();
                }
            }

        this.y += this.dy;
        for (var i = 0; i < blocks.length; i++)
            if ( (this.x + this.width > blocks[i].x) && (this.x < blocks[i].x + 42) && (this.y + this.height > blocks[i].y) && (this.y < blocks[i].y + 20) ) {
                blocks[i].x = -100;
                this.dy = -this.dy;
                blocks_count--;
                if ((blocks_count < 1) && (paddle.lives > 0)) {
                    youWin();
                    isAlive = false;
                    playAgain();
                }
            }

        if ((this.x < 0) || (this.x + this.width > W_W)) {
            this.dx = -this.dx;
        }
        if (this.y < 0) {
            this.dy = -this.dy;
        }
        if (this.y + this.height > W_H) {
            this.dy = -this.dy;
            paddle.lives--;
            if ((paddle.lives < 1) && (blocks_count > 0)) {
                gameOver();
                isAlive = false;
                playAgain();
            }
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }

    collide() {
        if ((this.x + this.width > paddle.x) && (this.x < paddle.x + paddle.width) && (this.y + this.height > paddle.y) && (this.y < paddle.y + paddle.height))
            this.dy = -randint(2,5);
    }
}

function gameOver() {
    ctx.fillStyle = "black"
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", 100, 200); 
}

function youWin() {
    ctx.fillStyle = "black"
    ctx.font = "50px Arial";
    ctx.fillText("You Win", 170, 200);
}

function playAgain() {
    ctx.fillStyle = "red"
    ctx.font = "50px Arial";
    ctx.fillText("Play again?", 135, 260); 
}

function init() {
    blocks_count = 100;
    isAlive = true;

    paddle = new Paddle(5, 440, 90, 9, paddleImage);
    ball = new Ball(300, 300, 12, 12, 12, 5, ballImage);

    for (var i = 1; i < 11; i++) {
        for (var j = 1; j < 11; j++) {
            blocks.push({x: i*43, y: j*20});
        }
    }    
}

function moveAll() {
    ball.move();
}

function drawAll() {
    ctx.drawImage(backgroundImage, 0, 0);
    ctx.drawImage(ballImage, ball.x, ball.y);
    for (var i = 0; i < blocks.length; i++) {
        ctx.drawImage(blockImage, blocks[i].x, blocks[i].y);
    }
    paddle.draw();

    ctx.fillStyle = "white"
    ctx.font = "20px Arial";
    ctx.fillText(paddle.lives, 10, 20); 

    ctx.fillStyle = "white"
    ctx.font = "20px Arial";
    ctx.fillText(blocks_count, 470, 20); 
}

function gameLoop() {
    moveAll();
    if(isAlive) {
        ball.collide()
        drawAll();
    }
}

function main() {
    init();

    game = setInterval(gameLoop, 20);
}

document.addEventListener("keydown", function keyDown(event) {
    paddle.move(event);
})

document.addEventListener("mousemove", function MM(event) {
    paddle.moveM(event);
})


document.addEventListener("click", function MM(event) {
    if (!isAlive) {
        var rect = canvas.getBoundingClientRect();
        var newX = Math.floor(event.clientX - rect.left);
        var newY = Math.floor(event.clientY - rect.top);

        if((newX > 135) && (newX < 395) && (newY > 225) && (newY < 260)) {
            init();
        }
    }
})

main()