
export function initUploadPanel(onImageLoaded) {
    const parts = [
        { id: 'hips', label: '1. الحوض' },
        { id: 'torso', label: '2. الصدر/الجذع' },
        { id: 'head', label: '3. الرأس' },
        { id: 'face', label: '4. الوجه والشعر' },
        { id: 'armR1', label: '5. العضد الأيمن' },
        { id: 'armR2', label: '6. الساعد الأيمن' },
        { id: 'armL1', label: '7. العضد الأيسر' },
        { id: 'armL2', label: '8. الساعد الأيسر' },
        { id: 'thighR', label: '9. الفخذ الأيمن' },
        { id: 'legR', label: '10. الساق اليمنى' },
        { id: 'thighL', label: '11. الفخذ الأيسر' },
        { id: 'legL', label: '12. الساق اليسرى' }
    ];

    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '<span style="font-weight: bold; color: var(--accent); font-size: 12px;">🖼️ رفع صور الأجزاء (PNG شفافة)</span>';

    parts.forEach(p => {
        let card = document.createElement('div');
        card.className = 'upload-card';
        card.innerHTML = `
            <label>${p.label}:</label>
            <input type="file" accept="image/png, image/jpeg" data-id="${p.id}">
        `;
        let input = card.querySelector('input');
        input.onchange = e => {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = ev => {
                let img = new Image();
                img.onload = () => { onImageLoaded(p.id, img); };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        };
        sidebar.appendChild(card);
    });
}
