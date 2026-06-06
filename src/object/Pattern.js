import { drawTexture } from '../utils.js';
import Bomb from './Bomb.js';
import { Warning, WarningGlittering } from './Warning.js';

export default class Pattern {
    constructor(acc, makeTime, intendedPattern = null) {
        this.acc = acc;
        this.makeTime = makeTime;
        this.span = [];
        
        if (new.target === Pattern) {
            const patterns = [Pattern1, Pattern2, Pattern3, Pattern4, Pattern5, Pattern6];
            let pattern = Math.floor(Math.random() * patterns.length);
            if (typeof intendedPattern === 'number' && !isNaN(intendedPattern)) {
                if (intendedPattern >= 0 && intendedPattern < patterns.length) {
                    pattern = intendedPattern;
                } else {
                    console.warn(`Invalid intendedPattern index: ${intendedPattern}. Using random pattern instead.`);
                }
            }
            const randomPattern = patterns[pattern];
            
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

    update(dt, bombs, player) {
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
    
    update(dt, bombs, player) {
        this.time += dt * this. acc;
        const phase = this.getPhase();
        if (phase === 2) {
            this.cooldown += dt * this.acc;
            while (this.cooldown > 0.05) {
                this.cooldown -= 0.05;
                const angle = Math.random() * 80  + 230;
                const velox = 1500 * Math.cos(angle * Math.PI / 180) * 0.2;
                const veloy = 1500 * Math.sin(angle * Math.PI / 180) * 0.2;
                bombs.push(new Bomb(1, this.sun.x, this.sun.y, velox * this.acc, veloy * this.acc, 400 * (this.acc ** 2), 15));
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

    update(dt, bombs, player) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase > this.spanfollow && phase < this.span.length) {
            this.spanfollow += 1;
            bombs.push(new Bomb(5, -60, 620, 200 * this.acc, 0, 0, 50, 0, 180));
            bombs.push(new Bomb(5, 860, 745, -200 * this.acc, 0, 0, 50, 0, -180));
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
        this.span = [0.5, 7, 2];
        this.cooldown = 0;
        this.belt = Math.random() * 600 + 100;
        this.belt_move = 0;
        this.belt_move_time = 0;
    }

    update(dt, bombs, player) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase === 1) {
            if (this.belt_move_time <= 0) {
                this.belt_move_time = Math.random() + 1;
                this.belt_move = Math.random() * 300 / this.belt_move_time;
                if (this.belt > 400) {
                    this.belt_move *= -1;
                }
                console.log(`${this.belt} : ${this.belt_move}`)
            }
            this.belt += this.belt_move * dt * this.acc;
            this.belt_move_time -= dt * this.acc;
            this.cooldown += dt * this.acc;
            while (this.cooldown >= 0.02) {
                this.cooldown -= 0.02;
                let x = Math.random() * 900;
                if (x > this.belt) {
                    x += 150;
                }
                bombs.push(new Bomb(1, x - 214, -50, 160 * this.acc, 600 * this.acc, 0, 15, 165, 0));
            }
        }
    }

    render(assetManager, ctx) {
        // 패턴3은 렌더링이 필요 없습니다.
        // Pattern3 render() method is overridden
    }
}

class Pattern4 extends Pattern {
    constructor(acc, makeTime) {
        super(acc, makeTime);
        this.span = [0.5, 3, 5];
        this.spanfollow = 0;
        this.warnings = [];
        this.x = Math.random() * 700;
    }

    update(dt, bombs, player) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase > this.spanfollow && phase < this.span.length) {
            this.spanfollow += 1;
            if (this.spanfollow === 1) {
                this.warnings.push(new WarningGlittering(0, 0, this.x, 800, 3 / this.acc, 1 / this.acc));
                this.warnings.push(new WarningGlittering(this.x+70, 0, 730, 800, 3 / this.acc, 1 / this.acc));
            }
            if (phase === 2) {
                bombs.push(new Bomb(14, this.x - 365, -365, 0, 800 * this.acc, 0, 365, 0, 180));
                bombs.push(new Bomb(14, this.x + 435, -365, 0, 800 * this.acc, 0, 365, 0, 180));
            }
        }
        this.warnings.forEach(warning => warning.update(dt * this.acc));
        this.warnings = this.warnings.filter(warning => !warning.isDead());
    }

    render(assetManager, ctx) {
        this.warnings.forEach(warning => warning.render(ctx));
    }
}

class Pattern5 extends Pattern {
    constructor(acc, makeTime) {
        super(acc, makeTime);
        this.span = [1, 2, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.2, 4];
        this.spanfollow = 1;

        this.llama = {
            x: 400,
            y: 130,
            radius: 100
        }
    }

