
import { Snake } from '../core/Snake.js';
import { Food } from '../core/Food.js';
import { Obstacle } from '../core/Obstacle.js'; 

export class GameManager {
    constructor() {
        try {
            this.canvas = document.getElementById("gameCanvas");
            if (!this.canvas) throw new Error("Canvas elementi bulunamadı!");
            
            this.ctx = this.canvas.getContext("2d");
            this.gridSize = 20;
            
            this.ui = {
                startScreen: document.getElementById("startScreen"),
                gameOverScreen: document.getElementById("gameOverScreen"),
                scoreValue: document.getElementById("scoreValue"),
                highScoreValue: document.getElementById("highScoreValue"),
                timeValue: document.getElementById("timeValue"),
                bestTimeValue: document.getElementById("bestTimeValue"), 
                finalScoreText: document.getElementById("finalScoreText"),
                diffButtons: document.querySelectorAll(".diff-btn")
            };

            this.state = {
                score: 0,
                highScore: localStorage.getItem("snakeHighScore") ? parseInt(localStorage.getItem("snakeHighScore")) : 0,
                bestTime: localStorage.getItem("snakeBestTime") ? parseInt(localStorage.getItem("snakeBestTime")) : 0, 
                speed: 100,
                interval: null,
                timerInterval: null,
                timeElapsed: 0,
                isPlaying: false,
                obstacles: [] 
            };

           
            this.ui.highScoreValue.innerText = this.state.highScore;
            this.ui.bestTimeValue.innerText = this.#formatTime(this.state.bestTime);

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
            this.ui.timeValue.innerText = "00:00";
        });

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

    #formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    #updateTimer() {
        this.state.timeElapsed++;
        this.ui.timeValue.innerText = this.#formatTime(this.state.timeElapsed);
    }

    #clearCanvas() {
        this.ctx.fillStyle = "#a2d149";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #generateObstacles(count) {
        this.state.obstacles = [];
        const snakeSegments = this.snake.getSegments();
        
        for (let i = 0; i < count; i++) {
            let newX, newY;
            let isSafe = false;

            while (!isSafe) {
                newX = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
                newY = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
                isSafe = true;

                for (let segment of snakeSegments) {
                    if (segment.x === newX && segment.y === newY) { isSafe = false; break; }
                }
                if (isSafe && this.food.x === newX && this.food.y === newY) isSafe = false;
                if (isSafe) {
                    for (let obs of this.state.obstacles) {
                        if (obs.x === newX && obs.y === newY) { isSafe = false; break; }
                    }
                }
            }
            this.state.obstacles.push(new Obstacle(newX, newY));
        }
    }

    startGame() {
        try {
            this.ui.startScreen.style.display = "none";
            this.ui.gameOverScreen.style.display = "none";
            this.state.isPlaying = true;
            this.state.score = 0;
            this.state.timeElapsed = 0;
            this.ui.scoreValue.innerText = "0";
            this.ui.timeValue.innerText = "00:00";
            
            this.snake.reset(200, 200);
            this.#generateObstacles(5);
            this.food.relocate(this.canvas.width, this.canvas.height, this.gridSize, this.snake.getSegments());
            
            if (this.state.interval) clearInterval(this.state.interval);
            this.state.interval = setInterval(() => this.gameLoop(), this.state.speed);

            if (this.state.timerInterval) clearInterval(this.state.timerInterval);
            this.state.timerInterval = setInterval(() => this.#updateTimer(), 1000);
        } catch(e) {
            console.error("Oyun başlatılamadı:", e);
        }
    }

    gameOver() {
        this.state.isPlaying = false;
        clearInterval(this.state.interval);
        clearInterval(this.state.timerInterval); 
        
        let newRecordMsg = "";
        
        
        let scoreBroken = false;
        let timeBroken = false;

        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            localStorage.setItem("snakeHighScore", this.state.highScore);
            this.ui.highScoreValue.innerText = this.state.highScore;
            scoreBroken = true;
        }

        if (this.state.timeElapsed > this.state.bestTime) {
            this.state.bestTime = this.state.timeElapsed;
            localStorage.setItem("snakeBestTime", this.state.bestTime);
            this.ui.bestTimeValue.innerText = this.#formatTime(this.state.bestTime);
            timeBroken = true;
        }

        
        if (scoreBroken && timeBroken) {
            newRecordMsg = `<br><br><span style="color:#f1c40f; font-size:24px;">🏆 İki Rekoru da Kırdın! 🏆</span>`;
        } else if (scoreBroken) {
            newRecordMsg = `<br><br><span style="color:#f1c40f; font-size:24px;">🏆 Yeni Skor Rekoru! 🏆</span>`;
        } else if (timeBroken) {
            newRecordMsg = `<br><br><span style="color:#3498db; font-size:24px;">⏱️ Yeni Süre Rekoru! ⏱️</span>`;
        }

        const survivedTime = this.#formatTime(this.state.timeElapsed);
        
        this.ui.finalScoreText.innerHTML = `
            Toplam Skor: <b style="color:#2ecc71;">${this.state.score}</b> <br> 
            Hayatta Kalınan Süre: <b>${survivedTime}</b> 
            ${newRecordMsg}
        `;
        
        this.ui.gameOverScreen.style.display = "flex";
    }

    gameLoop() {
        try {
            this.snake.move();
            const head = this.snake.getHead();

            if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height || this.snake.checkSelfCollision()) {
                this.gameOver();
                return;
            }

            for (let obs of this.state.obstacles) {
                if (head.x === obs.x && head.y === obs.y) {
                    this.gameOver();
                    return;
                }
            }

            if (head.x === this.food.x && head.y === this.food.y) {
                this.state.score += 10;
                this.ui.scoreValue.innerText = this.state.score;
                this.food.relocate(this.canvas.width, this.canvas.height, this.gridSize, this.snake.getSegments());
            } else {
                this.snake.removeTail();
            }

            this.#clearCanvas();
            this.state.obstacles.forEach(obs => obs.draw(this.ctx, this.gridSize));
            this.food.draw(this.ctx, this.gridSize);
            this.snake.draw(this.ctx, this.gridSize);

        } catch (error) {
            console.error("Döngü sırasında hata:", error);
            this.gameOver();
        }
    }
}

window.onload = () => {
    new GameManager();
};