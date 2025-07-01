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
    // Matrix rain effect
    function initMatrix() {
      const canvas = document.getElementById('matrix-bg');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
      const matrixArray = matrix.split("");

      const fontSize = 10;
      const columns = canvas.width / fontSize;

      const drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }

      let intervalId;
      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px arial`;

        for (let i = 0; i < drops.length; i++) {
          const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      intervalId = setInterval(draw, 35);
      
      const handleResize = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', handleResize);
      };
    }

    const cleanupMatrix = initMatrix();

    // Daily Quote Fetcher
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

    // Game Logic
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    class Game {
        constructor() {
          this.canvas = canvas;
          this.ctx = ctx;
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
            }
          });

          if (this.birdY > this.canvas.height - 30 || this.birdY < 0) {
            this.gameOver = true;
            this.updateStatus(`Game Over - Score: ${this.score} - Press SPACE to restart`);
          }

          this.frame++;
        }

        draw() {
          this.ctx.fillStyle = "#000";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          
          this.ctx.strokeStyle = "#003300";
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

          this.ctx.shadowColor = "#00ff00";
          this.ctx.shadowBlur = 10;
          this.ctx.fillStyle = "#00ff00";
          this.ctx.fillRect(100, this.birdY, 40, 30);
          this.ctx.shadowBlur = 0;

          this.ctx.fillStyle = "#ff6b6b";
          this.ctx.shadowColor = "#ff6b6b";
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

          this.ctx.fillStyle = "#00ff00";
          this.ctx.font = "20px 'Courier New'";
          this.ctx.textAlign = "left";
          this.ctx.fillText(`Score: ${this.score}`, 10, 30);
          
          if (this.gameOver) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#ff6b6b";
            this.ctx.font = "32px 'Courier New'";
            this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.fillStyle = "#4ecdc4";
            this.ctx.font = "16px 'Courier New'";
            this.ctx.fillText("Press SPACE to restart", this.canvas.width / 2, this.canvas.height / 2 + 20);
          } else if (!this.gameStarted) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#4ecdc4";
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
      
      const game = new Game();
      
      const gamePanel = document.querySelector('.game-terminal .terminal-content');
      if (gamePanel) {
        const canvasWidth = Math.min(800, gamePanel.clientWidth - 32);
        canvas.width = canvasWidth;
        canvas.height = Math.max(300, (canvasWidth / 16) * 9);
      }

    return () => {
      cleanupMatrix && cleanupMatrix();
      document.removeEventListener('keydown', game.handleInput);
      cancelAnimationFrame(game.animationFrameId);
    };
  }, []);

  return (
    <div className="code-universe">
      <canvas id="matrix-bg" className="matrix-background"></canvas>
      
      <header className="universe-header">
        <h1 className="hacker-title">
          <span className="bracket">&lt;</span>
          <span className="code-text">Code</span>
          <span className="universe-text">Universe</span>
          <span className="bracket">/&gt;</span>
        </h1>
        <div className="subtitle-container">
          <span className="terminal-prompt">root@universe:~$</span>
          <span className="typing-text">探索前沿技术 | 分享开发心得</span>
        </div>
      </header>

      <div className="universe-grid">
        <section className="terminal-section game-terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="btn-close"></span>
              <span className="btn-minimize"></span>
              <span className="btn-maximize"></span>
            </div>
            <span className="terminal-title">game.exe</span>
          </div>
          <div className="terminal-content">
            <canvas id="game-canvas"></canvas>
            <div className="game-status">
              <span className="status-text">Status: Ready</span>
            </div>
          </div>
        </section>

        <section className="terminal-section posts-terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="btn-close"></span>
              <span className="btn-minimize"></span>
              <span className="btn-maximize"></span>
            </div>
            <span className="terminal-title">latest_posts.json</span>
          </div>
          <div className="terminal-content">
            <div className="json-structure">
              <div className="json-line">
                <span className="json-bracket">{'{'}</span>
              </div>
              <div className="json-line indent">
                <span className="json-key">"posts"</span><span className="json-colon">:</span> <span className="json-bracket">{'['}</span>
              </div>
              {posts && posts.slice(0, 3).map((post, index) => (
                <div className="json-line indent-2" key={post.slug}>
                  <span className="json-bracket">{'{'}</span>
                  <div className="post-content">
                    <a href={`/blog/${post.slug}/`} className="post-link">
                      <div className="json-line indent-3">
                        <span className="json-key">"title"</span><span className="json-colon">:</span> 
                        <span className="json-string">{`"${post.data.title}"`}</span><span className="json-comma">,</span>
                      </div>
                      <div className="json-line indent-3">
                        <span className="json-key">"date"</span><span className="json-colon">:</span> 
                        <span className="json-string">{`"${formatDate(post.data.pubDate)}"`}</span>
                      </div>
                    </a>
                  </div>
                  <div className="json-line indent-2">
                    <span className="json-bracket">{'}'}</span>{index < 2 ? <span className="json-comma">,</span> : ''}
                  </div>
                </div>
              ))}
              <div className="json-line indent">
                <span className="json-bracket">{']'}</span>
              </div>
              <div className="json-line">
                <span className="json-bracket">{'}'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="terminal-section intro-terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="btn-close"></span>
              <span className="btn-minimize"></span>
              <span className="btn-maximize"></span>
            </div>
            <span className="terminal-title">about.sh</span>
          </div>
          <div className="terminal-content">
            <div className="console-output">
              <div className="console-line">
                <span className="prompt">$</span> <span className="command">./about.sh</span>
              </div>
              <div className="console-line output">
                探索技术世界
              </div>
              <div className="console-line output">
                分享前沿技术与开发心得
              </div>
              <div className="console-line">
                <Greeting messages={["你好", "欢迎", "很高兴见到你", "欢迎回来"]} />
              </div>
              <div className="console-line">
                <span className="prompt">$</span> <span className="command">python daily_quote.py</span>
              </div>
              <div className="console-line output">
                <span className="comment"># 每日语录</span>
              </div>
              <div className="console-line output">
                <span className="string" id="quote-text">正在加载每日语录...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CodeUniverse; 