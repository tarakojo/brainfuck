
//コンソールログを制御する

let consoleLog = {};

consoleLog.next_default = {
  break_interpreter: false,
  break_input: false,
  write_inputPrefix: true
};
consoleLog.next = consoleLog.next_default;

consoleLog.clear = () => {
  document.getElementById("console_log").value = "";
}

consoleLog.write = (str, next = { break_interpreter: false, break_input: true, write_inputPrefix: true }) => {
  document.getElementById("console_log").value += str;
  consoleLog.next = next;
};

//コンソール入力に入力された文字列の書き込み
consoleLog.write_fromInput = (str) => {
  const c = document.getElementById("console_log");
  if (consoleLog.next.break_input) c.value += "\n";
  if (consoleLog.next.write_inputPrefix) c.value += ">>>";
  c.value += str;
  c.scrollTop = c.scrollHeight;
  consoleLog.next = { break_interpreter: true, break_input: true, write_inputPrefix: true };
}

//インタプリタからバイトを書き込み
consoleLog.write_fromInterpreter = (byte) => {
  const c = document.getElementById("console_log");
  if (consoleLog.next.break_interpreter) c.value += "\n";
  c.value += String.fromCharCode(byte);
  c.scrollTop = c.scrollHeight;
  consoleLog.next = { break_interpreter: false, break_input: true, write_inputPrefix: true };
}
