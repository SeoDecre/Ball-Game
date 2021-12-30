/* --------------------------------------- Canvas variables --------------------------------------- */
var gameContainer = document.getElementById("gameField");
var context = gameContainer.getContext("2d");
gameContainer.width = 1350; // Canvas width
gameContainer.height = 650; // Canvas height
var fieldWidth = 1000; // Field width
var fieldHeight = 500; // Field height

/* --------------------------------------- Global variables --------------------------------------- */
// Game
var gameOver = false; // Not used yet
var firstControllablePlayerName = "pippo";

// Scores
var redScore = 0;
var blueScore = 0;
var topScore = 5;
var redScoreLabel = document.getElementById("redScore");
var blueScoreLabel = document.getElementById("blueScore");
var goalLabel = document.getElementById("goalText");

// Turns
var isRemovable = true;
var leftGoalPosition;
var rightGoalPosition; 
var spawnWallMargin = 100;
var blockWall;

// Colors
var redPlayerColor = "#e93a3a";
var bluePlayerColor = "#4d56cf";
var ballColor = "white";
var fieldColor = "#58cf4d";
var transparentColor = "#212121";

// Entity properties
var playerRadius = 30;
var ballRadius = 20;
var playerMass = 3;
var ballMass = 3;

// Entities declarations
var ball;
var redPlayers = [];
var bluePlayers = [];
const fieldWalls = []; // Field walls
const canvasWalls = []; // Canvas external walls

/* --------------------------------------- Global functions --------------------------------------- */

/* ------------------- Walls ------------------- */
function drawField() {
    var xPos = (gameContainer.width - fieldWidth) / 2;
    var yPos = (gameContainer.height - fieldHeight) / 2;

    var topWall = new Wall(xPos, yPos, xPos+fieldWidth, yPos, fieldColor);
    var bottomWall = new Wall(xPos, yPos+fieldHeight, xPos+fieldWidth, yPos+fieldHeight, fieldColor);
    var leftWall1 = new Wall(xPos, yPos, xPos, yPos+150, fieldColor);
    var leftWall2 = new Wall(xPos, yPos+fieldHeight, xPos, yPos+(fieldHeight-150), fieldColor);
    var rightWall1 = new Wall(xPos+fieldWidth, yPos, xPos+fieldWidth, yPos+150, fieldColor);
    var rightWall2 = new Wall(xPos+fieldWidth, yPos+fieldHeight, xPos+fieldWidth, yPos+(fieldHeight-150), fieldColor);

    var leftBack = new Wall(xPos-50, yPos+150, xPos-50, yPos+350, fieldColor);
    var rightBack = new Wall(xPos+fieldWidth+50, yPos+150, xPos+fieldWidth+50, yPos+350, fieldColor);

    var leftTop = new Wall(xPos-50, yPos+150, xPos, yPos+150, fieldColor);
    var leftBottom = new Wall(xPos-50, yPos+350, xPos, yPos+fieldHeight-150, fieldColor);

    var rightTop = new Wall(xPos+fieldWidth+50, yPos+150, xPos+fieldWidth, yPos+150, fieldColor);
    var rightBottom = new Wall(xPos+fieldWidth, yPos+fieldHeight-150, xPos+fieldWidth+50, yPos+fieldHeight-150, fieldColor);

    fieldWalls.push(topWall);
    fieldWalls.push(bottomWall);
    fieldWalls.push(leftWall1);
    fieldWalls.push(leftWall2);
    fieldWalls.push(rightWall1);
    fieldWalls.push(rightWall2);
    fieldWalls.push(leftBack);
    fieldWalls.push(rightBack);
    fieldWalls.push(leftTop);
    fieldWalls.push(leftBottom);
    fieldWalls.push(rightTop);
    fieldWalls.push(rightBottom);

    var topCanvasWall = new Wall(0, 0, gameContainer.width, 0, transparentColor);
    var bottomCanvasWall = new Wall(0, gameContainer.height, gameContainer.width, gameContainer.height, transparentColor);
    var leftCanvasWall = new Wall(0, 0, 0, gameContainer.height, transparentColor);
    var rightCanvasWall = new Wall(gameContainer.width, 0, gameContainer.width, gameContainer.height, transparentColor);

    canvasWalls.push(topCanvasWall);
    canvasWalls.push(bottomCanvasWall);
    canvasWalls.push(leftCanvasWall);
    canvasWalls.push(rightCanvasWall);
}
function closestPointBallToWall(ball, wall) {
    var ballToWallStart = wall.start.sub(ball.pos);
    if(Vector.dot(wall.wallUnit(), ballToWallStart) > 0) {
        return wall.start;
    }

    var wallEndToBall = ball.pos.sub(wall.end);
    if(Vector.dot(wall.wallUnit(), wallEndToBall) > 0) {
        return wall.end;
    }

    var closestDist = Vector.dot(wall.wallUnit(), ballToWallStart);
    var closestVect = wall.wallUnit().mul(closestDist);
    return wall.start.sub(closestVect);
}

