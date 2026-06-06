import Scene from './scene.js';
import { drawTexture, drawRect, drawText, downloadCanvasBlob } from '../utils.js';
import Explosion from '../object/Explosion.js';
import Pattern from '../object/Pattern.js';

export default class GameScene extends Scene {
    constructor(SceneManager, makeTime) {
        super(SceneManager, makeTime);
        this.player = { x: 400, y: 0, size: 20 }; // 플레이어의 초기 위치와 크기
        this.player.y = 800 - this.player.size; // 플레이어를 화면 아래에 위치시키기
        this.hp = 20;
        this.maxhp = 20;
        this.player_grav = 4000;
        this.player_speed = 400;
        this.player_jump_speed = 1200;
        this.jumping = 0;
        this.jump_time = 0;

        this.score = 0;
        this.acc = 1;

        this.healing = 0;
        this.heal_time = 7;

        this.bombs = [];
        this.explosions = [];

        this.patterns = [];
        this.patterns.push(new Pattern(1, performance.now()));

        this.holding = {
            'ArrowLeft': false,
            'ArrowRight': false,
            'a': false,
            'd': false,
            ' ': false,
            'ArrowUp': false,
            'w': false
        }

        this.playTime = -3;

        this.click_replay = false; 
        this.replay_button = {
            x: 278,
            y: 550,
            w: 265,
            h: 75
        }
        this.download_button = {
            x: 379,
            y: 650,
            w: 42,
            h: 42
        }
    }

