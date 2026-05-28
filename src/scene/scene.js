export default class Scene {
    constructor(SceneManager, makeTime = 0) {
        if (this.constructor === Scene) {
            throw new Error("Abstract class 'Scene' cannot be instantiated directly.");
        }
        this.sceneManager = SceneManager;
        this.makeTime = makeTime;
    }

    handleInput(e, type) {
        throw new Error("Method 'handleInput()' must be implemented.");
    }

    update(dt) {
        throw new Error("Method 'update()' must be implemented.");
    }

    render(ctx) {
        throw new Error("Method 'render()' must be implemented.");
    }
}