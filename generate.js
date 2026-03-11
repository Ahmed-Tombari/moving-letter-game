// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

const VOWELS = [
  { id: "fatha", symbol: "◌َ", name: "Fatha" },
  { id: "damma", symbol: "◌ُ", name: "Damma" },
  { id: "kasra", symbol: "◌ِ", name: "Kasra" },
  { id: "fathatayn", symbol: "◌ً", name: "Fathatayn" },
  { id: "dammatayn", symbol: "◌ٌ", name: "Dammatayn" },
  { id: "kasratayn", symbol: "◌ٍ", name: "Kasratayn" },
  { id: "alif", symbol: "ا", name: "Alif" },
  { id: "waw", symbol: "و", name: "Waw" },
  { id: "ya", symbol: "ي", name: "Ya" },
];

const RAW_LETTERS = [
  { id: "alif", char: "أ" },
  { id: "ba", char: "بـ" },
  { id: "ta", char: "تـ" },
  { id: "tha", char: "ثـ" },
  { id: "jeem", char: "جـ" },
  { id: "haa", char: "حـ" },
  { id: "khaa", char: "خـ" },
  { id: "dal", char: "د" },
  { id: "dhal", char: "ذ" },
  { id: "ra", char: "ر" },
  { id: "zay", char: "ز" },
  { id: "seen", char: "سـ" },
  { id: "sheen", char: "شـ" },
  { id: "sad", char: "صـ" },
  { id: "dad", char: "ضـ" },
  { id: "ttaa", char: "طـ" },
  { id: "dhaa", char: "ظـ" },
  { id: "ayn", char: "عـ" },
  { id: "ghayn", char: "غـ" },
  { id: "fa", char: "فـ" },
  { id: "qaf", char: "قـ" },
  { id: "kaf", char: "كـ" },
  { id: "lam", char: "لـ" },
  { id: "meem", char: "مـ" },
  { id: "noon", char: "نـ" },
  { id: "ha", char: "هـ" },
  { id: "waw", char: "و" },
  { id: "ya", char: "يـ" },
];

let out = `export interface Vowel {
  id: string;
  symbol: string;
  name: string;
}

export interface Letter {
  id: string;
  char: string; // Initial form
}

export interface Syllable {
  letterId: string;
  vowelId: string;
  result: string;
  audioPath?: string;
}

export const VOWELS: Vowel[] = [
`;

VOWELS.forEach((v) => {
  out += `  { id: "${v.id}", symbol: "${v.symbol}", name: "${v.name}" },\n`;
});
out += "];\n\nexport const LETTERS: Letter[] = [\n";

RAW_LETTERS.forEach((l) => {
  out += `  { id: "${l.id}", char: "${l.char}", name: "${l.name}" },\n`;
});
out += "];\n\nexport const SYLLABLES: Syllable[] = [\n";

RAW_LETTERS.forEach((l) => {
  out += `  // ${l.name}\n`;
  let base = l.char.replace("ـ", "");

  const forms = {};
  if (l.id === "alif") {
    forms["fatha"] = "أَ";
    forms["damma"] = "أُ";
    forms["kasra"] = "إِ";
    forms["alif"] = "آ";
    forms["waw"] = "أو";
    forms["ya"] = "أي";
    forms["fathatayn"] = "أً";
    forms["dammatayn"] = "أٌ";
    forms["kasratayn"] = "إٍ";
  } else if (l.id === "lam") {
    forms["alif"] = "لا";
    forms["fathatayn"] = "لًا";
  }

  const vMap = {
    fatha: "َ",
    damma: "ُ",
    kasra: "ِ",
    fathatayn: "ًا",
    dammatayn: "ٌ",
    kasratayn: "ٍ",
    alif: "ا",
    waw: "و",
    ya: "ي",
  };

  VOWELS.forEach((v) => {
    let res = "";
    if (forms[v.id]) {
      res = forms[v.id];
    } else {
      if (v.id === "fathatayn") {
        if (["dal", "dhal", "ra", "zay", "waw"].includes(l.id)) {
          res = base + "ًا";
        } else {
          res = base + "ًا";
        }
      } else {
        res = base + vMap[v.id];
      }
    }
    out += `  { letterId: "${l.id}", vowelId: "${v.id}", result: "${res}" },\n`;
  });
});

out += "];\n";

fs.writeFileSync("lib/alphabet-data.ts", out);
console.log("Done");
