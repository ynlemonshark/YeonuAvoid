import { drawTexture } from '../utils.js';
import Bomb from './Bomb.js';

export default class Pattern {
    constructor(acc, makeTime) {
        this.acc = acc;
        this.makeTime = makeTime;
        this.span = [];
        
        if (new.target === Pattern) {
            const patterns = [Pattern1, Pattern2, Pattern3];
            const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
            
            return new randomPattern(acc, makeTime);
        }

        this.time = 0;
    }
    
    getPhase() {
        let phase = 0;
        let time = this.time;
        while (phase < this.span.length && time > this.span[phase]) {
            time -= this.span[phase];
            phase++;
        }
        return phase;
    }

    update(dt) {
        throw new Error("Method 'update()' must be implemented.");
    }
    
    render(assets, ctx) {
        throw new Error("Method 'render()' must be implemented.");
    }

    isEnd() {
        const phase = this.getPhase();
        return phase >= this.span.length;
    }
    
}

class Pattern1 extends Pattern {
    constructor(acc, makeTime) {
        super(acc, makeTime);
        this.sun = {
            x: 400,
            y: 130,
            radius: 100,
            rotation: 720
        };
        
        this.span = [2, 1, 4, 4];
        this.cooldown = 0;
        
    }
    
    update(dt, bombs) {
        this.time += dt * this. acc;
        const phase = this.getPhase();
        if (phase === 2) {
            this.cooldown += dt * this.acc;
            while (this.cooldown > 0.05) {
                this.cooldown -= 0.05;
                const angle = Math.random() * 80  + 230;
                const velox = 1500 * Math.cos(angle * Math.PI / 180) * 0.2;
                const veloy = 1500 * Math.sin(angle * Math.PI / 180) * 0.2;
                bombs.push(new Bomb(this.sun.x, this.sun.y, velox * this.acc, veloy * this.acc, 400 * (this.acc ** 2), 15));
            }
        }
    }
    
    render(assetManager, ctx) {
        const phase = this.getPhase();
        if (phase === 0) {
            drawTexture(ctx, assetManager.get('sun'), assetManager.isImageLoaded('sun'),
            this.sun.x - this.sun.radius, this.sun.y - this.sun.radius, this.sun.radius * 2, this.sun.radius * 2, 0, this.time / this.span[0]);
        } else if (phase === 1) {
            drawTexture(ctx, assetManager.get('sun'), assetManager.isImageLoaded('sun'),
            this.sun.x - this.sun.radius, this.sun.y - this.sun.radius, this.sun.radius * 2, this.sun.radius * 2, 0, 1);
        } else if (phase === 2) {
            const intime = (this.time - this.span[0] - this.span[1]) / this.span[2];

            drawTexture(ctx, assetManager.get('sun'), assetManager.isImageLoaded('sun'),
            this.sun.x - this.sun.radius * (1 - intime), this.sun.y - this.sun.radius * (1 - intime),
            this.sun.radius * (1 - intime) * 2, this.sun.radius * (1 - intime) * 2,
            intime * this.sun.rotation, 1 - intime);
        }
    }
}


class Pattern2 extends Pattern {
    constructor(acc, makeTime) {
        super(acc, makeTime);
        this.span = [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 4];
        this.spanfollow = 0;
    }

    update(dt, bombs) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase > this.spanfollow && phase < this.span.length) {
            this.spanfollow += 1;
            bombs.push(new Bomb(-60, 620, 200 * this.acc, 0, 0, 50, 0, 180));
            bombs.push(new Bomb(860, 745, -200 * this.acc, 0, 0, 50, 0, -180));
        }
    }

    render(assetManager, ctx) {
        // 패턴2는 렌더링이 필요 없습니다.
        // Pattern2 render() method is overridden
    }
}

class Pattern3 extends Pattern {
    constructor(acc, makeTime) {
        super(acc, makeTime);
        this.span = [0.5, 8, 2];
        this.cooldown = 0;
    }

    update(dt, bombs) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase === 1) {
            this.cooldown += dt * this.acc;
            while (this.cooldown >= 0.05) {
                this.cooldown -= 0.05;
                const x = Math.random() * 1000;
                bombs.push(new Bomb(x - 214, -50, 160 * this.acc, 600 * this.acc, 0, 15, 165, 0));
            }
        }
    }

    render(assetManager, ctx) {
        // 패턴3은 렌더링이 필요 없습니다.
        // Pattern3 render() method is overridden
    }
}