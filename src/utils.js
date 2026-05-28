/**
 * 텍스처(이미지)를 지정된 위치, 크기, 회전 각도, 투명도로 캔버스에 그립니다.
 * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
 * @param {HTMLImageElement} img - 렌더링할 이미지 객체
 * @param {boolean} isImageLoaded - 이미지 로드 여부
 * @param {number} x - X 좌표
 * @param {number} y - Y 좌표
 * @param {number} w - 너비
 * @param {number} h - 높이
 * @param {number} angleDegrees - 회전 각도 (도 단위)
 * @param {number} alpha - 투명도 (0.0 ~ 1.0)
 */
export function drawTexture(ctx, img, isImageLoaded, x, y, w, h, angleDegrees = 0, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // 중심점 이동 후 회전
    ctx.translate(x + w / 2, y + h / 2);
    if (angleDegrees !== 0) {
        ctx.rotate((angleDegrees * Math.PI) / 180);
    }
    
    if (isImageLoaded) {
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
    } else {
        // 이미지가 없을 때의 Fallback 렌더링 (디버그용 십자선)
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.beginPath();
        ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0);
        ctx.moveTo(0, -h / 2); ctx.lineTo(0, h / 2);
        ctx.stroke();
    }
    ctx.restore();
}

export function drawDebugRect(ctx, x, y, w, h, color = 'cyan', alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
}

export function drawText(ctx, text, x, y, font = '16px Arial', color = 'white', angle = 0, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (angle !== 0) {
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
    } else {
        ctx.fillText(text, x, y);
    }
    ctx.restore();
}