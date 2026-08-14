// Global State for Character Customization
const characterState = {
  headShape: 'circle',
  eyeStyle: 'happy',
  armStyle: 'smooth',
  legStyle: 'standard',
  primaryColor: '#38bdf8',
  jointColor: '#22c55e'
};

// UI Elements & Navigation
const builderScreen = document.getElementById('builderScreen');
const animatorScreen = document.getElementById('animatorScreen');
const step1Indicator = document.getElementById('step1Indicator');
const step2Indicator = document.getElementById('step2Indicator');

const goToAnimBtn = document.getElementById('goToAnimBtn');
const backToBuilderBtn = document.getElementById('backToBuilderBtn');

// Canvases Initialization
const builderCanvas = document.getElementById('builderCanvas');
const bCtx = builderCanvas.getContext('2d');

const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

const thumbStrip = document.getElementById('thumbStrip');
const frameCountLabel = document.getElementById('frameCount');

// Safe Custom Rounded Rectangle implementation
function drawRoundRect(targetCtx, x, y, width, height, radius) {
  targetCtx.beginPath();
  targetCtx.moveTo(x + radius, y);
  targetCtx.lineTo(x + width - radius, y);
  targetCtx.arcTo(x + width, y, x + width, y + radius, radius);
  targetCtx.lineTo(x + width, y + height - radius);
  targetCtx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  targetCtx.lineTo(x + radius, y + height);
  targetCtx.arcTo(x, y + height, x, y + height - radius, radius);
  targetCtx.lineTo(x, y + radius);
  targetCtx.arcTo(x, y, x + radius, y, radius);
  targetCtx.closePath();
}

// دالة حساب الأبعاد الآمنة
function resizeCanvases() {
  // حساب شاشة التصميم
  const bRect = builderCanvas.parentElement.getBoundingClientRect();
  if (bRect && bRect.width > 0) {
    builderCanvas.width = bRect.width;
    builderCanvas.height = bRect.height;
  }

  // حساب شاشة التحريك
  const mRect = mainCanvas.parentElement.getBoundingClientRect();
  if (mRect && mRect.width > 0) {
    mainCanvas.width = mRect.width;
    mainCanvas.height = mRect.height;
  }
}

window.addEventListener('resize', () => {
  resizeCanvases();
});

// Switch Screen Handlers (مع تأخير زمني بسيط للسماح للمتصفح بالرسم)
goToAnimBtn.addEventListener('click', () => {
  builderScreen.classList.remove('active');
  animatorScreen.classList.add('active');
  step1Indicator.classList.remove('active');
  step2Indicator.classList.add('active');

  setTimeout(() => {
    resizeCanvases();
  }, 50);
});

backToBuilderBtn.addEventListener('click', () => {
  animatorScreen.classList.remove('active');
  builderScreen.classList.add('active');
  step2Indicator.classList.remove('active');
  step1Indicator.classList.add('active');

  setTimeout(() => {
    resizeCanvases();
  }, 50);
});

// Customization Event Listeners
document.getElementById('headShape').addEventListener('change', (e) => { characterState.headShape = e.target.value; });
document.getElementById('eyeStyle').addEventListener('change', (e) => { characterState.eyeStyle = e.target.value; });
document.getElementById('armStyle').addEventListener('change', (e) => { characterState.armStyle = e.target.value; });
document.getElementById('legStyle').addEventListener('change', (e) => { characterState.legStyle = e.target.value; });
document.getElementById('primaryColor').addEventListener('input', (e) => { characterState.primaryColor = e.target.value; });
document.getElementById('jointColor').addEventListener('input', (e) => { characterState.jointColor = e.target.value; });

