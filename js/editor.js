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
  pc_marking: null,
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

editor.editor.on("beforeChange", (e, c) => {
  if (editor.playMode) c.cancel();
});

editor.getValue = () => { return editor.editor.getValue(); }
editor.setValue = (str) => { editor.editor.setValue(str); }

editor.setPlayMode = () => {
  editor.playMode = true;
  document.getElementById("editor").classList.add("editor_disabled");
}
editor.setEditMode = () => {
  document.getElementById("editor").classList.remove("editor_disabled");
  editor.clear_marking();
  editor.set_cursor_endOfSource();
  editor.playMode = false;
}

editor.clear_marking = () => {
  if (editor.pc_marking != null) {
    editor.pc_marking.clear();
    editor.pc_marking = null;
  }
}

editor.set_cursor_endOfSource = () => {
  const loc = interpreter.location[interpreter.location.length - 1];
  editor.editor.setCursor(loc.line, loc.ch)
}

editor.update_highlight = () => {
  editor.clear_marking();
  let pc = interpreter.programCounter;
  if (pc >= interpreter.program.length) {
    editor.set_cursor_endOfSource();
    return;
  }
  const loc = interpreter.location[pc];
  editor.pc_marking = editor.editor.markText(loc, { line: loc.line, ch: loc.ch + 1 }, { className: "editor_playmode_cursor" });
}

editor.loop = () => {
  if (editor.loopEnd) return;
  new Promise((resolve) => {
    if (editor.playMode) editor.update_highlight();
    setTimeout(resolve, editor.delay);
  }).then(editor.loop);
}
editor.loop();
