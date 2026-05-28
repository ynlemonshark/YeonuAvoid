import { drawTexture } from "../utils.js";

export default class Bomb {
    /**
     * 폭탄 객체 클래스
     * @param {number} x 폭탄의 초기 x 좌표
     * @param {number} y 폭탄의 초기 y 좌표
     * @param {number} velox 폭탄의 초기 x 방향 속도
     * @param {number} veloy 폭탄의 초기 y 방향 속도
     * @param {number} grav 폭탄의 중력 가속도
     * @param {number} size 폭탄의 반지름
     * @param {number} birthTime 폭탄의 생성 시각
     * @param {number} startAngle 폭탄의 초기 회전 각도 (도 단위)
     * @param {number} angleSpeed 폭탄의 회전 속도 (도/초 단위)
    */
    constructor(x, y, velox, veloy, grav, size, startAngle=0, angleSpeed=0) {
        this.x = x;
        this.y = y;
        this.velox = velox;
        this.veloy = veloy;
        this.grav = grav;
        this.size = size;
        this.startAngle = startAngle;
        this.angleSpeed = angleSpeed;
        this.birthTime = performance.now();

        this.time = 0;

        this.posx = x;
        this.posy = y;

        this.angle = startAngle;
    }

    update(dt) {
        this.time += dt;
        this.posx = this.x + this.velox * this.time;
        this.posy = this.y + this.veloy * this.time + 0.5 * this.grav * this.time ** 2;

        this.angle = this.startAngle + this.angleSpeed * this.time;
    }
 
    render(ctx, bombImage, isImageLoaded) {
        drawTexture(ctx, bombImage, isImageLoaded,
                    this.posx - this.size, this.posy - this.size, this.size * 2, this.size * 2, this.angle);
    }

    isDead() {
        // 폭탄이 화면 아래로 떨어지면 제거
        if (this.posy > 800 + this.size) {
            return true;
        }

        if (this.velox < 0 && this.posx < -this.size) {
            return true;
        }
        if (this.velox > 0 && this.posx > 800 + this.size) {
            return true;
        }
        return false;
    }
}