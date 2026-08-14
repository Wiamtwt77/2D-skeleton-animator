// --- 1. إعدادات وهيكل البيانات المبدئي ---
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

let fps = 30;
let totalFrames = 30;
let currentFrame = 1;
let isPlaying = false;
let animationTimer = null;
let selectedBone = null;
let isDragging = false;
let showBones = true;

// هيكل العظام الأساسي (Skeleton)
let skeleton = [
  { id: 'root', parentId: null, x: 300, y: 250, length: 0, rotation: 0, color: '#f38ba8' },
  { id: 'torso', parentId: 'root', x: 0, y: -80, length: 80, rotation: 0, color: '#a6e3a1' },
  { id: 'head', parentId: 'torso', x: 0, y: -50, length: 40, rotation: 0, color: '#f9e2af' },
  { id: 'arm_R', parentId: 'torso', x: 25, y: -70, length: 60, rotation: 30, color: '#89b4fa' },
  { id: 'arm_L', parentId: 'torso', x: -25, y: -70, length: 60, rotation: -30, color: '#89b4fa' }
];

// Keyframes تخزين الوضعيات
let keyframes = [
  {
    frame: 1,
    bones: {
      root: { x: 300, y: 250, rotation: 0 },
      torso: { rotation: 0 },
      head: { rotation: 0 },
      arm_R: { rotation: 30 },
      arm_L: { rotation: -30 }
    }
  },
  {
    frame: 15,
    bones: {
      root: { x: 300, y: 250, rotation: 0 },
      torso: { rotation: 10 },
      head: { rotation: -10 },
      arm_R: { rotation: -60 },
      arm_L: { rotation: 60 }
    }
  }
];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  computeWorldTransforms();
  render();
}

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

// --- 2. محرك Forward Kinematics ---
function computeWorldTransforms() {
  const bonesMap = {};
  skeleton.forEach(b => bonesMap[b.id] = b);

  function calculate(bone) {
    if (!bone.parentId) {
      bone.worldX = bone.x;
      bone.worldY = bone.y;
      bone.worldRot = bone.rotation;
    } else {
      const parent = bonesMap[bone.parentId];
      const rad = (parent.worldRot * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      bone.worldX = parent.worldX + (bone.x * cos - bone.y * sin);
      bone.worldY = parent.worldY + (bone.x * sin + bone.y * cos);
      bone.worldRot = parent.worldRot + bone.rotation;
    }

    const endRad = (bone.worldRot * Math.PI) / 180;
    bone.endX = bone.worldX + Math.sin(endRad) * bone.length;
    bone.endY = bone.worldY - Math.cos(endRad) * bone.length;

    skeleton.filter(b => b.parentId === bone.id).forEach(calculate);
  }

  skeleton.filter(b => b.parentId === null).forEach(calculate);
}

// --- 3. الـ Interpolation بين الـ Keyframes ---
function lerpAngle(start, end, t) {
  let delta = (end - start) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return start + delta * t;
}

function updateBonesForCurrentFrame() {
  if (keyframes.length === 0) return;

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  let prevKF = sorted.filter(k => k.frame <= currentFrame).pop();
  let nextKF = sorted.find(k => k.frame > currentFrame);

  if (!prevKF) prevKF = sorted[0];
  if (!nextKF) nextKF = prevKF;

  const totalStep = nextKF.frame - prevKF.frame;
  const t = totalStep === 0 ? 0 : (currentFrame - prevKF.frame) / totalStep;

  skeleton.forEach(bone => {
    const prevData = prevKF.bones[bone.id];
    const nextData = nextKF.bones[bone.id];

    if (prevData && nextData) {
      bone.rotation = lerpAngle(prevData.rotation, nextData.rotation, t);
      if (bone.id === 'root') {
        bone.x = prevData.x + (nextData.x - prevData.x) * t;
        bone.y = prevData.y + (nextData.y - prevData.y) * t;
      }
    }
  });

  computeWorldTransforms();
}

function saveCurrentStateToKeyframe() {
  let kf = keyframes.find(k => k.frame === currentFrame);
  if (!kf) {
    kf = { frame: currentFrame, bones: {} };
    keyframes.push(kf);
  }
  skeleton.forEach(b => {
    kf.bones[b.id] = { rotation: b.rotation, x: b.x, y: b.y };
  });
}

// --- 4. الرسم على الـ Canvas ---
function render(targetCtx = ctx, targetCanvas = canvas, drawControls = showBones) {
  targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  skeleton.forEach(bone => {
    if (bone.length > 0) {
      targetCtx.beginPath();
      targetCtx.moveTo(bone.worldX, bone.worldY);
      targetCtx.lineTo(bone.endX, bone.endY);
      targetCtx.strokeStyle = bone.color;
      targetCtx.lineWidth = 8;
      targetCtx.lineCap = 'round';
      targetCtx.stroke();
    }

    if (drawControls) {
      targetCtx.beginPath();
      targetCtx.arc(bone.worldX, bone.worldY, selectedBone === bone ? 10 : 7, 0, Math.PI * 2);
      targetCtx.fillStyle = selectedBone === bone ? '#ffffff' : bone.color;
      targetCtx.fill();
      targetCtx.strokeStyle = '#11111b';
      targetCtx.lineWidth = 2;
      targetCtx.stroke();
    }
  });
}

// --- 5. أحداث الماوس والتفاعل ---
canvas.addEventListener('mousedown', (e) => {
  const pos = getMousePos(e);

  let found = null;
  skeleton.forEach(bone => {
    const dist = Math.hypot(bone.worldX - pos.x, bone.worldY - pos.y);
    if (dist < 25) found = bone;
  });

  selectedBone = found;
  isDragging = !!found;
  updateUI();
  render();
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging || !selectedBone) return;

  const pos = getMousePos(e);

  if (selectedBone.id === 'root') {
    selectedBone.x = pos.x;
    selectedBone.y = pos.y;
  } else {
    const dx = pos.x - selectedBone.worldX;
    const dy = pos.y - selectedBone.worldY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    const parent = skeleton.find(b => b.id === selectedBone.parentId);
    selectedBone.rotation = angle - (parent ? parent.worldRot : 0);
  }

  computeWorldTransforms();
  saveCurrentStateToKeyframe();
  updateUI();
  render();
});

