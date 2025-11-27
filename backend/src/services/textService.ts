import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();

let initialized = false;

export async function initKuroshiro() {
    if (!initialized) {
        await kuroshiro.init(new KuromojiAnalyzer());
        initialized = true;
    }
}

export async function convertToHiragana(text: string) {
    await initKuroshiro();
    return await kuroshiro.convert(text, { to: "hiragana" });
}