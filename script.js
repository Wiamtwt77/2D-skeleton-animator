const characters = {
    human: {
        name: 'الإنسان',
        bones: [
            { id: 'root', label: 'الجذع', min: -10, max: 10, default: 0, pivot: [200, 280] },
            { id: 'head', label: 'الرأس', min: -45, max: 45, default: 0, pivot: [200, 140] },
            { id: 'armL_upper', label: 'الذراع اليسرى العلوية', min: -160, max: 60, default: -10, pivot: [155, 190] },
            { id: 'armL_lower', label: 'الذراع اليسرى السفلية', min: -130, max: 0, default: -20, pivot: [120, 260] },
            { id: 'armR_upper', label: 'الذراع اليمنى العلوية', min: -60, max: 160, default: 10, pivot: [245, 190] },
            { id: 'armR_lower', label: 'الذراع اليمنى السفلية', min: 0, max: 130, default: 20, pivot: [280, 260] },
            { id: 'legL_upper', label: 'الرجل اليسرى العلوية', min: -80, max: 45, default: 5, pivot: [175, 310] },
            { id: 'legL_lower', label: 'الرجل اليسرى السفلية', min: 0, max: 130, default: 5, pivot: [165, 390] },
            { id: 'legR_upper', label: 'الرجل اليمنى العلوية', min: -45, max: 80, default: -5, pivot: [225, 310] },
            { id: 'legR_lower', label: 'الرجل اليمنى السفلية', min: 0, max: 130, default: -5, pivot: [235, 390] },
        ],
        svg: (bones) => \`
<g class="character-root" id="bone-root" transform="rotate(\${bones.root},200,280)">
    <!-- الجذع -->
    <rect x="170" y="180" width="60" height="130" rx="20" fill="#fca5a5" stroke="#f87171" stroke-width="3"/>
    <circle cx="200" cy="180" r="8" fill="#f87171" opacity="0.5"/>

    <!-- الرأس -->
    <g id="bone-head" transform="rotate(\${bones.head},200,140)">
        <circle cx="200" cy="120" r="45" fill="#fecaca" stroke="#f87171" stroke-width="3"/>
        <circle cx="185" cy="110" r="5" fill="#1e293b"/>
        <circle cx="215" cy="110" r="5" fill="#1e293b"/>
        <path d="M 185 135 Q 200 150 215 135" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
        <circle cx="200" cy="140" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الذراع اليسرى -->
    <g id="bone-armL_upper" transform="rotate(\${bones.armL_upper},155,190)">
        <rect x="135" y="185" width="20" height="70" rx="10" fill="#fecaca" stroke="#f87171" stroke-width="2"/>
        <circle cx="145" cy="255" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
        <g id="bone-armL_lower" transform="rotate(\${bones.armL_lower},145,255)">
            <rect x="135" y="255" width="18" height="60" rx="9" fill="#fecaca" stroke="#f87171" stroke-width="2"/>
            <circle cx="144" cy="315" r="12" fill="#fca5a5" stroke="#f87171" stroke-width="2"/>
        </g>
    </g>

    <!-- الذراع اليمنى -->
    <g id="bone-armR_upper" transform="rotate(\${bones.armR_upper},245,190)">
        <rect x="245" y="185" width="20" height="70" rx="10" fill="#fecaca" stroke="#f87171" stroke-width="2"/>
        <circle cx="255" cy="255" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
        <g id="bone-armR_lower" transform="rotate(\${bones.armR_lower},255,255)">
            <rect x="247" y="255" width="18" height="60" rx="9" fill="#fecaca" stroke="#f87171" stroke-width="2"/>
            <circle cx="256" cy="315" r="12" fill="#fca5a5" stroke="#f87171" stroke-width="2"/>
        </g>
    </g>

    <!-- الرجل اليسرى -->
    <g id="bone-legL_upper" transform="rotate(\${bones.legL_upper},175,310)">
        <rect x="162" y="310" width="22" height="80" rx="11" fill="#93c5fd" stroke="#60a5fa" stroke-width="2"/>
        <circle cx="173" cy="390" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
        <g id="bone-legL_lower" transform="rotate(\${bones.legL_lower},173,390)">
            <rect x="164" y="390" width="20" height="70" rx="10" fill="#93c5fd" stroke="#60a5fa" stroke-width="2"/>
            <ellipse cx="174" cy="460" rx="18" ry="10" fill="#475569" stroke="#334155" stroke-width="2"/>
        </g>
    </g>

    <!-- الرجل اليمنى -->
    <g id="bone-legR_upper" transform="rotate(\${bones.legR_upper},225,310)">
        <rect x="216" y="310" width="22" height="80" rx="11" fill="#93c5fd" stroke="#60a5fa" stroke-width="2"/>
        <circle cx="227" cy="390" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
        <g id="bone-legR_lower" transform="rotate(\${bones.legR_lower},227,390)">
            <rect x="216" y="390" width="20" height="70" rx="10" fill="#93c5fd" stroke="#60a5fa" stroke-width="2"/>
            <ellipse cx="226" cy="460" rx="18" ry="10" fill="#475569" stroke="#334155" stroke-width="2"/>
        </g>
    </g>
</g>
\`,
    },

    robot: {
        name: 'الروبوت',
        bones: [
            { id: 'root', label: 'الجذع', min: -15, max: 15, default: 0, pivot: [200, 280] },
            { id: 'head', label: 'الرأس', min: -60, max: 60, default: 0, pivot: [200, 130] },
            { id: 'armL_upper', label: 'الذراع اليسرى العلوية', min: -150, max: 60, default: -15, pivot: [150, 200] },
            { id: 'armL_lower', label: 'الذراع اليسرى السفلية', min: -120, max: 0, default: -30, pivot: [110, 270] },
            { id: 'armR_upper', label: 'الذراع اليمنى العلوية', min: -60, max: 150, default: 15, pivot: [250, 200] },
            { id: 'armR_lower', label: 'الذراع اليمنى السفلية', min: 0, max: 120, default: 30, pivot: [290, 270] },
            { id: 'legL', label: 'الرجل اليسرى', min: -30, max: 30, default: 0, pivot: [175, 340] },
            { id: 'legR', label: 'الرجل اليمنى', min: -30, max: 30, default: 0, pivot: [225, 340] },
        ],
        svg: (bones) => \`
<g class="character-root" id="bone-root" transform="rotate(\${bones.root},200,280)">
    <!-- هوائي -->
    <line x1="200" y1="85" x2="200" y2="40" stroke="#94a3b8" stroke-width="3"/>
    <circle cx="200" cy="35" r="5" fill="#ef4444"/>

    <!-- الرأس -->
    <g id="bone-head" transform="rotate(\${bones.head},200,130)">
        <rect x="160" y="85" width="80" height="70" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
        <rect x="170" y="100" width="25" height="18" rx="4" fill="#0ea5e9"/>
        <rect x="205" y="100" width="25" height="18" rx="4" fill="#0ea5e9"/>
        <rect x="185" y="130" width="30" height="8" rx="2" fill="#64748b"/>
        <circle cx="200" cy="120" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الجذع -->
    <rect x="155" y="160" width="90" height="110" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
    <rect x="170" y="180" width="60" height="50" rx="5" fill="#475569"/>
    <circle cx="185" cy="205" r="6" fill="#22c55e"/>
    <circle cx="200" cy="205" r="6" fill="#eab308"/>
    <circle cx="215" cy="205" r="6" fill="#ef4444"/>

    <!-- الذراع اليسرى -->
    <g id="bone-armL_upper" transform="rotate(\${bones.armL_upper},150,200)">
        <rect x="125" y="190" width="25" height="60" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
        <circle cx="110" cy="250" r="8" fill="#64748b"/>
        <circle cx="110" cy="250" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
        <g id="bone-armL_lower" transform="rotate(\${bones.armL_lower},110,270)">
            <rect x="98" y="250" width="24" height="55" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
            <rect x="93" y="305" width="34" height="25" rx="4" fill="#64748b" stroke="#475569" stroke-width="2"/>
        </g>
    </g>

    <!-- الذراع اليمنى -->
    <g id="bone-armR_upper" transform="rotate(\${bones.armR_upper},250,200)">
        <rect x="250" y="190" width="25" height="60" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
        <circle cx="290" cy="250" r="8" fill="#64748b"/>
        <circle cx="290" cy="250" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
        <g id="bone-armR_lower" transform="rotate(\${bones.armR_lower},290,270)">
            <rect x="278" y="250" width="24" height="55" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
            <rect x="273" y="305" width="34" height="25" rx="4" fill="#64748b" stroke="#475569" stroke-width="2"/>
        </g>
    </g>

    <!-- الرجل اليسرى -->
    <g id="bone-legL" transform="rotate(\${bones.legL},175,340)">
        <rect x="158" y="270" width="34" height="80" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
        <rect x="150" y="350" width="50" height="20" rx="4" fill="#475569" stroke="#334155" stroke-width="2"/>
        <circle cx="175" cy="340" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الرجل اليمنى -->
    <g id="bone-legR" transform="rotate(\${bones.legR},225,340)">
        <rect x="208" y="270" width="34" height="80" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
        <rect x="200" y="350" width="50" height="20" rx="4" fill="#475569" stroke="#334155" stroke-width="2"/>
        <circle cx="225" cy="340" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>
</g>
\`,
    },

    cat: {
        name: 'القط',
        bones: [
            { id: 'root', label: 'الجذع', min: -15, max: 15, default: 0, pivot: [200, 280] },
            { id: 'head', label: 'الرأس', min: -50, max: 50, default: 0, pivot: [200, 170] },
            { id: 'tail', label: 'الذيل', min: -40, max: 40, default: 0, pivot: [200, 330] },
            { id: 'legFL', label: 'الرجل الأمامية اليسرى', min: -30, max: 60, default: 0, pivot: [165, 300] },
            { id: 'legFR', label: 'الرجل الأمامية اليمنى', min: -60, max: 30, default: 0, pivot: [235, 300] },
            { id: 'legBL', label: 'الرجل الخلفية اليسرى', min: -30, max: 45, default: 10, pivot: [165, 340] },
            { id: 'legBR', label: 'الرجل الخلفية اليمنى', min: -45, max: 30, default: -10, pivot: [235, 340] },
        ],
        svg: (bones) => \`
<g class="character-root" id="bone-root" transform="rotate(\${bones.root},200,280)">
    <!-- الذيل -->
    <g id="bone-tail" transform="rotate(\${bones.tail},200,330)">
        <path d="M 200 330 Q 200 380 200 420" fill="none" stroke="#f97316" stroke-width="12" stroke-linecap="round"/>
        <path d="M 200 330 Q 200 380 200 420" fill="none" stroke="#fb923c" stroke-width="8" stroke-linecap="round"/>
        <circle cx="200" cy="330" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الجذع -->
    <ellipse cx="200" cy="280" rx="55" ry="45" fill="#fb923c" stroke="#f97316" stroke-width="3"/>
    <ellipse cx="200" cy="280" rx="35" ry="30" fill="#fdba74" opacity="0.6"/>

    <!-- الرجل الأمامية اليسرى -->
    <g id="bone-legFL" transform="rotate(\${bones.legFL},165,300)">
        <rect x="155" y="295" width="16" height="50" rx="8" fill="#fb923c" stroke="#f97316" stroke-width="2"/>
        <ellipse cx="163" cy="345" rx="12" ry="8" fill="#fff" stroke="#f97316" stroke-width="2"/>
        <circle cx="163" cy="300" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الرجل الأمامية اليمنى -->
    <g id="bone-legFR" transform="rotate(\${bones.legFR},235,300)">
        <rect x="229" y="295" width="16" height="50" rx="8" fill="#fb923c" stroke="#f97316" stroke-width="2"/>
        <ellipse cx="237" cy="345" rx="12" ry="8" fill="#fff" stroke="#f97316" stroke-width="2"/>
        <circle cx="237" cy="300" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الرجل الخلفية اليسرى -->
    <g id="bone-legBL" transform="rotate(\${bones.legBL},165,340)">
        <rect x="155" y="335" width="18" height="45" rx="9" fill="#fb923c" stroke="#f97316" stroke-width="2"/>
        <ellipse cx="164" cy="380" rx="14" ry="9" fill="#fff" stroke="#f97316" stroke-width="2"/>
        <circle cx="165" cy="340" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الرجل الخلفية اليمنى -->
    <g id="bone-legBR" transform="rotate(\${bones.legBR},235,340)">
        <rect x="227" y="335" width="18" height="45" rx="9" fill="#fb923c" stroke="#f97316" stroke-width="2"/>
        <ellipse cx="236" cy="380" rx="14" ry="9" fill="#fff" stroke="#f97316" stroke-width="2"/>
        <circle cx="235" cy="340" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>

    <!-- الرأس -->
    <g id="bone-head" transform="rotate(\${bones.head},200,170)">
        <!-- الأذنين -->
        <path d="M 165 145 L 155 110 L 185 130 Z" fill="#fb923c" stroke="#f97316" stroke-width="2"/>
        <path d="M 235 145 L 245 110 L 215 130 Z" fill="#fb923c" stroke="#f97316" stroke-width="2"/>
        <path d="M 168 140 L 162 120 L 180 132 Z" fill="#fda4af"/>
        <path d="M 232 140 L 238 120 L 220 132 Z" fill="#fda4af"/>

        <!-- الوجه -->
        <ellipse cx="200" cy="160" rx="45" ry="38" fill="#fb923c" stroke="#f97316" stroke-width="3"/>
        <ellipse cx="200" cy="175" rx="20" ry="14" fill="#fff" opacity="0.8"/>

        <!-- العينين -->
        <ellipse cx="185" cy="150" rx="8" ry="10" fill="#1e293b"/>
        <ellipse cx="215" cy="150" rx="8" ry="10" fill="#1e293b"/>
        <circle cx="187" cy="147" r="3" fill="#fff"/>
        <circle cx="217" cy="147" r="3" fill="#fff"/>

        <!-- الأنف -->
        <path d="M 195 168 L 205 168 L 200 175 Z" fill="#f43f5e"/>

        <!-- الفم -->
        <path d="M 192 178 Q 200 185 208 178" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>

        <!-- الشوارب -->
        <line x1="160" y1="165" x2="130" y2="160" stroke="#1e293b" stroke-width="1.5"/>
        <line x1="160" y1="172" x2="130" y2="175" stroke="#1e293b" stroke-width="1.5"/>
        <line x1="240" y1="165" x2="270" y2="160" stroke="#1e293b" stroke-width="1.5"/>
        <line x1="240" y1="172" x2="270" y2="175" stroke="#1e293b" stroke-width="1.5"/>

        <circle cx="200" cy="170" r="4" fill="var(--accent)" class="bone-joint joint-indicator"/>
    </g>
</g>
\`,
    }
};

let currentChar = 'human';
let boneValues = {};

function init() {
    loadCharacter('human');
    setupCharacterButtons();
    setupActions();
}

function loadCharacter(charKey) {
    currentChar = charKey;
    const char = characters[charKey];
    boneValues = {};

    char.bones.forEach(bone => {
        boneValues[bone.id] = bone.default;
    });

    renderSVG();
    renderControls();
    highlightCharacterButton(charKey);
}

function renderSVG() {
    const svg = document.getElementById('stage-svg');
    const char = characters[currentChar];
    svg.innerHTML = char.svg(boneValues);
}

function renderControls() {
    const container = document.getElementById('bones-controls');
    const char = characters[currentChar];

    container.innerHTML = char.bones.map(bone => \`
        <div class="bone-control" data-bone="\${bone.id}">
            <label>
                <span>\${bone.label}</span>
                <span id="val-\${bone.id}">\${bone.default}°</span>
            </label>
            <input 
                type="range" 
                id="slider-\${bone.id}" 
                min="\${bone.min}" 
                max="\${bone.max}" 
                value="\${boneValues[bone.id]}"
                data-bone="\${bone.id}"
            >
        </div>
    \`).join('');

    container.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const boneId = e.target.dataset.bone;
            const value = parseInt(e.target.value);
            boneValues[boneId] = value;
            document.getElementById(\`val-\${boneId}\`).textContent = value + '°';
            updateBoneTransform(boneId, value);
        });
    });
}

function updateBoneTransform(boneId, angle) {
    const boneEl = document.getElementById(\`bone-\${boneId}\`);
    if (!boneEl) return;

    const char = characters[currentChar];
    const bone = char.bones.find(b => b.id === boneId);
    if (!bone) return;

    const [cx, cy] = bone.pivot;
    boneEl.setAttribute('transform', \`rotate(\${angle},\${cx},\${cy})\`);
}

function setupCharacterButtons() {
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const charKey = btn.dataset.char;
            loadCharacter(charKey);
        });
    });
}

function highlightCharacterButton(charKey) {
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.char === charKey);
    });
}

function setupActions() {
    document.getElementById('reset-pose').addEventListener('click', () => {
        const char = characters[currentChar];
        char.bones.forEach(bone => {
            boneValues[bone.id] = bone.default;
            const slider = document.getElementById(\`slider-\${bone.id}\`);
            if (slider) {
                slider.value = bone.default;
                document.getElementById(\`val-\${bone.id}\`).textContent = bone.default + '°';
            }
            updateBoneTransform(bone.id, bone.default);
        });
    });

    document.getElementById('random-pose').addEventListener('click', () => {
        const char = characters[currentChar];
        char.bones.forEach(bone => {
            const range = bone.max - bone.min;
            const randomVal = Math.round(bone.min + Math.random() * range);
            boneValues[bone.id] = randomVal;
            const slider = document.getElementById(\`slider-\${bone.id}\`);
            if (slider) {
                slider.value = randomVal;
                document.getElementById(\`val-\${bone.id}\`).textContent = randomVal + '°';
            }
            updateBoneTransform(bone.id, randomVal);
        });
    });
}

document.addEventListener('DOMContentLoaded', init);
