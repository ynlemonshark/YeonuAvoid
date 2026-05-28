import AssetManager from './AssetManager.js';
import SoundManager from './SoundManager.js';
import TitleScene from './scene/TitleScene.js';
import GameScene from './scene/GameScene.js';

const soundManager = new SoundManager();
// soundManager.load('explosion', 'assets/explosion.mp3', 100); // 1초 쿨타임

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// --- 게임 상태(State) 관리 객체 ---
// const sysState = {
//     ingame: false,
//     holding_a: false,
//     holding_d: false,
//     holding_left: false,
//     holding_right: false,
// };

// const gameState = {
//     playerX: 400,
//     playerY: 400,
//     timeliving: 0,
//     playergrav: 0,
//     playerveloy: 0,

//     bombs: [],
//     patterns: []
// }

const imageFiles = {
    'player': 'assets/player.png',
    'bomb': 'assets/bomb.png',
    'sun': 'assets/sun.png'
};

const SceneManager = {
    currentScene: null,
    assetManager: new AssetManager(),

    changeScene(sceneName, now = performance.now()) {
        if (sceneName === 'title') {
            this.currentScene = new TitleScene(this, now);
        }
        if (sceneName === 'game') {
            this.currentScene = new GameScene(this, now);
        }
    }
};

SceneManager.assetManager.loadImages(imageFiles).then(() => {
    console.log('모든 이미지 로드 완료!');
}).catch((err) => {
    console.error('이미지 로드 중 오류 발생:', err);
});

SceneManager.changeScene('title', performance.now());

// --- 이벤트 리스너 세팅 ---
window.addEventListener('keydown', (e) => {
    if (SceneManager.currentScene) {
        SceneManager.currentScene.handleInput(e, 'keydown');
    }
    if (e.code === 'KeyF') {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (SceneManager.currentScene) {
        SceneManager.currentScene.handleInput(e, 'keyup');
    }
});

// --- 메인 루프 ---
let lastTime = performance.now();

function gameLoop(currentTime) {
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // --- 씬 업데이트 ---
    SceneManager.currentScene.update(dt);

    // --- 씬 렌더링 ---
    SceneManager.currentScene.render(ctx);
    
    requestAnimationFrame(gameLoop);
}

// 루프 최초 실행
requestAnimationFrame(gameLoop);