window.addEventListener('mouseup', () => isDragging = false);

// --- 6. إدارة الـ Timeline والواجهة ---
const scrubber = document.getElementById('timeline-scrubber');
const frameCounter = document.getElementById('frame-counter');
const btnPlay = document.getElementById('btn-play');
const inputFps = document.getElementById('input-fps');
const inputTotalFrames = document.getElementById('input-total-frames');

function updateUI() {
  scrubber.value = currentFrame;
  scrubber.max = totalFrames;
  frameCounter.innerText = `Frame: ${currentFrame} / ${totalFrames}`;

  const track = document.getElementById('keyframes-track');
  track.innerHTML = '';
  keyframes.forEach(kf => {
    const marker = document.createElement('div');
    marker.className = 'keyframe-marker';
    marker.style.left = `${((kf.frame - 1) / (totalFrames - 1)) * 100}%`;
    marker.title = `Keyframe ${kf.frame}`;
    marker.onclick = () => {
      currentFrame = kf.frame;
      updateBonesForCurrentFrame();
      updateUI();
      render();
    };
    track.appendChild(marker);
  });

  const info = document.getElementById('bone-info');
  if (selectedBone) {
    info.innerHTML = `
      <p><b>اسم العظمة:</b> ${selectedBone.id}</p>
      <p><b>الدوران:</b> ${Math.round(selectedBone.rotation)}°</p>
      <p><b>الموقع:</b> (${Math.round(selectedBone.worldX)}, ${Math.round(selectedBone.worldY)})</p>
    `;
  } else {
    info.innerHTML = `<p class="placeholder-text">انقر على أي مفصل (دائرة ملونة) لتحريك العظمة بالماوس.</p>`;
  }
}

scrubber.addEventListener('input', (e) => {
  currentFrame = parseInt(e.target.value);
  updateBonesForCurrentFrame();
  updateUI();
  render();
});

inputFps.addEventListener('change', (e) => {
  fps = parseInt(e.target.value) || 30;
  if (isPlaying) { togglePlay(); togglePlay(); }
});

inputTotalFrames.addEventListener('change', (e) => {
  totalFrames = parseInt(e.target.value) || 30;
  updateUI();
});

document.getElementById('chk-show-bones').addEventListener('change', (e) => {
  showBones = e.target.checked;
  render();
});

