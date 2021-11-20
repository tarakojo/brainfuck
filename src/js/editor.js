CodeMirror.defineMode("mymode", function () {
  return {
    token: function (stream, state) {
      let r = stream.next();
      if (r == null) return null;
      switch (r) {
        case ">": return "pi";
        case "<": return "pd";
        case "+": return "mi";
        case "-": return "md";
        case "[": return "lb";
        case "]": return "rb";
        case ".": return "put";
        case ",": return "get";
      }
      if (r == "/" && stream.peek() == "/") stream.skipToEnd();
      return "comment";
    }
  };
});

let editor = {
  playMode: false,
  delay: 20,
  loopEnd: false
};

document.addEventListener("beforeunload", () => { editor.loopEnd = true; });

editor.editor = CodeMirror.fromTextArea(document.getElementById("editor_body"), {
  lineNumbers: true,
  theme: "mymonokai",
  mode: "mymode",
  autoCloseBrackets: true
});

editor.getValue = () => { return editor.editor.getValue(); }
editor.setValue = (str) => { editor.editor.setValue(str); }

editor.setPlayMode = () => {
  editor.playMode = true;
  document.getElementById("editor").classList.add("editor_playmode");
}
editor.setEditMode = () => {
  editor.set_cursor_endOfSource();
  document.getElementById("editor").classList.remove("editor_playmode");
  editor.playMode = false;
}

editor.editor.on("beforeChange", (e, c) => {
  if (editor.playMode) c.cancel();
});

editor.set_cursor_endOfSource = () => {
  const loc = interpreter.location[interpreter.location.length - 1];
  editor.editor.setCursor(loc.line, loc.ch)
}

editor.update_highlight = () => {
  let pc = interpreter.programCounter;
  if (pc >= interpreter.program.length) {
    editor.set_cursor_endOfSource();
    return;
  }
  const loc = interpreter.location[pc];
  editor.editor.setSelection(loc, { line: loc.line, ch: loc.ch + 1 });
}

document.addEventListener("beforeunload", () => { editor.loopEnd = true; });
editor.loop = () => {
  if (editor.loopEnd) return;
  new Promise((resolve) => {
    if (editor.playMode) editor.update_highlight();
    setTimeout(resolve, editor.delay);
  }).then(editor.loop);
}
editor.loop();
