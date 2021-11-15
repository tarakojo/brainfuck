

let interpreter = {
  memorySize: 1024,
  program: null,
  programCounter: 0,
  memoryPointer: 0,
  jumpStack: []
};
interpreter.memory = new Uint8Array(interpreter.memorySize);
interpreter.memory.fill(0);

//インタプリタの初期化
interpreter.init = (program) => {
  interpreter.memory.fill(0);
  interpreter.program = program;
  interpreter.programCounter = 0;
  interpreter.memoryPointer = 0;
  interpreter.jumpStack = [];
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
    case opcode.pointer_add:
      ip.memoryPointer = (ip.memoryPointer + ope) % ip.memorySize;
      break;
    case opcode.memory_add:
      ip.memory[ip.memoryPointer] += ope;
      break;
    case opcode.put:
      consoleLog.write_fromInterpreter(ip.memory[ip.memoryPointer]);
      break;
    case opcode.get:
      if (inputBuffer.check_empty()) return -1;
      ip.memory[ip.memoryPointer] = inputBuffer.pop();
      break;
    case opcode.if0_jump:
      if (ip.memory[ip.memoryPointer] == 0) ip.programCounter = ope;
      break;
    case opcode.ifnot0_jump:
      if (ip.memory[ip.memoryPointer] != 0) ip.programCounter = ope;
      break;
    default:
      alert("internal error");
      break;
  };

  ip.programCounter++;
  return (ip.programCounter === ip.program.length) ? 0 : 1;
}