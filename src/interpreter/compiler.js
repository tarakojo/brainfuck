

let compiler = {};


//コンパイル。ソースのかっこの対応がとれていればコンパイルは成功し、operationの配列を返す。
//そうでなければ失敗し、nullを返す
//tokenはTokenクラス
compiler.compile = (src, token) => {
  let stack = [];
  let ans = [];
  let pos = 0;
  while (pos < src.length) {
    let r = tokenizer.read(src, pos, token);
    switch (r.index) {

      case token_index.pointer_inclement:
        ans.push(new Operation(opcode.pointer_add, 1));
        break;
      case token_index.pointer_declement:
        ans.push(new Operation(opcode.pointer_add, -1));
        break;
      case token_index.memory_inclement:
        ans.push(new Operation(opcode.memory_add, 1));
        break;
      case token_index.memory_declement:
        ans.push(new Operation(opcode.memory_add, -1));
        break;
      case token_index.put:
        ans.push(new Operation(opcode.put, 1));
        break;
      case token_index.get:
        ans.push(new Operation(opcode.get, 1));
        break;
      case token_index.if0_jump:
        stack.push(ans.length);
        ans.push(new Operation(opcode.if0_jump, -1));
        break;
      case token_index.ifnot0_jump:
        if (stack.length === 0) return null;
        let lb = stack[stack.length - 1];
        ans[lb].operand = ans.length;
        ans.push(new Operation(opcode.ifnot0_jump, lb));
        stack.pop();
        break;
      case token_index.comment:
        break;
      default:
        alert("internal error");
    };
    pos = r.nextpos;
  };

  return (stack.length > 0 ? null : ans);
};