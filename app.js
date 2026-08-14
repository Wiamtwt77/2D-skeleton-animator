// Initialization
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const thumbStrip = document.getElementById('thumbStrip');
const frameCountLabel = document.getElementById('frameCount');

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Character Parts & Customization State
const characterState = {
  headShape: 'circle',
  eyeStyle: 'happy',
  armStyle: 'smooth',
  primaryColor: '#38bdf8',
  jointColor: '#22c55e'
};

// Physics Rig Setup
const upperArmLength = 110;
const forearmLength = 95;
const spineBase = { x: 0, y: 120 };
let target = { x: 120, y: -20 };
let isDragging = false;

let torsoAngle = 0;
let targetTorsoAngle = 0;
let torsoInfluence = 0.25;
let springStiffness = 0.12;

let keyframes = [];
let motionHistory = [];
let time = 0;

// Recording State
let mediaRecorder;
let recordedChunks = [];

// IK Engine
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

  const elbow = {
    x: shoulder.x + Math.cos(shoulderAngle) * l1,
    y: shoulder.y + Math.sin(shoulderAngle) * l1
  };

  const wrist = {
    x: elbow.x + Math.cos(shoulderAngle + elbowAngle) * l2,
    y: elbow.y + Math.sin(shoulderAngle + elbowAngle) * l2
  };

  return { shoulder, elbow, wrist };
}

// Main Render Loop
function animate() {
  time += 0.04;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 + 50;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Breathing Idle Motion
  const idleY = Math.sin(time * 2) * 3;
  const currentSpineBase = { x: centerX + spineBase.x, y: centerY + spineBase.y + idleY };

  // Torso Physics Balance
  const dx = (target.x + centerX) - currentSpineBase.x;
  const dy = (target.y + centerY) - currentSpineBase.y;
  const targetDist = Math.hypot(dx, dy);

  targetTorsoAngle = Math.atan2(dy, dx) * torsoInfluence * (targetDist / 250);
  torsoAngle += (targetTorsoAngle - torsoAngle) * springStiffness;

  // Shoulder Position
  const torsoLength = 100;
  const shoulder = {
    x: currentSpineBase.x + Math.sin(torsoAngle) * torsoLength,
    y: currentSpineBase.y - Math.cos(torsoAngle) * torsoLength
  };

  // Solve Pose
  const worldTarget = { x: centerX + target.x, y: centerY + target.y };
  const pose = solveIK(shoulder, worldTarget, upperArmLength, forearmLength);

  // Draw Scene
  drawGrid();
  drawSkeleton(currentSpineBase, shoulder, pose);
  drawTarget(worldTarget);

  requestAnimationFrame(animate);
}