    handleInput(e, type) {
        const canvas_rect = this.sceneManager.canvas.getBoundingClientRect();
        if (type === 'keydown') {
            this.holding[e.key] = true;
            
            if (this.playTime > 0 && !this.jumping && (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ')) {
                this.jump_time = 0;
                this.jumping = true;
            }
        } else if (type === 'keyup') {
            this.holding[e.key] = false;
        } else if (type === 'mousedown') {
            const posx = (e.x - canvas_rect.x) * (this.sceneManager.canvas.width / canvas_rect.width);
            const posy = (e.y - canvas_rect.y) * (this.sceneManager.canvas.height / canvas_rect.height);
            if (this.hp <= 0) {
                // check replay button
                if (this.replay_button.x < posx &&
                    posx - canvas_rect.x < this.replay_button.x + this.replay_button.w &&
                    this.replay_button.y < posy &&
                    posy < this.replay_button.y + this.replay_button.h
                ) {
                    this.click_replay = true;
                }
                // check download button
                if (this.download_button.x < posx &&
                    posx - canvas_rect.x < this.download_button.x + this.download_button.w &&
                    this.download_button.y < posy &&
                    posy < this.download_button.y + this.download_button.h
                ) {
                    if (confirm('게임 기록을 이미지로 다운로드하시겠습니까?\n(이미지 800x900)')) {
                        downloadCanvasBlob(this.sceneManager.canvas, `YeonuAvoid_score_${this.score}.png`);
                    }
                }
            }
        } else if (type === 'mouseup') {
            const posx = (e.x - canvas_rect.x) * (this.sceneManager.canvas.width / canvas_rect.width);
            const posy = (e.y - canvas_rect.y) * (this.sceneManager.canvas.height / canvas_rect.height);
            if (this.hp <= 0) {
                if (this.replay_button.x < posx &&
                    posx < this.replay_button.x + this.replay_button.w &&
                    this.replay_button.y < posy &&
                    posy < this.replay_button.y + this.replay_button.h
                ) {
                    if (this.click_replay) {
                        this.sceneManager.changeScene('game');
                    }
                }
                this.click_replay = false;
            }
        }
    }
    
    update(dt) {
        this.playTime += dt;
        if (this.playTime > 0) {
            if (this.hp > 0) {
                this.score = Math.max(Math.floor(this.playTime * 10), 0);
                this.acc = 1 + Math.floor(this.score / 100) / 10;

                if (this.hp < this.maxhp) {
                    this.healing += dt;
                    if (this.healing > this.heal_time) {
                        this.healing = 0;
                        this.hp = this.maxhp;
                    }
                }

                // player movement
                if (this.holding['ArrowLeft'] || this.holding['a']) {
                    this.player.x -= this.player_speed * dt * this.acc;
                }
                if (this.holding['ArrowRight'] || this.holding['d']) {
                    this.player.x += this.player_speed * dt * this.acc;
                }
                this.player.x = Math.max(this.player.size, Math.min(800 - this.player.size, this.player.x));
                
                // player jump
                if (this.jumping) {
                    this.jump_time += dt * this.acc;
                    this.player.y = 800 - this.player.size
                                    + 0.5 * this.player_grav * this.jump_time ** 2
                                    - this.player_jump_speed * this.jump_time;
                    if (this.player.y >= 800 - this.player.size) {
                        this.player.y = 800 - this.player.size;
                        this.jumping = false;
                    }
                }

                // push new pattern
                if (this.patterns.length === 0) {
                    this.patterns.push(new Pattern(this.acc, performance.now()));
                }

                // update patterns
                for (const pattern of this.patterns) {
                    pattern.update(dt, this.bombs, this.player);
                }

                for (let i = this.patterns.length - 1; i >= 0; i--) {
                    if (this.patterns[i].isEnd()) {
                        this.patterns.splice(i, 1);
                    }
                }

                // update bombs
                this.bombs.forEach(bomb => bomb.update(dt));
                for (let i = this.bombs.length - 1; i >= 0; i--) { 
                    if (this.bombs[i].isDead()) {
                        this.bombs.splice(i, 1);
                    }
                }

                // check collisions
                for (let i = this.bombs.length - 1; i >= 0; i--) {
                    if (this.bombs[i].isColliding(this.player)) {
                        this.hp -= this.bombs[i].damage;
                        this.healing = 0;
                        this.explosions.push(new Explosion(this.bombs[i].posx, this.bombs[i].posy, this.bombs[i].size, this.bombs[i].angle));
                        this.bombs.splice(i, 1);
                    }
                }
                if (this.hp < 0) {
                    this.hp = 0;
                }

                // update explosions
                this.explosions.forEach(explosion => explosion.update(dt));
                for (let i = this.explosions.length - 1; i >= 0; i--) {
                    if (this.explosions[i].isDead()) {
                        this.explosions.splice(i, 1);
                    }
                }
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = '#000000ff';
        ctx.fillRect(0, 0, 800, 800);
        ctx.fillStyle = 'white';
        const playerImage = this.sceneManager.assetManager.get('player');
        if (this.sceneManager.assetManager.isImageLoaded('player')) {
            drawTexture(ctx, playerImage, true,
                this.player.x - this.player.size,
                this.player.y - this.player.size,
                this.player.size * 2,
                this.player.size * 2, 0, 1);
        }

        this.bombs.forEach(bomb => bomb.render(ctx, this.sceneManager.assetManager.get('bomb'),
        this.sceneManager.assetManager.isImageLoaded('bomb')));

        this.explosions.forEach(explosion => explosion.render(ctx, this.sceneManager.assetManager.get('explosion'),
        this.sceneManager.assetManager.isImageLoaded('explosion')));

        for (const pattern of this.patterns) {
            pattern.render(this.sceneManager.assetManager, ctx);
        }

        // status bar rendering
        ctx.fillStyle = '#000000ff';
        ctx.imageSmoothingEnabled = false;
        ctx.fillRect(0, 800, 800, 100);
        ctx.fillStyle = 'white';
        drawTexture(ctx, this.sceneManager.assetManager.get('hp'), this.sceneManager.assetManager.isImageLoaded('hp'),
        40, 810, 90, 45, 0, 1);
        drawRect(ctx, 140, 810, 260 * (this.hp / this.maxhp), 45, '#ff0000')
        drawTexture(ctx, this.sceneManager.assetManager.get('score'),
        this.sceneManager.assetManager.isImageLoaded('score'),
        405, 810, 200, 45, 0, 1);
        drawText(ctx, `${this.score}`, 700, 830, "32px Arial", "#00aaff");
        if (this.healing > 0) {
            drawRect(ctx, 40, 857, 720 * (this.healing / this.heal_time), 41, '#00dd00')
            drawTexture(ctx, this.sceneManager.assetManager.get('healing'),
            this.sceneManager.assetManager.isImageLoaded('healing'),
            310, 860, 190, 33);
        }
        if (this.hp === 0) {
            drawTexture(ctx, this.sceneManager.assetManager.get('gameover'),
            this.sceneManager.assetManager.isImageLoaded('gameover'),
            80, 355, 640, 90);
            drawText(ctx, `당신의 점수는 이다 ${this.score} !`, 400, 500, "32px Arial", "#ff00ff");
            if (!this.click_replay) {
                drawTexture(ctx, this.sceneManager.assetManager.get('replay_off'),
                    this.sceneManager.assetManager.isImageLoaded('replay_off'),
                    this.replay_button.x, this.replay_button.y, this.replay_button.w, this.replay_button.h);
            } else {
                drawTexture(ctx, this.sceneManager.assetManager.get('replay_on'),
                    this.sceneManager.assetManager.isImageLoaded('replay_on'),
                    this.replay_button.x, this.replay_button.y, this.replay_button.w, this.replay_button.h);
            }
            drawTexture(ctx, this.sceneManager.assetManager.get('download'),
            this.sceneManager.assetManager.isImageLoaded('download'),
            this.download_button.x, this.download_button.y, this.download_button.w, this.download_button.h);
        }
        if (this.playTime < 0) {
            const i = Math.floor(Math.abs(this.playTime)) + 1;
            drawTexture(ctx, this.sceneManager.assetManager.get(`${i}`),
            this.sceneManager.assetManager.isImageLoaded(`${i}`), 355, 355, 90, 90);
        }
        ctx.imageSmoothingEnabled = true;
    }
}