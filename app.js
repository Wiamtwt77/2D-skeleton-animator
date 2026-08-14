const canvas = document.getElementById('animCanvas');
const ctx = canvas.getContext('2d');

// تعريف الشخصيات وقوالب الألوان (Multi-Character Registry)
const charactersData = {
    nova: {
        name: 'Nova',
        skin: '#fcd34d',
        hoodie: '#1e3a8a',
        hoodieDark: '#1e326e',
        pants: '#d4d4d8',
        shoes: '#db2777',
        hair: '#ea580c'
    },
    cyber: {
        name: 'Cyber Boy',
        skin: '#38bdf8',
        hoodie: '#065f46',
        hoodieDark: '#047857',
        pants: '#334155',
        shoes: '#eab308',
        hair: '#a855f7'
    }
};

let activeCharacterKey = 'nova';
let currentExpression = 'normal';

// الهيكل العظمي متعدد المفاصل وشجرة العظام (Bone Hierarchy)
const char = {
    root: { x: 400, y: 320, radius: 25 }, // الحوض (مركز الثقل)
    spine: { length: 50, angle: 0 },
    neck: { length: 30, angle: 0 },
    limbs: [
        { id: 'leftArm', type: 'arm', side: 'back', startX: -25, startY: -70, l1: 65, l2: 60, flip: -1, target: {x: 280, y: 240} },
        { id: 'leftLeg', type: 'leg', side: 'back', startX: -15, startY: 10, l1: 75, l2: 70, flip: 1, target: {x: 340, y: 500} },
        { id: 'rightLeg', type: 'leg', side: 'front', startX: 15, startY: 10, l1: 75, l2: 70, flip: 1, target: {x: 460, y: 500} },
        { id: 'rightArm', type: 'arm', side: 'front', startX: 25, startY: -70, l1: 65, l2: 60, flip: -1, target: {x: 520, y: 240} }
    ]
};

let activeNode = null;
let keyframes = [];
let isPlaying = false;
let animProgress = 0;
let currentFrameIndex = 0;
let time = 0;

// حل الكينماتيكا العكسية (IK)
function solveIK(startX, startY, targetX, targetY, l1, l2, flip) {
    let dx = targetX - startX;
    let dy = targetY - startY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > l1 + l2) dist = l1 + l2 - 0.001;

    let angle2 = Math.acos((dist * dist - l1 * l1 - l2 * l2) / (2 * l1 * l2)) * flip;
    let angle1 = Math.atan2(dy, dx) - Math.atan2(l2 * Math.sin(angle2), l1 + l2 * Math.cos(angle2));
    return { angle1, angle2 };
}

// رسم عناصر الشخصية مع الحفاظ على مواجهة الوجه وثبات المنظور (Facing & Anti-Distortion Logic)
function drawCharacter() {
    let cTheme = charactersData[activeCharacterKey];
    let sx = char.root.x;
    let sy = char.root.y;

    // 1. الأطراف الخلفية
    char.limbs.filter(l => l.side === 'back').forEach(limb => drawLimb(limb, cTheme));

    // 2. الجذع والعمود الفقري
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy - 80);
    ctx.lineWidth = 40;
    ctx.strokeStyle = cTheme.hoodie;
    ctx.stroke();

    // 3. الرأس وملامح الوجه الثابتة (منع الاعوجاج)
    let headX = sx;
    let headY = sy - 120;
    
    // الرأس
    ctx.beginPath();
    ctx.arc(headX, headY, 45, 0, Math.PI * 2);
    ctx.fillStyle = cTheme.skin;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#09090b';
    ctx.stroke();

    // نظام تعابير الوجه المدولبة (Modular Expressions)
    drawFacialExpressions(headX, headY, currentExpression);

    // 4. الأطراف الأمامية
    char.limbs.filter(l => l.side === 'front').forEach(limb => drawLimb(limb, cTheme));

    // مركز التحكم (الحوض)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.beginPath(); ctx.arc(sx, sy, 15, 0, Math.PI * 2); ctx.fill();
}

function drawLimb(limb, theme) {
    let sx = char.root.x + limb.startX;
    let sy = char.root.y + limb.startY;
    let { angle1, angle2 } = solveIK(sx, sy, limb.target.x, limb.target.y, limb.l1, limb.l2, limb.flip);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle1);

    ctx.lineWidth = limb.type === 'arm' ? 16 : 18;
    ctx.strokeStyle = limb.side === 'front' ? theme.hoodie : theme.hoodieDark;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(limb.l1, 0);
    ctx.stroke();

    ctx.translate(limb.l1, 0);
    ctx.rotate(angle2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(limb.l2, 0);
    ctx.stroke();

    ctx.restore();

    // مقبض التحكم بالطرف
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.beginPath(); ctx.arc(limb.target.x, limb.target.y, 12, 0, Math.PI * 2); ctx.fill();
}

