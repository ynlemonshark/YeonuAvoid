export class Warning {
    constructor(x, y, w, h, duration) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.duration = duration;
    }

    update(dt) {
        this.duration -= dt;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.max(0, this.duration)})`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
    
    isDead () {
        return (this.duration <= 0);
    }
}

export class WarningGlittering {
    constructor(x, y, w, h, duration, span) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.duration = duration;
        this.span = span;
        this.time = 0;
    }
    
    update(dt) {
        this.time += dt;
        this.duration -= dt;
        if (this.time > this.span) {
            this.time -= this.span;
        }
    }

    render(ctx) {
        ctx.save();
        const alpha = 0.8 - 0.3 * (this.time / this.span);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }

    isDead () {
        return (this.duration <= 0);
    }
}