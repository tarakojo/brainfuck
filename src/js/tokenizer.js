
let tokenizer = {};

//トークンを1つ読みだす
//posはsrcのインデックスにおさまっている必要がある
//tokenはTokenクラス
//返却値は{index : 読みだしたトークンのtoken_index, nextpos:次の読み出し位置}
tokenizer.read = (src, pos, token) => {
  for (i = 0; i < token.value.length - 1; ++i) {
    if (src.startsWith(token.value[i], pos)) return { index: i, nextpos: pos + token.value[i].length };
  }
  if (src.startsWith(token.value[token_index.comment], pos)) {
    let p = src.indexOf("\n", pos);
    return { index: token_index.comment, nextpos: (p == -1 ? src.length : p + 1) };
  }
  return { index: token_index.comment, nextpos: pos + 1 };
}