// Draw Grid Background
function drawGrid() {
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

// Modular Character Drawing Engine
function drawSkeleton(base, shoulder, pose) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Torso
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = characterState.armStyle === 'stick' ? 4 : 12;
  ctx.beginPath();
  ctx.moveTo(base.x, base.y);
  ctx.lineTo(shoulder.x, shoulder.y);
  ctx.stroke();

  // Head Customization
  const headPos = {
    x: shoulder.x + Math.sin(torsoAngle * 0.5) * 35,
    y: shoulder.y - Math.cos(torsoAngle * 0.5) * 35 - 15
  };

  ctx.fillStyle = characterState.primaryColor;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  if (characterState.headShape === 'circle') {
    ctx.beginPath(); ctx.arc(headPos.x, headPos.y, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (characterState.headShape === 'square') {
    ctx.beginPath(); ctx.roundRect(headPos.x - 20, headPos.y - 20, 40, 40, 8); ctx.fill(); ctx.stroke();
  } else if (characterState.headShape === 'cat') {
    ctx.beginPath(); ctx.arc(headPos.x, headPos.y, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Ears
    ctx.beginPath();
    ctx.moveTo(headPos.x - 15, headPos.y - 12); ctx.lineTo(headPos.x - 22, headPos.y - 30); ctx.lineTo(headPos.x - 5, headPos.y - 18);
    ctx.moveTo(headPos.x + 15, headPos.y - 12); ctx.lineTo(headPos.x + 22, headPos.y - 30); ctx.lineTo(headPos.x + 5, headPos.y - 18);
    ctx.fill(); ctx.stroke();
  } else if (characterState.headShape === 'robot') {
    ctx.beginPath(); ctx.rect(headPos.x - 22, headPos.y - 18, 44, 36); ctx.fill(); ctx.stroke();
    ctx.fillRect(headPos.x - 4, headPos.y - 26, 8, 8); // Antenna
  }

  // Eyes Customization
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  const eyeOffset = 8;

  if (characterState.eyeStyle === 'normal') {
    ctx.beginPath(); ctx.arc(headPos.x - eyeOffset, headPos.y - 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(headPos.x + eyeOffset, headPos.y - 2, 3, 0, Math.PI * 2); ctx.fill();
  } else if (characterState.eyeStyle === 'happy') {
    ctx.beginPath(); ctx.arc(headPos.x - eyeOffset, headPos.y, 4, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(headPos.x + eyeOffset, headPos.y, 4, Math.PI, 0); ctx.stroke();
  } else if (characterState.eyeStyle === 'surprised') {
    ctx.beginPath(); ctx.arc(headPos.x - eyeOffset, headPos.y, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(headPos.x + eyeOffset, headPos.y, 5, 0, Math.PI * 2); ctx.stroke();
  } else if (characterState.eyeStyle === 'blink') {
    ctx.beginPath(); ctx.moveTo(headPos.x - eyeOffset - 3, headPos.y); ctx.lineTo(headPos.x - eyeOffset + 3, headPos.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(headPos.x + eyeOffset - 3, headPos.y); ctx.lineTo(headPos.x + eyeOffset + 3, headPos.y); ctx.stroke();
  }

  // Arm Customization
  ctx.strokeStyle = characterState.primaryColor;
  ctx.lineWidth = characterState.armStyle === 'stick' ? 4 : (characterState.armStyle === 'segmented' ? 12 : 8);

  ctx.beginPath(); ctx.moveTo(shoulder.x, shoulder.y); ctx.lineTo(pose.elbow.x, pose.elbow.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pose.elbow.x, pose.elbow.y); ctx.lineTo(pose.wrist.x, pose.wrist.y); ctx.stroke();

  // Joints
  [shoulder, pose.elbow, pose.wrist].forEach((joint, idx) => {
    ctx.fillStyle = idx === 2 ? characterState.jointColor : '#ffffff';
    ctx.beginPath(); ctx.arc(joint.x, joint.y, characterState.armStyle === 'stick' ? 4 : 7, 0, Math.PI * 2); ctx.fill();
  });
}

function drawTarget(worldTarget) {
  ctx.strokeStyle = isDragging ? '#4ade80' : characterState.jointColor;
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.beginPath(); ctx.arc(worldTarget.x, worldTarget.y, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}

// Interaction Listeners
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left - (canvas.width / 2),
    y: e.clientY - rect.top - (canvas.height / 2 + 50)
  };
}

canvas.addEventListener('mousedown', (e) => {
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

// Customization UI Event Listeners
document.getElementById('headShape').addEventListener('change', (e) => characterState.headShape = e.target.value);
document.getElementById('eyeStyle').addEventListener('change', (e) => characterState.eyeStyle = e.target.value);
document.getElementById('armStyle').addEventListener('change', (e) => characterState.armStyle = e.target.value);
document.getElementById('primaryColor').addEventListener('input', (e) => characterState.primaryColor = e.target.value);
document.getElementById('jointColor').addEventListener('input', (e) => characterState.jointColor = e.target.value);

document.getElementById('torsoWeight').addEventListener('input', (e) => {
  torsoInfluence = parseFloat(e.target.value);
  document.getElementById('torsoVal').innerText = Math.round(torsoInfluence * 100) + '%';
});

document.getElementById('springStiffness').addEventListener('input', (e) => {
  springStiffness = parseFloat(e.target.value) / 100;
  document.getElementById('springVal').innerText = e.target.value;
});

// Video Recorder Logic (Canvas Export)
const startRecBtn = document.getElementById('startRecBtn');
const stopRecBtn = document.getElementById('stopRecBtn');
const recBadge = document.getElementById('recBadge');

startRecBtn.addEventListener('click', () => {
  const stream = canvas.captureStream(30); // 30 FPS
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character_animation_${Date.now()}.webm`;
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

// Storyboard & Keyframe Timeline System
document.getElementById('addFrameBtn').addEventListener('click', () => {
  const frameData = { ...target };
  keyframes.push(frameData);

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 90;
  thumbCanvas.height = 65;
  const tCtx = thumbCanvas.getContext('2d');

  tCtx.fillStyle = '#0f172a';
  tCtx.fillRect(0, 0, 90, 65);
  
  // Render mini target
  tCtx.fillStyle = characterState.jointColor;
  tCtx.beginPath();
  tCtx.arc(45 + frameData.x * 0.2, 35 + frameData.y * 0.2, 4, 0, Math.PI * 2);
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
  target = { x: 120, y: -20 };
});

// Start Animation Engine
animate();
