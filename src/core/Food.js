import { GameEntity } from './GameEntity.js';

// KURAL: Kalıtım / Inheritance (Food sınıfı GameEntity'den miras alır)
// KURAL: En az 3 sınıf yapısı (2. Sınıf)
export class Food extends GameEntity {
    constructor(x, y) {
        super(x, y, "#e74c3c"); // Üst sınıfın yapıcısına renk gönderiyoruz
    }

    relocate(canvasWidth, canvasHeight, gridSize, snakeSegments) {
        let newX, newY;
        let isSafe = false;

        // Yemin yılanın üzerine düşmesini engelleme mantığı
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

    // KURAL: Polymorphism (Üst sınıfın draw metodunu eziyoruz - Override)
    draw(ctx, gridSize) {
        ctx.beginPath();
        ctx.arc(this.x + gridSize / 2, this.y + gridSize / 2, gridSize / 2.2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}