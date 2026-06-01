import { drawTexture } from "../utils.js";

export default class Explosion {
    constructor(x, y, radius, angle=0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this.duration = 0.5; // 폭발 효과의 지속 시간 (초)
    }
    
    update(dt) {
        this.duration -= dt;
    }

    render(ctx, ExplosionImage, isImageLoaded) {
        const alpha = Math.max(0, this.duration / 0.5); // 폭발 효과의 투명도 계산
        drawTexture(ctx, ExplosionImage, isImageLoaded,
        this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2, this.angle, alpha);
    }

    isDead() {
        return (this.duration <= 0);
    }
}