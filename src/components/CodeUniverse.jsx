import React, { useEffect } from 'react';
import Greeting from './Greeting.jsx';
import '../styles/CodeUniverse.css';

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

const CodeUniverse = ({ posts }) => {
  useEffect(() => {
    // 每日语录
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://v1.hitokoto.cn");
        const quoteElement = document.getElementById("quote-text");
        if (!quoteElement) return;

        if (response.ok) {
          const data = await response.json();
          quoteElement.textContent = data.hitokoto || "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。";
        } else {
          quoteElement.textContent = "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。";
        }
      } catch (error) {
        const quoteElement = document.getElementById("quote-text");
        if (quoteElement) {
          quoteElement.textContent = "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。";
        }
      }
    };

    fetchQuote();

    // 游戏逻辑（配色调整为蓝紫青系）
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const scoreList = document.getElementById('score-history');

    const addHistory = (score) => {
      if (!scoreList) return;
      const item = document.createElement('li');
      const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
      item.textContent = `${time}  —  ${score}`;
      scoreList.insertBefore(item, scoreList.firstChild);
      // 只保留最近 10 条
      while (scoreList.children.length > 10) {
        scoreList.removeChild(scoreList.lastChild);
      }
    };

    class Game {
        constructor(onGameOver) {
          this.canvas = canvas;
          this.ctx = ctx;
          this.onGameOver = onGameOver;
          this.init();
        }

        init(isRestart = false) {
          this.birdY = 150;
          this.birdVelocity = 0;
          this.gravity = 0.5;
          this.pipes = [];
          this.frame = 0;
          this.score = 0;
          this.gameOver = false;
          this.gameStarted = false;
          this.recorded = false;
          
          if (!isRestart) {
            document.addEventListener("keydown", this.handleInput);
            this.gameLoop();
          }
          
          this.updateStatus("Ready - Press SPACE to start");
        }

        restart = () => {
          this.init(true);
        }

        updateStatus(text) {
          const statusElement = document.querySelector(".status-text");
          if (statusElement) {
            statusElement.textContent = `Status: ${text}`;
          }
        }

        handleInput = (e) => {
          if (e.code === "Space") {
            e.preventDefault();
            if (this.gameOver) {
              this.restart();
              return;
            }
            if (!this.gameStarted) {
              this.gameStarted = true;
              this.updateStatus("Playing - Use SPACE to fly");
            }
            this.birdVelocity = -8;
          }
        }

        update() {
          if (!this.gameStarted || this.gameOver) return;

          this.birdVelocity += this.gravity;
          this.birdY += this.birdVelocity;

          if (this.frame % 90 === 0) {
            const gap = 150;
            const top = Math.random() * (this.canvas.height - gap - 120) + 60;
            this.pipes.push({ x: this.canvas.width, top, passed: false });
          }

          this.pipes = this.pipes.filter((pipe) => {
            pipe.x -= 2.5;
            
            if (!pipe.passed && pipe.x + 60 < 100) {
              pipe.passed = true;
              this.score++;
              this.updateStatus(`Playing - Score: ${this.score}`);
            }
            
            return pipe.x + 60 > 0;
          });

          const gap = 150;
          this.pipes.forEach((pipe) => {
            if (
              100 < pipe.x + 60 &&
              100 + 40 > pipe.x &&
              (this.birdY < pipe.top || this.birdY + 30 > pipe.top + gap)
            ) {
              this.gameOver = true;
              this.updateStatus(`Game Over - Score: ${this.score} - Press SPACE to restart`);
              if (!this.recorded) { this.onGameOver && this.onGameOver(this.score); this.recorded = true; }
            }
          });

          if (this.birdY > this.canvas.height - 30 || this.birdY < 0) {
            this.gameOver = true;
            this.updateStatus(`Game Over - Score: ${this.score} - Press SPACE to restart`);
            if (!this.recorded) { this.onGameOver && this.onGameOver(this.score); this.recorded = true; }
          }

          this.frame++;
        }

        draw() {
          // 背景
          this.ctx.fillStyle = "#0b1021";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          
          // 细网格
          this.ctx.strokeStyle = "rgba(124, 240, 255, 0.08)";
          this.ctx.lineWidth = 0.5;
          for (let i = 0; i < this.canvas.width; i += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
          }
          for (let i = 0; i < this.canvas.height; i += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
          }

          // 玩家
          this.ctx.shadowColor = "#7cf0ff";
          this.ctx.shadowBlur = 10;
          this.ctx.fillStyle = "#7cf0ff";
          this.ctx.fillRect(100, this.birdY, 40, 30);
          this.ctx.shadowBlur = 0;

          // 障碍
          this.ctx.fillStyle = "#7c6cff";
          this.ctx.shadowColor = "#7c6cff";
          this.ctx.shadowBlur = 5;
          this.pipes.forEach((pipe) => {
            const gap = 150;
            this.ctx.fillRect(pipe.x, 0, 60, pipe.top);
            this.ctx.fillRect(
              pipe.x,
              pipe.top + gap,
              60,
              this.canvas.height - pipe.top - gap
            );
          });
          this.ctx.shadowBlur = 0;

          this.ctx.fillStyle = "#8ab4ff";
          this.ctx.font = "20px 'Courier New'";
          this.ctx.textAlign = "left";
          this.ctx.fillText(`Score: ${this.score}`, 10, 30);
          
          if (this.gameOver) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#ff8fa3";
            this.ctx.font = "32px 'Courier New'";
            this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.fillStyle = "#7cf0ff";
            this.ctx.font = "16px 'Courier New'";
            this.ctx.fillText("Press SPACE to restart", this.canvas.width / 2, this.canvas.height / 2 + 20);
          } else if (!this.gameStarted) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#7cf0ff";
            this.ctx.font = "24px 'Courier New'";
            this.ctx.fillText("Press SPACE to start", this.canvas.width / 2, this.canvas.height / 2);
          }
        }

        gameLoop = () => {
          this.update();
          this.draw();
          this.animationFrameId = requestAnimationFrame(this.gameLoop);
        }
      }
      
      const game = new Game(addHistory);
      
      const gamePanel = document.querySelector('.game-card .card-content') || canvas.parentElement;
      const setCanvasSize = () => {
        const panelWidth = gamePanel ? gamePanel.clientWidth : 800;
        const canvasWidth = Math.min(900, panelWidth - 32);
        canvas.width = canvasWidth;
        canvas.height = Math.max(320, Math.round((canvasWidth / 16) * 9));
      };
      setCanvasSize();
      window.addEventListener('resize', setCanvasSize);

    return () => {
      document.removeEventListener('keydown', game.handleInput);
      cancelAnimationFrame(game.animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="code-universe">
      <div className="bg-orbs" aria-hidden="true"></div>

      <header className="hero">
        <h1 className="hero-title">CodeUniverse</h1>
        <p className="hero-subtitle">探索前沿技术 · 分享开发洞见</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/blog/">阅读博客</a>
          <a className="btn btn-secondary" href="#play">开始小游戏</a>
        </div>
      </header>

      <div className="universe-grid">
        <section id="play" className="card game-card">
          <div className="card-header">
            <span className="card-title">Mini Game</span>
          </div>
          <div className="card-content">
            <div className="game-layout">
              <div className="game-canvas-wrap">
                <canvas id="game-canvas"></canvas>
                <div className="game-status">
                  <span className="status-text">Status: Ready</span>
                </div>
              </div>
              <aside className="game-history">
                <div className="history-title">游戏记录</div>
                <ul id="score-history" className="history-list"></ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="card posts-card">
          <div className="card-header">
            <span className="card-title">最新文章</span>
          </div>
          <div className="card-content">
            <div className="posts-list">
              {posts && posts.slice(0, 3).map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}/`} className="post-card">
                  <div className="post-title">{post.data.title}</div>
                  <div className="post-date">{formatDate(post.data.pubDate)}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="card about-card">
          <div className="card-header">
            <span className="card-title">关于</span>
          </div>
          <div className="card-content">
            <div className="about-lines">
              <div>探索技术世界 · 构建优雅产品</div>
              <div>分享前沿技术与开发心得</div>
              <div className="greeting"><Greeting messages={["你好", "欢迎", "很高兴见到你", "欢迎回来"]} /></div>
              <div className="quote-label">每日语录</div>
              <div className="quote-text" id="quote-text">正在加载每日语录...</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CodeUniverse; 