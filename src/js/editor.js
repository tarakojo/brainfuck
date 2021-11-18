
let editor = {
  locked: false
};

editor.editor = CodeMirror.fromTextArea(document.getElementById("editor_body"), {
  lineNumbers: true,
  theme: "mymonokai"
});

editor.getValue = () => { return editor.editor.getValue(); }
editor.setValue = (str) => { editor.editor.setValue(str); }

editor.lock = () => { editor.locked = true; }
editor.unlock = () => { editor.locked = false; }

editor.editor.on("beforeChange", (e, c) => {
  if (editor.locked) c.cancel();
});