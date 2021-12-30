class Entity {
    constructor(x, y, radius, mass) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        if(this.mass === 0) {
            this.inverseMass = 0;
        } else {
            this.inverseMass = 1 / this.mass;
        }
    }

    draw() {}
    update() {}
}