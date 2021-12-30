class Wall {
    constructor(x1, y1, x2, y2, color) {
        this.start = new Vector(x1, y1);
        this.end = new Vector(x2, y2);
        this.color = color;
    }

    drawWall(context) {
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);
        context.lineTo(this.end.x, this.end.y);
        context.strokeStyle = this.color;
        context.lineWidth = 5;
        context.stroke();
    }

    wallUnit() {
        return this.end.sub(this.start).unit();
    }
}