import Scene from "./scene.js";
import { drawText } from "../utils.js";

export default class TitleScene extends Scene {
    constructor(sceneManager, makeTime) {
        super(sceneManager, makeTime);
        this.deco_size = 20;
    }

    handleInput(e, type) {
        if (e.code === 'Space' && type === 'keyup') {
            this.sceneManager.changeScene('game');
        }
    }

    update(dt) {
        this.deco_size = Math.abs(Math.round((performance.now() - this.makeTime) * 0.2, 1) % 80 - 40) + 20;
    }

    render(ctx) {
        ctx.fillStyle = '#000000ff';
        ctx.fillRect(0, 0, 800, 900);
        drawText(ctx, '그것은 매우 즐거운!', 200, 380, `${this.deco_size}px Arial`, 'red', 12, 1);
        drawText(ctx, 'Yeonu Avoid', 400, 350, '48px Arial', 'white', 0, 1);
        drawText(ctx, '스페이스 바 를 눌러 시작하다', 400, 450, '24px Arial', 'white', 0, 1);
        drawText(ctx, 'Version alpha 1.1.1', 100, 870, `20px Arial`, 'white', 0, 1);
    }
}