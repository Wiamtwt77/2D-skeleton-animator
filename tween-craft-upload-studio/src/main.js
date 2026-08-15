
import { bones } from './core/rig.js';
import { drawCharacter } from './core/renderer.js';
import { TimelineEngine } from './animation/timeline.js';
import { getEasingProgress } from './animation/easing.js';
import { initInteraction } from './interaction/touchDrag.js';
import { initUploadPanel } from './ui/uploadPanel.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const timeline = new TimelineEngine();

let images = {};
let selectedBone = null;
let showOnionSkin = false;

// تهيئة لوحة الرفع
initUploadPanel((id, img) => {
    images[id] = img;
});

// تهيئة السحب والتفاعل
initInteraction(canvas, bones, {
    onSelect: (bone) => { selectedBone = bone; }
});

// حلقة الرسم العامة
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showOnionSkin && timeline.keyframes.length > 1 && timeline.currentFrameIdx > 0) {
        timeline.applyPose(bones, timeline.keyframes[timeline.currentFrameIdx - 1]);
        drawCharacter(ctx, bones, images, 0.25, null);
    }

    if (timeline.isPlaying && timeline.keyframes.length > 1) {
        let fA = timeline.keyframes[timeline.currentFrameIdx];
        let fB = timeline.keyframes[(timeline.currentFrameIdx + 1) % timeline.keyframes.length];
        
        timeline.animProgress += 0.035;
        let easing = document.getElementById('easingSelect').value;
        let t = getEasingProgress(timeline.animProgress, easing);

        timeline.interpolate(fA, fB, t, bones);

        if (timeline.animProgress >= 1) {
            timeline.animProgress = 0;
            timeline.currentFrameIdx++;
            if (timeline.currentFrameIdx >= timeline.keyframes.length - 1) {
                timeline.currentFrameIdx = 0;
                timeline.isPlaying = false;
                document.getElementById('playBtn').innerText = '▶️ تشغيل';
            }
        }
    }

    drawCharacter(ctx, bones, images, 1.0, selectedBone);
    requestAnimationFrame(render);
}

// Global UI Handlers
window.saveKeyframe = () => {
    timeline.saveKeyframe(bones);
    updateTimelineUI();
};

window.clearFrames = () => {
    timeline.clear();
    updateTimelineUI();
};

window.togglePlay = () => {
    if (timeline.keyframes.length < 2) return alert("أضف فريمين على الأقل للتشغيل!");
    timeline.isPlaying = !timeline.isPlaying;
    document.getElementById('playBtn').innerText = timeline.isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
    if (timeline.isPlaying) { timeline.animProgress = 0; timeline.currentFrameIdx = 0; }
};

window.scrubTimeline = (val) => {
    if (timeline.keyframes.length < 2) return;
    let idx = Math.floor((val / 100) * (timeline.keyframes.length - 1));
    timeline.currentFrameIdx = idx;
    timeline.applyPose(bones, timeline.keyframes[idx]);
};

window.toggleOnionSkin = () => {
    showOnionSkin = !showOnionSkin;
    let btn = document.getElementById('onionBtn');
    btn.innerText = showOnionSkin ? '🧅 قشر البصل: مفعل' : '🧅 قشر البصل: معطل';
    btn.classList.toggle('active', showOnionSkin);
};

window.resetPose = () => {
    location.reload();
};

function updateTimelineUI() {
    const track = document.getElementById('framesTrack');
    document.getElementById('frameCount').innerText = `الفريمات: ${timeline.keyframes.length}`;
    track.innerHTML = '';
    timeline.keyframes.forEach((_, idx) => {
        let node = document.createElement('div');
        node.className = 'frame-node';
        node.innerText = idx + 1;
        node.onclick = () => {
            timeline.currentFrameIdx = idx;
            timeline.applyPose(bones, timeline.keyframes[idx]);
        };
        track.appendChild(node);
    });
}

render();
