class Player extends Entity {
    constructor(x, y, radius, mass, team, name) {
        super(x, y, radius, mass);
        this.team = team;
        this.name = name;
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.acceleration = 0.8;
        this.friction = 0.1;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.team;
        context.font = "15px Rubik";
        context.textAlign = "center";
        context.fillText(this.name, this.pos.x, this.pos.y + 50);
        context.fill();
    }

    update(context) {
        this.draw(context);
        /*context.beginPath();context.moveTo(this.pos.x, this.pos.y);
        context.lineTo(this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
        context.strokeStyle = "white";
        context.stroke();*/
    }

    // Setters
    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    setVel(x, y) {
        this.vel.x = x;
        this.vel.y = y;
    }
    setAcc(x, y) {
        this.acc.x = x;
        this.acc.y = y;
    }
}

function reposition(p) {
    p.acc = p.acc.unit().mul(p.acceleration);
    p.vel = p.vel.add(p.acc);
    p.vel = p.vel.mul(1 - p.friction);
    p.pos = p.pos.add(p.vel);
}

// Movement variables
var UP, DOWN, LEFT, RIGHT, SHOOT;
// Player movement
function keyControl(player, ball) {
    window.addEventListener('keydown', function (e) {
        if (e.key == 'w') {
            UP = true;
        }
        if (e.key == 's') {
            DOWN = true;
        }
        if (e.key == 'a') {
            LEFT = true;
        }
        if (e.key == 'd') {
            RIGHT = true;
        }
        if (e.keyCode == 32) {
            SHOOT = true;
        }
    });

    window.addEventListener('keyup', function (e) {
        if (e.key == 'w') {
            UP = false;
        }
        if (e.key == 's') {
            DOWN = false;
        }
        if (e.key == 'a') {
            LEFT = false;
        }
        if (e.key == 'd') {
            RIGHT = false;
        }
        if (e.keyCode == 32) {
            SHOOT = false;
        }
    });

    // Positions
    if (UP) {
        player.acc.y = -player.acceleration;
    }
    if (DOWN) {
        player.acc.y = player.acceleration;
    }
    if (LEFT) {
        player.acc.x = -player.acceleration;
    }
    if (RIGHT) {
        player.acc.x = player.acceleration;
    }

    if (!UP && !DOWN) {
        player.acc.y = 0;
    }
    if (!LEFT && !RIGHT) {
        player.acc.x = 0;
    }

    player.acc = player.acc.unit().mul(player.acceleration);
    player.vel = player.vel.add(player.acc);
    player.vel = player.vel.mul(1 - player.friction);
    player.pos = player.pos.add(player.vel);

    // Player shot
    if (SHOOT) {
        if (isColliding(player, ball)) {
            ball.getShoot(player);
        }
        // Decrease acceleration
        player.acceleration = 0.4;
        // Set white stroke
        context.beginPath();
        context.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2, false);
        context.strokeStyle = "white";
        context.stroke();
    }
    if (!SHOOT) {
        ball.resetShoot();
        // Reset acceleration
        player.acceleration = 0.8;
    }
}

// Movement variables
var UP1, DOWN1, LEFT1, RIGHT1, SHOOT1;
// Player movement
function secondKeyControl(player, ball) {
    window.addEventListener('keydown', function (e) {
        if (e.key == 'i') {
            UP1 = true;
        }
        if (e.key == 'k') {
            DOWN1 = true;
        }
        if (e.key == 'j') {
            LEFT1 = true;
        }
        if (e.key == 'l') {
            RIGHT1 = true;
        }
        if (e.keyCode == 190) {
            SHOOT1 = true;
        }
    });

    window.addEventListener('keyup', function (e) {
        if (e.key == 'i') {
            UP1 = false;
        }
        if (e.key == 'k') {
            DOWN1 = false;
        }
        if (e.key == 'j') {
            LEFT1 = false;
        }
        if (e.key == 'l') {
            RIGHT1 = false;
        }
        if (e.keyCode == 190) {
            SHOOT1 = false;
        }
    });

    // Positions
    if (UP1) {
        player.acc.y = -player.acceleration;
    }
    if (DOWN1) {
        player.acc.y = player.acceleration;
    }
    if (LEFT1) {
        player.acc.x = -player.acceleration;
    }
    if (RIGHT1) {
        player.acc.x = player.acceleration;
    }

    if (!UP1 && !DOWN1) {
        player.acc.y = 0;
    }
    if (!LEFT1 && !RIGHT1) {
        player.acc.x = 0;
    }

    player.acc = player.acc.unit().mul(player.acceleration);
    player.vel = player.vel.add(player.acc);
    player.vel = player.vel.mul(1 - player.friction);
    player.pos = player.pos.add(player.vel);

    // Player shot
    if (SHOOT1) {
        if (isColliding(player, ball)) {
            ball.getShoot(player);
        }
        // Decrease acceleration
        player.acceleration = 0.4;
        // Set white stroke
        context.beginPath();
        context.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2, false);
        context.strokeStyle = "white";
        context.stroke();
    }
    if (!SHOOT1) {
        ball.resetShoot();
        // Reset acceleration
        player.acceleration = 0.8;
    }
}

function followBall(player, ball) {
    player.acc = player.acc.add(ball.vel);

    player.acc = player.acc.unit().mul(player.acceleration);
    player.vel = player.vel.add(player.acc);
    player.vel = player.vel.mul(1 - player.friction);
    player.pos = player.pos.add(player.vel);
    //player.vel = player.vel.add(player.vel);
    /*
    player.acc = player.acc.unit().mul(player.acceleration);
    player.vel = player.vel.add(player.acc);
    player.vel = player.vel.mul(1 - player.friction);
    player.pos = player.pos.add(player.vel);
    */
}