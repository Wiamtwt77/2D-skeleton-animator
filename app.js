// 1. حالة الشخصية (بيانات التصميم)
const character = {
  headShape: 'circle',
  eyeStyle: 'happy',
  primaryColor: '#38bdf8',
  jointColor: '#22c55e'
};

// 2. إعداد الكانفاس
const canvas = document.getElementById('characterCanvas');
const ctx = canvas.getContext('2d');

// دالة ضبط أبعاد الكانفاس الحقيقية لمنع التشوه واختفاء الرسم
function fitCanvasSize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  drawCharacter(); // إعادة الرسم فور ضبط الحجم
}

// 3. دالة رسم الشخصية الرئيسية
function drawCharacter() {
  if (!canvas.width || !canvas.height) return;

  // مسح الشاشة
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // نقطة المنتصف
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // --- أ) رسم الجذع (الجسم) ---
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 30);
  ctx.lineTo(cx, cy + 60);
  ctx.stroke();

  // --- ب) رسم الأذرع ---
  ctx.strokeStyle = character.primaryColor;
  ctx.lineWidth = 6;

  // الذراع الأيسر
  ctx.beginPath();
  ctx.moveTo(cx, cy - 20);
  ctx.lineTo(cx - 50, cy + 20);
  ctx.stroke();

  // الذراع الأيمن
  ctx.beginPath();
  ctx.moveTo(cx, cy - 20);
  ctx.lineTo(cx + 50, cy + 20);
  ctx.stroke();

  // --- ج) رسم الأرجل ---
  // الرجل اليسرى
  ctx.beginPath();
  ctx.moveTo(cx, cy + 60);
  ctx.lineTo(cx - 30, cy + 130);
  ctx.stroke();

  // الرجل اليمنى
  ctx.beginPath();
  ctx.moveTo(cx, cy + 60);
  ctx.lineTo(cx + 30, cy + 130);
  ctx.stroke();

  // --- د) رسم المفاصل ---
  ctx.fillStyle = character.jointColor;
  const joints = [
    { x: cx - 50, y: cy + 20 }, // كف أيسر
    { x: cx + 50, y: cy + 20 }, // كف أيمن
    { x: cx - 30, y: cy + 130 }, // قدم يسرى
    { x: cx + 30, y: cy + 130 }  // قدم يمنى
  ];
  joints.forEach(j => {
    ctx.beginPath();
    ctx.arc(j.x, j.y, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // --- هـ) رسم الرأس ---
  const headY = cy - 70;
  ctx.fillStyle = character.primaryColor;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  if (character.headShape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, headY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (character.headShape === 'square') {
    ctx.beginPath();
    ctx.rect(cx - 30, headY - 30, 60, 60);
    ctx.fill();
    ctx.stroke();
  } else if (character.headShape === 'cat') {
    ctx.beginPath();
    ctx.arc(cx, headY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // أذنين القطة
    ctx.beginPath();
    ctx.moveTo(cx - 25, headY - 15); ctx.lineTo(cx - 35, headY - 45); ctx.lineTo(cx - 10, headY - 28);
    ctx.moveTo(cx + 25, headY - 15); ctx.lineTo(cx + 35, headY - 45); ctx.lineTo(cx + 10, headY - 28);
    ctx.fill();
    ctx.stroke();
  } else if (character.headShape === 'robot') {
    ctx.beginPath();
    ctx.rect(cx - 35, headY - 25, 70, 50);
    ctx.fill();
    ctx.stroke();
    // هوائي الروبوت
    ctx.fillRect(cx - 4, headY - 40, 8, 15);
  }

  // --- و) رسم العينين ---
  ctx.strokeStyle = '#0f172a';
  ctx.fillStyle = '#0f172a';
  ctx.lineWidth = 3;

  if (character.eyeStyle === 'happy') {
    ctx.beginPath(); ctx.arc(cx - 12, headY - 5, 6, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 12, headY - 5, 6, Math.PI, 0); ctx.stroke();
  } else if (character.eyeStyle === 'normal') {
    ctx.beginPath(); ctx.arc(cx - 12, headY - 5, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 12, headY - 5, 4, 0, Math.PI * 2); ctx.fill();
  } else if (character.eyeStyle === 'surprised') {
    ctx.beginPath(); ctx.arc(cx - 12, headY - 5, 7, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 12, headY - 5, 7, 0, Math.PI * 2); ctx.stroke();
  }
}

// 4. ربط القوائم والألوان بالحالة وبدء الرسم اللحظي
document.getElementById('headShape').addEventListener('change', (e) => {
  character.headShape = e.target.value;
  drawCharacter();
});

document.getElementById('eyeStyle').addEventListener('change', (e) => {
  character.eyeStyle = e.target.value;
  drawCharacter();
});

document.getElementById('primaryColor').addEventListener('input', (e) => {
  character.primaryColor = e.target.value;
  drawCharacter();
});

document.getElementById('jointColor').addEventListener('input', (e) => {
  character.jointColor = e.target.value;
  drawCharacter();
});

// 5. أحداث تحميل الصفحة وتغيير حجم الشاشة
window.addEventListener('resize', fitCanvasSize);
window.addEventListener('load', () => {
  // استخدام التوقيت لضمان قراءة المتصفح للأبعاد بدقة
  setTimeout(fitCanvasSize, 50);
});
