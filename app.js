const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let startX = 0;
let startY = 0;
let currentW = 0;
let currentH = 0;

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
