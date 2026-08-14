const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let startX = 0;const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// ضبط أبعاد الكانفاس الحقيقية
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// حالة الشخصية المختارة
let currentType = 'robot';

document.querySelectorAll('.char-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.char-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.char;
    resetRig();
  });
});

// إحداثيات العظام والمفاصل القابلة للسحب
let rig = {};

function resetRig() {
  rig = {
    head: { x: 0, y: -90, radius: 24 },
    torso: { x: 0, y: -20 },
    hip: { x: 0, y: 35 },
    leftHand: { x: -60, y: 10, radius: 12 },
    rightHand: { x: 60, y: 10, radius: 12 },
    leftFoot: { x: -35, y: 130, radius: 12 },
    rightFoot: { x: 35, y: 130, radius: 12 }
  };
}
resetRig();

let activeJoint = null;

// خوارزمية الحركة العكسية (IK) لربط المفاصل والأطراف بسلاسة
function solveIK(origin, target, l1, l2, invert = false) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  let dist = Math.hypot(dx, dy);
  const maxDist = l1 + l2 - 0.001;
  if (dist > maxDist) dist = maxDist;
  if (dist < 10) dist = 10;

  const cosAngle = (dist * dist + l1 * l1 - l2 * l2) / (2 * dist * l1);
  const angle1 = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  const baseAngle = Math.atan2(dy, dx);
  const jointAngle = invert ? baseAngle + angle1 : baseAngle - angle1;

  return {
    x: origin.x + Math.cos(jointAngle) * l1,
    y: origin.y + Math.sin(jointAngle) * l1
  };
}

// التفاعل مع الماوس (السحب والإفلات للمفاصل)
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - (canvas.width / 2);
  const my = e.clientY - rect.top - (canvas.height / 2);

  const joints = ['head', 'leftHand', 'rightHand', 'leftFoot', 'rightFoot'];
  for (let j of joints) {
    const pos = rig[j];
    if (Math.hypot(mx - pos.x, my - pos.y) < (pos.radius || 20) + 10) {
      activeJoint = j;
      break;
    }
  }
});

window.addEventListener('mousemove', (e) => {
  if (!activeJoint) return;
  const rect = canvas.getBoundingClientRect();
  rig[activeJoint].x = e.clientX - rect.left - (canvas.width / 2);
  rig[activeJoint].y = e.clientY - rect.top - (canvas.height / 2);
});

window.addEventListener('mouseup', () => {
  activeJoint = null;
});

// حلقة الرسم المستمرة
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!canvas.width) {
    requestAnimationFrame(loop);
    return;
  }

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // مواضع الأكتاف والحوض نسبياً
  const shoulderLeft = { x: rig.torso.x - 25, y: rig.torso.y - 30 };
  const shoulderRight = { x: rig.torso.x + 25, y: rig.torso.y - 30 };
  const hipLeft = { x: rig.hip.x - 18, y: rig.hip.y };
  const hipRight = { x: rig.hip.x + 18, y: rig.hip.y };

  // حساب المفاصل الوسطى (المرفقين والركبتين)
  const leftElbow = solveIK(shoulderLeft, rig.leftHand, 55, 50, false);
  const rightElbow = solveIK(shoulderRight, rig.rightHand, 55, 50, true);
  const leftKnee = solveIK(hipLeft, rig.leftFoot, 65, 60, true);
  const rightKnee = solveIK(hipRight, rig.rightFoot, 65, 60, false);

  // ألوان الشخصيات
  const primaryColor = currentType === 'robot' ? '#38bdf8' : '#a855f7';
  const jointColor = currentType === 'robot' ? '#22c55e' : '#ec4899';

  // --- رسم العظام (الأطراف) ---
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.strokeStyle = primaryColor;

  // الذراع الأيسر
  ctx.beginPath(); ctx.moveTo(shoulderLeft.x, shoulderLeft.y); ctx.lineTo(leftElbow.x, leftElbow.y); ctx.lineTo(rig.leftHand.x, rig.leftHand.y); ctx.stroke();
  // الذراع الأيمن
  ctx.beginPath(); ctx.moveTo(shoulderRight.x, shoulderRight.y); ctx.lineTo(rightElbow.x, rightElbow.y); ctx.lineTo(rig.rightHand.x, rig.rightHand.y); ctx.stroke();
  // الرجل اليسرى
  ctx.beginPath(); ctx.moveTo(hipLeft.x, hipLeft.y); ctx.lineTo(leftKnee.x, leftKnee.y); ctx.lineTo(rig.leftFoot.x, rig.leftFoot.y); ctx.stroke();
  // الرجل اليمنى
  ctx.beginPath(); ctx.moveTo(hipRight.x, hipRight.y); ctx.lineTo(rightKnee.x, rightKnee.y); ctx.lineTo(rig.rightFoot.x, rig.rightFoot.y); ctx.stroke();

  // --- رسم الجذع ---
  ctx.lineWidth = 30;
  ctx.strokeStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(rig.hip.x, rig.hip.y);
  ctx.lineTo(rig.torso.x, rig.torso.y);
  ctx.stroke();

  // --- رسم الرأس ---
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(rig.head.x, rig.head.y, rig.head.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#fff';
  ctx.stroke();

  // عيون الشخصية
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(rig.head.x - 8, rig.head.y - 3, 4, 0, Math.PI * 2);
  ctx.arc(rig.head.x + 8, rig.head.y - 3, 4, 0, Math.PI * 2);
  ctx.fill();

  // --- رسم مفاصل التحكم الظاهرة (تظهر للمستخدم ليعرف أماكن السحب) ---
  const handles = [rig.head, rig.leftHand, rig.rightHand, rig.leftFoot, rig.rightFoot];
  handles.forEach(h => {
    ctx.fillStyle = jointColor;
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.radius || 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  });

  ctx.restore();
  requestAnimationFrame(loop);
}

