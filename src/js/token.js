

let token = {};

token.token_index = {
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

token.Token = class {
  constructor(array) {
    this.value = array;
  }

  check_conflict() {
    for (let i = 0; i < this.value.length; ++i) {
      for (let j = i + 1; j < this.value.length; ++j) {
        if (this.value[i].startsWith(this.value[j]) || this.value[j].startsWith(this.value[i])) return true;
      }
    }
    return false;
  }

  check_includesComment() {
    for (let i = 0; i < this.value.length - 1; ++i) {
      if (this.value[i].includes(this.value[token.token_index.comment])) return true;
    }
    return false;
  }

  check_valid() {
    return !this.check_conflict() && !this.check_includesComment();
  }
};

token.token = new token.Token([">", "<", "+", "-", ".", ",", "[", "]", "//"]);
token.token_changed_event = new CustomEvent("token_changed", { bubbles: false });
document.dispatchEvent(token.token_changed_event);

token.set_token = (t) => {
  if (!t.check_valid()) return false;
  token.token = t;
  document.dispatchEvent(token.token_changed_event);
  return true;
}