import kuromoji from "kuromoji";

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

export async function getTokenizer() {
  if (tokenizer) return tokenizer;

  return new Promise((resolve, reject) => {
    kuromoji
      .builder({ dicPath: "node_modules/kuromoji/dict" })
      .build((err, t) => {
        if (err) reject(err);
        tokenizer = t;
        resolve(t);
      });
  });
}
