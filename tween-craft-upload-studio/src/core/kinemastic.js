
export function computeTransforms(bones) {
    let map = {};
    bones.forEach(b => {
        let absX = 0, absY = 0, absAngle = 0;
        if (!b.parent) {
            absX = b.x;
            absY = b.y;
            absAngle = b.angle;
        } else {
            let p = map[b.parent];
            let cos = Math.cos(p.absAngle);
            let sin = Math.sin(p.absAngle);
            absX = p.absX + (cos * b.offsetX - sin * b.offsetY);
            absY = p.absY + (sin * b.offsetX + cos * b.offsetY);
            absAngle = p.absAngle + b.angle;
        }
        map[b.id] = { absX, absY, absAngle };
        b._absX = absX;
        b._absY = absY;
        b._absAngle = absAngle;
    });
}
