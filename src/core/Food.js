import { GameEntity } from './GameEntity.js';

export class Food extends GameEntity {
    constructor(x, y) {
        super(x, y, "#e74c3c"); 
    }

    relocate(canvasWidth, canvasHeight, gridSize, snakeSegments) {
        let newX, newY;
        let isSafe = false;

       
        while (!isSafe) {
            newX = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
            newY = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
            isSafe = true;
            for (let segment of snakeSegments) {
                if (segment.x === newX && segment.y === newY) {
                    isSafe = false;
                    break;
                }
            }
        }
        this.x = newX;
        this.y = newY;
    }

   
    draw(ctx, gridSize) {
        ctx.beginPath();
        ctx.arc(this.x + gridSize / 2, this.y + gridSize / 2, gridSize / 2.2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}