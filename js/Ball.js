class Ball extends Entity {
    constructor(x, y, radius, mass, color) {
        super(x, y, radius, mass);
        this.color = color;
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.acceleration = 0.8;
        this.friction = 0.1;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    reposition() {
        this.acc = this.acc.unit().mul(this.acceleration);
        this.vel = this.vel.add(this.acc);
        this.vel = this.vel.mul(1 - this.friction);
        this.pos = this.pos.add(this.vel);
    }

    getShoot(p) {
        var shootPower = 90;

        var normal = p.pos.sub(this.pos).unit();
        var relVel = p.vel.sub(this.vel);
        var sepVel = Vector.dot(relVel, normal);
        var newSepVel = -sepVel * 0.7;

        var sepVelDifference = newSepVel - sepVel;
        var impulse = (sepVelDifference / (p.inverseMass + this.inverseMass)) - shootPower;
        var impulseVector = normal.mul(impulse);

        p.vel = p.vel.add(impulseVector.mul(p.inverseMass));
        this.vel = this.vel.add(impulseVector.mul(-this.inverseMass / 3)); // Collision rebound
    }

    resetShoot() {
        this.acceleration = 1;
        this.friction = 0.05;
    }

    update(context) {
        this.draw(context);
        this.reposition();
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