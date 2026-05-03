// KURAL: En az 3 sınıf yapısı (1. Sınıf)
export class GameEntity {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    // KURAL: Polymorphism (Çok biçimlilik) için temel metot
    draw(ctx, gridSize) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
    }
}