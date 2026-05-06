import { GameEntity } from './GameEntity.js';


export class Snake extends GameEntity {
    
    #segments = [];
    #dx;
    #dy;

    constructor(startX, startY, gridSize) {
        super(startX, startY, "#4C7BEC"); 
        this.gridSize = gridSize;
        this.reset(startX, startY);
    }

    reset(x, y) {
        this.#segments = [
            { x: x, y: y },
            { x: x - this.gridSize, y: y },
            { x: x - (this.gridSize * 2), y: y }
        ];
        this.#dx = this.gridSize; 
        this.#dy = 0;
    }

    
    getSegments() { return this.#segments; }
    getHead() { return this.#segments[0]; }
    getDx() { return this.#dx; }
    getDy() { return this.#dy; }

   
    setDirection(newDx, newDy) {
        this.#dx = newDx;
        this.#dy = newDy;
    }

    move() {
        const newHead = { x: this.#segments[0].x + this.#dx, y: this.#segments[0].y + this.#dy };
        this.#segments.unshift(newHead);
    }

    removeTail() {
        this.#segments.pop();
    }

    checkSelfCollision() {
        const head = this.getHead();
        for (let i = 1; i < this.#segments.length; i++) {
            if (head.x === this.#segments[i].x && head.y === this.#segments[i].y) return true;
        }
        return false;
    }

   
    draw(ctx, gridSize) {
        if (this.#segments.length === 0) return;

        
        ctx.beginPath();
        ctx.moveTo(this.#segments[0].x + gridSize / 2, this.#segments[0].y + gridSize / 2);
        
        for (let i = 1; i < this.#segments.length; i++) {
            ctx.lineTo(this.#segments[i].x + gridSize / 2, this.#segments[i].y + gridSize / 2);
        }
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = gridSize - 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.closePath();

        this.#drawHeadFeatures(ctx, gridSize);
    }


    #drawHeadFeatures(ctx, gridSize) {
        const head = this.getHead();
        const centerX = head.x + gridSize / 2;
        const centerY = head.y + gridSize / 2;
        const eyeOffset = 5; 
        
        let e1x, e1y, e2x, e2y;
        if (this.#dx === gridSize) { e1x = centerX + eyeOffset; e1y = centerY - eyeOffset; e2x = centerX + eyeOffset; e2y = centerY + eyeOffset; } 
        else if (this.#dx === -gridSize) { e1x = centerX - eyeOffset; e1y = centerY - eyeOffset; e2x = centerX - eyeOffset; e2y = centerY + eyeOffset; } 
        else if (this.#dy === -gridSize) { e1x = centerX - eyeOffset; e1y = centerY - eyeOffset; e2x = centerX + eyeOffset; e2y = centerY - eyeOffset; } 
        else if (this.#dy === gridSize) { e1x = centerX - eyeOffset; e1y = centerY + eyeOffset; e2x = centerX + eyeOffset; e2y = centerY + eyeOffset; }

        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(e1x, e1y, 3, 0, 2 * Math.PI); ctx.arc(e2x, e2y, 3, 0, 2 * Math.PI); ctx.fill(); ctx.closePath();
        ctx.fillStyle = "black";
        ctx.beginPath(); ctx.arc(e1x, e1y, 1.5, 0, 2 * Math.PI); ctx.arc(e2x, e2y, 1.5, 0, 2 * Math.PI); ctx.fill(); ctx.closePath();
    }
}