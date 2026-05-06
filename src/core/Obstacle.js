import { GameEntity } from './GameEntity.js';


export class Obstacle extends GameEntity {
    constructor(x, y) {
        
        super(x, y, "#5d4037"); 
    }

   
    draw(ctx, gridSize) {
        ctx.fillStyle = this.color;
        
       
        const r = 5; 
        ctx.beginPath();
        
        ctx.roundRect(this.x + 1, this.y + 1, gridSize - 2, gridSize - 2, [r, r, r, r]); 
        ctx.fill();
        ctx.closePath();
    }
}