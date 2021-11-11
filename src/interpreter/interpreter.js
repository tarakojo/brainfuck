

let interpreter = {
  memorySize: 1024,
  program: null,
  programCounter: null,
  memoryPointer: null,
  jumpStack: []
};
interpreter.memory = new Uint8Array(interpreter.memorySize);

//インタプリタの初期化
interpreter.init = (program) => {
  interpreter.memory.fill(0);
  interpreter.program = program;
  interpreter.programCounter = 0;
  interpreter.memoryPointer = 0;
  interpreter.jumpStack = [];
}

//1ステップ実行する。accelerate=trueのとき、連続する同命令は一度に実行される
//プログラムが終了したならfalse そうでないときtrue
interpreter.step = (accelerate) => {
  let ip = interpreter;
  let last_opcode = null;
  do {
    last_opcode = ip.program[ip.programCounter];

    switch (last_opcode) {
      case token.index.pointer_inclement:
        ip.memoryPointer++;
        ip.memoryPointer %= interpreter_memorySize;
        ip.programCounter++;
        break;
      case token.index.pointer_declement:
        ip.memoryPointer--;
        ip.memoryPointer = (ip.memoryPointer + interpreter_memorySize) % interpreter_memorySize;
        ip.programCounter++;
        break;
      case token.index.memory_inclement:
        ip.memory[ip.memoryPointer]++;
        ip.programCounter++;
        break;
      case token.index.memory_declement:
        ip.memory[ip.memoryPointer]--;
        ip.programCounter++;
        break;
      case token.index.put:
        consoleLog.write_fromInterpreter(ip.memory[ip.memoryPointer]);
        ip.programCounter++;
        break;
      case token.index.get:
        ip.memory[ip.memoryPointer] = inputBuffer.pop();
        ip.programCounter++;
        break;
      case token.index.if0_jump:


      default:
        console.log("実装途中です");
    };

    if (ip.programCounter === ip.program.length) return false;
  } while (accelerate && last_opcode == ip.program[ip.programCounter]);
  return true;
}