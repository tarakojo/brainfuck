
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

const token_index = {
  pointer_inclement: 0,
  pointer_declement: 1,
  memory_inclement: 2,
  memory_declement: 3,
  put: 4,
  get: 5,
  if0_jump: 6,
  ifnot0_jump: 7,
  comment: 8
};

class Token {
  constructor(array) {
    this.value = array;
  }

  check_conflict() {
    for (i = 0; i < this.value.length; ++i) {
      for (j = i + 1; j < this.value.length; ++j) {
        if (this.value[i].startsWith(this.value[j]) || this.value[j].startsWith(this.value[i])) return true;
      }
    }
    return false;
  }

  check_includesComment() {
    for (i = 0; i < this.value.length - 1; ++i) {
      if (this.value[i].includes(this.value[token_index.comment])) return true;
    }
    return false;
  }

  check_valid () {
    return !this.check_conflict() && !this.check_includesComment();
  }
};