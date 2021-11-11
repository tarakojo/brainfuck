
//コンソールログを制御する

let consoleLog = {};

consoleLog.clear = () => {
  document.getElementById("console_log").value = "";
}

consoleLog.lastLog_fromInput = false;
consoleLog.waitInput = false;

//文字列の書き込み
consoleLog.write = (str) => {
  const console_log = document.getElementById("console_log");
  console_log.value += str;
  console_log.scrollTop = console_log.scrollHeight;
}

//コンソール入力に入力された文字列の書き込み
consoleLog.write_fromInput = (str) => {
  const console_log = document.getElementById("console_log");
  if (!consoleLog.lastLog_fromInput) console_log.value += "\n";
  if (!consoleLog.waitInput) console_log.value += ">>>";
  consoleLog.lastLog_fromInput = true;
  consoleLog.waitInput = false;
  console_log.value += str;
  console_log.value += "\n";
  console_log.scrollTop = console_log.scrollHeight;
}

//インタプリタからバイトを書き込み
consoleLog.write_fromInterpreter = (byte) => {
  const console_log = document.getElementById("console_log");
  if (consoleLog.lastLog_fromInput) console_log.value += "\n";
  consoleLog.lastLog_fromInput = false;
  console_log.value += String.fromCharCode(byte);
  console_log.scrollTop = console_log.scrollHeight;
}

//入力待ち状態のときは>>>を先に出しておく
document.addEventListener("inputBuffer_waitInput", () => { consoleLog.write(">>>"); consoleLog.waitInput = true; });