/* ------------------- Goal and scores ------------------- */
function redTurn() {
    var xPos = (document.getElementById("gameField").width / 2) - (fieldWidth / 2);
    blockWall = new Wall(xPos+(fieldWidth/2)+spawnWallMargin, 0, xPos+(fieldWidth/2)+spawnWallMargin, gameContainer.width, redPlayerColor);
    fieldWalls.push(blockWall);
}
function blueTurn() {
    var xPos = (document.getElementById("gameField").width / 2) - (fieldWidth / 2);
    blockWall = new Wall(xPos+(fieldWidth/2)-spawnWallMargin, 0, xPos+(fieldWidth/2)-spawnWallMargin, gameContainer.width, bluePlayerColor);
    fieldWalls.push(blockWall);
}

/* ------------------- Goal and scores ------------------- */
function goalAnimation(playerWhoScored) {
    goalLabel.classList.remove("invisible");
    goalLabel.style.visibility = "visible";

    if(playerWhoScored == "red") {
        goalLabel.innerText = "Red scored!";
        goalLabel.style.color = redPlayerColor;
    }
    if(playerWhoScored == "blue") {
        goalLabel.innerText = "Blue scored!";
        goalLabel.style.color = bluePlayerColor;
    }

    setTimeout(function() {
        goalLabel.className = "invisible";
    }, 1000);
}
function winAnimation(playerWhoWon) {
    goalLabel.classList.remove("invisible");
    goalLabel.style.visibility = "visible";

    if(playerWhoWon == "red") {
        goalLabel.innerText = "Red won!";
        goalLabel.style.color = redPlayerColor;
    }
    if(playerWhoWon == "blue") {
        goalLabel.innerText = "Blue won!";
        goalLabel.style.color = bluePlayerColor;
    }

    setTimeout(function() {
        goalLabel.className = "invisible";
    }, 2000);

    redScore = 0;
    blueScore = 0;
    redScoreLabel.innerText = redScore;
    blueScoreLabel.innerText = blueScore;
}
function checkGoal() {
    leftGoalPosition = ((gameContainer.width - fieldWidth) / 2) - ball.radius;
    rightGoalPosition = (gameContainer.width - ((gameContainer.width - fieldWidth) / 2)) + ball.radius;

    if(ball.pos.x > rightGoalPosition) {
        isRemovable = true;
        goalAnimation("red");
        redScore++;
        redScoreLabel.innerText = redScore;
        resetAllPositions();
        blueTurn();
    }
    if(ball.pos.x < leftGoalPosition) {
        isRemovable = true;
        goalAnimation("blue");
        blueScore++;
        blueScoreLabel.innerText = blueScore;
        resetAllPositions();
        redTurn();
    }
    checkWin();
}
function checkWin() {
    if(redScore == topScore) {
        winAnimation("red");
    }
    if(blueScore == topScore) {
        winAnimation("blue");
    }
}