// Shared Skeleton Rendering Engine
function drawCharacterParts(targetCtx, base, shoulder, pose, torsoAngleVal) {
  targetCtx.lineCap = 'round';
  targetCtx.lineJoin = 'round';

  // 1. Legs Rendering
  targetCtx.strokeStyle = characterState.primaryColor;
  targetCtx.lineWidth = characterState.armStyle === 'stick' ? 4 : 8;

  const leftFoot = { x: base.x - 25, y: base.y + 70 };
  const rightFoot = { x: base.x + 25, y: base.y + 70 };

  targetCtx.beginPath(); targetCtx.moveTo(base.x - 8, base.y); targetCtx.lineTo(leftFoot.x, leftFoot.y); targetCtx.stroke();
  targetCtx.beginPath(); targetCtx.moveTo(base.x + 8, base.y); targetCtx.lineTo(rightFoot.x, rightFoot.y); targetCtx.stroke();

  if (characterState.legStyle === 'standard') {
    targetCtx.fillStyle = characterState.jointColor;
    targetCtx.beginPath(); targetCtx.arc(leftFoot.x - 4, leftFoot.y, 6, 0, Math.PI * 2); targetCtx.fill();
    targetCtx.beginPath(); targetCtx.arc(rightFoot.x + 4, rightFoot.y, 6, 0, Math.PI * 2); targetCtx.fill();
  }

  // 2. Torso
  targetCtx.strokeStyle = '#f8fafc';
  targetCtx.lineWidth = characterState.armStyle === 'stick' ? 4 : 12;
  targetCtx.beginPath();
  targetCtx.moveTo(base.x, base.y);
  targetCtx.lineTo(shoulder.x, shoulder.y);
  targetCtx.stroke();

  // 3. Head & Face
  const headPos = {
    x: shoulder.x + Math.sin(torsoAngleVal * 0.5) * 35,
    y: shoulder.y - Math.cos(torsoAngleVal * 0.5) * 35 - 15
  };

  targetCtx.fillStyle = characterState.primaryColor;
  targetCtx.strokeStyle = '#ffffff';
  targetCtx.lineWidth = 2;

  if (characterState.headShape === 'circle') {
    targetCtx.beginPath(); targetCtx.arc(headPos.x, headPos.y, 22, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
  } else if (characterState.headShape === 'square') {
    drawRoundRect(targetCtx, headPos.x - 20, headPos.y - 20, 40, 40, 8);
    targetCtx.fill(); targetCtx.stroke();
  } else if (characterState.headShape === 'cat') {
    targetCtx.beginPath(); targetCtx.arc(headPos.x, headPos.y, 20, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
    targetCtx.beginPath();
    targetCtx.moveTo(headPos.x - 15, headPos.y - 12); targetCtx.lineTo(headPos.x - 22, headPos.y - 30); targetCtx.lineTo(headPos.x - 5, headPos.y - 18);
    targetCtx.moveTo(headPos.x + 15, headPos.y - 12); targetCtx.lineTo(headPos.x + 22, headPos.y - 30); targetCtx.lineTo(headPos.x + 5, headPos.y - 18);
    targetCtx.fill(); targetCtx.stroke();
  } else if (characterState.headShape === 'robot') {
    targetCtx.beginPath(); targetCtx.rect(headPos.x - 22, headPos.y - 18, 44, 36); targetCtx.fill(); targetCtx.stroke();
    targetCtx.fillStyle = '#0f172a';
    targetCtx.fillRect(headPos.x - 4, headPos.y - 26, 8, 8);
  }

  // Eye Details
  targetCtx.fillStyle = '#0f172a';
  targetCtx.strokeStyle = '#0f172a';
  targetCtx.lineWidth = 2;
  const eyeOffset = 8;

  if (characterState.eyeStyle === 'normal') {
    targetCtx.beginPath(); targetCtx.arc(headPos.x - eyeOffset, headPos.y - 2, 3, 0, Math.PI * 2); targetCtx.fill();
    targetCtx.beginPath(); targetCtx.arc(headPos.x + eyeOffset, headPos.y - 2, 3, 0, Math.PI * 2); targetCtx.fill();
  } else if (characterState.eyeStyle === 'happy') {
    targetCtx.beginPath(); targetCtx.arc(headPos.x - eyeOffset, headPos.y, 4, Math.PI, 0); targetCtx.stroke();
    targetCtx.beginPath(); targetCtx.arc(headPos.x + eyeOffset, headPos.y, 4, Math.PI, 0); targetCtx.stroke();
  } else if (characterState.eyeStyle === 'surprised') {
    targetCtx.beginPath(); targetCtx.arc(headPos.x - eyeOffset, headPos.y, 5, 0, Math.PI * 2); targetCtx.stroke();
    targetCtx.beginPath(); targetCtx.arc(headPos.x + eyeOffset, headPos.y, 5, 0, Math.PI * 2); targetCtx.stroke();
  } else if (characterState.eyeStyle === 'blink') {
    targetCtx.beginPath(); targetCtx.moveTo(headPos.x - eyeOffset - 3, headPos.y); targetCtx.lineTo(headPos.x - eyeOffset + 3, headPos.y); targetCtx.stroke();
    targetCtx.beginPath(); targetCtx.moveTo(headPos.x + eyeOffset - 3, headPos.y); targetCtx.lineTo(headPos.x + eyeOffset + 3, headPos.y); targetCtx.stroke();
  }

  // 4. Arms (IK Pose)
  targetCtx.strokeStyle = characterState.primaryColor;
  targetCtx.lineWidth = characterState.armStyle === 'stick' ? 4 : (characterState.armStyle === 'segmented' ? 12 : 8);

  targetCtx.beginPath(); targetCtx.moveTo(shoulder.x, shoulder.y); targetCtx.lineTo(pose.elbow.x, pose.elbow.y); targetCtx.stroke();
  targetCtx.beginPath(); targetCtx.moveTo(pose.elbow.x, pose.elbow.y); targetCtx.lineTo(pose.wrist.x, pose.wrist.y); targetCtx.stroke();

  // Joints
  [shoulder, pose.elbow, pose.wrist].forEach((joint, idx) => {
    targetCtx.fillStyle = idx === 2 ? characterState.jointColor : '#ffffff';
    targetCtx.beginPath(); targetCtx.arc(joint.x, joint.y, characterState.armStyle === 'stick' ? 4 : 7, 0, Math.PI * 2); targetCtx.fill();
  });
}

// دالة رسم المعاينة 
function drawBuilderPreview() {
  if (!builderCanvas.width || builderCanvas.width === 0) return;
  bCtx.clearRect(0, 0, builderCanvas.width, builderCanvas.height);

  const centerX = builderCanvas.width / 2;
  const centerY = builderCanvas.height / 2;

  const base = { x: centerX, y: centerY + 20 };
  const shoulder = { x: centerX, y: centerY - 80 };
  const pose = {
    elbow: { x: centerX + 60, y: centerY - 50 },
    wrist: { x: centerX + 110, y: centerY - 20 }
  };

  drawCharacterParts(bCtx, base, shoulder, pose, 0);
}

// محرك الحركة الذكية (IK Solver)
const upperArmLength = 100;
const forearmLength = 85;
const spineBase = { x: 0, y: 80 };
let target = { x: 100, y: -20 };
let isDragging = false;

let torsoAngle = 0;
let targetTorsoAngle = 0;
let torsoInfluence = 0.25;
let springStiffness = 0.12;

let keyframes = [];
let time = 0;

function solveIK(shoulder, target, l1, l2) {
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  let dist = Math.hypot(dx, dy);

  const maxDist = l1 + l2 - 0.01;
  if (dist > maxDist) dist = maxDist;
  if (dist < 10) dist = 10;

  const cosElbow = (dist * dist - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  const elbowAngle = Math.acos(Math.max(-1, Math.min(1, cosElbow)));

  const angleToTarget = Math.atan2(dy, dx);
  const cosShoulder = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
  const shoulderAngleOffset = Math.acos(Math.max(-1, Math.min(1, cosShoulder)));

  const shoulderAngle = angleToTarget - shoulderAngleOffset;

  return {
    shoulder,
    elbow: { x: shoulder.x + Math.cos(shoulderAngle) * l1, y: shoulder.y + Math.sin(shoulderAngle) * l1 },
    wrist: { x: shoulder.x + Math.cos(shoulderAngle) * l1 + Math.cos(shoulderAngle + elbowAngle) * l2, y: shoulder.y + Math.sin(shoulderAngle) * l1 + Math.sin(shoulderAngle + elbowAngle) * l2 }
  };
}

// حلقة التحريك الرئيسية
function animate() {
  time += 0.04;

  if (builderScreen.classList.contains('active')) {
    drawBuilderPreview();
  } else if (animatorScreen.classList.contains('active')) {
    // شرط حماية يمنع العمل إذا كانت الأبعاد صفر
    if (mainCanvas.width && mainCanvas.width > 0) {
      const centerX = mainCanvas.width / 2;
      const centerY = mainCanvas.height / 2 + 20;

      ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      const idleY = Math.sin(time * 2) * 3;
      const currentSpineBase = { x: centerX + spineBase.x, y: centerY + spineBase.y + idleY };

      const dx = (target.x + centerX) - currentSpineBase.x;
      const dy = (target.y + centerY) - currentSpineBase.y;
      const targetDist = Math.hypot(dx, dy);

      targetTorsoAngle = Math.atan2(dy, dx) * torsoInfluence * (targetDist / 250);
      torsoAngle += (targetTorsoAngle - torsoAngle) * springStiffness;

      const torsoLength = 90;
      const shoulder = {
        x: currentSpineBase.x + Math.sin(torsoAngle) * torsoLength,
        y: currentSpineBase.y - Math.cos(torsoAngle) * torsoLength
      };

      const worldTarget = { x: centerX + target.x, y: centerY + target.y };
      const pose = solveIK(shoulder, worldTarget, upperArmLength, forearmLength);

      drawGrid(ctx, mainCanvas);
      drawCharacterParts(ctx, currentSpineBase, shoulder, pose, torsoAngle);
      drawTargetHandle(ctx, worldTarget);
    }
  }

  requestAnimationFrame(animate);
}

function drawGrid(targetCtx, c) {
  targetCtx.strokeStyle = '#1e293b';
  targetCtx.lineWidth = 1;
  for (let x = 0; x < c.width; x += 40) {
    targetCtx.beginPath(); targetCtx.moveTo(x, 0); targetCtx.lineTo(x, c.height); targetCtx.stroke();
  }
  for (let y = 0; y < c.height; y += 40) {
    targetCtx.beginPath(); targetCtx.moveTo(0, y); targetCtx.lineTo(c.width, y); targetCtx.stroke();
  }
}

function drawTargetHandle(targetCtx, worldTarget) {
  targetCtx.strokeStyle = isDragging ? '#4ade80' : characterState.jointColor;
  targetCtx.lineWidth = 2;
  targetCtx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  targetCtx.beginPath(); targetCtx.arc(worldTarget.x, worldTarget.y, 14, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
}

// التفاعل والسحب
function getMousePos(e) {
  const rect = mainCanvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left - (mainCanvas.width / 2),
    y: e.clientY - rect.top - (mainCanvas.height / 2 + 20)
  };
}

mainCanvas.addEventListener('mousedown', (e) => {
  const m = getMousePos(e);
  if (Math.hypot(m.x - target.x, m.y - target.y) < 25) isDragging = true;
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const m = getMousePos(e);
    target.x = m.x;
    target.y = m.y;
  }
});
window.addEventListener('mouseup', () => isDragging = false);

// إعدادات الفيزياء
document.getElementById('torsoWeight').addEventListener('input', (e) => {
  torsoInfluence = parseFloat(e.target.value);
  document.getElementById('torsoVal').innerText = Math.round(torsoInfluence * 100) + '%';
});

document.getElementById('springStiffness').addEventListener('input', (e) => {
  springStiffness = parseFloat(e.target.value) / 100;
  document.getElementById('springVal').innerText = e.target.value;
});

// مسجل الفيديو
let mediaRecorder;
let recordedChunks = [];
const startRecBtn = document.getElementById('startRecBtn');
const stopRecBtn = document.getElementById('stopRecBtn');
const recBadge = document.getElementById('recBadge');

startRecBtn.addEventListener('click', () => {
  const stream = mainCanvas.captureStream(30);
  recordedChunks = [];
  
  const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
  mediaRecorder = new MediaRecorder(stream, { mimeType });

  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube_character_anim_${Date.now()}.${mimeType.includes('webm') ? 'webm' : 'mp4'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
  startRecBtn.disabled = true;
  stopRecBtn.disabled = false;
  recBadge.style.display = 'inline-block';
});

stopRecBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    startRecBtn.disabled = false;
    stopRecBtn.disabled = true;
    recBadge.style.display = 'none';
  }
});

