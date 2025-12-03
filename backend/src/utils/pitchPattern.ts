export function pitchPattern(kana, accent) {
    if (typeof accent !== "number" || accent < 0) return null;

    const moraCount = [...kana].length;

    const pattern = [];

    if (accent == 0) {
        pattern.push("L");
        for (let i = 0; i < moraCount; i++) pattern.push("H");
        return pattern;
    }

    if (accent == 1) {
        pattern.push("H");
        for (let i = 0; i < moraCount; i++) pattern.push("L");
        return pattern;
    }

    if (accent == 2) {
        pattern.push("L", "H");
        for (let i = 0; i < moraCount; i++) pattern.push("L");
        return pattern;
    }

    if (accent == 3) {
        pattern.push("L", "H", "H");
        for (let i = 0; i < moraCount; i++) pattern.push("L");
        return pattern;
    }
}