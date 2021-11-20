
const opcode = {
  pointer_add: 0,
  memory_add: 1,
  put: 2,
  get: 3,
  if0_jump: 4,
  ifnot0_jump: 5
};

class Operation {
  constructor(opcode, operand) {
    this.opcode = opcode;
    this.operand = operand;
  };
};
