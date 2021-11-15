

document.getElementById("console_input").addEventListener("keyup", (e) => {
  if (e.code != "Enter") return;
  const c = document.getElementById("console_input");
  consoleLog.write_fromInput(c.value);
  (new TextEncoder).encode(c.value).forEach((x) => { inputBuffer.push(x); });
  c.value = "";
});
