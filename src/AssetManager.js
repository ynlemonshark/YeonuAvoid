export default class AssetManager {
    constructor() {
        this.images = {}; // 로드 완료된 이미지 객체들을 키-값 쌍으로 보관할 저장소
    }

    /**
     * 이미지 경로가 담긴 객체를 받아 모두 병렬로 로드합니다.
     * @param {Object} manifest - { 키이름: '경로' } 형태의 리스트
     * @returns {Promise} 모든 이미지 로드가 완료되면 resolve되는 프라미스
     */
    loadImages(manifest) {
        // 객체의 [키, 값] 쌍을 배열로 변환하여 반복문을 돌립니다.
        const promises = Object.entries(manifest).map(([key, src]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;

                img.onload = () => {
                    this.images[key] = img; // 로드 성공 시 저장소에 보관
                    resolve(img);           // 하나의 이미지 로드 완료 알림
                };

                img.onerror = () => {
                    console.error(`에셋 로드 실패: ${src}`);
                    reject(new Error(`Failed to load asset: ${src}`));
                };
            });
        });

        // [핵심] 등록된 모든 비동기 Promise가 전부 완료될 때까지 기다립니다.
        return Promise.all(promises);
    }

    /**
     * 로드된 이미지를 안전하게 가져오는 겟터(Getter) 함수
     */
    isImageLoaded(key) {
        return !!this.images[key]; // 해당 키에 이미지가 존재하는지 여부 반환
    }

    get(key) {
        return this.images[key] || null;
    }
}