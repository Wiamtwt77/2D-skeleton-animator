
export const bones = [
    { id: 'hips', name: 'الحوض (Root)', parent: null, x: 425, y: 220, length: 0, angle: 0 },
    { id: 'torso', name: 'الصدر / الجذع', parent: 'hips', offsetX: 0, offsetY: 0, length: 65, angle: -Math.PI/2 },
    { id: 'head', name: 'الرأس', parent: 'torso', offsetX: 0, offsetY: -65, length: 45, angle: 0 },
    { id: 'face', name: 'الوجه والشعر', parent: 'head', offsetX: 0, offsetY: -10, length: 0, angle: 0 },
    { id: 'armR1', name: 'العضد الأيمن', parent: 'torso', offsetX: 15, offsetY: -45, length: 50, angle: 0 },
    { id: 'armR2', name: 'الساعد الأيمن', parent: 'armR1', offsetX: 50, offsetY: 0, length: 45, angle: 0 },
    { id: 'armL1', name: 'العضد الأيسر', parent: 'torso', offsetX: -15, offsetY: -45, length: 50, angle: 0 },
    { id: 'armL2', name: 'الساعد الأيسر', parent: 'armL1', offsetX: -50, offsetY: 0, length: 45, angle: 0 },
    { id: 'thighR', name: 'الفخذ الأيمن', parent: 'hips', offsetX: 15, offsetY: 10, length: 65, angle: Math.PI/2 },
    { id: 'legR', name: 'الساق اليمنى', parent: 'thighR', offsetX: 65, offsetY: 0, length: 60, angle: 0 },
    { id: 'thighL', name: 'الفخذ الأيسر', parent: 'hips', offsetX: -15, offsetY: 10, length: 65, angle: Math.PI/2 },
    { id: 'legL', name: 'الساق اليسرى', parent: 'thighL', offsetX: 65, offsetY: 0, length: 60, angle: 0 }
];