    update(dt, bombs, player) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase > this.spanfollow && phase <= this.span.length) {
            this.spanfollow += 1;
            if (this.spanfollow < 22) {
                if (this.spanfollow % 2 === 1) {
                    const dx = player.x - this.llama.x;
                    const dy = player.y - this.llama.y;
                    bombs.push(new Bomb(6, this.llama.x, this.llama.y,
                        dx * 3 * this.acc, dy * 3 * this.acc, 0, 30, Math.atan2(dy, dx) * 180 / Math.pi));
                }
            } else if (this.spanfollow == 23) {
                bombs.push(new Bomb(17, this.llama.x, this.llama.y, 0, -800 * this.acc,
                    2000 * this.acc ** 2, this.llama.radius, 0, 180));
            }
        }
    }

    render(assetManager, ctx) {
        const phase = this.getPhase();
        if (phase === 0) {
            drawTexture(ctx, assetManager.get('llama'), assetManager.isImageLoaded('llama'),
            this.llama.x - this.llama.radius, this.llama.y - this.llama.radius,
            this.llama.radius * 2, this.llama.radius * 2, 0, this.time / this.span[0]);
        } else if (phase === 22) {
            drawTexture(ctx, assetManager.get('llama'), assetManager.isImageLoaded('llama'),
            this.llama.x - this.llama.radius, this.llama.y - this.llama.radius,
            this.llama.radius * 2, this.llama.radius * 2, 0, 1);
        }
        if (1 <= phase && phase <= 21) {
            if (phase % 2 === 1) {
                drawTexture(ctx, assetManager.get('llama'), assetManager.isImageLoaded('llama'),
                this.llama.x - this.llama.radius, this.llama.y - this.llama.radius,
                this.llama.radius * 2, this.llama.radius * 2, 0, 1);
            } else {
                drawTexture(ctx, assetManager.get('llama_spit'), assetManager.isImageLoaded('llama_spit'),
                this.llama.x - this.llama.radius, this.llama.y - this.llama.radius,
                this.llama.radius * 2, this.llama.radius * 2, 0, 1);
            }
        }

    }

}


class Pattern6 extends Pattern {
    constructor(acc, makeTime) {
        super(acc, makeTime);
        this.span = [0.2, 3, 7, 3];
        this.warn = false;
        this.warnings = [];
        this.waveterm = 0;
        this.waveinterval = 1.3;
        this.waves = [];
    }

    update(dt, bombs, player) {
        this.time += dt * this.acc;
        const phase = this.getPhase();
        if (phase === 1) {
            if (this.warn === false) {
                this.warn = true;
                this.warnings.push(new WarningGlittering(0, 670, 800, 130, 3 / this.acc, 1 / this.acc));
            }
        } else if (phase === 2) {
            this.waveterm += dt * this.acc;
            if (this.waveterm >= this.waveinterval) {
                this.waveterm -= this.waveinterval;
                this.waves.push({ going: 0, last_going: -26 });
            }
        }
        if (2 <= phase && phase <= 3) {
            for (const wave of this.waves) {
                wave.going += dt * this.acc * 300;
                if (wave.last_going < wave.going) {
                    wave.last_going += 26;
                    bombs.push(new Bomb(1, wave.last_going + 13, 814, 0,
                        -1300 * this.acc, 6500 * this.acc ** 2, 15));
                }
            }
        }

        this.warnings.forEach(warning => warning.update(dt * this.acc));
        this.warnings = this.warnings.filter(warning => !warning.isDead());
    }

    render(assetManager, ctx) {
        this.warnings.forEach(warning => warning.render(ctx));
    }
}