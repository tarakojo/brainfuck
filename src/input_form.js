

document.getElementById("console_input_form").addEventListener("keyup", (e) => {
  if (e.code != "Enter") return;
  const c = document.getElementById("console_input_form");
  consoleLog.write_fromInput(c.value);
  (new TextEncoder).encode(c.value).forEach((x) => { inputBuffer.push(x); });
  c.value = "";
});
