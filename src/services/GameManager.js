import { Snake } from '../core/Snake.js';
import { Food } from '../core/Food.js';

export class GameManager {
    constructor() {
        // KURAL: Hata Yönetimi (Try-Catch) yapısı
        try {
            this.canvas = document.getElementById("gameCanvas");
            if (!this.canvas) throw new Error("Canvas elementi bulunamadı!");
            
            this.ctx = this.canvas.getContext("2d");
            this.gridSize = 20;
            
            // DOM Elementleri
            this.ui = {
                startScreen: document.getElementById("startScreen"),
                gameOverScreen: document.getElementById("gameOverScreen"),
                scoreValue: document.getElementById("scoreValue"),
                highScoreValue: document.getElementById("highScoreValue"),
                finalScoreText: document.getElementById("finalScoreText"),
                diffButtons: document.querySelectorAll(".diff-btn")
            };

            this.state = {
                score: 0,
                highScore: localStorage.getItem("snakeHighScore") ? parseInt(localStorage.getItem("snakeHighScore")) : 0,
                speed: 100,
                interval: null,
                isPlaying: false
            };

            this.ui.highScoreValue.innerText = this.state.highScore;

            // Sınıfları başlat
            this.snake = new Snake(200, 200, this.gridSize);
            this.food = new Food(0, 0);

            this.#setupEventListeners();
            this.#clearCanvas();
        } catch (error) {
            console.error("Sistem başlatılırken kritik bir hata oluştu:", error.message);
            alert("Oyun yüklenirken hata oluştu. Lütfen sayfayı yenileyin.");
        }
    }

    #setupEventListeners() {
        // Zorluk Seçimi
        this.ui.diffButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.ui.diffButtons.forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                this.state.speed = parseInt(e.target.getAttribute("data-speed"));
            });
        });

        document.getElementById("startBtn").addEventListener("click", () => this.startGame());
        document.getElementById("restartBtn").addEventListener("click", () => this.startGame());
        
        document.getElementById("menuBtn").addEventListener("click", () => {
            this.ui.gameOverScreen.style.display = "none";
            this.ui.startScreen.style.display = "flex";
            this.state.isPlaying = false;
            this.#clearCanvas();
        });

        // Klavye Kontrolleri
        document.addEventListener("keydown", (e) => {
            if (!this.state.isPlaying) return;
            const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
            const dx = this.snake.getDx();
            const dy = this.snake.getDy();

            if (e.keyCode === LEFT && dx !== this.gridSize) this.snake.setDirection(-this.gridSize, 0);
            if (e.keyCode === UP && dy !== this.gridSize) this.snake.setDirection(0, -this.gridSize);
            if (e.keyCode === RIGHT && dx !== -this.gridSize) this.snake.setDirection(this.gridSize, 0);
            if (e.keyCode === DOWN && dy !== -this.gridSize) this.snake.setDirection(0, this.gridSize);
        });
    }

    #clearCanvas() {
        this.ctx.fillStyle = "#a2d149";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startGame() {
        try {
            this.ui.startScreen.style.display = "none";
            this.ui.gameOverScreen.style.display = "none";
            this.state.isPlaying = true;
            this.state.score = 0;
            this.ui.scoreValue.innerText = "0";
            
            this.snake.reset(200, 200);
            this.food.relocate(this.canvas.width, this.canvas.height, this.gridSize, this.snake.getSegments());
            
            if (this.state.interval) clearInterval(this.state.interval);
            this.state.interval = setInterval(() => this.gameLoop(), this.state.speed);
        } catch(e) {
            console.error("Oyun başlatılamadı:", e);
        }
    }

    gameOver() {
        this.state.isPlaying = false;
        clearInterval(this.state.interval);
        
        let newRecordMsg = "";
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            localStorage.setItem("snakeHighScore", this.state.highScore);
            this.ui.highScoreValue.innerText = this.state.highScore;
            newRecordMsg = `<br><span style="color:#f1c40f; font-size:28px;">🏆 Yeni Rekor! 🏆</span>`;
        }

        this.ui.finalScoreText.innerHTML = `Toplam Skor: ${this.state.score} ${newRecordMsg}`;
        this.ui.gameOverScreen.style.display = "flex";
    }

    gameLoop() {
        try {
            this.snake.move();
            const head = this.snake.getHead();

            // Çarpışma Kontrolleri
            if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height || this.snake.checkSelfCollision()) {
                this.gameOver();
                return;
            }

            // Yem Yeme Kontrolü
            if (head.x === this.food.x && head.y === this.food.y) {
                this.state.score += 10;
                this.ui.scoreValue.innerText = this.state.score;
                this.food.relocate(this.canvas.width, this.canvas.height, this.gridSize, this.snake.getSegments());
            } else {
                this.snake.removeTail();
            }

            // Çizim İşlemleri
            this.#clearCanvas();
            this.food.draw(this.ctx, this.gridSize);
            this.snake.draw(this.ctx, this.gridSize);

        } catch (error) {
            console.error("Döngü sırasında hata:", error);
            this.gameOver();
        }
    }
}

// Oyunu Başlat
window.onload = () => {
    new GameManager();
};