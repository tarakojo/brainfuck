
let interpreter = {
  memorySize: 1024,
  program: [],
  location: [],
  programCounter: 0,
  memoryPointer: 0,
  stepCount: 0,
  jumpStack: []
};

interpreter.opcode = {
  pointer_add: 0,
  memory_add: 1,
  put: 2,
  get: 3,
  if0_jump: 4,
  ifnot0_jump: 5
};

interpreter.memory = new Uint8Array(interpreter.memorySize);
interpreter.memory.fill(0);

interpreter.compile = () => {
  let ip = interpreter;
  const src = editor.getValue();
  let pos = 0;
  let line = 0;
  let ch = 0;
  let st = [];
  while (pos < src.length) {
    let operation = true;
    switch (src[pos]) {
      case ">":
        ip.program.push({ opcode: interpreter.opcode.pointer_add, operand: 1 });
        break;
      case "<":
        ip.program.push({ opcode: interpreter.opcode.pointer_add, operand: -1 });
        break;
      case "+":
        ip.program.push({ opcode: interpreter.opcode.memory_add, operand: 1 });
        break;
      case "-":
        ip.program.push({ opcode: interpreter.opcode.memory_add, operand: -1 });
        break;
      case ".":
        ip.program.push({ opcode: interpreter.opcode.put, operand: 0 });
        break;
      case ",":
        ip.program.push({ opcode: interpreter.opcode.get, operand: 0 });
        break;
      case "[":
        ip.program.push({ opcode: interpreter.opcode.if0_jump, operand: 0 });
        st.push(ip.program.length - 1);
        break;
      case "]":
        if (st.length == 0) {
          alert("compile error: unbalanced brackets");
          return false;
        }
        let p = st[st.length - 1];
        ip.program.push({ opcode: interpreter.opcode.ifnot0_jump, operand: p });
        ip.program[p].operand = ip.program.length - 1;
        st.pop();
        break;
      default:
        operation = false;
        break;
    }
    if (operation) {
      ip.location.push({ line: line, ch: ch });
      ++ch;
      ++pos;
      continue;
    }
    if (src[pos] == "\n") {
      ++line;
      ch = 0;
      ++pos;
      continue;
    }
    if (pos + 1 < src.length && src[pos] == "/" && src[pos + 1] == "/") {
      while (pos < src.length && src[pos] != "\n") ++pos;
      continue;
    }
    ++pos;
    ++ch;
  }
  if (st.length > 0) {
    alert("compile error: unbalanced brackets");
    return false;
  }
  if (ip.program.length == 0) {
    alert("compile error: no command token");
    return false;
  }
  return true;
}

//インタプリタの初期化
interpreter.init = () => {
  interpreter.memory.fill(0);
  interpreter.program = [];
  interpreter.location = [];
  interpreter.programCounter = 0;
  interpreter.memoryPointer = 0;
  interpreter.stepCount = 0;
  interpreter.jumpStack = [];
  if (!interpreter.compile()) return false;
  return true;
}

//1ステップ実行する。
//入力バッファが空で入力の読み取りに失敗:-1
//プログラムが終了した:0 
//そうでないとき:1
interpreter.step = () => {
  let ip = interpreter;
  let opc = ip.program[ip.programCounter].opcode;
  let ope = ip.program[ip.programCounter].operand;

  switch (opc) {
    case ip.opcode.pointer_add:
      ip.memoryPointer = (ip.memoryPointer + ope + ip.memorySize) % ip.memorySize;
      break;
    case ip.opcode.memory_add:
      ip.memory[ip.memoryPointer] += ope;
      break;
    case ip.opcode.put:
      consoleLog.write_fromInterpreter(ip.memory[ip.memoryPointer]);
      break;
    case ip.opcode.get:
      if (inputBuffer.check_empty()) return -1;
      ip.memory[ip.memoryPointer] = inputBuffer.pop();
      break;
    case ip.opcode.if0_jump:
      if (ip.memory[ip.memoryPointer] == 0) ip.programCounter = ope;
      break;
    case ip.opcode.ifnot0_jump:
      if (ip.memory[ip.memoryPointer] != 0) ip.programCounter = ope;
      break;
    default:
      alert("internal error: interpreter.step");
      break;
  };
  ip.stepCount++;
  ip.programCounter++;
  return (ip.programCounter === ip.program.length) ? 0 : 1;
}