/* ------------------- Collisions ------------------- */
// Function used to get distance between two objects
function getDistance(x1, y1, x2, y2) {
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
function isWallCollision(ball, wall) {
    var ballToClosest = closestPointBallToWall(ball, wall).sub(ball.pos);
    if(ballToClosest.len() <= ball.radius) {
        return true;
    }
}
function resolveWallPenetration(ball, wall) {
    var penetrationVector = ball.pos.sub(closestPointBallToWall(ball, wall));
    ball.pos = ball.pos.add(penetrationVector.unit().mul(ball.radius - penetrationVector.len()));
}
function resolveWallCollision(ball, wall) {
    var normal = ball.pos.sub(closestPointBallToWall(ball, wall)).unit();
    var sepVel = Vector.dot(ball.vel, normal);
    var newSepVel = -sepVel * 1;
    var sepVelDifference = sepVel - newSepVel;
    ball.vel = ball.vel.add(normal.mul(-sepVelDifference));
}

function isColliding(entity1, entity2) {
    if(entity1.radius + entity2.radius >= entity2.pos.sub(entity1.pos).len()) {
        return true;
    } else {
        return false;
    }
}
function resolvePenetrationBetweenBalls(entity1, entity2) {
    var distance = entity1.pos.sub(entity2.pos);
    var penetration = entity1.radius + entity2.radius - distance.len();
    var response = distance.unit().mul(penetration / entity1.inverseMass + entity2.inverseMass);
    entity1.pos = entity1.pos.add(response.mul(entity1.inverseMass));
    entity2.pos = entity2.pos.add(response.mul(-entity2.inverseMass));
}
function resolveCollisionBetweenBalls(entity1, entity2) {
    var normal = entity1.pos.sub(entity2.pos).unit();
    var relVel = entity1.vel.sub(entity2.vel);
    var sepVel = Vector.dot(relVel, normal);
    var newSepVel = -sepVel * 0.5;

    var sepVelDifference = newSepVel - sepVel;
    var impulse = sepVelDifference / (entity1.inverseMass + entity2.inverseMass);
    var impulseVector = normal.mul(impulse);

    entity1.vel = entity1.vel.add(impulseVector.mul(entity1.inverseMass));
    entity2.vel = entity2.vel.add(impulseVector.mul(-entity2.inverseMass));
}

/* ------------------- Spawning positions ------------------- */
function spawnBallToPosition(ball) {
    var xBallSpawn = gameContainer.width / 2;
    var yBallSpawn = gameContainer.height / 2;
    ball.setPos(xBallSpawn, yBallSpawn);
    ball.setVel(0, 0);
}
function spawnPlayerToPosition(player) {
    var xRedSpawn = gameContainer.width / 2 - 200;
    var yRedSpawn = gameContainer.height / 2;
    var xBlueSpawn = gameContainer.width / 2 + 200;
    var yBlueSpawn = gameContainer.height / 2;

    if(player.team == redPlayerColor) {
        player.setPos(xRedSpawn, yRedSpawn);
    }
    if(player.team == bluePlayerColor) {
        player.setPos(xBlueSpawn, yBlueSpawn);
    }
}
function resetAllPositions() {
    redPlayers.forEach(p => {
        spawnPlayerToPosition(p);     
    });
    bluePlayers.forEach(p =>{
        spawnPlayerToPosition(p);
    });
    spawnBallToPosition(ball);
}

/* --------------------------------------- Main funcions --------------------------------------- */
// Init
function init() {
    drawField(); // Drawing field
    redTurn();

    redNumber = 1;
    blueNumber = 1;
    redPlayers = [];
    bluePlayers = [];

    /* ----------------------------------- Creating red players -----------------------------------*/
    for(var i=0; i<redNumber; i++) {
        redPlayers.push(new Player(0, 0, playerRadius, playerMass, redPlayerColor, firstControllablePlayerName)); // Pushing into players array
        spawnPlayerToPosition(redPlayers[i]); // Spawning to correct position
    }

    /* ----------------------------------- Creating blue players -----------------------------------*/
    for(var i=0; i<blueNumber; i++) {
        bluePlayers.push(new Player(0, 0, playerRadius, playerMass, bluePlayerColor, "armando")); // Pushing into players array
        spawnPlayerToPosition(bluePlayers[i]); // Spawning to correct position
    }

    // Creating ball
    ball = new Ball(0, 0, ballRadius, ballMass, ballColor);
    spawnBallToPosition(ball);

    // Setting scores to 0
    redScoreLabel.innerText = redScore;
    blueScoreLabel.innerText = blueScore;

    animate();
}

// Animation loop
function animate() {
    context.clearRect(0, 0, gameContainer.width, gameContainer.height); // Clearing canvas 60 times per second

    // Detecting wall collisions
    fieldWalls.forEach(w => {
        w.drawWall(context);
        if(isWallCollision(ball, w)) {
            resolveWallPenetration(ball, w);
            resolveWallCollision(ball, w);
        }
    });

    // Updating ball
    ball.update(context);
    
    /* ------------------- Spawning red players ------------------- */
    redPlayers.forEach(p => {
        p.update(context, redPlayers);
        if(p.name == firstControllablePlayerName) {
            keyControl(p, ball);
        } else {
            reposition(p);
            // followBall(p, ball);
        }
        if(isColliding(p, ball)) {
            resolveCollisionBetweenBalls(p, ball);
            resolvePenetrationBetweenBalls(p, ball);
            if(isRemovable) {
                fieldWalls.pop(); // Remove blue block
                isRemovable = false;
            }
        }

        // Canvas wall collisions
        canvasWalls.forEach(w => {
            w.drawWall(context);
            if(isWallCollision(p, w)) {
                resolveWallPenetration(p, w);
                resolveWallCollision(p, w);
            }
        });
        // Block wall collisions
        if(isRemovable) {
            if(isWallCollision(p, blockWall)) {
                resolveWallPenetration(p, blockWall);
                resolveWallCollision(p, blockWall);
            }
        }
    });
    /* ------------------- Spawning blue players ------------------- */
    bluePlayers.forEach(p => {
        p.update(context, bluePlayers);
        if(p.name == firstControllablePlayerName) {
            keyControl(p, ball);
        } else {
            //secondKeyControl(p, ball);
            reposition(p);
            //followBall(p, ball);
        }
        if(isColliding(p, ball)) {
            resolveCollisionBetweenBalls(p, ball);
            resolvePenetrationBetweenBalls(p, ball);
            if(isRemovable) {
                fieldWalls.pop(); // Remove red block
                isRemovable = false;
            }
        }

        // Canvas wall collisions
        canvasWalls.forEach(w => {
            w.drawWall(context);
            if(isWallCollision(p, w)) {
                resolveWallPenetration(p, w);
                resolveWallCollision(p, w);
            }
        });
        // Block wall collisions
        if(isRemovable) {
            if(isWallCollision(p, blockWall)) {
                resolveWallPenetration(p, blockWall);
                resolveWallCollision(p, blockWall);
            }
        }
    });

    // Collisions between players
    redPlayers.forEach(p1 => {
        bluePlayers.forEach(p2 => {
            if(isColliding(p1, p2)) {
                resolveCollisionBetweenBalls(p1, p2);
                resolvePenetrationBetweenBalls(p1, p2);
            }
        });
    });

    checkGoal();
    requestAnimationFrame(animate);
}

// Calls
init();