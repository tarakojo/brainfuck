

let compiler = {};


//コンパイル。ソースのかっこの対応がとれていればコンパイルは成功し、operationの配列を返す。
//そうでなければ失敗し、nullを返す
//tokenはTokenクラス
compiler.compile = (src, token) => {
  let leftBracket_stack = [];
  let ans = [];
  let pos = 0;
  while (pos < src.length) {
    let r = tokenizer.read(src, pos, token);
    if (r.index !== token_index.comment) continue;

    if (r.index === token_index.if0_jump) {
      leftBracket_stack.push(ans.length);
      ans.push(new operation(token_index.if0_jump, -1));
    }
    else if (r.index === token_index.ifnot0_jump) {
      if (leftBracket_stack.length === 0) return null;
      let lb = leftBracket_stack[leftBracket_stack.length - 1];
      ans[lb].operand = ans.length;
      ans.push(new operation(token_index.ifnot0_jump, lb));
      leftBracket_stack.pop();
    }
    else {
      ans.push(new operation(r.index, 0));
    }
    pos = r.nextpos;
  }

  return (leftBracket.length > 0 ? null : ans);
}