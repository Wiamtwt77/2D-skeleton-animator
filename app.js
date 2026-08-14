// --- 1. إعدادات وهيكل البيانات المبدئي للشخصية ---
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

let fps = 30;
let totalFrames = 30;
let currentFrame = 1;
let isPlaying = false;
let animationTimer = null;
let selectedBone = null;
let isDragging = false;

// هيكل العظام (Skeleton Definition)
let skeleton = [
  { id: 'root', parentId: null, x: 450, y: 300, length: 0, rotation: 0, color: '#f38ba8' },
  { id: 'torso', parentId: 'root', x: 0, y: -80, length: 80, rotation: 0, color: '#a6e3a1' },
  { id: 'head', parentId: 'torso', x: 0, y: -50, length: 40, rotation: 0, color: '#f9e2af' },
  { id: 'arm_R', parentId: 'torso', x: 20, y: -70, length: 60, rotation: 30, color: '#89b4fa' },
  { id: 'arm_L', parentId: 'torso', x: -20, y: -70, length: 60, rotation: -30, color: '#89b4fa' }
];

// Keyframes: تخزين الوضعية لكل Frame متواجد
let keyframes = [
  {
    frame: 1,
    bones: {
      root: { x: 450, y: 300, rotation: 0 },
      torso: { rotation: 0 },
      head: { rotation: 0 },
      arm_R: { rotation: 30 },
      arm_L: { rotation: -30 }
    }
  },
  {
    frame: 15,
    bones: {
      root: { x: 450, y: 300, rotation: 0 },
      torso: { rotation: 10 },
      head: { rotation: -10 },
      arm_R: { rotation: -60 },
      arm_L: { rotation: 60 }
    }
  }
];

// --- 2. محرك حساب التحويلات الهرمية (Forward Kinematics) ---
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

    // حساب نقطة نهاية العظمة بناءً على طولها وزاويتها
    const endRad = (bone.worldRot * Math.PI) / 180;
    bone.endX = bone.worldX + Math.sin(endRad) * bone.length;
    bone.endY = bone.worldY - Math.cos(endRad) * bone.length;

    // تطبيق الحساب للأبناء
    skeleton.filter(b => b.parentId === bone.id).forEach(calculate);
  }

  skeleton.filter(b => b.parentId === null).forEach(calculate);
}

// --- 3. حساب الـ Interpolation (Lerp) بين الـ Keyframes ---
function lerpAngle(start, end, t) {
  let delta = (end - start) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return start + delta * t;
}

function updateBonesForCurrentFrame() {
  if (keyframes.length === 0) return;

  // ترتيب Keyframes حسَب أرقام الـ Frames
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

// --- 4. الرسم على الـ Canvas ---
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // رسم العظام والوصلات
  skeleton.forEach(bone => {
    // رسم جسم العظمة (Line)
    if (bone.length > 0) {
      ctx.beginPath();
      ctx.moveTo(bone.worldX, bone.worldY);
      ctx.lineTo(bone.endX, bone.endY);
      ctx.strokeStyle = bone.color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // رسم مفصل العظمة (Joint)
    ctx.beginPath();
    ctx.arc(bone.worldX, bone.worldY, selectedBone === bone ? 9 : 6, 0, Math.PI * 2);
    ctx.fillStyle = selectedBone === bone ? '#f5e0dc' : bone.color;
    ctx.fill();
    ctx.strokeStyle = '#11111b';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// --- 5. التفاعل بالماوس (اختيار وتحريك العظام) ---
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // البحث عن أقرب عظمة
  let found = null;
  skeleton.forEach(bone => {
    const dist = Math.hypot(bone.worldX - mouseX, bone.worldY - mouseY);
    if (dist < 15) found = bone;
  });

  selectedBone = found;
  isDragging = !!found;
  updateUI();
  render();
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging || !selectedBone) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (selectedBone.id === 'root') {
    selectedBone.x = mouseX;
    selectedBone.y = mouseY;
  } else {
    // حساب الزاوية الجديدة بناءً على موقع الماوس بالنسبة لمفصل العظمة الأب
    const dx = mouseX - selectedBone.worldX;
    const dy = mouseY - selectedBone.worldY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    const parent = skeleton.find(b => b.id === selectedBone.parentId);
    selectedBone.rotation = angle - (parent ? parent.worldRot : 0);
  }

  computeWorldTransforms();
  render();
});

window.addEventListener('mouseup', () => isDragging = false);

// --- 6. إدارة الـ Timeline والتشغيل ---
const scrubber = document.getElementById('timeline-scrubber');
const frameCounter = document.getElementById('frame-counter');
const btnPlay = document.getElementById('btn-play');

function updateUI() {
  scrubber.value = currentFrame;
  frameCounter.innerText = `Frame: ${currentFrame} / ${totalFrames}`;
  
  // تحديث نقاط الـ Keyframes في الشريط
  const track = document.getElementById('keyframes-track');
  track.innerHTML = '';
  keyframes.forEach(kf => {
    const marker = document.createElement('div');
    marker.className = 'keyframe-marker';
    marker.style.left = `${((kf.frame - 1) / (totalFrames - 1)) * 100}%`;
    track.appendChild(marker);
  });

  const info = document.getElementById('bone-info');
  if (selectedBone) {
    info.innerHTML = `
      <p><b>العظمة:</b> ${selectedBone.id}</p>
      <p><b>الدوران:</b> ${Math.round(selectedBone.rotation)}°</p>
    `;
  } else {
    info.innerHTML = `<p>اختر عظمة من الشاشة لتحريكها بالماوس</p>`;
  }
}

scrubber.addEventListener('input', (e) => {
  currentFrame = parseInt(e.target.value);
  updateBonesForCurrentFrame();
  updateUI();
  render();
});

btnPlay.addEventListener('click', () => {
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
});

document.getElementById('btn-add-keyframe').addEventListener('click', () => {
  const existingIdx = keyframes.findIndex(k => k.frame === currentFrame);
  const boneStates = {};
  
  skeleton.forEach(b => {
    boneStates[b.id] = { rotation: b.rotation, x: b.x, y: b.y };
  });

  if (existingIdx >= 0) {
    keyframes[existingIdx].bones = boneStates;
  } else {
    keyframes.push({ frame: currentFrame, bones: boneStates });
  }

  updateUI();
});

// --- 7. حفظ وتحميل ملف المشروع (JSON) ---
document.getElementById('btn-save').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ skeleton, keyframes, fps }, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "animation_project.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// التشغيل المبدئي عند فتح الصفحة
updateBonesForCurrentFrame();
updateUI();
render();
