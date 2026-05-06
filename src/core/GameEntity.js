
export class GameEntity {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

   
    draw(ctx, gridSize) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
    }
}