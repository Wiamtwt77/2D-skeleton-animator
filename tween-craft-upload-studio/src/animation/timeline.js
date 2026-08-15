
export class TimelineEngine {
    constructor() {
        this.keyframes = [];
        this.currentFrameIdx = 0;
        this.isPlaying = false;
        this.animProgress = 0;
    }

    saveKeyframe(bones) {
        let pose = bones.map(b => ({ x: b.x, y: b.y, angle: b.angle }));
        this.keyframes.push(pose);
        return this.keyframes.length;
    }

    clear() {
        this.keyframes = [];
        this.currentFrameIdx = 0;
        this.isPlaying = false;
    }

    applyPose(bones, pose) {
        pose.forEach((p, i) => {
            bones[i].x = p.x;
            bones[i].y = p.y;
            bones[i].angle = p.angle;
        });
    }

    interpolate(poseA, poseB, t, bones) {
        poseA.forEach((pA, i) => {
            let pB = poseB[i];
            bones[i].x = pA.x + (pB.x - pA.x) * t;
            bones[i].y = pA.y + (pB.y - pA.y) * t;
            bones[i].angle = pA.angle + (pB.angle - pA.angle) * t;
        });
    }
}
