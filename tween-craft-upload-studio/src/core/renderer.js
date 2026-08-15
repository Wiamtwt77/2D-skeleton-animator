
import { computeTransforms } from './kinematics.js';

export function drawCharacter(ctx, bones, images, alpha = 1.0, selectedBone = null) {
    ctx.save();
    ctx.globalAlpha = alpha;
    computeTransforms(bones);

    bones.forEach(b => {
        ctx.save();
        ctx.translate(b._absX, b._absY);
        ctx.rotate(b._absAngle);

        let img = images[b.id];
        if (img) {
            // رسم الصورة الشفافة المرفوعة للمستخدم بدقة
            if (b.id === 'hips') ctx.drawImage(img, -30, -18, 60, 35);
            else if (b.id === 'torso') ctx.drawImage(img, -32, -b.length, 64, b.length + 10);
            else if (b.id === 'head') ctx.drawImage(img, -30, -40, 60, 60);
            else if (b.id === 'face') ctx.drawImage(img, -25, -35, 50, 50);
            else if (b.id.startsWith('arm')) ctx.drawImage(img, 0, -12, b.length, 24);
            else if (b.id.startsWith('thigh') || b.id.startsWith('leg')) ctx.drawImage(img, -12, 0, 26, b.length);
        } else {
            // رسم هندسي بديل في حال لم يتم رفع صورة للجزء بعد
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(b.length, 0); ctx.stroke();
        }

        ctx.restore();

        // نقاط المفصل
        ctx.fillStyle = (selectedBone === b) ? '#ef4444' : '#38bdf8';
        ctx.beginPath(); ctx.arc(b._absX, b._absY, 5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
}
