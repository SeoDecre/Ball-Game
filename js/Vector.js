class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    len() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    mul(n) {
        return new Vector(this.x * n, this.y * n);
    }

    unit() {
        if(this.len() === 0) {
            return new Vector(0, 0);
        } else {
            return new Vector(this.x/this.len(), this.y/this.len());
        }
    }

    normal() {
        return new Vector(-this.y, this.x).unit();
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
}