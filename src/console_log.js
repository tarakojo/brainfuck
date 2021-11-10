
const clear_consoleLog = () => {
  document.getElementById("console_log").value = "";
}

let lastLog_fromInput = false;
let waitInput = false;

const write_consoleLog_fromInput = (str) => {
  const console_log = document.getElementById("console_log");
  if (!lastLog_fromInput) console_log.value += "\n";
  lastLog_fromInput = true;
  console_log.value += ">>>";
  console_log.value += str;
  console_log.value += "\n";
  console_log.scrollTop = console_log.scrollHeight;
}

const write_consoleLog_fromInterpreter = (byte) => {
  const console_log = document.getElementById("console_log");
  if (lastLog_fromInput) console_log.value += "\n";
  lastLog_fromInput = false;
  console_log.value += String.fromCharCode(byte);
  console_log.scrollTop = console_log.scrollHeight;
}