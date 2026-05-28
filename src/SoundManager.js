export default class SoundManager {
    constructor() {
        this.sounds = {};
        this.cooldowns = {};
        this.lastPlayed = {};
    }

    load(name, src, cooldown = 0){
        const audio = new Audio(src);
        audio.preload = 'auto';
        this.sounds[name] = audio;
        this.cooldowns[name] = cooldown;
        this.lastPlayed[name] = 0;
    }

    play(name, volume = 1.0) {
        const original = this.sounds[name];
        if (!original) return;

        const now = Date.now();
        if (now - this.lastPlayed[name] < this.cooldowns[name]) {
            return;
        }
        this.lastPlayed[name] = now;

        const clone = original.cloneNode();

        clone.volume = volume;
        clone.play().catch(err => {
            console.warn(`사운드 재생 실패: ${name}`, err);
        });
    }
}