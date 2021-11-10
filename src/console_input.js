

document.getElementById("console_input").addEventListener("keyup", (e) => {
  if (e.code != "Enter") return;
  const console_input = document.getElementById("console_input");
  write_consoleLog_fromInput(console_input.value);
  const input_as_byte = (new TextEncoder).encode(console_input.value);
  input_as_byte.forEach((x) => { push_inputBuffer(x); });
  console_input.value = "";
});