import Scene from './Scene.js';
import { drawTexture } from '../utils.js';
import Pattern from '../object/Pattern.js';

export default class GameScene extends Scene {
    constructor(SceneManager, makeTime) {
        super(SceneManager, makeTime);
        this.player = { x: 400, y: 0, size: 20 }; // 플레이어의 초기 위치와 크기
        this.player.y = 800 - this.player.size; // 플레이어를 화면 아래에 위치시키기
        this.player_grav = 4000;
        this.player_speed = 400;
        this.player_jump_speed = 1200;
        this.jump_time = 0;
        this.energy_speed = 200;
        this.energy_time = 0;
        this.energized = false;

        this.bombs = [];

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
    }

    handleInput(e) {
        if (e.type === 'keydown') {
            this.holding[e.key] = true;
            
            if (this.jump_time === 0 && (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ')) {
                this.jump_time = performance.now();
                this.energized = true;
                this.energy_time = 0;
            }
        } else if (e.type === 'keyup') {
            this.holding[e.key] = false;
        }
    }
    
    update(dt) {
        this.playTime += dt;
        if (this.playTime > 0) {
            // player movement
            if (this.holding['ArrowLeft'] || this.holding['a']) {
                this.player.x -= this.player_speed * dt;
            }
            if (this.holding['ArrowRight'] || this.holding['d']) {
                this.player.x += this.player_speed * dt;
            }
            this.player.x = Math.max(this.player.size, Math.min(800 - this.player.size, this.player.x));
            
            // player jump
            const jump_duration = (performance.now() - this.jump_time) / 1000;
            if (this.jump_time) {
                if (this.energized) {
                    if (this.holding['ArrowUp'] || this.holding['w'] || this.holding[' ']) {
                        this.energy_time += dt;
                    } else {
                        this.energized = false;
                    }
                }
                this.player.y = 800 - this.player.size
                                + 0.5 * this.player_grav * jump_duration ** 2
                                - this.player_jump_speed * jump_duration;
                if (this.player.y >= 800 - this.player.size) {
                    this.player.y = 800 - this.player.size;
                    this.jump_time = 0;
                }
            }

            // push new pattern
            if (this.patterns.length === 0) {
                this.patterns.push(new Pattern(1, performance.now()));
            }

            // update patterns
            for (const pattern of this.patterns) {
                pattern.update(dt, this.bombs);
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

        for (const pattern of this.patterns) {
            pattern.render(this.sceneManager.assetManager, ctx);
        }
    }
}