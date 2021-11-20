
let tokenizer = {};

//トークンを1つ読みだす
//posはsrcのインデックスにおさまっている必要がある
//tokenはTokenクラス
//返却値は{index : 読みだしたトークンのtoken_index, nextpos:次の読み出し位置}
tokenizer.read = (src, pos, t) => {
  for (i = 0; i < t.value.length - 1; ++i) {
    if (src.startsWith(t.value[i], pos)) return { index: i, nextpos: pos + t.value[i].length };
  }
  if (src.startsWith(t.value[token.token_index.comment], pos)) {
    let p = src.indexOf("\n", pos);
    return { index: token.token_index.comment, nextpos: (p == -1 ? src.length : p + 1) };
  }
  return { index: token.token_index.comment, nextpos: pos + 1 };
}