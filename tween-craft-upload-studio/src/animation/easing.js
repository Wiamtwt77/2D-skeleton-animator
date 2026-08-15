
export function getEasingProgress(t, type = 'easeInOut') {
    if (type === 'easeInOut') {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    return t;
}