// رسم تعابير الوجه المدولبة
function drawFacialExpressions(hx, hy, expr) {
    ctx.fillStyle = '#09090b';
    
    // العيون الافتراضية
    let blink = Math.random() > 0.98 ? 2 : 8;
    ctx.beginPath(); ctx.ellipse(hx - 12, hy - 5, 4, blink, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 12, hy - 5, 4, blink, 0, 0, Math.PI * 2); ctx.fill();

    // تعديل بناءً على التعبير
    if (expr === 'happy') {
        ctx.beginPath(); ctx.arc(hx, hy + 12, 10, 0, Math.PI); ctx.stroke(); // ابتسامة عريضة
    } else if (expr === 'angry') {
        ctx.strokeStyle = '#09090b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hx - 20, hy - 15); ctx.lineTo(hx - 5, hy - 10); ctx.stroke(); // حواجب غاضبة
        ctx.beginPath(); ctx.moveTo(hx + 20, hy - 15); ctx.lineTo(hx + 5, hy - 10); ctx.stroke();
    } else if (expr === 'shocked') {
        ctx.beginPath(); ctx.arc(hx, hy + 12, 6, 0, Math.PI * 2); ctx.fill(); // فم مفتوح من الصدمة
    } else {
        // العادي
        ctx.beginPath(); ctx.arc(hx, hy + 10, 6, 0.1, Math.PI - 0.1); ctx.stroke();
    }
}

// التحديث والتحريك
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isPlaying && !activeNode) {
        time += 0.05;
        char.root.y += Math.sin(time) * 0.2; // تنفس خفيف
    } else if (isPlaying && keyframes.length > 1) {
        let fA = keyframes[currentFrameIndex];
        let fB = keyframes[(currentFrameIndex + 1) % keyframes.length];
        
        animProgress += 0.03;
        let t = animProgress < 0.5 ? 2 * animProgress * animProgress : 1 - Math.pow(-2 * animProgress + 2, 3) / 2; // Easing

        // استيفاء مواقع الأهداف (Lerp)
        for (let i = 0; i < char.limbs.length; i++) {
            char.limbs[i].target.x = fA.limbs[i].x + (fB.limbs[i].x - fA.limbs[i].x) * t;
            char.limbs[i].target.y = fA.limbs[i].y + (fB.limbs[i].y - fA.limbs[i].y) * t;
        }

        if (animProgress >= 1) {
            animProgress = 0;
            currentFrameIndex++;
            if (currentFrameIndex >= keyframes.length - 1) isPlaying = false;
        }
    }

    drawCharacter();
    requestAnimationFrame(render);
}

// واجهة التحكم وتغيير الشخصيات والتعابير
function changeCharacter(key) { activeCharacterKey = key; }
function changeExpression(expr) { currentExpression = expr; }

// إدارة التايملاين والمشاهد (Keyframes)
function saveKeyframe() {
    let frameData = {
        limbs: char.limbs.map(l => ({ x: l.target.x, y: l.target.y }))
    };
    keyframes.push(frameData);
    updateTimelineUI();
}

function clearKeyframes() {
    keyframes = [];
    updateTimelineUI();
}

function playAnimation() {
    if (keyframes.length < 2) return alert("أضف مشهدين على الأقل للتشغيل!");
    isPlaying = true;
    animProgress = 0;
    currentFrameIndex = 0;
}

function updateTimelineUI() {
    const track = document.getElementById('timelineTrack');
    document.getElementById('frameCounter').innerText = `المشاهد المحفوظة: ${keyframes.length}`;
    track.innerHTML = '';
    keyframes.forEach((_, idx) => {
        let node = document.createElement('div');
        node.className = 'keyframe-node';
        node.innerText = idx + 1;
        track.appendChild(node);
    });
}

// نظام التصدير والاستيراد (JSON)
function saveProject() {
    let projectData = { character: activeCharacterKey, keyframes: keyframes };
    let blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'json' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nova-animation-project.json';
    a.click();
}

function loadProjectPrompt() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = event => {
            let data = JSON.parse(event.target.result);
            activeCharacterKey = data.character;
            document.getElementById('charSelect').value = data.character;
            keyframes = data.keyframes;
            updateTimelineUI();
        };
        reader.readAsText(file);
    };
    input.click();
}

// التفاعل بالسحب (Mouse / Touch)
let getPos = e => {
    let r = canvas.getBoundingClientRect();
    let cx = e.touches ? e.touches[0].clientX : e.clientX;
    let cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - r.left, y: cy - r.top };
};

canvas.addEventListener('mousedown', e => {
    let p = getPos(e);
    if (Math.hypot(p.x - char.root.x, p.y - char.root.y) < 30) { activeNode = char.root; return; }
    for (let l of char.limbs) {
        if (Math.hypot(p.x - l.target.x, p.y - l.target.y) < 20) { activeNode = l.target; return; }
    }
});

window.addEventListener('mousemove', e => {
    if (!activeNode) return;
    let p = getPos(e);
    activeNode.x = p.x;
    activeNode.y = p.y;
});

window.addEventListener('mouseup', () => activeNode = null);

render();
