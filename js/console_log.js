
//コンソールログを制御する

let consoleLog = {};

consoleLog = {
  break_interpreter: false,
  break_input: false,
  write_inputPrefix: true,
  queue: [],
  queueLength: 0,
  queueLengthMax: 10000,
  logLengthMax: 10000,
  next: { break_interpreter: false, break_input: false },
  delay: 50,
  loopTick: 5,
  loopEnd: false,
  query_index: {
    newline: 0,
    input: 1,
    interpreter: 2
  }
};

document.addEventListener("beforeunload", () => { consoleLog.loopEnd = true; });

consoleLog.clear = () => {
  document.getElementById("console_log").value = "";
  consoleLog.queue = [];
  consoleLog.next = { break_interpreter: false, break_input: false }
}

consoleLog.check_queueOverflow = () => {
  while (consoleLog.queueLength > consoleLog.queueLengthMax) {
    consoleLog.queueLength -= consoleLog.queue[0].str.length;
    consoleLog.queue.shift();
  }
}

consoleLog.newline = () => {
  consoleLog.queue.push({ query: consoleLog.query_index.newline, str: "\n\n", next: { break_interpreter: false, break_input: false } });
  consoleLog.queueLength += 2;
  consoleLog.check_queueOverflow();
}

consoleLog.write_fromInput = (str) => {
  consoleLog.queue.push({ query: consoleLog.query_index.input, str: str, next: { break_interpreter: true, break_input: true } });
  consoleLog.queueLength += str.length;
  consoleLog.check_queueOverflow();
}

consoleLog.write_fromInterpreter = (byte) => {
  consoleLog.queue.push({ query: consoleLog.query_index.interpreter, str: String.fromCharCode(byte), next: { break_interpreter: false, break_input: true } });
  consoleLog.queueLength++;
  consoleLog.check_queueOverflow();
}

consoleLog.proc_queue = () => {
  let timeout = performance.now() + consoleLog.loopTick;
  let str = "";
  do {
    if (consoleLog.queue.length === 0) break;
    switch (consoleLog.queue[0].query) {
      case consoleLog.query_index.newline:
        break;
      case consoleLog.query_index.input:
        if (consoleLog.next.break_input) str += "\n";
        str += ">>>";
        break;
      case consoleLog.query_index.interpreter:
        if (consoleLog.next.break_interpreter) str += "\n";
        break;
      default: alert("internal error: console log");
    }
    str += consoleLog.queue[0].str;
    consoleLog.queueLength -= consoleLog.queue[0].str.length;
    consoleLog.next = consoleLog.queue[0].next;
    consoleLog.queue.shift();
  } while (performance.now() < timeout);

  const c = document.getElementById("console_log");
  if (c.value.length + str.length <= consoleLog.logLengthMax) c.value += str;
  else {
    const tmp = (c.value + str);
    c.value = tmp.slice(tmp.length - consoleLog.logLengthMax, tmp.length);
  }
  c.scrollTop = c.scrollHeight;
}

consoleLog.loop = () => {
  if (consoleLog.loopEnd) return;
  new Promise((resolve) => {
    if (consoleLog.queue.length > 0) consoleLog.proc_queue();
    setTimeout(resolve, consoleLog.delay);
  }).then(consoleLog.loop);
}
consoleLog.loop();