function togglePlay() {
  isPlaying = !isPlaying;
  btnPlay.innerText = isPlaying ? '⏸ إيقاف' : '▶ تشغيل';

  if (isPlaying) {
    animationTimer = setInterval(() => {
      currentFrame = (currentFrame % totalFrames) + 1;
      updateBonesForCurrentFrame();
      updateUI();
      render();
    }, 1000 / fps);
  } else {
    clearInterval(animationTimer);
  }
}

btnPlay.addEventListener('click', togglePlay);

// إضافة / حذف Keyframe
document.getElementById('btn-add-kf').addEventListener('click', () => {
  saveCurrentStateToKeyframe();
  updateUI();
});

document.getElementById('btn-del-kf').addEventListener('click', () => {
  keyframes = keyframes.filter(k => k.frame !== currentFrame);
  updateBonesForCurrentFrame();
  updateUI();
  render();
});

// التنقل بين Keyframes
document.getElementById('btn-prev-kf').addEventListener('click', () => {
  const sorted = [...keyframes].sort((a,b) => a.frame - b.frame);
  const prev = sorted.filter(k => k.frame < currentFrame).pop();
  if (prev) {
    currentFrame = prev.frame;
    updateBonesForCurrentFrame();
    updateUI();
    render();
  }
});

document.getElementById('btn-next-kf').addEventListener('click', () => {
  const sorted = [...keyframes].sort((a,b) => a.frame - b.frame);
  const next = sorted.find(k => k.frame > currentFrame);
  if (next) {
    currentFrame = next.frame;
    updateBonesForCurrentFrame();
    updateUI();
    render();
  }
});

// --- 7. مسجل الفيديو وتصدير الأنيميشن (Video Export) ---
async function exportVideo() {
  if (isPlaying) togglePlay();

  const exportBtn = document.getElementById('btn-export-video');
  const originalText = exportBtn.innerText;
  exportBtn.innerText = '⏳ جاري تسجيل الفيديو...';
  exportBtn.disabled = true;

  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2d_animation.webm';
    a.click();
    URL.revokeObjectURL(url);

    exportBtn.innerText = originalText;
    exportBtn.disabled = false;
  };

  mediaRecorder.start();

  currentFrame = 1;
  const interval = 1000 / fps;
  let recordFrameCount = 0;

  const recordInterval = setInterval(() => {
    recordFrameCount++;
    currentFrame = recordFrameCount;
    updateBonesForCurrentFrame();
    updateUI();
    render();

    if (recordFrameCount >= totalFrames) {
      clearInterval(recordInterval);
      mediaRecorder.stop();
    }
  }, interval);
}

document.getElementById('btn-export-video').addEventListener('click', exportVideo);

// --- 8. نافذة معاينة واختبار الأنيميشن (Modal Preview) ---
const previewModal = document.getElementById('preview-modal');
const previewCanvas = document.getElementById('preview-stage');
const previewCtx = previewCanvas.getContext('2d');
let previewTimer = null;

function startPreview() {
  previewModal.classList.remove('hidden');
  let pFrame = 1;

  previewTimer = setInterval(() => {
    pFrame = (pFrame % totalFrames) + 1;
    currentFrame = pFrame;
    updateBonesForCurrentFrame();
    render(previewCtx, previewCanvas, false);
  }, 1000 / fps);
}

function stopPreview() {
  previewModal.classList.add('hidden');
  if (previewTimer) clearInterval(previewTimer);
}

document.getElementById('btn-preview').addEventListener('click', startPreview);
document.getElementById('btn-close-modal').addEventListener('click', stopPreview);
document.getElementById('btn-modal-close').addEventListener('click', stopPreview);
document.getElementById('btn-modal-record').addEventListener('click', () => {
  stopPreview();
  exportVideo();
});

// --- 9. حفظ وتحميل المشروع ---
document.getElementById('btn-save').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ skeleton, keyframes, fps, totalFrames }, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "skeletal_project.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

const fileInput = document.getElementById('file-input');
document.getElementById('btn-load').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.skeleton) skeleton = data.skeleton;
      if (data.keyframes) keyframes = data.keyframes;
      if (data.fps) fps = data.fps;
      if (data.totalFrames) totalFrames = data.totalFrames;
      
      currentFrame = 1;
      updateBonesForCurrentFrame();
      updateUI();
      render();
    } catch (err) {
      alert('خطأ في قراءة ملف JSON');
    }
  };
  reader.readAsText(file);
});

window.addEventListener('resize', resizeCanvas);
setTimeout(() => {
  resizeCanvas();
  updateBonesForCurrentFrame();
  updateUI();
}, 50);