// شريط المشاهد
document.getElementById('addFrameBtn').addEventListener('click', () => {
  const frameData = { ...target };
  keyframes.push(frameData);

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 90;
  thumbCanvas.height = 65;
  const tCtx = thumbCanvas.getContext('2d');

  tCtx.fillStyle = '#0f172a';
  tCtx.fillRect(0, 0, 90, 65);
  tCtx.fillStyle = characterState.jointColor;
  tCtx.beginPath();
  tCtx.arc(45 + frameData.x * 0.2, 32 + frameData.y * 0.2, 4, 0, Math.PI * 2);
  tCtx.fill();

  const card = document.createElement('div');
  card.className = 'thumb-card';
  card.innerHTML = `<span class="thumb-number">مشهد ${keyframes.length}</span>`;
  card.appendChild(thumbCanvas);

  card.addEventListener('click', () => {
    document.querySelectorAll('.thumb-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    smoothMoveToTarget(frameData);
  });

  thumbStrip.appendChild(card);
  frameCountLabel.innerText = `عدد المشاهد: ${keyframes.length}`;
});

function smoothMoveToTarget(goal) {
  const startX = target.x;
  const startY = target.y;
  let progress = 0;

  function step() {
    progress += 0.08;
    target.x = startX + (goal.x - startX) * progress;
    target.y = startY + (goal.y - startY) * progress;
    if (progress < 1) requestAnimationFrame(step);
  }
  step();
}

document.getElementById('playSeqBtn').addEventListener('click', () => {
  if (keyframes.length < 2) return;
  let idx = 0;
  function playNext() {
    if (idx >= keyframes.length) return;
    const cards = document.querySelectorAll('.thumb-card');
    cards.forEach(c => c.classList.remove('active'));
    if (cards[idx]) cards[idx].classList.add('active');
    smoothMoveToTarget(keyframes[idx]);
    idx++;
    setTimeout(playNext, 1200);
  }
  playNext();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  keyframes = [];
  thumbStrip.innerHTML = '';
  frameCountLabel.innerText = 'عدد المشاهد: 0';
  target = { x: 100, y: -20 };
});

// بدء التشغيل الآمن (الحل السحري لمشكلة التحميل الأولي)
window.addEventListener('load', () => {
  setTimeout(() => {
    resizeCanvases();
    requestAnimationFrame(animate);
  }, 50); // إعطاء المتصفح 50 جزء من الثانية لترتيب ملفات CSS قبل الحساب
});
