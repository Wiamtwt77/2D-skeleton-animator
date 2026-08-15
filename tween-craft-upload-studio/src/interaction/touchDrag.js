
export function initInteraction(canvas, bones, callbacks) {
    let isDragging = false;
    let selectedBone = null;
    let lastMouse = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', e => {
        let r = canvas.getBoundingClientRect();
        let mx = e.clientX - r.left;
        let my = e.clientY - r.top;
        
        selectedBone = bones.find(b => Math.hypot(b._absX - mx, b._absY - my) < 20);
        isDragging = true;
        lastMouse = { x: mx, y: my };
        if (callbacks.onSelect) callbacks.onSelect(selectedBone);
    });

    window.addEventListener('mousemove', e => {
        if (!isDragging || !selectedBone) return;
        let r = canvas.getBoundingClientRect();
        let mx = e.clientX - r.left;
        let my = e.clientY - r.top;

        let dx = mx - lastMouse.x;
        let dy = my - lastMouse.y;

        if (e.shiftKey || selectedBone.parent) {
            selectedBone.angle += dx * 0.025;
        } else {
            selectedBone.x += dx;
            selectedBone.y += dy;
        }

        lastMouse = { x: mx, y: my };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
}
