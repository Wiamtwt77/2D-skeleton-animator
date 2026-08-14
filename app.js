const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let startX = 0;
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