loop();
let startY = 0;
let currentW = 0;
let currentH = 0;
// 1. حالة التطبيق
let currentShape = 'circle';
let currentColor = '#38bdf8';
const shapesHistory = []; // تخزين الأشكال التي تم إنشاؤها

// حالة السحب والإنشاء
let isDrawing = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

// 2. العناصر الأساسية
const canvas = document.getElementById('builderCanvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('shapeColor');
const shapeButtons = document.querySelectorAll('.shape-btn');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');

// 3. ضبط أبعاد الكانفاس تلقائياً
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  redrawAll();
}

// 4. أزرار اختيار الأشكال واللون
shapeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    shapeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentShape = btn.dataset.shape;
  });
});

colorInput.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

// 5. أحداث الماوس لإنشاء الأشكال عبر السحب
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  currentX = startX;
  currentY = startY;
  isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  currentX = e.clientX - rect.left;
  currentY = e.clientY - rect.top;
  
  redrawAll();
  // رسم المعاينة اللحظية للشكل أثناء السحب
  drawSingleShape({
    type: currentShape,
    color: currentColor,
    x1: startX,
    y1: startY,
    x2: currentX,
    y2: currentY,
    isPreview: true
  });
});

canvas.addEventListener('mouseup', () => {
  if (!isDrawing) return;
  isDrawing = false;

  // تجاهل الأشكال الصغيرة جداً الناتجة عن النقرات السريعة غير المقصودة
  const dist = Math.hypot(currentX - startX, currentY - startY);
  if (dist > 5) {
    shapesHistory.push({
      type: currentShape,
      color: currentColor,
      x1: startX,
      y1: startY,
      x2: currentX,
      y2: currentY
    });
  }
  redrawAll();
});

// 6. دالة إعادة رسم الكانفاس بالكامل
function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // رسم جميع الأشكال المخزنة
  shapesHistory.forEach(shape => drawSingleShape(shape));
}

// 7. دالة رسم شكل واحد
function drawSingleShape(shape) {
  const { type, color, x1, y1, x2, y2, isPreview } = shape;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = isPreview ? '#ffffff' : color;
  ctx.lineWidth = isPreview ? 2 : 1;

  if (isPreview) {
    ctx.setLineDash([6, 6]); // خط مقطع أثناء المعاينة
  }

  const width = x2 - x1;
  const height = y2 - y1;
  const cx = x1 + width / 2;
  const cy = y1 + height / 2;
  const rx = Math.abs(width / 2);
  const ry = Math.abs(height / 2);

  ctx.beginPath();

  if (type === 'rect') {
    ctx.rect(x1, y1, width, height);
  } 
  else if (type === 'circle') {
    // رسم بيضاوي/دائري بناءً على مدى السحب
    ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
  } 
  else if (type === 'triangle') {
    ctx.moveTo(cx, y1);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x2, y2);
    ctx.closePath();
  } 
  else if (type === 'star') {
    const outerRadius = Math.max(rx, ry);
    const innerRadius = outerRadius / 2;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 === 0) ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  ctx.fill();
  if (isPreview) ctx.stroke();
  ctx.restore();
}

// 8. أدوات التحكم (التراجع والمسح)
undoBtn.addEventListener('click', undoLast);
clearBtn.addEventListener('click', () => {
  shapesHistory.length = 0;
  redrawAll();
});

function undoLast() {
  shapesHistory.pop();
  redrawAll();
}

// اختصار لوحة المفاتيح (Ctrl + Z)
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    undoLast();
  }
});

// الأحداث عند التحميل وتغيير الحجم
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => setTimeout(resizeCanvas, 50));
// 1. عند ضغط زر الماوس
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;
});

// 2. أثناء سحب الماوس
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    currentW = currentX - startX;
    currentH = currentY - startY;

    // إعادة رسم الشاشة لإظهار الشكل أثناء السحب
    draw(); 
});

// 3. عند ترك زر الماوس
canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        // هنا يمكنك حفظ أبعاد وموقع الشخصية الجديدة في مصفوفة (Array) للعبة
        console.log(`تم إنشاء الشخصية في: X:${startX}, Y:${startY}, W:${currentW}, H:${currentH}`);
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // مسح الإطار السابق

    // رسم مربع المعاينة أثناء السحب
    if (isDragging) {
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, currentW, currentH);
    }
}
